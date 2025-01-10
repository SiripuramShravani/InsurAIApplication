from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from Master_package.master_package_security import Authentication
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_utils import Ai_utils, Policy_utils, File_handling, Address_validations
from Master_package.master_package_schemas import PolicyInfo, PropertyInfo, AdditionalInfo, Coverages, Details_to_extract
from datetime import datetime, timezone, timedelta
import threading
import os
from .utils import *
from io import BytesIO
from pydantic import ValidationError
import base64
from docx2python import docx2python
import bleach
import imghdr
import json
from Master_package.master_package_utils import Administration_utils
  


@api_view(['POST'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def policy_creation(request):
    policy_data_str = request.data.get('policy_data')
    email = request.data.get('email')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    if not policy_data_str or not email:
        return Response({'error': 'Policy_data or email cannot be empty', 'api': 'policy_creation'}, status=status.HTTP_404_NOT_FOUND)

    try:
        policy_data = json.loads(policy_data_str)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON in policy_data', 'api': 'policy_creation'}, status=status.HTTP_400_BAD_REQUEST)
    policy_data = Ai_utils.process_extracted_data(policy_data)
    policy_holder_info = policy_data.get('PolicyInfo', {})
    additional_info = policy_data.get('AdditionalInfo', {})
    property_info = policy_data.get('PropertyInfo', {})
    coverages = policy_data.get('Coverages', {})

    coverage_and_additional_information_collection = db['coverage_and_additional_information']
    latest_doc = coverage_and_additional_information_collection.find_one(
        filter={},  # no filter criteria
        projection={'_id': 0},  # exclude _id field
        sort=[('_id', -1)]  # still sort by _id to get latest
    )
    if latest_doc:
        latest_policy = Authentication.decrypt_data(latest_doc)
        latest_quote_number = latest_policy['quote_number']
    else:
        latest_quote_number = None
    random_quote_amount = Policy_utils.generate_random_quote_amount()
    next_quote_number = Policy_utils.generate_next_quote_number(latest_quote_number)
    policy_holder_info['quote_number'] = next_quote_number
    policy_holder_info['quote_amount'] = random_quote_amount
    property_info['quote_number'] = next_quote_number
    coverage_and_additional_info = {
        'additional_info': additional_info,
        'coverages': coverages,
        'policy_created_at': datetime.now(timezone.utc),
        'quote_number': next_quote_number
    }

    if 'file' in request.data:
        process_document = request.data.get('file')
        original_file, path, message = File_handling.save_policy_documents_with_unique_ids(process_document, 'Policy_Intake_IDP_files')
        coverage_and_additional_info['policy_process_document_name'] = original_file if original_file else ''
        coverage_and_additional_info['policy_process_document_url'] = path if path else ''
    else:
        coverage_and_additional_info['policy_process_document_name'] = ''
        coverage_and_additional_info['policy_process_document_url'] = ''

    result = Policy_utils.add_policy_info_to_db(policy_holder_info, property_info, coverage_and_additional_info)
    if email:        
        client, db = MongoDB.get_mongo_client_Administration()
        draft_data_collection = db['Portals_Draft']        
        existing_draft = draft_data_collection.find_one({
            'user_email': email,
            'portal_type': "policy"
        })
        if existing_draft:
            delete_result = Administration_utils.delete_draft_data_from_DB(email, "policy")
            if not delete_result.get('ok', 0.0) == 1.0:
                    error_msg = delete_result.get('error', "Unknown draft deletion error")
                    print(f"Error deleting draft: {error_msg}")
                    return Response({
                        'error': f"Error deleting draft: {error_msg}"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            if delete_result.get("n", 0) == 0:
                print("No matching draft found for deletion.")
                return Response({
                    'error': f"Error deleting draft: No matching draft found for deletion."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"No draft found for email {email}")

    return Response({
        'message': result,
        'quote_number': next_quote_number,
        'quote_amount': random_quote_amount
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def idp_policy_intake(request):
    if 'combined_extracted_text' in request.data:
        try:
            combined_extracted_text = request.data.get('combined_extracted_text', '')
            file_name = request.data.get('file_name', 'unknown')
            response_data = handle_extraction(combined_extracted_text, file_name, "DocAI Image Extraction", Details_to_extract.medbill)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e), 'api': 'idp_policy_intake'}, status=status.HTTP_400_BAD_REQUEST)
   
    if 'file' not in request.data:
        return Response({'error': 'No file provided', 'api': 'idp_policy_intake'}, status=status.HTTP_400_BAD_REQUEST)
   
    uploaded_file = request.data['file']
    file_name, file_extension = os.path.splitext(uploaded_file.name)
    file_content = uploaded_file.read()
   
    if file_extension.lower() in ['.pdf', '.doc', '.docx', '.txt']:
        return handle_document(file_content, file_name, file_extension)
    elif file_extension.lower() in ['.jpg', '.jpeg', '.png']:
        return handle_image(file_content)
   
    return Response({'error': 'Unsupported file type', 'api': 'idp_policy_intake'}, status=status.HTTP_400_BAD_REQUEST)
 
def handle_extraction(text, file_name, application, details_func):
    extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(text)
    accuracy, reason = Ai_utils.get_accuracy(text, extracted_text, details_to_extract=details_func())
    validate_and_update_addresses(extracted_text)
    Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, file_name, application=application)
    return build_response_data(extracted_text, input_tokens, output_tokens, total_tokens, accuracy, reason)
 
def handle_document(file_content, file_name, file_extension):
    if file_extension.lower() == '.pdf':
        init_extracted_text = File_handling.extract_text_from_pdf(BytesIO(file_content))
        if init_extracted_text == 'pdf_image':
            images_base64 = handle_pdf_images(file_content)
            return Response({'image': images_base64}, status=status.HTTP_200_OK)
        details_func = Details_to_extract.quote
    elif file_extension.lower() == '.docx':
        init_extracted_text = File_handling.extract_text_from_docx(BytesIO(file_content))
        details_func = Details_to_extract.quote
    elif file_extension.lower() == '.txt':
        init_extracted_text = File_handling.extract_text_from_txt(file_content)
        details_func = Details_to_extract.quote
    else:
        return Response({'error': 'Invalid file type', 'api': 'idp_policy_intake'}, status=status.HTTP_400_BAD_REQUEST)
   
    response_data = handle_extraction(init_extracted_text, file_name, "DocAI Quote", details_func)
    return Response(response_data, status=status.HTTP_200_OK)
 
 
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def trigger_email_parsing(request):
    if request.method == 'POST':
        try:
            email_user = os.getenv('EMAIL_POLICY_USER')
            email_password = os.getenv('EMAIL_POLICY_PASSWORD_USER')

            if not email_user or not email_password:
                return Response(
                    {'status': 'error', 'message': 'Email credentials not found in environment variables.', 'api': 'trigger_email_parsing'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            def email_parsing_worker(user, password):
                """Parses emails in a separate thread and prepares the response."""
                try:
                    sender_emails = parse_and_save_emails(user, password)
                    request.thread_response = Response({
                        'status': 'success',
                        'message': 'Email parsing completed.',
                        'sender_emails': sender_emails
                    })
                except Exception as e:
                    request.thread_response = Response({
                        'status': 'error',
                        'message': str(e),
                        'api': 'trigger_email_parsing'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Store the response for later retrieval
            request.thread_response = None

            # Start the parsing thread
            thread = threading.Thread(target=email_parsing_worker, args=(email_user, email_password))
            thread.start()
            thread.join()  # Wait for the thread to finish

            return request.thread_response


        except Exception as e:
            return Response({'status': 'error', 'message': str(e), 'api': 'trigger_email_parsing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    else:
        return Response({'status': 'error', 'message': 'Invalid request method.', 'api': 'trigger_email_parsing'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def process_emails(request):
    """
    API endpoint to start processing emails from the "email_to_policy_intake" MongoDB collection.
    """
    client, db = MongoDB.get_mongo_client_Policy_intake()
    collection = db['email_to_policy_intake']
    success_emails = []
    failure_emails = []
    current_time = datetime.now(timezone.utc)
    emails = collection.find()  # Fetch all emails (consider pagination for large volumes)
    for email in emails:
        subject = email.get('subject')
        body = email.get('body')
        sender_email = email.get('sender_email')
        email_time = email.get('email_time')    
        process_document_name = email.get('process_document_name')[0] if email.get('process_document_name') else None
        process_document_url = email.get('process_document_url')[0] if email.get('process_document_url') else None
        if process_document_name and process_document_url and (
                process_document_name.lower().endswith('.pdf') or process_document_name.lower().endswith(
                '.docx') or process_document_name.lower().endswith('.txt')):
            file_path = os.path.join(settings.MEDIA_ROOT, process_document_url[len(settings.MEDIA_URL):])
        try:
            if process_document_url is not None:
                if process_document_name.lower().endswith('.pdf'):
                    with open(file_path, 'rb') as pdf_file:
                        pdf_data = pdf_file.read()  # Read the PDF data once

                        if not pdf_data:
                            print(f"Error: PDF file '{process_document_name}' is empty.")
                            continue
                        pdf_bytesio = BytesIO(pdf_data)  # Create a BytesIO object
                        init_extracted_text = File_handling.extract_text_from_pdf(pdf_bytesio)
                        if init_extracted_text == 'pdf_image':
                            continue
                        else:
                            body += "\n" + str(init_extracted_text)
                            extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(body)
                            accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.quote())
                elif process_document_name.lower().endswith('.docx'):
                    with open(file_path, 'rb') as word_file:
                        word_data = word_file.read()
                        if not word_data:
                            print(f"Error: Word file '{process_document_name}' is empty.")
                            continue
                        word_bytesio = BytesIO(word_data)
                        init_extracted_text = File_handling.extract_text_from_docx(word_bytesio)
                        body += "\n" + str(init_extracted_text)
                        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(body)
                        accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.quote())
                else:
                    with open(file_path, 'r') as txt:
                        init_extracted_text = txt.read()
                        body += "\n" + str(init_extracted_text)
                        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(body)
                        accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.quote())
            else:
                extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(body)
                accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.quote())
            Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, process_document_name if process_document_name else "No Document",
                                         application="Mail2Quote")
            missing_fields = []
            print("extracted text", extracted_text)

            required_fields = {
                "PolicyInfo": ["selectedPolicy", "policy_holder_FirstName", "policy_holder_LastName",
                               "policy_holder_mobile",
                               "policy_holder_email", "policy_holder_occupation"],
                "PropertyInfo": ["residenceType", "constructionType", "yearBuilt", "numberOfStories", "squareFootage",
                                 "heatingType", "plumbing_installed_year", "wiring_installed_year",
                                 "heating_installed_year",
                                 "roof_installed_year", "fireHydrantDistance", "fireStationDistance",
                                 "alternateHeating",
                                 "any_business_conducted_on_premises", "trampolineRamp", "subjectToFlood",
                                 "floodInsuranceRequested",
                                 "rentedToOthers"],
                "AdditionalInfo": ["currentInsuranceCarrier", "currentPolicy", "effectiveDate",
                                   "current_policy_premium",
                                   "anyLossLast4Years", "mortgageeName", "mortgageeInstallmentAmount"],
                "Coverages": ["dwellingCoverage", "personalProperty", "personalLiabilityCoverage", "medicalPayments",
                              "deductible"]
            }

            for nested_key, fields in required_fields.items():
                for field in fields:
                    value = extracted_text.get(nested_key, {}).get(field)  # Get value from nested dictionary
                    if value is None or str(value).strip() == '':
                        missing_fields.append(f"{field}")  # Indicate missing field with its nested key

            extracted_text = Ai_utils.process_extracted_data(extracted_text)
            print("Extracted_text: ", extracted_text)
            policy_info = extracted_text.get('PolicyInfo', {})
            property_info = extracted_text.get('PropertyInfo', {})

            if policy_info and property_info:
                policy_holder_address = Address_validations.format_address(policy_info, 'policy_holder')
                property_address = Address_validations.format_address(property_info, 'CoverageLocation')
                validated_policy_holder_address = ""
                policy_holder_splitted_address = ""
                property_splitted_address = ""
                if policy_holder_address:
                    if not property_address:
                        property_address = policy_holder_address
                        validated_policy_holder_address = Address_validations.validate_address(policy_holder_address)
                        property_info['CoverageLocation_street_number'] = policy_info['policy_holder_street_number']
                        property_info['CoverageLocation_street_name'] = policy_info['policy_holder_street_name']
                        property_info['CoverageLocation_city'] = policy_info['policy_holder_city']
                        property_info['CoverageLocation_state'] = policy_info['policy_holder_state']
                        property_info['CoverageLocation_zip'] = policy_info['policy_holder_zip']
                        property_info['CoverageLocation_country'] = policy_info['policy_holder_country']
                    if validated_policy_holder_address:
                        validated_property_address = validated_policy_holder_address
                    else:
                        validated_policy_holder_address = Address_validations.validate_address(policy_holder_address)
                        validated_property_address = Address_validations.validate_address(property_address)
                    if validated_policy_holder_address != "Address Not validated":
                        policy_holder_splitted_address = Address_validations.parse_address(validated_policy_holder_address)
                    else:
                        missing_fields.append({"Invalid Policy Holder Address": policy_holder_address})
                    if validated_property_address != "Address Not validated":
                        property_splitted_address = Address_validations.parse_address(validated_property_address)
                    else:
                        missing_fields.append({"Invalid Coverage Location": property_address})

            if missing_fields or validated_policy_holder_address == "Address Not validated" or validated_property_address == "Address Not validated":
                email['status'] = 'failed'
                email['missing_fields'] = missing_fields
                email['time_stamp'] = current_time
                email['policy_holder_validated_address'] = validated_policy_holder_address
                email['policy_holder_splitted_validated_address'] = policy_holder_splitted_address
                email['property_validated_address'] = validated_property_address
                email['property_splitted_validated_address'] = property_splitted_address
                policy_info['validated_address'] = validated_policy_holder_address
                property_info['validated_address'] = validated_property_address
                email['extracted_text'] = extracted_text
                print("failure emails due to handle missing fileds")
                handle_failure(db, email, process_document_name, process_document_url, missing_fields, sender_email,
                               subject, collection, policy_info['policy_holder_FirstName'])
                failure_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                continue  # Skip to the next email

            policy_holder_info = extracted_text.get('PolicyInfo', {})
            additional_info = extracted_text.get('AdditionalInfo', {})
            property_info = extracted_text.get('PropertyInfo', {})
            coverages = extracted_text.get('Coverages', {})

            coverage_and_additional_information_collection = db['coverage_and_additional_information']
            latest_doc = coverage_and_additional_information_collection.find_one(
                filter={},  # no filter criteria
                projection={'_id': 0},  # exclude _id field
                sort=[('_id', -1)]  # still sort by _id to get latest
            )
            if latest_doc:
                latest_policy = Authentication.decrypt_data(latest_doc)
                latest_quote_number = latest_policy['quote_number']
            else:
                latest_quote_number = None
            random_quote_amount = Policy_utils.generate_random_quote_amount()
            next_quote_number = Policy_utils.generate_next_quote_number(latest_quote_number)
            policy_holder_info['quote_number'] = next_quote_number
            policy_holder_info['quote_amount'] = random_quote_amount
            property_info['quote_number'] = next_quote_number
            coverage_and_additional_info = {
                'additional_info': additional_info,
                'coverages': coverages,
                'policy_created_at': datetime.now(timezone.utc),
                'quote_number': next_quote_number
            }
            result = Policy_utils.add_policy_info_to_db(policy_holder_info, property_info, coverage_and_additional_info)

            if result == "Policy created successfully":
                print("Hello")
                email['time_stamp'] = current_time
                email['policy_holder_validated_address'] = validated_policy_holder_address
                email['policy_holder_splitted_validated_address'] = policy_holder_splitted_address
                email['property_validated_address'] = validated_property_address
                email['property_splitted_validated_address'] = property_splitted_address
                email['status'] = 'success'
                email['extracted_text'] = extracted_text
                email['quote_number'] = next_quote_number
                email['quote_amount'] = random_quote_amount
                user_email = policy_holder_info['policy_holder_email']
                print("sending policy success email")
                if user_email:
                    pass
                    # send_claim_confirmation_email(user_email, next_quote_number,random_quote_amount, policy_holder_info['policy_holder_FirstName'])

                    # send_claim_confirmation_email(sender_email, next_quote_number, random_quote_amount, policy_holder_info['policy_holder_FirstName'])                                 
                else:
                    pass

                move_email_data_to_collection(db, email, 'email_to_policy_intake_success')
                collection.delete_one({'_id': email['_id']})
                print(f"Email with subject '{subject}' deleted from MongoDB.")
                if process_document_name and process_document_url:
                    move_attachments_to_folder(process_document_url, 'email_to_policy_intake',
                                               'email_to_policy_intake_success', 'process_documents')
                success_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
            else:
                email['time_stamp'] = current_time
                email['policy_holder_validated_address'] = validated_policy_holder_address
                email['policy_holder_splitted_validated_address'] = policy_holder_splitted_address
                email['property_validated_address'] = validated_property_address
                email['property_splitted_validated_address'] = property_splitted_address
                email['extracted_text'] = extracted_text
                email['status'] = 'failed'
                print(f"Failed to add claim_details")
                handle_failure(db, email, process_document_name, process_document_url,
                               missing_fields, sender_email, subject, collection,
                               insured_name=policy_holder_info['policy_holder_FirstName'])
                failure_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                continue  # Skip to the next email

        except FileNotFoundError:
            print(f"Error: File not found at path: {file_path}")
            # TODO: Handle file not found error (e.g., send failure email)
        except Exception as e:
            print(f"Error processing PDF {process_document_name}: {e}")
            # TODO: Handle other PDF processing errors (e.g., corrupted file)
    return Response({'status': 'Done', 'message': 'Email processing Successful.', 'Success_mails': success_emails,
                         'Failure_mails': failure_emails})


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_document_by_email(request):
    email = request.data.get('email')
    status = request.data.get('status')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    print(email, status)
    if status == "failure":
        emails_collection = db['email_to_policy_intake_failure']
        sub_folder = "email_to_policy_intake_failure"
    else:
        emails_collection = db['email_to_policy_intake_success']
        sub_folder = "email_to_policy_intake_success"
    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
    if data_list:
        data = data_list[0]
        body = data.get('body', None)
        email_time = data.get('email_time', None)
        subject = data.get('subject', None)
        Errors = data.get('missing_fields', None)
        extracted_data = data.get('extracted_text', None)
        quote_number = data.get('quote_number', None)
        quote_amount = data.get('quote_amount', None)
        if data:
            process_document_path = data.get('process_document_url', None)
            document_name = data.get('process_document_name', None)
            if process_document_path:
                actual_path = process_document_path[0].split("/")[-1]
                print(actual_path)
                document_name = document_name[0]

                file_path = os.path.join(settings.MEDIA_ROOT, "email_to_policy_intake", sub_folder, "process_documents",
                                        actual_path)
                print(file_path)
                if os.path.exists(file_path):
                    try:
                        if document_name.lower().endswith(('.docx', '.doc')):
                            html_content = ""
                            with docx2python(file_path, html=True) as docx_content:
                                html_content = docx_content.text
                            html_content = bleach.clean(html_content, tags=bleach.sanitizer.ALLOWED_TAGS,
                                                        attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)
                            content_type = 'html'

                        elif document_name.endswith('.txt'):
                            with open(file_path, 'r') as file:
                                html_content = f"<pre>{file.read()}</pre>"
                            content_type = 'html'
                        elif document_name.endswith('.pdf'):
                            with open(file_path, 'rb') as file:
                                encoded_content = base64.b64encode(file.read()).decode('utf-8')
                            content_type = 'pdf'
                        else:
                            print("8. Unsupported file type:", document_name)
                            return Response({'error': 'Unsupported file type', 'api': 'get_document_by_email'}, status=status.HTTP_400_BAD_REQUEST)
                        if content_type == 'pdf':
                            encoded_content = encoded_content
                        else:   
                            encoded_content = html_content

                        if status == "failure":
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                                'body': body,
                                'subject': subject,
                                'email_time': email_time,
                                'Errors': Errors,
                                'Extracted_data': extracted_data
                            })
                        else:
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                                'body': body,
                                "email_time": email_time,
                                'subject': subject,
                                'Errors': Errors,
                                'Extracted_data': extracted_data,
                                'quote_number': quote_number,
                                'quote_amount': quote_amount
                            })
                    except Exception as e:
                        print("6. Error processing file:", e)
                        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_document_by_email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    print("7. File not found:", file_path)
                    return Response({'error': 'File not found', 'api': 'get_document_by_email'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                    'success': True,
                    'body': body,
                    'document_name': None,
                    'content': body,
                    'content_type': None,
                    'subject': subject,
                    'email_time': email_time,
                    'Errors': Errors,
                    'Extracted_data': extracted_data,
                    'quote_number': quote_number,
                    'quote_amount': quote_amount
                })

    else:
        return Response({'error': 'Email not found', 'api': 'get_document_by_email'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def email_to_policy_edit(request):
    policy_data_str = request.data.get('policy_data')
    email = request.data.get('email')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    if not policy_data_str or not email:
        return Response({'error': 'Policy_data or email cannot be empty', 'api': 'email_to_policy_edit'}, status=status.HTTP_404_NOT_FOUND)

    try:
        policy_data = json.loads(policy_data_str)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON in policy_data', 'api': 'email_to_policy_edit'}, status=status.HTTP_400_BAD_REQUEST)

    emails_collection = db['email_to_policy_intake_failure']
    print(email, emails_collection)
    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
    print(data_list)
    email_data = data_list[0]
    print("email data from failure collection:", email_data)
    process_document_name = email_data.get('process_document_name')[0] if email_data.get(
        'process_document_name') else None
    process_document_url = email_data.get('process_document_url')[0] if email_data.get('process_document_url') else None

    policy_data = Ai_utils.process_extracted_data(policy_data)
    policy_holder_info = policy_data.get('PolicyInfo', {})
    additional_info = policy_data.get('AdditionalInfo', {})
    property_info = policy_data.get('PropertyInfo', {})
    coverages = policy_data.get('Coverages', {})

    print("process document name and url", process_document_name, process_document_url)
    if process_document_name and process_document_url and (
            process_document_name.lower().endswith('.pdf') or process_document_name.lower().endswith('.docx') or
            process_document_name.lower().endswith('.txt')):
        file_path = os.path.join(settings.MEDIA_ROOT, process_document_url[len(settings.MEDIA_URL):])

    coverage_and_additional_information_collection = db['coverage_and_additional_information']
    latest_doc = coverage_and_additional_information_collection.find_one(
        filter={},  # no filter criteria
        projection={'_id': 0},  # exclude _id field
        sort=[('_id', -1)]  # still sort by _id to get latest
    )
    if latest_doc:
        latest_policy = Authentication.decrypt_data(latest_doc)
        latest_quote_number = latest_policy['quote_number']
    else:
        latest_quote_number = None

    random_quote_amount = Policy_utils.generate_random_quote_amount()
    next_quote_number = Policy_utils.generate_next_quote_number(latest_quote_number)
    policy_holder_info['quote_number'] = next_quote_number
    policy_holder_info['quote_amount'] = random_quote_amount
    property_info['quote_number'] = next_quote_number
    coverage_and_additional_info = {'additional_info': additional_info, 'coverages': coverages,
                                    'policy_created_at': datetime.now(timezone.utc), 'quote_number': next_quote_number,
                                    'process_document_name': process_document_name,
                                    'process_document_url': process_document_url}

    result = Policy_utils.add_policy_info_to_db(policy_holder_info, property_info, coverage_and_additional_info)
    if result == "Policy created successfully":
        print("Hello")
        email_data['status'] = 'edited_success'
        email_data['quote_number'] = next_quote_number
        email_data['quote_amount'] = random_quote_amount
        email_data['extracted_text'] = policy_data
        user_email = policy_holder_info['policy_holder_email']
        print("sending policy success email")
        if user_email:
            pass
            # send_claim_confirmation_email(user_email, next_quote_number,random_quote_amount, policy_holder_info['policy_holder_FirstName'])
        else:
            pass

        move_email_data_to_collection(db, email_data, 'email_to_policy_intake_success')
        emails_collection.delete_one({'_id': email_data['_id']})
        if process_document_name and process_document_url:
            move_attachments_to_folder_edit(process_document_url, 'email_to_policy_intake',
                                            'email_to_policy_intake_success', 'process_documents')

        return Response({
            'message': result,
            'quote_number': next_quote_number,
            'quote_amount': random_quote_amount
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Something happened', 'api': 'email_to_policy_edit'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_quotes_by_channel(request):
    ic_id = request.data.get('ic_id')
    channel = request.data.get('channel')
    if not ic_id or not channel:
        return Response({'error': "IC_ID and channel must not be empty", 'api': 'get_quotes_by_channel'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_Policy_intake()
    policy_holders_collection = db['policy_holder_information']
    coverage_collection = db['coverage_and_additional_information']
    encrypted_data = Authentication.encrypt_data({'policy_associated_ic_id': ic_id, 'policy_from_channel': channel})
    encrypted_keys = list(encrypted_data.keys())
    encrypted_values = list(encrypted_data.values())
    policy_holders_db = list(policy_holders_collection.find({encrypted_keys[0]: encrypted_values[0], encrypted_keys[1]: encrypted_values[1]}, {'_id':0}))
    policy_holders = []
    for policy in policy_holders_db:
        policy_holders.append(Authentication.decrypt_data(policy))
    results = []
    for policy_holder in policy_holders:
        quote_number = policy_holder.get('quote_number')
        encrypted_quote_number = Authentication.encrypt_data({'quote_number': quote_number})
        encrypted_quote_key = list(encrypted_quote_number.keys())
        encrypted_quote_value = list(encrypted_quote_number.values())
        # Find matching coverage information
        coverage_info = coverage_collection.find_one({encrypted_quote_key[0]: encrypted_quote_value[0]}, {'_id':0})
        if not coverage_info:
            continue
        decrypted_coverage_info = Authentication.decrypt_data(coverage_info)
        policy_holder_name = f"{policy_holder.get('policy_holder_FirstName', '')} {policy_holder.get('policy_holder_LastName', '')}"
        results.append({
            'quote_number': quote_number,
            'quote_amount': policy_holder.get('quote_amount'),
            'policy_holder_name': policy_holder_name.strip(),
            'selected_policy': policy_holder.get('selectedPolicy'),
            'policy_holder_email': policy_holder.get('policy_holder_email'),
            'policy_created_at': decrypted_coverage_info.get('policy_created_at'),
        })
 
    return Response(results, status=status.HTTP_200_OK)
 
 
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_docai_process_document(request):
    quote_number = request.data.get('quote_number')
    ic_id = request.data.get('ic_id')
    if not quote_number or not ic_id:
        return Response({'Error': 'quote_number and ic_id should not be empty', 'api': 'get_docai_process_document'}, status=status.HTTP_400_BAD_REQUEST)
    encrypted_quote_number = Authentication.encrypt_data({'quote_number': quote_number})
    encrypted_quote_key = list(encrypted_quote_number.keys())
    encrypted_quote_value = list(encrypted_quote_number.values())
    client, db = MongoDB.get_mongo_client_Policy_intake()
    coverage_and_additional_collection = db['coverage_and_additional_information']
    coverage_info = coverage_and_additional_collection.find_one({encrypted_quote_key[0]: encrypted_quote_value[0]}, {'_id':0})
    if not coverage_info:
        return Response({'Error': 'Quote not found', 'api': 'get_docai_process_document'}, status=404)
    decrypted_quote = Authentication.decrypt_data(coverage_info)  
    docaiQuote_process_document_name = decrypted_quote.get('policy_process_document_name', '')
    docaiQuote_process_document_url = decrypted_quote.get('policy_process_document_url', '')
 
    if not docaiQuote_process_document_name and not docaiQuote_process_document_url:
        return Response({"error": "Document not found for the quote", 'api': 'get_docai_process_document'}, status=status.HTTP_404_NOT_FOUND)
   
    actual_path = docaiQuote_process_document_url.split("/")[-1]
    document_name = docaiQuote_process_document_name
    file_path = os.path.join(settings.MEDIA_ROOT, "Policy_Intake_IDP_files", actual_path)
    if not os.path.exists(file_path):
        return Response({"error": "Document file not found", 'api': 'get_docai_process_document'}, status=status.HTTP_404_NOT_FOUND)
 
    try:
        if actual_path.lower().endswith(('.docx', '.doc')):
            with docx2python(file_path, html=True) as docx_content:
                html_content = docx_content.text
            html_content = bleach.clean(html_content,
                                        tags=bleach.sanitizer.ALLOWED_TAGS,
                                        attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)
            encoded_content = html_content
            content_type = 'html'
        elif actual_path.endswith('.txt'):
            with open(file_path, 'r') as file:
                html_content = f"<pre>{file.read()}</pre>"
            encoded_content = html_content
            content_type = 'html'
        elif actual_path.endswith('.pdf'):
            with open(file_path, 'rb') as file:
                encoded_content = base64.b64encode(file.read()).decode('utf-8')
            content_type = 'pdf'
        elif actual_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            with open(file_path, 'rb') as file:
                encoded_content = base64.b64encode(file.read()).decode('utf-8')
            content_type = imghdr.what(file_path)
        else:
            return Response({'error': 'Unsupported file type', 'api': 'get_docai_process_document'}, status=status.HTTP_400_BAD_REQUEST)
         
        return Response({
            'document_name': document_name,
            'encoded_content': encoded_content,
            'content_type': content_type
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_docai_process_document'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_mail2quote_quotes(request):
    ic_id = request.data.get('ic_id')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    mail2Quote_success_collection = db['email_to_policy_intake_success']
    mail2Quote_failure_collection = db['email_to_policy_intake_failure']
    success_data = {}
    failure_data = {}
    edited_success_data = {}   
    # success_quotes = list(mail2Quote_success_collection.find({"policy_associated_ic_id":ic_id, "status":"success"}))  
    success_quotes = list(mail2Quote_success_collection.find({"status":"success"}))
    failure_quotes = list(mail2Quote_failure_collection.find({"status":"failed"}))
    edited_success_quotes = list(mail2Quote_success_collection.find({"status":"edited_success"}))

    for index, quote in enumerate(success_quotes, start=1):
        success_data[index] = {"email_id": quote.get('sender_email', ''),
                               "subject": quote.get('subject', ''),
                               "body": quote.get('body', ''),
                               "email_time": quote.get('email_time', ''),
                               }
        
    for index, quote in enumerate(edited_success_quotes, start=1):
        edited_success_data[index] = {"email_id": quote.get('sender_email', ''),
                               "subject": quote.get('subject', ''),
                               "body": quote.get('body', ''),
                               "email_time": quote.get('email_time', ''),
                               }

    for index, quote in enumerate(failure_quotes, start=1):
        failure_data[index] = {
                                "email_id": quote.get('sender_email', ''),
                                "subject": quote.get('subject', ''),
                                "body": quote.get('body', ''),
                                "email_time": quote.get('email_time', ''),
                                "missing_fields": quote.get('missing_fields', '')
                            }

    return Response({'success_data': success_data,
                     'edited_success_data':edited_success_data,
                    'failure_data': failure_data,
                    'no_of_success_mails': len(success_quotes),
                    'no_of_edited_success_mails': len(edited_success_quotes),
                    'no_of_failure_mails': len(failure_quotes)}, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_mail2quote_process_document(request):
    email = request.data.get('email')
    policy_status = request.data.get('status')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    if policy_status == "failure":
        emails_collection = db['email_to_policy_intake_failure']
        sub_folder = "email_to_policy_intake_failure"
    else:
        emails_collection = db['email_to_policy_intake_success']
        sub_folder = "email_to_policy_intake_success"
 
    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
     
    if data_list:
        data = data_list[0]
        if data:
            process_document_path = data.get('process_document_url', None)
            document_name = data.get('process_document_name', None)

            if process_document_path and document_name:
                actual_path = process_document_path[0].split("/")[-1]
                document_name = document_name[0]
                file_path = os.path.join(settings.MEDIA_ROOT, "email_to_policy_intake", sub_folder, "process_documents", actual_path)
                
                if os.path.exists(file_path):
                    try:
                        if actual_path.lower().endswith(('.docx', '.doc')):
                            html_content = ""
                            with docx2python(file_path, html=True) as docx_content:
                                html_content = docx_content.text                             
                            html_content = bleach.clean(html_content,
                                                        tags=bleach.sanitizer.ALLOWED_TAGS,
                                                        attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)
                            content_type = 'html'
                        elif actual_path.endswith('.txt'):
                            with open(file_path, 'r') as file:
                                html_content = f"<pre>{file.read()}</pre>"
                            content_type = 'html'
                        elif actual_path.endswith('.pdf'):
                            with open(file_path, 'rb') as file:
                                encoded_content = base64.b64encode(file.read()).decode('utf-8')
                            content_type = 'pdf'
                        else:
                            print("8. Unsupported file type:", document_name)
                            return Response({'error': 'Unsupported file type', 'api': 'get_mail2quote_process_document'}, status=status.HTTP_400_BAD_REQUEST)
                        
                        if content_type == 'pdf':
                            encoded_content = encoded_content
                        else:  # For HTML, don't base64 encode
                            encoded_content = html_content

                        if policy_status == "failure":
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                            })
                        else:
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                            })
                          
                    except Exception as e:
                        print("6. Error processing file:", e)
                        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_mail2quote_process_document'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                else:
                    print("7. File not found:", file_path)
                    return Response({'error': 'File not found', 'api': 'get_mail2quote_process_document'}, status=status.HTTP_404_NOT_FOUND)

            else:
                return Response({'error': 'File path or document name is missing', 'api': 'get_mail2quote_process_document'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({'error': 'Email not found', 'api': 'get_mail2quote_process_document'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_document_extracteddata_by_mail2quote_email(request):
    email = request.data.get('email')
    status = request.data.get('status')
    client, db = MongoDB.get_mongo_client_Policy_intake()
    if status == "failure":
        emails_collection = db['email_to_policy_intake_failure']
        sub_folder = "email_to_policy_intake_failure"
    else:
        emails_collection = db['email_to_policy_intake_success']
        sub_folder = "email_to_policy_intake_success"

    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
     
    if data_list:
        data = data_list[0]
        body = data.get('body', None)
        email_time = data.get('email_time', None)
        subject = data.get('subject', None)
        Errors = data.get('missing_fields', None)
        extracted_data = data.get('extracted_text', None)
        print("extracted text", extracted_data)
        policy_associated_ic_id = data.get('policy_associated_ic_id', None)


        if data:
            process_document_path = data.get('process_document_url', None)
            document_name = data.get('process_document_name', None)

            if process_document_path and document_name:
                actual_path = process_document_path[0].split("/")[-1]
                document_name = document_name[0]
                file_path = os.path.join(settings.MEDIA_ROOT, "email_to_policy_intake", sub_folder, "process_documents", actual_path)
                if os.path.exists(file_path):
                    try:
                        # Determine document type
                        if actual_path.lower().endswith(('.docx', '.doc')):
                            html_content = ""
                            with docx2python(file_path, html=True) as docx_content:
                                html_content = docx_content.text
                            # Sanitize HTML content with bleach
                            html_content = bleach.clean(html_content,
                                                        tags=bleach.sanitizer.ALLOWED_TAGS,
                                                        attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)

                            content_type = 'html'
                        elif actual_path.endswith('.txt'):
                            with open(file_path, 'r') as file:
                                html_content = f"<pre>{file.read()}</pre>"
                            content_type = 'html'
                        elif actual_path.endswith('.pdf'):
                            with open(file_path, 'rb') as file:
                                encoded_content = base64.b64encode(file.read()).decode('utf-8')
                            content_type = 'pdf'
                        else:
                            print("8. Unsupported file type:", document_name)
                            return Response({'error': 'Unsupported file type'}, status=400)

                        # Encode content as base64 (if needed - for PDF)
                        if content_type == 'pdf':
                            encoded_content = encoded_content
                        else:  # For HTML, don't base64 encode
                            encoded_content = html_content

                        if status == "failure":
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                                'body': body,
                                'subject': subject,
                                'email_time': email_time,
                                'Errors': Errors,
                                'Extracted_data': extracted_data,
                                'policy_associated_ic_id':policy_associated_ic_id
                            })
                        else:
                            return Response({
                                'success': True,
                                'document_name': document_name,
                                'content': encoded_content,
                                'content_type': content_type,
                                'body': body,
                                "email_time": email_time,
                                'subject': subject,
                                'Errors': Errors,
                                'Extracted_data': extracted_data,
                                'policy_associated_ic_id':policy_associated_ic_id                             
                            })
                    except Exception as e:
                        print("6. Error processing file:", e)
                        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_document_extracteddata_by_mail2quote_email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    print("7. File not found:", file_path)
                    return Response({'error': 'File not found', 'api': 'get_document_extracteddata_by_mail2quote_email'}, status=status.HTTP_404_NOT_FOUND)

            else:                 
                if extracted_data and '_id' in extracted_data:
                    extracted_data['_id'] = str(extracted_data['_id'])
                print("if document no exist",body,subject, email_time, Errors, extracted_data )
                return Response({
                                    'success': True,
                                    'body': body,
                                    'document_name': None,
                                    'content': body,
                                    'content_type': None,
                                    'subject': subject,
                                    'email_time': email_time,
                                    'Errors': Errors,
                                    'Extracted_data': extracted_data,  
                                    'policy_associated_ic_id':policy_associated_ic_id                                
                                })                

    else:
        return Response({'error': 'Email not found', 'api': 'get_document_extracteddata_by_mail2quote_email'}, status=status.HTTP_404_NOT_FOUND)