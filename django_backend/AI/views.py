from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from Master_package.master_package_security import Authentication
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_utils import Claim_utils, Ai_utils, Address_validations, File_handling, Emails
from Master_package.master_package_schemas import Details_to_extract
from rest_framework.response import Response
from langchain.memory import ConversationBufferWindowMemory
from .utils import *
from datetime import datetime, timezone, timedelta
from rest_framework import status
from PIL import Image
import base64
from io import BytesIO
from django.conf import settings
import os
import random
import pandas as pd
import threading
from docx2python import docx2python
import bleach
from dotenv import load_dotenv
from django.core.files.uploadedfile import InMemoryUploadedFile
import mimetypes  # For guessing content type
import shutil

load_dotenv()


@api_view(['POST'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def IDP(request):
    ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
    ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']
    if 'file' not in request.data:
        return Response({'error': 'No file provided', 'api': 'IDP'}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.data['file']
    file_name, file_extension = os.path.splitext(uploaded_file.name)

    file_type = ''
    init_extracted_text = ''

    if file_extension.lower() in ALLOWED_IMAGE_EXTENSIONS:
        file_type = 'image'
    elif file_extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS:
        file_type = file_extension.lower()[1:]   
        if file_type == 'pdf':
            init_extracted_text = File_handling.extract_text_from_pdf(BytesIO(uploaded_file.read()))
            if init_extracted_text == 'pdf_image':
                file_type = 'pdf_image'
            if 'form_fields' in init_extracted_text:
                form_fields = init_extracted_text.get('form_fields', [])
                if not isinstance(form_fields, list):
                    return Response({
                        'message': 'Invalid form fields format',
                        'api': 'IDP',
                        'upload_status': 'invalid_format'
                    }, status=status.HTTP_400_BAD_REQUEST)
                all_fields_empty = all(
                    str(field.get('value', '')).strip() == ''
                    for field in form_fields
                )               
                if all_fields_empty:
                    return Response({
                        'message': 'Your file appears to be empty. Please upload a file with data to proceed',
                        'api': 'IDP',
                        'upload_status': 'empty_form'
                    }, status=status.HTTP_400_BAD_REQUEST)
        elif file_type == 'docx':
            init_extracted_text = File_handling.extract_text_from_docx(BytesIO(uploaded_file.read()))
        elif file_type == 'txt':
            init_extracted_text = File_handling.extract_text_from_txt(uploaded_file)
 
    else:
        return Response({'error': 'Invalid file type', 'api': 'IDP'}, status=status.HTTP_400_BAD_REQUEST)

    # Re-read the uploaded file for image processing, if necessary
    queries = Ai_utils.get_textract_queries_for_claim
    uploaded_file.seek(0)
    if file_type == 'image':
        img_extracted_text = Ai_utils.extract_text_from_image(
            BytesIO(uploaded_file.read()),
            queries,
        )
        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.error_agent(img_extracted_text)
        accuracy, reason = Ai_utils.get_accuracy(img_extracted_text, extracted_text, details_to_extract=Details_to_extract.claim())
    elif file_type == 'pdf_image':
        img_extracted_text = Ai_utils.process_pdf_image(
            BytesIO(uploaded_file.read()),
            queries,
        )
        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.error_agent(img_extracted_text)
        accuracy, reason = Ai_utils.get_accuracy(img_extracted_text, extracted_text, details_to_extract=Details_to_extract.claim())
    else:
        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(init_extracted_text)
        accuracy, reason = Ai_utils.get_accuracy(init_extracted_text, extracted_text, details_to_extract=Details_to_extract.claim())

    if extracted_text:
        policy_number = extracted_text.get("policy_number")

        client, db = MongoDB.get_mongo_client_innoclaimfnol()
        policy_data = db['policies'].find_one({"policy_number": policy_number})

        if policy_data:
            ic_id = policy_data.get("ic_id")
            insurance_company_data = db['insurancecompanies'].find_one({"ic_id": ic_id})
            policy = Claim_utils.convert_objectid_to_str(policy_data)
            insurance_company = Claim_utils.convert_objectid_to_str(insurance_company_data)
            if 'ic_logo_path' in insurance_company and insurance_company['ic_logo_path'] != "":
                image_path = insurance_company['ic_logo_path'][7:]
                image_name = insurance_company['ic_logo_name']
                Full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                # Extract image type from file name
                _, image_type = os.path.splitext(image_name)
                # Remove the leading '.' from the extension
                image_type = image_type[1:].lower()
                if Full_path:
                    # Read and encode the image
                    with open(Full_path, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    insurance_company['image_data'] = encoded_string
                    insurance_company['image_type'] = image_type
            address_parts = [
                policy.get('pro_address1', ''),
                policy.get('pro_address2', ''),
                policy.get('pro_street', ''),
                policy.get('pro_city', ''),
                policy.get('pro_zip', ''),
                policy.get('pro_state', ''),
                policy.get('pro_country', '')
            ]
            loss_location = [
                extracted_text.get('street_number', ''),
                extracted_text.get('street_name', ''),
                extracted_text.get('loss_city', ''),
                extracted_text.get('loss_state', ''),
                extracted_text.get('loss_zip', '') if extracted_text.get('loss_zip') != 0 else "",
                extracted_text.get('loss_country', '')
            ]
            # Filter out empty parts and join with spaces
            address_string = " ".join(part for part in address_parts if part != "Null")
            loss_location = " ".join(str(part) for part in loss_location if
                                     part is not None and (part != "" or part != "Null" or part != "None"))
            extracted_text['loss_location'] = loss_location
            splitted_address = ""
            formatted_address = ""
            if loss_location:
                formatted_address = Address_validations.validate_address(loss_location)
                if formatted_address != "Address Not validated":
                    splitted_address = Address_validations.parse_address(formatted_address)
            extracted_text['address'] = address_string
            Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, file_name,
                                         application="DocAI Claim")
            return Response({
                'file_type': file_type,
                'file_name': file_name,
                'output_tokens': output_tokens,
                'input_tokens': input_tokens,
                'total_tokens': total_tokens,
                'accuracy': accuracy,
                'reasons': reason,
                'extracted_data': extracted_text,
                'Validated_Address': formatted_address,
                'splitted_address': splitted_address,
                'policy_data': policy,
                'insurance_company_data': insurance_company,
                # 'address': address_string
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": f"The provided policy number does not match with records! please verify your policy number: {policy_number}", "api": "IDP"},
                status=status.HTTP_404_NOT_FOUND)


@parser_classes([MultiPartParser])
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def add_idp_claim_details(request):
    data = request.data
    process_document = request.FILES.getlist('process_document')
    witness_documents = request.FILES.getlist('witness_documents')
    original_filenames = []
    save_paths = []
    storage_type = data['claim_storage_type']
    data['claim_created_at'] = datetime.now(timezone.utc)

    if process_document:
        # Save documents with unique IDs
        # original_files, paths, message = File_handling.save_documents_with_unique_ids(process_document, 'IDP_files/process_documents')
        original_files, paths, message = File_handling.save_documents_with_unique_ids(process_document,'IDP_files\\process_documents')
        original_filenames = original_files
        save_paths = paths
        data['claim_process_document_name'] = original_filenames
        data['claim_process_document_url'] = save_paths

    if witness_documents:
        # original_files, paths, message = File_handling.save_documents_with_unique_ids(witness_documents,'IDP_files/witness_documents')
        original_files, paths, message = File_handling.save_documents_with_unique_ids(witness_documents,'IDP_files\\witness_documents')
        original_filenames = original_files
        save_paths = paths
        data['claim_witness_document_names'] = original_filenames
        data['claim_witness_document_urls'] = save_paths


    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    claim_collection = db['claims']
    policy_collection = db['policies']
    company_collection = db['insurancecompanies']
    policy_number = data['policy_number']
    policy = policy_collection.find_one({'policy_number': policy_number})
    insured_name = policy["pol_first_name"] + " " + policy["pol_middle_name"] if policy["pol_middle_name"] != "Null" or policy["pol_middle_name"] != "" else "" + " " + policy["pol_last_name"]
    company = company_collection.find_one({'ic_id': policy['ic_id']})
    claimants_contact = [
            policy.get('pol_first_name', ''),
            policy.get('pol_middle_name', ''),
            policy.get('pol_last_name', ''),
            str(policy.get('pol_mobile', '')),
            policy.get('pol_email', ''),
            str(policy.get('pro_address1', '')),
            policy.get('pro_address2', ''),
            policy.get('pro_street', ''),
            policy.get('pro_city', ''),
            str(policy.get('pro_zip', '')),
            policy.get('pro_state', ''),
            policy.get('pro_country', '')
        ]
    claimants_contact_str = ",".join(claimants_contact)
    data['insured_contact_details'] = claimants_contact_str

    # Get the latest claim ID (if any)
    if storage_type == 'Database':
        # Exclude _id field using projection parameter {_id: 0}
        latest_doc = claim_collection.find_one(
            filter={},  # no filter criteria
            projection={'_id': 0},  # exclude _id field
            sort=[('_id', -1)]  # still sort by _id to get latest
        )
        if latest_doc:
            latest_claim = Authentication.decrypt_data(latest_doc)
            latest_claim_id = latest_claim.get('claim_id', None)
        else:
            latest_claim_id = None
        # Generate the next claim ID
        next_claim_id = Claim_utils.generate_next_claim_id(latest_claim_id)
        data['claim_id'] = next_claim_id
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if process_document:
            # Remove 'documents' key as it's not needed
            del data_to_insert['process_document']
        if witness_documents:
            del data_to_insert['witness_documents']
        data_to_insert['loss_date_and_time'] = data_to_insert['loss_date_and_time'].replace('-', '/')
        converted_data = Claim_utils.get_dictionary_structure(data_to_insert, "Insured", policy)

        # Insert claim into the database
        inserted_claim = Claim_utils.add_claim_to_db(converted_data)

    elif storage_type == 'CSV':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if process_document:
            # Remove 'documents' key as it's not needed
            del data_to_insert['process_document']
        if witness_documents:
            del data_to_insert['witness_documents']
        
        converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_csv(converted_data, company['ic_name'])
        data['claim_id'] = next_claim_id

    elif storage_type == 'Excel':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if process_document:
            # Remove 'documents' key as it's not needed
            del data_to_insert['process_document']
        if witness_documents:
            del data_to_insert['witness_documents']
        converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_excel(converted_data, company['ic_name'])
        data['claim_id'] = next_claim_id

    elif storage_type == 'Flat File':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if process_document:
            # Remove 'documents' key as it's not needed
            del data_to_insert['process_document']
        if witness_documents:
            del data_to_insert['witness_documents']

        converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_flat_file(converted_data, company['ic_name'])
        data['claim_id'] = next_claim_id

    # Get user email and send confirmation email
    if 'policy_number' in data:
        policy_number = data['policy_number']
        user_email = Claim_utils.get_user_email_from_policy(policy_number)

        if user_email:
            if 'ic_logo_path' in company and company['ic_logo_path'] != "":
                image_path = company['ic_logo_path'][7:]
                image_name = company['ic_logo_name']
                Full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                # Extract image type from file name
                _, image_type = os.path.splitext(image_name)
                # Remove the leading '.' from the extension
                image_type = image_type[1:].lower()
                if Full_path:
                    # Read and encode the image
                    with open(Full_path, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            Emails.send_claim_confirmation_email(user_email, next_claim_id, company['ic_name'], insured_name, encoded_string,
                                          company['ic_email'], company['ic_mobile'], company['ic_primary_color'],
                                          company['ic_id'])
        else:
            # Handle case where email is not found (e.g., log an error)
            pass

    return Response({
        'message': 'Claim details added successfully',
        'data': Claim_utils.convert_objectid_to_str(data['claim_id'])
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def Welcome_Chat_agent(request):
    query = request.data.get('query')
    Welcome_Message = Ai_utils.welcome_agent(query)
    return Response({'welcome_message': Welcome_Message}, status=status.HTTP_200_OK)


@parser_classes([MultiPartParser])
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def AI_CHAT_AGENT(request):
    query = request.data.get('query')
    user_email = request.data.get('userEmail')
    Role = request.data.get('role')
    all_policies = Claim_utils.get_policy_numbers_from_db()
    random.shuffle(all_policies)
    manage_conversation_data(request, verify_history={"user": query})
    refined_query = ""

    if 'file' in request.data:
        query = " "
        uploaded_file = request.data.get('file')
        ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
        ALLOWED_DOCUMENT_EXTENSIONS = '.pdf'
        file_name, file_extension = os.path.splitext(uploaded_file.name)
        queries = Ai_utils.get_textract_queries_for_claim()
        if file_extension.lower() in ALLOWED_IMAGE_EXTENSIONS:
            file_type = 'image'
            # Handle image processing (not covered in this example)
        elif file_extension.lower() == ALLOWED_DOCUMENT_EXTENSIONS:
            file_type = file_extension.lower()[1:]  # Remove leading '.'
        else:
            return Response({'error': 'Invalid file type', 'api': 'AI_CHAT_AGENT'}, status=status.HTTP_400_BAD_REQUEST)

        if file_type == 'pdf':
            pdf_bytesio = BytesIO(uploaded_file.read())
            init_extracted_text = File_handling.extract_text_from_pdf(pdf_bytesio)
            if init_extracted_text == 'pdf_image':
                pdf_bytesio.seek(0)
                img_extracted_text = Ai_utils.process_pdf_image(
                    pdf_bytesio,
                    queries,
                )
                extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.error_agent(img_extracted_text)
            else:
                extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(init_extracted_text)
        else:
            img_extracted_text = Ai_utils.extract_text_from_image(
                BytesIO(uploaded_file.read()),
                queries,
            )
            extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.error_agent(img_extracted_text)

        manage_conversation_data(request, {"user": f"This is my information:{extracted_text}",
                                           "ai": '''Thank you for providing this information, 
                                                 These are all the collected information upto now!, 
                                                 and let me check and tell you the list of fields that are missing'''},
                                 intent='True')
        manage_conversation_data(request, verify_history={"user": extracted_text})
    conversation_history, intent, verification_status, verify_history = manage_conversation_data(request)
    if Role == "Insured":
        memory = ConversationBufferWindowMemory(ai_prefix="Insurance Agent", k=20)
    else:
        memory = ConversationBufferWindowMemory(ai_prefix="Insurance Agent", k=70)
    for item in conversation_history:
        memory.save_context(
            {"input": item.get('user', '')}, {"output": item.get('ai', '')}
        )

    if intent == 'False':
        intent = classifier_agent(query)
        context = ''
        if intent == 'False':
            refined_query = query_refiner_agent(conversation_history, query)
            manage_conversation_data(request, {"user": query, "ai": refined_query})
            context = []
            query_response = query_agent(refined_query, context)

        else:
            if verification_status == 'False':
                verification_status = verification_agent(verify_history, all_policies)
                if verification_status == 'Wrong':
                    query_response = "The provided policy number does not exist in our database. Please verify and try again."
                    manage_conversation_data(request=request, verification_status=verification_status)
                else:
                    query_response = claim_agent(query, memory, Role)
                    manage_conversation_data(request=request, intent=intent,
                                             verification_status=verification_status)  # Update intent in cache
            elif verification_status == 'True':
                query_response = claim_agent(query, memory, Role)
            else:
                verification_status = verification_agent(verify_history, all_policies)
                if verification_status == 'Wrong':
                    query_response = "The provided policy number does not exist in our database. Please verify and try again."
                    manage_conversation_data(request=request, verification_status=verification_status)
                else:
                    query_response = claim_agent(query, memory, Role)
                    manage_conversation_data(request=request, intent=intent,
                                             verification_status=verification_status)  # Update intent in cache

    else:
        if verification_status == 'False':
            verification_status = verification_agent(verify_history, all_policies)
            if verification_status == 'Wrong':
                query_response = "The provided policy number does not exist in our database. Please verify and try again."
                manage_conversation_data(request=request, verification_status=verification_status)
            else:
                query_response = claim_agent(query, memory, Role)
                manage_conversation_data(request=request, intent=intent,
                                         verification_status=verification_status)  # Update intent in cache
        elif verification_status == 'True':
            query_response = claim_agent(query, memory, Role)
        else:
            verification_status = verification_agent(verify_history, all_policies)
            if verification_status == 'Wrong':
                query_response = "The provided policy number does not exist in our database. Please verify and try again."
                manage_conversation_data(request=request, verification_status=verification_status)
            else:
                query_response = claim_agent(query, memory, Role)
                manage_conversation_data(request=request, intent=intent,
                                         verification_status=verification_status)  # Update intent in cache

    manage_conversation_data(request, {"user": query, "ai": query_response})
    if intent == 'True':
        if "adjuster" in query_response.lower():
            extracted_text = retriever_agent(query_response, Role)
            if isinstance(extracted_text['policy_number'], list):
                for key, value in extracted_text.items():
                    extracted_text[key] = value[0]
            loss_location = [
                extracted_text.get('street_number', '') if extracted_text.get('street_number') != 'None' else '',
                extracted_text.get('street_name', '') if extracted_text.get('street_name') != 'None' else '',
                extracted_text.get('loss_city', '') if extracted_text.get('loss_city') != 'None' else '',
                extracted_text.get('loss_state', '') if extracted_text.get('loss_state') != 'None' else '',
                extracted_text.get('loss_zip', '') if extracted_text.get('loss_zip') != 0 else "",
                extracted_text.get('loss_country', '') if extracted_text.get('loss_country') != 'None' else ''
            ]
            # Filter out empty parts and join with spaces
            loss_location = " ".join(
                str(part) for part in loss_location if part is not None and (part != "" and part != "Null"))
            validated_address = Address_validations.validate_address(loss_location)
            if validated_address != "Address Not validated":
                splitted_address = Address_validations.parse_address(validated_address)
                intent = "False"
                manage_conversation_data(request=request, intent=intent)
                client, db = MongoDB.get_mongo_client_innoclaimfnol()
                claim_collection = db['claims']
                policy_collection = db['policies']
                company_collection = db['insurancecompanies']
                policy_number = extracted_text['policy_number']
                policy = policy_collection.find_one({'policy_number': policy_number})
                insured_name = policy["pol_first_name"] + " " + policy["pol_middle_name"] if policy[
                                                                                                 "pol_middle_name"] != "Null" or \
                                                                                             policy[
                                                                                                 "pol_middle_name"] != "" else "" + " " + \
                                                                                                                               policy[
                                                                                                                                   "pol_last_name"]
                company = company_collection.find_one({'ic_id': policy['ic_id']})
                address_parts = [
                    policy.get('pro_address1', ''),
                    policy.get('pro_address2', ''),
                    policy.get('pro_street', ''),
                    policy.get('pro_city', ''),
                    policy.get('pro_zip', ''),
                    policy.get('pro_state', ''),
                    policy.get('pro_country', '')
                ]
                # Filter out empty parts and join with spaces
                address_string = " ".join(part for part in address_parts if part != "Null")
                if Role == "Insured":
                    claimants_contact = [
                        policy.get('pol_first_name', ''),
                        policy.get('pol_middle_name', ''),
                        policy.get('pol_last_name', ''),
                        str(policy.get('pol_mobile', '')),
                        policy.get('pol_email', ''),
                        str(policy.get('pro_address1', '')),
                        policy.get('pro_address2', ''),
                        policy.get('pro_street', ''),
                        policy.get('pro_city', ''),
                        str(policy.get('pro_zip', '')),
                        policy.get('pro_state', ''),
                        policy.get('pro_country', '')
                    ]
                    claimants_contact_str = ",".join(claimants_contact)
                    extracted_text['insured_contact_details'] = claimants_contact_str

                extracted_text['loss_property'] = address_string
                storage_type = company['claim_storage_type']
                extracted_text['claim_process_document_name'] = "Claimed Through AI Agent"
                extracted_text['claim_process_document_url'] = "Claimed Through AI Agent"
                extracted_text['claim_witness_document_names'] = "Claimed Through AI Agent"
                extracted_text['claim_witness_document_urls'] = "Claimed Through AI Agent"
                extracted_text['street_number'] = splitted_address['street_number']
                extracted_text['street_name'] = splitted_address['street_name']
                extracted_text['loss_city'] = splitted_address['city']
                extracted_text['loss_state'] = splitted_address['state']
                extracted_text['loss_zip'] = splitted_address['zip_code']
                extracted_text['loss_country'] = splitted_address['country']
                extracted_text['claim_created_at'] = datetime.now(timezone.utc)
                if storage_type == 'Database':
                    # Get the latest claim ID (if any)
                    latest_doc = claim_collection.find_one(
                        filter={},  # no filter criteria
                        projection={'_id': 0},  # exclude _id field
                        sort=[('_id', -1)]  # still sort by _id to get latest
                    )
                    if latest_doc:
                        latest_claim = Authentication.decrypt_data(latest_doc)
                        latest_claim_id = latest_claim.get('claim_id', None)
                    else:
                        latest_claim_id = None
                    # Generate the next claim ID
                    next_claim_id = Claim_utils.generate_next_claim_id(latest_claim_id)
                    extracted_text['claim_id'] = next_claim_id
                    if Role == "Insured":
                        extracted_data = Claim_utils.get_dictionary_structure(extracted_text, Role, policy)
                    else:
                        extracted_data = Claim_utils.get_dictionary_structure(extracted_text, Role, email=user_email)
                    # Insert claim into the database
                    inserted_claim = Claim_utils.add_claim_to_db(extracted_data)
                elif storage_type == 'CSV':
                    extracted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, Role, user_email)
                    inserted_claim, next_claim_id = File_handling.save_to_csv(extracted_data, company['ic_name'])
                elif storage_type == 'Excel':
                    extracted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, Role, user_email)
                    inserted_claim, next_claim_id = File_handling.save_to_excel(extracted_data, company['ic_name'])
                elif storage_type == 'Flat File':
                    extracted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, Role, user_email)
                    inserted_claim, next_claim_id = File_handling.save_to_flat_file(extracted_data, company['ic_name'])
                if next_claim_id:
                    if 'policy_number' in extracted_text:
                        policy_number = extracted_text['policy_number']
                        clear_user_cache(user_email)
                        user_email = Claim_utils.get_user_email_from_policy(policy_number)
                        if user_email:
                            if 'ic_logo_path' in company and company['ic_logo_path'] != "":
                                image_path = company['ic_logo_path'][7:]
                                image_name = company['ic_logo_name']
                                Full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                                # Extract image type from file name
                                _, image_type = os.path.splitext(image_name)
                                # Remove the leading '.' from the extension
                                image_type = image_type[1:].lower()
                                if Full_path:
                                    # Read and encode the image
                                    with open(Full_path, "rb") as image_file:
                                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                            Emails.send_claim_confirmation_email(user_email, next_claim_id, company['ic_name'], insured_name,
                                                          encoded_string, company['ic_email'], company['ic_mobile'],
                                                          company['ic_primary_color'], company['ic_id'])
                        else:
                            # Handle case where email is not found (e.g., log an error)
                            pass
                # Generate the markdown
                markdown_output = dict_to_markdown(extracted_text, Role)
                query_response = f"Your address has been validated: {validated_address}\n\n{markdown_output}\n\n Thanks again for your time and patience, we have processed your claim and your Claim_id is : {next_claim_id}"
            else:
                query_response = f"Sorry after validating the provided address, we think it is not valid: {loss_location}, please provide correct address to continue with your claim."
                manage_conversation_data(request, {"user": query, "ai": query_response})
    manage_conversation_data(request, verify_history={"ai": query_response})
    client, db = MongoDB.get_mongo_client_innoclaimfnol()

    if ensure_user_collection(db, user_email):
        # Collection is ready, add conversation data
        conversation_collection = db[user_email.replace('@', '_').replace('.', '_')]
        conversation_data = {
            "user": query,
            "ai": query_response,
            "timestamp": datetime.now(timezone.utc)  # Add a timestamp
        }
        conversation_collection.insert_one(conversation_data)
    else:
        # Handle the error (e.g., log it and inform the user)
        return Response({f"Error": "Could not access or create collection for {user_email}", "api": "AI_CHAT_AGENT"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(query_response)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_chat_history(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required', 'api': 'get_chat_history'}, status=status.HTTP_400_BAD_REQUEST)

    collection_name = str(email.replace('@', '_').replace('.', '_'))
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    chat_collection = db[collection_name]
    chat_history = list(chat_collection.find({}, {'_id': 0}))
    formatted_chat_history = []
    for message in chat_history:
        timestamp_str = str(message['timestamp'])  # Get timestamp as string

        try:
            # Try to parse with milliseconds
            timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S.%f')
        except ValueError:
            # If milliseconds are missing, parse without them
            timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')

        message['date'] = timestamp.strftime('%Y-%m-%d')
        message['time'] = timestamp.strftime('%H:%M:%S')
        formatted_chat_history.append(message)
    if chat_history:
        return Response({'chat_history': formatted_chat_history})
    else:
        return Response({'message': 'No chat history found for this user.', 'api': 'get_chat_history'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def trigger_email_parsing(request):
    if request.method == 'POST':
        try:
            email_user = os.getenv('EMAIL_USER')
            email_password = os.getenv('EMAIL_PASSWORD_USER')

            if not email_user or not email_password:
                return Response(
                    {'status': 'error', 'message': 'Email credentials not found in environment variables.', "api":"trigger_email_parsing"},
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
                    }, status=status.HTTP_200_OK)
                except Exception as e:
                    request.thread_response = Response({
                        'status': 'error',
                        'message': str(e)
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Store the response for later retrieval
            request.thread_response = None

            # Start the parsing thread
            thread = threading.Thread(target=email_parsing_worker, args=(email_user, email_password))
            thread.start()
            thread.join()  # Wait for the thread to finish

            return request.thread_response

        except Exception as e:
            return Response({'status': 'error', 'message': str(e), 'api':'trigger_email_parsing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'status': 'error', 'message': 'Invalid request method.', 'api':'trigger_email_parsing'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def process_emails(request):
    """
    API endpoint to start processing emails from the "email-to-fnol" MongoDB collection.
    """
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    collection = db['email_to_fnol']
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
        witness_document_names = email.get('witness_document_names') if email.get('witness_document_names') else None
        witness_document_urls = email.get('witness_document_urls') if email.get('witness_document_urls') else None
        insured_name = None
        company = None
        encoded_string = None
        if process_document_name and process_document_url and (process_document_name.lower().endswith(
                '.pdf') or process_document_name.lower().endswith('.docx') or process_document_name.lower().endswith(
            '.txt')):
            file_path = os.path.join(settings.MEDIA_ROOT, process_document_url[len(settings.MEDIA_URL):])
        try:
            if process_document_url != None:
                if process_document_name.lower().endswith('.pdf'):
                    with open(file_path, 'rb') as pdf_file:
                        pdf_data = pdf_file.read()  # Read the PDF data once

                        if not pdf_data:
                            print(f"Error: PDF file '{process_document_name}' is empty.")
                            continue

                        pdf_bytesio = BytesIO(pdf_data)  # Create a BytesIO object
                        init_extracted_text = File_handling.extract_text_from_pdf(pdf_bytesio)
                        if init_extracted_text == 'pdf_image':
                            queries = [
                                {'Text': 'What is policy number?', 'Alias': 'policy_number'},
                                {'Text': ' Who reported the claim ?', 'Alias': 'claim_reported_by'},
                                {'Text': 'what is the loss date and time?', 'Alias': 'loss_date_and_time'},
                                {'Text': 'What is the cause for loss(FIRE/STORM/...)?', 'Alias': 'loss_type'},
                                {'Text': 'What is the loss street number', 'Alias': 'street_number'},
                                {'Text': 'What is the loss street name ?', 'Alias': 'street_name'},
                                {'Text': 'What is the loss city ?', 'Alias': 'loss_city'},
                                {'Text': 'What is the loss STATE name ?', 'Alias': 'loss_state'},
                                {'Text': 'What is the loss zip ?', 'Alias': 'loss_zip'},
                                {'Text': 'What is the loss country ?', 'Alias': 'loss_country'},
                                {'Text': 'is there any police or fire contacted checked?',
                                 'Alias': 'police_fire_contacted'},
                                {'Text': 'what is the report number of police or fire department contacted?',
                                 'Alias': 'report_number'},
                                {'Text': 'What was happened to the insured home?', 'Alias': 'loss_damage_description'},
                            ]
                            pdf_bytesio.seek(0)
                            img_extracted_text = Ai_utils.process_pdf_image(
                                pdf_bytesio,
                                queries,
                            )
                            body += "\n" + str(img_extracted_text)
                            extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.error_agent(body)
                            accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.claim())
                        else:
                            body += "\n" + str(init_extracted_text)
                            extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(body)
                            accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.claim())
                elif process_document_name.lower().endswith('.docx'):
                    with open(file_path, 'rb') as word_file:
                        word_data = word_file.read()
                        if not word_data:
                            print(f"Error: Word file '{process_document_name}' is empty.")
                            continue
                        word_bytesio = BytesIO(word_data)
                        init_extracted_text = File_handling.extract_text_from_docx(word_bytesio)
                        body += "\n" + str(init_extracted_text)
                        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(body)
                        accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.claim())
                else:
                    with open(file_path, 'r') as txt:
                        init_extracted_text = txt.read()
                        body += "\n" + str(init_extracted_text)
                        extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(body)
                        accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.claim())
            else:
                extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.data_extraction_agent(body)
                accuracy, reason = Ai_utils.get_accuracy(body, extracted_text, details_to_extract=Details_to_extract.claim())

            Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason,
                                         process_document_name if process_document_name else "No Document",
                                         application="Mail2Claim")
            missing_fields = []
            required_fields = ["policy_number", "loss_date_and_time", "loss_type", "loss_damage_description"]
            address_fields = ["street_number", "street_name", "loss_city", "loss_state", "loss_zip", "loss_country"]
            email['extracted_text'] = extracted_text

            # Check for required fields (handling empty strings)
            for field in required_fields:
                if not extracted_text.get(field) or extracted_text.get(field) is None or str(
                        extracted_text.get(field)).strip() == '' or str(
                    extracted_text.get(field)).strip() == 'Null' or str(extracted_text.get(field)).strip() == 'None':
                    missing_fields.append(field)

            # Check if at least one address field is present (handling empty strings)
            if not any(extracted_text.get(field) or str(extracted_text.get(field)).strip() != '' or str(
                    extracted_text.get(field)).strip() == 'Null' for field in address_fields):
                missing_fields.append("At least one address field is required.")

            claim_collection = db['claims']
            policy_collection = db['policies']
            company_collection = db['insurancecompanies']
            policy_number = extracted_text['policy_number']
            policy = policy_collection.find_one({'policy_number': policy_number})

            if policy:
                insured_name = policy["pol_first_name"] + " " + policy["pol_middle_name"] if policy[
                                                                                                 "pol_middle_name"] != "Null" or \
                                                                                             policy[
                                                                                                 "pol_middle_name"] != "" else "" + " " + \
                                                                                                                               policy[
                                                                                                                                   "pol_last_name"]
                loss_location = [
                    extracted_text.get('street_number', '') if extracted_text.get('street_number') != 'None' else '',
                    extracted_text.get('street_name', '') if extracted_text.get('street_name') != 'None' else '',
                    extracted_text.get('loss_city', '') if extracted_text.get('loss_city') != 'None' else '',
                    extracted_text.get('loss_state', '') if extracted_text.get('loss_state') != 'None' else '',
                    extracted_text.get('loss_zip', '') if extracted_text.get('loss_zip') != 0 else "",
                    extracted_text.get('loss_country', '') if extracted_text.get('loss_country') != 'None' else ''
                ]
                # Filter out empty parts and join with spaces
                loss_location = " ".join(
                    str(part) for part in loss_location if part is not None and (part != "" and part != "Null"))
                validated_address = Address_validations.validate_address(loss_location)
                splitted_address = None
                if validated_address != "Address Not validated":
                    splitted_address = Address_validations.parse_address(validated_address)
                else:
                    missing_fields.append({"Invalid Address": loss_location})
                company = company_collection.find_one({'ic_id': policy['ic_id']})
                if 'ic_logo_path' in company and company['ic_logo_path'] != "":
                    image_path = company['ic_logo_path'][7:]
                    image_name = company['ic_logo_name']
                    Full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                    # Extract image type from file name
                    _, image_type = os.path.splitext(image_name)
                    # Remove the leading '.' from the extension
                    image_type = image_type[1:].lower()
                    if Full_path:
                        # Read and encode the image
                        with open(Full_path, "rb") as image_file:
                            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                if missing_fields or validated_address == "Address Not validated":
                    email['status'] = 'failed'
                    email['missing_fields'] = missing_fields
                    email['time_stamp'] = current_time
                    email['validated_address'] = validated_address
                    email['splitted_validated_address'] = splitted_address
                    handle_failure(db, email, process_document_name, process_document_url, witness_document_names,
                                   witness_document_urls, missing_fields, sender_email, subject, collection,
                                   encoded_string=encoded_string, company=company, insured_name=insured_name)
                    failure_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                    continue  # Skip to the next email
                address_parts = [
                    policy.get('pro_address1', ''),
                    policy.get('pro_address2', ''),
                    policy.get('pro_street', ''),
                    policy.get('pro_city', ''),
                    policy.get('pro_zip', ''),
                    policy.get('pro_state', ''),
                    policy.get('pro_country', '')
                ]
                # Filter out empty parts and join with spaces
                claimants_contact = [
                        policy.get('pol_first_name', ''),
                        policy.get('pol_middle_name', ''),
                        policy.get('pol_last_name', ''),
                        str(policy.get('pol_mobile', '')),
                        policy.get('pol_email', ''),
                        str(policy.get('pro_address1', '')),
                        policy.get('pro_address2', ''),
                        policy.get('pro_street', ''),
                        policy.get('pro_city', ''),
                        str(policy.get('pro_zip', '')),
                        policy.get('pro_state', ''),
                        policy.get('pro_country', '')
                    ]
                claimants_contact_str = ",".join(claimants_contact)
                extracted_text['insured_contact_details'] = claimants_contact_str
                address_string = " ".join(part for part in address_parts if part != "Null")
                extracted_text['loss_property'] = address_string
                storage_type = company['claim_storage_type']
                extracted_text['claim_process_document_name'] = "From_email" + "(" + sender_email + ")"
                extracted_text['claim_process_document_url'] = "From_email" + "(" + sender_email + ")"
                extracted_text['claim_witness_document_names'] = "From_email" + "(" + sender_email + ")"
                extracted_text['claim_witness_document_urls'] = "From_email" + "(" + sender_email + ")"
                extracted_text['insured_contact_details'] = "From_email" + "(" + sender_email + ")"
                extracted_text['non_insured_contact_details'] = "From_email" + "(" + sender_email + ")"
                extracted_text['street_number'] = splitted_address['street_number']
                extracted_text['street_name'] = splitted_address['street_name']
                extracted_text['loss_city'] = splitted_address['city']
                extracted_text['loss_state'] = splitted_address['state']
                extracted_text['loss_zip'] = splitted_address['zip_code']
                extracted_text['loss_country'] = splitted_address['country']
                extracted_text['claim_created_at'] = datetime.now(timezone.utc)
                if storage_type == 'Database':
                    # Get the latest claim ID (if any)
                    latest_doc = claim_collection.find_one(
                        filter={},  # no filter criteria
                        projection={'_id': 0},  # exclude _id field
                        sort=[('_id', -1)]  # still sort by _id to get latest
                    )
                    if latest_doc:
                        latest_claim = Authentication.decrypt_data(latest_doc)
                        latest_claim_id = latest_claim.get('claim_id', None)
                    else:
                        latest_claim_id = None
                    # Generate the next claim ID
                    next_claim_id = Claim_utils.generate_next_claim_id(latest_claim_id)
                    extracted_text['claim_id'] = next_claim_id
                    # Insert claim into the database
                    converted_data = Claim_utils.get_dictionary_structure(extracted_text, "Insured", policy)
                    inserted_claim = Claim_utils.add_claim_to_db(converted_data)
                elif storage_type == 'CSV':
                    converted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, "Insured")
                    inserted_claim, next_claim_id = File_handling.save_to_csv(converted_data, company['ic_name'])
                elif storage_type == 'Excel':
                    converted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, "Insured")
                    inserted_claim, next_claim_id = File_handling.save_to_excel(converted_data, company['ic_name'])
                elif storage_type == 'Flat File':
                    converted_data = Claim_utils.get_dictionary_structure_for_documents(extracted_text, "Insured")
                    inserted_claim, next_claim_id = File_handling.save_to_flat_file(converted_data, company['ic_name'])

                # Delete the processed email from MongoDB
                if inserted_claim and next_claim_id != None:
                    policy_number = extracted_text['policy_number']
                    email['time_stamp'] = current_time
                    email['validated_address'] = validated_address
                    email['splitted_validated_address'] = splitted_address
                    email['extracted_text'] = extracted_text
                    email['claim_id'] = next_claim_id
                    email['status'] = 'success'
                    user_email = policy['pol_email']
                    if user_email:
                        Emails.send_claim_confirmation_email(user_email, next_claim_id, company['ic_name'], insured_name,
                                                      encoded_string, company['ic_email'], company['ic_mobile'],
                                                      company['ic_primary_color'], company['ic_id'])
                        Emails.send_claim_confirmation_email(sender_email, next_claim_id, company['ic_name'], insured_name,
                                                      encoded_string, company['ic_email'], company['ic_mobile'],
                                                      company['ic_primary_color'], company['ic_id'])
                    else:
                        pass
                    move_email_data_to_collection(db, email, 'email_to_fnol_success')
                    collection.delete_one({'_id': email['_id']})
                    print(f"Email with subject '{subject}' deleted from MongoDB.")
                    if process_document_name and process_document_url:
                        move_attachments_to_folder(process_document_url, 'email-to-fnol', 'email-to-fnol-success',
                                                   'process_documents')
                    if witness_document_names and witness_document_urls:
                        for doc_url in witness_document_urls:
                            move_attachments_to_folder(doc_url, 'email-to-fnol', 'email-to-fnol-success',
                                                       'witness_documents')
                    success_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                else:
                    email['time_stamp'] = current_time
                    email['validated_address'] = validated_address
                    email['splitted_validated_address'] = splitted_address
                    email['status'] = 'failed'
                    print(f"Failed to add claim_details")
                    handle_failure(db, email, process_document_name, process_document_url, witness_document_names,
                                   witness_document_urls, missing_fields, sender_email, subject, collection,
                                   encoded_string=encoded_string, company=company, insured_name=insured_name)
                    failure_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                    continue  # Skip to the next email
            else:
                if policy_number:
                    missing_fields.append(f"Wrong Policy Number: {policy_number}")
                email['missing_fields'] = missing_fields
                email['time_stamp'] = current_time
                email['status'] = 'failed'
                handle_failure(db, email, process_document_name, process_document_url, witness_document_names,
                               witness_document_urls, missing_fields, sender_email, subject, collection,
                               encoded_string=encoded_string, company=company, insured_name=insured_name)
                failure_emails.append({"email": sender_email, "Subject": subject, "email_time": email_time})
                continue  # Skip to the next email

        except FileNotFoundError:
            print(f"Error: File not found at path: {file_path}")
            # TODO: Handle file not found error (e.g., send failure email)
        except Exception as e:
            print(f"Error processing PDF {process_document_name}: {e}")
            # TODO: Handle other PDF processing errors (e.g., corrupted file)

    return Response({'status': 'Done', 'message': 'Email processing Successful.', 'Success_mails': success_emails,
                         'Failure_mails': failure_emails}, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_document_by_email(request):
    email = request.data.get('email')
    status = request.data.get('status')
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    if status == "failure":
        emails_collection = db['email_to_fnol_failure']
        sub_folder = "email-to-fnol-failure"
    else:
        emails_collection = db['email_to_fnol_success']
        sub_folder = "email-to-fnol-success"
    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
    if data_list:
        data = data_list[0]
        body = data.get('body', None)
        email_time = data.get('email_time', None)
        subject = data.get('subject', None)
        Errors = data.get('missing_fields', None)
        extracted_data = data.get('extracted_text', None)

        claim_id=data.get('claim_id',None)
        if data:
            process_document_path = data.get('process_document_url', None)
            document_name = data.get('process_document_name', None)

            if process_document_path and document_name:
                actual_path = process_document_path[0].split("/")[-1]
                document_name = document_name[0]
                file_path = os.path.join(settings.MEDIA_ROOT, "email-to-fnol", sub_folder, "process_documents",
                                         actual_path)
                if os.path.exists(file_path):
                    try:
                        # Determine document type
                        if document_name.lower().endswith(('.docx', '.doc')):
                            html_content = ""
                            with docx2python(file_path, html=True) as docx_content:
                                html_content = docx_content.text

                            # Sanitize HTML content with bleach
                            html_content = bleach.clean(html_content,
                                                        tags=bleach.sanitizer.ALLOWED_TAGS,
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
                            return Response({'error': 'Unsupported file type', 'api':'get_document_by_email'}, status=status.HTTP_400_BAD_REQUEST)

                        # Encode content as base64 (if needed - for PDF)F
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
                                'claim_id':claim_id
                            })

                    except Exception as e:
                        print("6. Error processing file:", e)
                        return Response({'error': f'Error processing file: {str(e)}', 'api':'get_document_by_email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    print("7. File not found:", file_path)
                    return Response({'error': 'File not found', 'api':'get_document_by_email'}, status=status.HTTP_404_NOT_FOUND)
            else:
                 
                if extracted_data and '_id' in extracted_data:
                   extracted_data['_id'] = str(extracted_data['_id'])
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
                                    'claim_id':claim_id
                                })
    else:
        return Response({'error': 'Email not found', 'api':'get_document_by_email'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def email_to_fnol_edit(request):
    data = request.data.dict()
    if not data:
        return Response({'error': 'Please share data for adding the claim', 'api':'email_to_fnol_edit'}, status=status.HTTP_400_BAD_REQUEST)
    email = data.get('email')
    policy_number = data.get('policy_number')
    del data['email']
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    emails_collection = db['email_to_fnol_failure']
    company_collection = db['insurancecompanies']
    policy_collection = db['policies']
    claim_collection = db['claims']
    data_cursor = emails_collection.find({"sender_email": email}).sort("time_stamp", -1)
    data_list = list(data_cursor)
    email_data = data_list[0]
    data['claim_process_document_name'] = "From_email" + "(" + email + ")"
    data['claim_process_document_url'] = "From_email" + "(" + email + ")"
    data['claim_witness_document_names'] = "From_email" + "(" + email + ")"
    data['claim_witness_document_urls'] = "From_email" + "(" + email + ")"
    data['insured_contact_details'] = "From_email" + "(" + email + ")"
    data['non_insured_contact_details'] = "From_email" + "(" + email + ")"
    policy = policy_collection.find_one({'policy_number': policy_number})
    insured_name = policy["pol_first_name"] + " " + policy["pol_middle_name"] if policy["pol_middle_name"] != "Null" or \
                                                                                 policy[
                                                                                     "pol_middle_name"] != "" else "" + " " + \
                                                                                                                   policy[
                                                                                                                       "pol_last_name"]
    process_document_name = email_data.get('process_document_name')[0] if email_data.get(
        'process_document_name') else None
    process_document_url = email_data.get('process_document_url')[0] if email_data.get('process_document_url') else None
    witness_document_names = email_data.get('witness_document_names') if email_data.get(
        'witness_document_names') else None
    witness_document_urls = email_data.get('witness_document_urls') if email_data.get('witness_document_urls') else None
    if process_document_name and process_document_url and (
            process_document_name.lower().endswith('.pdf') or process_document_name.lower().endswith('.docx') or
            process_document_name.lower().endswith('.txt')):
        file_path = os.path.join(settings.MEDIA_ROOT, process_document_url[len(settings.MEDIA_URL):])

    if not policy:
        return Response({'Error': 'The provided policy number is invalid please check and try again', 'api':'email_to_fnol_edit'}, status=status.HTTP_400_BAD_REQUEST)

    ic_id = policy['ic_id']
    company = company_collection.find_one({'ic_id': ic_id})
    if 'ic_logo_path' in company and company['ic_logo_path'] != "":
        image_path = company['ic_logo_path'][7:]
        image_name = company['ic_logo_name']
        Full_path = os.path.join(settings.MEDIA_ROOT, image_path)
        # Extract image type from file name
        _, image_type = os.path.splitext(image_name)
        # Remove the leading '.' from the extension
        image_type = image_type[1:].lower()
        if Full_path:
            # Read and encode the image
            with open(Full_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            company['image_data'] = encoded_string
            company['image_type'] = image_type
    storage_type = company['claim_storage_type']
    data['claim_created_at'] = datetime.now(timezone.utc)
    if storage_type == 'Database':
        # Get the latest claim ID (if any)
        latest_doc = claim_collection.find_one(
            filter={},  # no filter criteria
            projection={'_id': 0},  # exclude _id field
            sort=[('_id', -1)]  # still sort by _id to get latest
        )
        if latest_doc:
            latest_claim = Authentication.decrypt_data(latest_doc)
            latest_claim_id = latest_claim.get('claim_id', None)
        else:
            latest_claim_id = None
        # Generate the next claim ID
        next_claim_id = Claim_utils.generate_next_claim_id(latest_claim_id)
        data['claim_id'] = next_claim_id
        # Insert claim into the database
        converted_data = Claim_utils.get_dictionary_structure(data, "Insured", policy)
        inserted_claim = Claim_utils.add_claim_to_db(converted_data)
    elif storage_type == 'CSV':
        converted_data = Claim_utils.get_dictionary_structure_for_documents(data, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_csv(converted_data, company['ic_name'])
    elif storage_type == 'Excel':
        converted_data = Claim_utils.get_dictionary_structure_for_documents(data, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_excel(converted_data, company['ic_name'])
    elif storage_type == 'Flat File':
        converted_data = Claim_utils.get_dictionary_structure_for_documents(data, "Insured")
        inserted_claim, next_claim_id = File_handling.save_to_flat_file(converted_data, company['ic_name'])

    if inserted_claim and next_claim_id != None:
        email_data['status'] = 'edited_success'
        email_data['extracted_text'] = data
        email_data['claim_id'] = next_claim_id
        Emails.send_claim_confirmation_email(email, next_claim_id, company['ic_name'], insured_name, encoded_string,
                                      company['ic_email'], company['ic_mobile'], company['ic_primary_color'],
                                      company['ic_id'])
        move_email_data_to_collection(db, email_data, 'email_to_fnol_success')
        emails_collection.delete_one({'_id': email_data['_id']})
        if process_document_name and process_document_url:
            move_attachments_to_folder_edit(process_document_url, 'email-to-fnol', 'email-to-fnol-success',
                                            'process_documents')
        if witness_document_names and witness_document_urls:
            for doc_url in witness_document_urls:
                move_attachments_to_folder_edit(doc_url, 'email-to-fnol', 'email-to-fnol-success', 'witness_documents')

        return Response({'Message': 'Claim Created Successfully',
                         'Claim_id': next_claim_id,
                         'company_details': Claim_utils.convert_objectid_to_str(company)}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Something happened', 'api':'email_to_fnol_edit'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def id_card_extraction(request):
    data = request.data
    extracted_text = data.get('extracted_text')
    if not extracted_text:
        return Response({'error': 'No text has been shared to backend', 'api': 'id_card_extraction'}, status=status.HTTP_400_BAD_REQUEST)
    file_name = data.get('file_name')
    gemini_input_tokens = data.get('gemini_input_tokens', 0)
    gemini_output_tokens = data.get('gemini_output_tokens', 0)
    gemini_total_tokens = data.get('gemini_total_tokens', 0)
    extracted_json, output_tokens, input_tokens, total_tokens = id_card_details_formatting(extracted_text)
    accuracy, reason = Ai_utils.get_accuracy(extracted_text, extracted_json, details_to_extract=Details_to_extract.idcard())
    total_input_tokens = input_tokens + gemini_input_tokens
    total_output_tokens = output_tokens + gemini_output_tokens
    total_all_tokens = total_tokens + gemini_total_tokens
    Ai_utils.add_LLM_Metadata_to_database(
        total_input_tokens,
        total_output_tokens,
        total_all_tokens,
        accuracy,
        reason,
        file_name,
        application="DocAI ID"
    )
    return Response({
        'extracted_json': extracted_json,
        "output_tokens": total_output_tokens,
        "input_tokens": total_input_tokens,
        "total_tokens": total_all_tokens,
        "accuracy": accuracy
    }, status=status.HTTP_200_OK)
 

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def docai_sov(request):
    ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.xlsx']
    if 'file' not in request.data:
        return Response({'error': 'No file provided', 'api': 'docai_sov'}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.data['file']
    file_name, file_extension = os.path.splitext(uploaded_file.name)
    if file_extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS:
        if file_extension.lower() == ".pdf":
            file_type = 'pdf'
        else:
            file_type = 'xlsx'
    else:
        return Response({'Error': "Invalid File Format, We only accept Image(jpg,jpeg,png) or documents (pdf,excel)", 'api': 'docai_sov'},
                        status=status.HTTP_400_BAD_REQUEST)

    if file_type == 'pdf':
        return Response({'Error': "PDF processing not implemented yet", 'api': 'docai_sov'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        extracted_text = pd.read_excel(uploaded_file)

    # Check if the DataFrame is NOT empty
    if not extracted_text.empty:
        # Find company name in the first row
        first_row = extracted_text.iloc[0:]
        company_name = find_company_name(first_row)

        # Set column names and remove the header rows
        extracted_text.columns = extracted_text.iloc[0]
        extracted_text = extracted_text.iloc[1:]  # Remove the first two rows
        extracted_text = extracted_text.reset_index(drop=True)  # Reset index after removing rows

        def find_closest_column(df, target_column):
            for column in df.columns:
                if pd.notna(column) and isinstance(column, str) and target_column.lower() in column.lower():
                    return column
            return None

        # Calculate totals
        total_properties = len(extracted_text)

        columns_to_sum = {
            "Real Property Value": "*Real Property Value ($)",
            "Personal Property Value": "Personal Property Value ($)",
            "Outdoor Property Value": "Other Value $ (outdoor prop & Eqpt must be sch'd)",
            "Rental Income": "BI/Rental Income ($)",
            "Total Insured Value": "*Total TIV",
            "Units": "*# of Units",
            "Square Footage": "*Square Footage"
        }

        data = {
            "Company Name": company_name,
            "Total Properties": total_properties
        }

        for key, column_name in columns_to_sum.items():
            column = find_closest_column(extracted_text, column_name)
            if column:
                data[f"Total {key} ($)"] = safe_sum(extracted_text[column])
            else:
                data[f"Total {key} ($)"] = "Column not found"

        def default_to_string(obj):
            if isinstance(obj, (int, float)):
                return obj
            return str(obj)

        return Response({'extracted_sums': data}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'The uploaded file is empty.','api': 'docai_sov'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def process_files(request):
    ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
    ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.xlsx']
    if 'file' not in request.data:
        return Response({'error': 'No file provided', 'api': 'process_files'}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.data['file']
    file_name, file_extension = os.path.splitext(uploaded_file.name)

    file_type = ''
    extracted_text = None
    base64_image = None

    if file_extension.lower() in ALLOWED_IMAGE_EXTENSIONS:
        file_type = 'image'
    elif file_extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS:
        if file_extension.lower() == ".pdf":
            file_type = 'pdf'
        else:
            file_type = 'xlxs'
    else:
        return Response({'Error': "Invalid File Format, We only accept Image(jpg,jpeg,png) or documents (pdf,excel)", 'api': 'process_files'},status=status.HTTP_400_BAD_REQUEST)
    if file_type == 'image':
        img = Image.open(BytesIO(uploaded_file.read()))
    elif file_type == 'pdf':
        extracted_text = extract_pdf_text_fitz(BytesIO(uploaded_file.read()))
        if extracted_text == "pdf_image":
            file_type = 'pdf_image'
            extracted_text = None
    else:
        extracted_text = read_excel(BytesIO(uploaded_file.read()))
    uploaded_file.seek(0)
    if file_type in ["image", "pdf_image"]:
        img_bytes = extract_image_from_pdf(BytesIO(uploaded_file.read()))
        img = Image.open(BytesIO(img_bytes))
        base64_image = image_to_base64(img)
    return Response({'image': base64_image, 'extracted_text': extracted_text}, status=200)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def parse_text(request):
    data = request.data
    Grand_totals = data.get('Grand_totals')
    Sub_totals = data.get('Sub_totals')
    if not Grand_totals and not Sub_totals:
        return Response({'error': 'Please provide Grand_totals and Sub_totals', 'api': 'parse_text(lossruns)'}, status=status.HTTP_400_BAD_REQUEST)    
    gemini_input_tokens = int(data.get('gemini_all_input_token') or 0)
    gemini_output_tokens = int(data.get('gemini_all_output_tokens') or 0)
    gemini_total_tokens = int(data.get('gemini_all_total_tokens') or 0)
    file_name = data.get('file_name')
    try:
        if Grand_totals:
    
            grand_totals_json, output_tokens1, input_tokens1, total_tokens1 = extract_loss_runs(Grand_totals)
        if Sub_totals:
            sub_totals_json, policy_numbers_list, policy_holder_name, sai_number, output_tokens2, input_tokens2, total_tokens2 = extract_subtotals(Sub_totals)
        total_input_tokens = input_tokens1 + input_tokens2 + gemini_input_tokens
        total_output_tokens = output_tokens1 + output_tokens2 + gemini_output_tokens
        total_all_tokens = total_tokens1 + total_tokens2 + gemini_total_tokens
        extracted_text = ""  # Initialize as a string
        if Grand_totals:
            extracted_text += Grand_totals  # String concatenation
        if Sub_totals:
            extracted_text += Sub_totals  # String concatenation
        extracted_info = {}
        if grand_totals_json:
            extracted_info.update(grand_totals_json)
        if sub_totals_json:
            extracted_info.update(sub_totals_json)
        accuracy, reason = Ai_utils.get_accuracy(extracted_text, extracted_info, details_to_extract=Details_to_extract.lossruns())
    
        Ai_utils.add_LLM_Metadata_to_database(
            total_input_tokens,
            total_output_tokens,
            total_all_tokens,
            accuracy,
            reason,
            file_name,
            application="DocAI Loss Run"
        )
        return Response({'grand_totals_json': grand_totals_json if Grand_totals else "",
                        'sub_totals_json': sub_totals_json if Sub_totals else "",
                        'policy_holder_name': policy_holder_name,
                        'policy_numbers_list': policy_numbers_list,
                        'sai_number': sai_number,
                        "output_tokens": total_output_tokens,
                        "input_tokens": total_input_tokens,
                        "total_tokens": total_all_tokens,
                        "accuracy": accuracy                    
                        }, status=200)
    except Exception as e:
        return Response({'error':str(e), 'api':'parse_text(Loss Run)'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def process_medbill(request):   
    if 'file' in request.FILES:
        ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf']  # This is now a list
        ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg']  # This is also a list    
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided', 'api': 'process_medbill'}, status=status.HTTP_400_BAD_REQUEST)
        uploaded_file = request.FILES['file']
        file_name, file_extension = os.path.splitext(uploaded_file.name)    
        if file_extension.lower() not in ALLOWED_DOCUMENT_EXTENSIONS + ALLOWED_IMAGE_EXTENSIONS:
            return Response({'error': 'Invalid file type'}, status=status.HTTP_400_BAD_REQUEST)    
        file_content = uploaded_file.read()    
        try:
            if file_extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS:
                extracted_text = File_handling.extract_text_from_pdf(BytesIO(file_content))  
                if extracted_text == 'pdf_image':
                    images_data = File_handling.extract_images_from_pdf(BytesIO(file_content))
                    images_base64 = [base64.b64encode(img).decode('utf-8') for img in images_data]
                    return Response({'image': images_base64}, status=status.HTTP_200_OK)
                else:
                    extracted_info, output_tokens, input_tokens, total_tokens = Ai_utils.medbill_extraction_agent(extracted_text)
                    accuracy, reason = Ai_utils.get_accuracy(extracted_text, extracted_info, details_to_extract=Details_to_extract.medbill())
                    Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, file_name,application="DocAI Med Bill")
                    return Response({'Extracted_information': extracted_info,"output_tokens":output_tokens, "input_tokens":input_tokens,"total_tokens":total_tokens,"accuracy":accuracy}, status=status.HTTP_200_OK)
            elif file_extension.lower() in ALLOWED_IMAGE_EXTENSIONS:
                img = Image.open(BytesIO(file_content))
                base64_image = image_to_base64(img)
                return Response({'image': [base64_image]}, status=status.HTTP_200_OK)              
        except Exception as e:
            return Response({'error': str(e), 'api': 'process_medbill'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.data.get('combined_extracted_text',None):
        data = request.data
        extracted_text = data.get('combined_extracted_text')
        if not extracted_text:
            return Response({'error': 'No text has been shared to backend','api': 'process_medbill'}, status=status.HTTP_400_BAD_REQUEST)
        gemini_input_tokens = int(data.get('gemini_all_input_token') or 0)
        gemini_output_tokens = int(data.get('gemini_all_output_tokens') or 0)
        gemini_total_tokens = int(data.get('gemini_all_total_tokens') or 0)
        file_name = data.get('file_name')
        extracted_info, output_tokens, input_tokens, total_tokens = Ai_utils.medbill_extraction_agent(extracted_text)
        accuracy, reason = Ai_utils.get_accuracy(extracted_text, extracted_info, details_to_extract=Details_to_extract.medbill())
        total_input_tokens = input_tokens + gemini_input_tokens
        total_output_tokens = output_tokens + gemini_output_tokens
        total_all_tokens = total_tokens + gemini_total_tokens
        Ai_utils.add_LLM_Metadata_to_database(
            total_input_tokens,
            total_output_tokens,
            total_all_tokens,
            accuracy,
            reason,
            file_name,
            application="DocAI Med Bill"
        )
        return Response({
            'extracted_json': extracted_info,
            "output_tokens": total_output_tokens,
            "input_tokens": total_input_tokens,
            "total_tokens": total_all_tokens,
            "accuracy": accuracy
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No file or text provided','api': 'process_medbill'}, status=status.HTTP_400_BAD_REQUEST)
    
 
 
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def process_docaiclassify_files(request):
    """
    Process and classify documents with comprehensive error handling and data management.
    """
    # Input validation
    if not request.FILES:
        return Response(
            {'error': 'No files provided', 'api': 'process_docaiclassify_files'},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Constants
    ALLOWED_EXTENSIONS = {
        'image': ['.jpg', '.jpeg', '.png'],
        'document': ['.pdf', '.doc', '.docx', '.txt']
    }    
    # Initialize result containers
    results = []
    success_records = []
    workqueue_records = []
    unclassified_workqueue_records = []
    invalid_files = []
    image_files = []    
    def process_document(file_content, file_name, file_extension):
        """Process individual document and extract information."""
        try:
            # Extract document content for frontend
            document_content, content_type = get_document_content(file_content, file_name)
            # Extract text based on file type
            extracted_text = None
            if file_extension == '.pdf':
                extracted_text = File_handling.extract_text_from_pdf(BytesIO(file_content))
                if extracted_text == 'pdf_image':
                    return handle_pdf_images(file_content, file_name)
            elif file_extension in ['.doc', '.docx']:
                extracted_text = File_handling.extract_text_from_docx(BytesIO(file_content))
            elif file_extension == '.txt':
                extracted_text = File_handling.extract_text_from_txt(BytesIO(file_content))            
            if not extracted_text:
                raise ValueError(f"Failed to extract text from {file_name}")            
            # Classify document
            classification_result, clas_output_tokens, clas_input_tokens, clas_total_tokens = Ai_utils.documents_classification_agent(extracted_text, file_name)            
            # Check if document is UnClassified
            if classification_result["document_classification_name"] == "UnClassified Document":
                # Save file
                new_file = create_memory_file(file_content, file_name)
                folder_path = 'DocAI_Classify\\classify_workqueue_documents'
                # folder_path = 'DocAI_Classify/classify_workqueue_documents'
                original_file_name, path, message = File_handling.save_documents_with_unique_ids(
                    [new_file],
                    folder_path
                )                
                if not path or not message:
                    raise ValueError("Failed to store file")
                
                # Create result data for UnClassified document without calling extraction agent
                result_data = {
                    'file_name': file_name,
                    'file_location': path[0] if path else None,
                    'file_classification_name': "UnClassified Document",
                    'classification_confidence_score': classification_result.get("confidence_score", 0.0),
                    'index_data': {},
                    'extraction_confidence_score': 0.0,
                    "output_tokens": clas_output_tokens,
                    "input_tokens": clas_input_tokens,
                    "total_tokens": clas_total_tokens,
                    'document_content': document_content,
                    'content_type': content_type
                }                
                 # Store in MongoDB with anonymous_workqueue status
                success, mongo_id = add_docaiclassify_metadata_to_database(False, [result_data], is_anonymous=True)
                if not success:
                    raise ValueError("Failed to store metadata in MongoDB")                
                result_data['_id'] = mongo_id
                unclassified_workqueue_records.append(result_data)
                results.append(result_data)           
                return None            
            # For non-anonymous documents, proceed with extraction
            result, ext_output_tokens, ext_input_tokens, ext_total_tokens = \
                Ai_utils.indexdata_extraction_agent(
                    classification_result["document_classification_name"],
                    extracted_text
                )            
            # Process extraction results
            extraction_confidence = result.get('confidence_score', 0.0)
            if isinstance(result, dict):
                result.pop('confidence_score', None)
                result.pop('extracted_date', None)            
            # Check extraction success
            is_index_have_all_data = check_extraction_success(result)            
            # Save file
            new_file = create_memory_file(file_content, file_name)
            # folder_path = 'DocAI_Classify/classify_success_documents' if is_index_have_all_data else 'DocAI_Classify/classify_workqueue_documents'
            folder_path = 'DocAI_Classify\\classify_success_documents' if is_index_have_all_data else 'DocAI_Classify\\classify_workqueue_documents'            
            original_file_name, path, message = File_handling.save_documents_with_unique_ids(
                [new_file],
                folder_path
            )            
            if not path or not message:
                raise ValueError("Failed to store file")            
            # Prepare result data
            result_data = {
                'file_name': file_name,
                'file_location': path[0],
                'file_classification_name': classification_result["document_classification_name"],
                'classification_confidence_score': classification_result.get("confidence_score", 0.0),
                'index_data': result,
                'extraction_confidence_score': extraction_confidence,
                "output_tokens": clas_output_tokens + ext_output_tokens,
                "input_tokens": clas_input_tokens + ext_input_tokens,
                "total_tokens": clas_total_tokens + ext_total_tokens,
                'document_content': document_content,
                'content_type': content_type
            }            
             # Store in MongoDB
            success, mongo_id = add_docaiclassify_metadata_to_database(is_index_have_all_data, [result_data])
            if not success:
                raise ValueError("Failed to store metadata in MongoDB")
            result_data['_id'] = mongo_id
            results.append(result_data)
            if is_index_have_all_data:
                success_records.append(result_data)
            else:
                workqueue_records.append(result_data)     
            return None            
        except Exception as e:
            return {'file_name': file_name, 'error': str(e)}
            
    def get_document_content(file_content, file_name):
        """Extract and encode document content based on file type."""
        try:
            file_extension = os.path.splitext(file_name)[1].lower()
            content = None
            content_type = None

            if file_extension in ['.doc', '.docx']:
                with BytesIO(file_content) as file:
                    doc = docx2python(file, html=True)
                    content = doc.text
                    # Sanitize HTML content
                    content = bleach.clean(content,
                                         tags=bleach.sanitizer.ALLOWED_TAGS,
                                         attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)
                content_type = 'html'

            elif file_extension == '.txt':
                content = file_content.decode('utf-8')
                content = f"<pre>{content}</pre>"
                content_type = 'html'

            elif file_extension == '.pdf':
                content = base64.b64encode(file_content).decode('utf-8')
                content_type = 'pdf'

            return content, content_type

        except Exception as e:
            print(f"Error extracting document content: {str(e)}")
            return None, None    
    
    def handle_pdf_images(file_content, file_name):
        """Handle PDF files containing only images."""
        try:
            images_data = File_handling.extract_images_from_pdf(BytesIO(file_content))
            images_base64 = [base64.b64encode(img).decode('utf-8') for img in images_data]
            image_files.append({'file_name': file_name, 'image': images_base64})
            return None
        except Exception as e:
            return {'file_name': file_name, 'error': f"Error processing PDF images: {str(e)}"}
    
    def create_memory_file(file_content, file_name):
        """Create InMemoryUploadedFile from file content."""
        return InMemoryUploadedFile(
            file=BytesIO(file_content),
            field_name='file',
            name=file_name,
            content_type='application/octet-stream',
            size=len(file_content),
            charset=None
        )
    
    def validate_file(file):
        """Validate file extension and return file type."""
        _, file_extension = os.path.splitext(file.name)
        file_extension = file_extension.lower()
        
        if file_extension in ALLOWED_EXTENSIONS['image']:
            return 'image', file_extension
        elif file_extension in ALLOWED_EXTENSIONS['document']:
            return 'document', file_extension
        else:
            return None, file_extension
    
    # Process each file
    for file in request.FILES.getlist('files'):
        try:
            file_type, file_extension = validate_file(file)
            if not file_type:
                invalid_files.append({'file_name': file.name, 'error': 'Invalid file type'})
                continue
            
            file_content = file.read()
            
            if file_type == 'image':
                img = Image.open(BytesIO(file_content))
                base64_image = image_to_base64(img)
                image_files.append({'file_name': file.name, 'image': [base64_image]})
            else:
                error = process_document(file_content, file.name, file_extension)
                if error:
                    invalid_files.append(error)
                    
        except Exception as e:
            invalid_files.append({
                'file_name': file.name,
                'error': f"Unexpected error: {str(e)}"
            })
    
    # Prepare response
    response_data = {
        'results': serialize_mongodb_data(results),
        'success_records': serialize_mongodb_data(success_records),
        'workqueue_records': serialize_mongodb_data(workqueue_records),
        'unclassified_workqueue_records': serialize_mongodb_data(unclassified_workqueue_records),
        'invalid_files': serialize_mongodb_data(invalid_files),
        'image_files': serialize_mongodb_data(image_files)
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def edit_update_docai_classify_document(request):
    """
    API endpoint to update document index data and move file between folders
    """
    try:
        data = request.data
        document_id = data.get('document_id')
        updated_index_data = data.get('index_data')
        classification_type = data.get('classification_type')

        if not all([document_id, updated_index_data, classification_type]):
            return Response({'message': 'Missing required fields', 'api':'edit_update_docai_classify_document'}, status=status.HTTP_400_BAD_REQUEST)

        client, db = MongoDB.get_mongo_client_DocAI_Classify()
        workqueue_collection = db['classify_workqueue_data']
        success_collection = db['classify_success_data']
        document_record = workqueue_collection.find_one(
            {'_id': ObjectId(document_id)},
            {'_id': 0} 
        )        
        document = Authentication.decrypt_data(document_record)
        if not document:
            return Response({'message': 'Document not found','api':'edit_update_docai_classify_document'}, status=status.HTTP_404_NOT_FOUND)

        relative_path = document['file_location'].lstrip('\\/').replace('Media/', '').replace('Media\\', '')
        source_file = os.path.normpath(os.path.join(settings.MEDIA_ROOT, relative_path))
        
        if not os.path.exists(source_file):
            return Response({
                'message': f'Source file not found: {source_file}',
                'relative_path': relative_path,
                'media_root': settings.MEDIA_ROOT,
                'api':'edit_update_docai_classify_document'
            }, status=status.HTTP_404_NOT_FOUND)

        filename = os.path.basename(source_file)
        dest_folder = os.path.normpath(os.path.join(settings.MEDIA_ROOT, 'DocAI_Classify', 'classify_success_documents'))
        dest_file = os.path.normpath(os.path.join(dest_folder, filename))
        os.makedirs(dest_folder, exist_ok=True)
        if os.path.exists(dest_file):
            base, ext = os.path.splitext(filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{base}_{timestamp}{ext}"
            dest_file = os.path.join(dest_folder, filename)

        try:
            shutil.move(source_file, dest_file)
        except PermissionError:
            return Response({'message': 'Permission denied while moving file','api':'edit_update_docai_classify_document'}, status=status.HTTP_403_FORBIDDEN)
        except FileNotFoundError:
            return Response({'message': 'Source file not found during move operation','api':'edit_update_docai_classify_document'}, status=status.HTTP_404_NOT_FOUND)

        relative_dest_path = os.path.relpath(dest_file, settings.MEDIA_ROOT)
        updated_document = {
            **document,
            'index_data': updated_index_data,
            'file_location': relative_dest_path,
            'process_status': 'success',
            'file_classification_name': classification_type,
            'updated_timestamp': datetime.now(timezone.utc)
        }
        encrypted_updated_document = Authentication.encrypt_data(updated_document)
        success_collection.insert_one(encrypted_updated_document)
        workqueue_collection.delete_one({'_id': ObjectId(document_id)})
        return Response({
            'message': 'Document updated successfully',
            'document_id': str(document_id),
            'new_location': relative_dest_path
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'message': f'Error updating document: {str(e)}', 
            'api':'edit_update_docai_classify_document'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def docai_summary(request):
    ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']
    if 'file' not in request.data:
        return Response({'error': 'No file provided', 'api': 'docai_summary'}, status=status.HTTP_400_BAD_REQUEST)
    uploaded_file = request.data['file']
    file_name, file_extension = os.path.splitext(uploaded_file.name)
    if file_extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS:
        file_type = file_extension.lower()[1:]   
        if file_type == 'pdf':
            init_extracted_text = File_handling.extract_text_from_pdf(BytesIO(uploaded_file.read()))
            if init_extracted_text == 'pdf_image':
                return Response({'error':'Not yet implemented for Image data','api':'docai_summary'}, status=status.HTTP_501_NOT_IMPLEMENTED)
        elif file_type == 'docx':
            init_extracted_text = File_handling.extract_text_from_docx(BytesIO(uploaded_file.read()))
        elif file_type == 'txt':
            init_extracted_text = File_handling.extract_text_from_txt(uploaded_file)
    else:
        return Response({'Error': 'Invalid File Format', 'api':'docai_summary'}, status=status.HTTP_400_BAD_REQUEST)
    extracted_summary = data_summarize_agent(init_extracted_text)
    accuracy, reason = Ai_utils.get_accuracy(init_extracted_text, extracted_summary, details_to_extract=Details_to_extract.summary())
    return Response({'Extracted_summary': extracted_summary, 'accuracy': accuracy}, content_type='application/json', status=status.HTTP_200_OK)   