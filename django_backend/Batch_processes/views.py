from Master_package.master_package_security import Authentication
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_utils import Ai_utils, Address_validations, Policy_utils
from Master_package.master_package_schemas import Details_to_extract
import os
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from datetime import datetime, timedelta, timezone
from rest_framework.response import Response
from rest_framework import status
from pydantic import ValidationError
import base64
from io import BytesIO
import json
from .utils import *
import logging
import threading

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
sender_email = os.getenv('EMAIL_ADMIN')
sender_password = os.getenv('EMAIL_PASSWORD')


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def DocAI_Batch_Quote(request):
    ic_id = request.data.get('ic_id')
    fnol_client, fnol_db = MongoDB.get_mongo_client_innoclaimfnol()
    client, db = MongoDB.get_mongo_client_Policy_intake()
    companies_collection = fnol_db['insurancecompanies']
    company_data = companies_collection.find_one({'ic_id': ic_id})
    if not company_data:
        return Response({'error': f'No company found with the provided ic_id: {ic_id}', 'api': 'DocAI_Batch_Quote'},
                        status=status.HTTP_400_BAD_REQUEST)

    SFTP_CONFIG = {
        'host': company_data.get('host'),
        'port': 22,
        'username': company_data.get('username'),
        'password': company_data.get('password'),
        'remote_folder': company_data.get('ic_name')
    }

    EMAIL_CONFIG = {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'sender_email': sender_email,
        'sender_password': sender_password,
        'recipient_email': company_data.get('ic_email')
    }
    ssh = None
    sftp = None
    try:
        ssh, sftp = create_sftp_client(SFTP_CONFIG)
    except Exception as e:
        logger.error(f"Failed to establish SFTP connection: {str(e)}")
        return Response({'error': 'Failed to connect to SFTP server', 'api': 'DocAI_Batch_Quote'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        success_files = []
        failure_files = []
        success_data = {}
        failure_data = {}
        missing_fields = []

        report = {'total_files': len(sftp.listdir(SFTP_CONFIG['remote_folder'])) - 3, 'success': 0, 'failure': 0}

        start_time = time.time()
        for filename in sftp.listdir(SFTP_CONFIG['remote_folder']):
            if filename in ['IDP_Batch_Success', 'IDP_Batch_Failure', 'reports']:
                continue

            policy_holder_name = ""
            policy_holder_email = ""
            policy_holder_mobile = ""
            extracted_text = ""

            try:
                logger.info(f"Processing file: {filename}")
                file_data = process_file(sftp, filename, SFTP_CONFIG)
                extracted_text, output_tokens, input_tokens, total_tokens = Ai_utils.policy_data_extraction_agent(file_data['content'])
                extracted_text = Ai_utils.process_extracted_data(extracted_text)
                accuracy, reason = Ai_utils.get_accuracy(str(file_data['content']), extracted_text, details_to_extract= Details_to_extract.quote())
                policy_info = extracted_text.get('PolicyInfo', {})
                policy_holder_name = (policy_info.get('policy_holder_FirstName', '') + " "
                                      + policy_info.get('policy_holder_LastName', ''))
                policy_holder_email = policy_info.get('policy_holder_email', '')
                policy_holder_mobile = policy_info.get('policy_holder_mobile', '')
                property_info = extracted_text.get('PropertyInfo', {})

                required_fields = {
                    "PolicyInfo": ["selectedPolicy", "policy_holder_FirstName", "policy_holder_LastName",
                                   "policy_holder_mobile",
                                   "policy_holder_email", "policy_holder_occupation"],
                    "PropertyInfo": ["residenceType", "constructionType", "yearBuilt", "numberOfStories",
                                     "squareFootage",
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
                    "Coverages": ["dwellingCoverage", "personalProperty", "personalLiabilityCoverage",
                                  "medicalPayments",
                                  "deductible"]
                }

                for nested_key, fields in required_fields.items():
                    for field in fields:
                        value = extracted_text.get(nested_key, {}).get(field)  # Get value from nested dictionary
                        if value is None or str(value).strip() == '':
                            missing_fields.append(f"{field}")  # Indicate missing field with its nested key
                validated_policy_holder_address = ""
                validated_property_address = ""
                if policy_info and property_info:
                    policy_holder_address = Address_validations.format_address(policy_info, 'policy_holder')
                    property_address = Address_validations.format_address(property_info, 'CoverageLocation')
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
                            missing_fields.append(f"'Invalid Policy Holder Address': {policy_holder_address}")
                        if validated_property_address != "Address Not validated":
                            property_splitted_address = Address_validations.parse_address(validated_property_address)
                        else:
                            missing_fields.append(f"'Invalid Policy Holder Address': {policy_holder_address}")
                if missing_fields:
                    print("Missing_fields: ", missing_fields)
                    policy_info['validated_address'] = validated_policy_holder_address
                    property_info['validated_address'] = validated_property_address
                    move_file(sftp, filename, 'IDP_Batch_Failure', SFTP_CONFIG)
                    report['failure'] += 1
                    logger.warning(f"Failed to process: {filename} - Insufficient data")
                    Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, filename,
                                             application="DocAI_Batch_Quote")
                    failure_files.append({
                        'policy_holder_name': policy_holder_name,
                        'policy_holder_email': policy_holder_email,
                        'policy_holder_mobile': policy_holder_mobile,
                        'filename': filename,
                        'reason': "\n".join([f"- {field}" for field in missing_fields])
                    })
                    failure_data = {'policy_holder_name': policy_holder_name,
                                    'policy_holder_email': policy_holder_email,
                                    'policy_holder_mobile': policy_holder_mobile,
                                    'filename': filename,
                                    'extracted_data': extracted_text,
                                    'reasons': missing_fields,
                                    'status': 'failure',
                                    'ic_id': ic_id}
                    try:
                        handle_DocAI_Batch_Quote_Failure(failure_data)
                    except Exception as e:
                        logger.error(f"An error occurred during saving data into database: {str(e)}")
                        continue
                        # return Response({'Error:' f'Got an error While saving data into database: {e}'},
                        #                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    continue
                else:
                    if policy_holder_splitted_address:
                        policy_info['policy_holder_street_number'] = policy_holder_splitted_address['street_number']
                        policy_info['policy_holder_street_name'] = policy_holder_splitted_address['street_name']
                        policy_info['policy_holder_city'] = policy_holder_splitted_address['city']
                        policy_info['policy_holder_state'] = policy_holder_splitted_address['state']
                        policy_info['policy_holder_zip'] = policy_holder_splitted_address['zip_code']
                        policy_info['policy_holder_country'] = policy_holder_splitted_address['country']
                    if property_splitted_address:
                        property_info['CoverageLocation_street_number'] = property_splitted_address['street_number']
                        property_info['CoverageLocation_street_name'] = property_splitted_address['street_name']
                        property_info['CoverageLocation_city'] = property_splitted_address['city']
                        property_info['CoverageLocation_state'] = property_splitted_address['state']
                        property_info['CoverageLocation_zip'] = property_splitted_address['zip_code']
                        property_info['CoverageLocation_country'] = property_splitted_address['country']
                    updated_text = {'PolicyInfo': policy_info, 'PropertyInfo': property_info,
                                    'AdditionalInfo': extracted_text.get('AdditionalInfo', {}),
                                    'Coverages': extracted_text.get('Coverages', {})}
                    Ai_utils.add_LLM_Metadata_to_database(input_tokens, output_tokens, total_tokens, accuracy, reason, filename,
                                             application="DocAI_Batch_Quote")

                    try:
                        policy_holder_info_dict, property_info_dict, additional_info_dict, coverages_dict = process_extracted_data_into_dict(
                            updated_text, company_data)
                    except Exception as e:
                        move_file(sftp, filename, 'IDP_Batch_Failure', SFTP_CONFIG)
                        report['failure'] += 1
                        logger.error(f"Error processing {filename}: {str(e)}")
                        missing_fields.append(str(e))
                        failure_files.append({
                            'policy_holder_name': policy_holder_name,
                            'policy_holder_email': policy_holder_email,
                            'policy_holder_mobile': policy_holder_mobile,
                            'filename': filename,
                            'reason': "\n".join([f"- {field}" for field in missing_fields])
                        })
                        failure_data = {'policy_holder_name': policy_holder_name,
                                        'policy_holder_email': policy_holder_email,
                                        'policy_holder_mobile': policy_holder_mobile,
                                        'filename': filename,
                                        'extracted_data': extracted_text,
                                        'reasons': missing_fields,
                                        'status': 'failure',
                                        'ic_id': ic_id}
                        try:
                            handle_DocAI_Batch_Quote_Failure(failure_data)
                        except Exception as e:
                            logger.error(f"An error occurred during saving data into database: {str(e)}")
                            continue
                            # return Response({'Error:' f'Got an error While saving data into database: {e}'},
                            #                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        continue

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
                    policy_holder_info_dict['quote_number'] = next_quote_number
                    policy_holder_info_dict['quote_amount'] = random_quote_amount
                    property_info_dict['quote_number'] = next_quote_number
                    coverage_and_additional_info = {
                        'additional_info': additional_info_dict,
                        'coverages': coverages_dict,
                        'policy_created_at': datetime.now(timezone.utc),
                        'quote_number': next_quote_number
                    }
                    print("adding data into DB")
                    print("Complete_data: ", policy_holder_info_dict, property_info_dict, coverage_and_additional_info)
                    selected_policy = policy_holder_info_dict.get('selectedPolicy')
                    result = Policy_utils.add_policy_info_to_db(policy_holder_info_dict, property_info_dict,
                                                   coverage_and_additional_info)

                    if result == "Policy created successfully":
                        move_file(sftp, filename, 'IDP_Batch_Success', SFTP_CONFIG)
                        success_files.append({
                            'filename': filename,
                            'quote_number': next_quote_number,
                            'quote_amount': random_quote_amount,
                            'policy_holder_name': policy_holder_name,
                            'selected_policy': selected_policy,
                            'policy_holder_email': policy_holder_email
                        })
                        success_data = {
                            'filename': filename,
                            'quote_number': next_quote_number,
                            'quote_amount': random_quote_amount,
                            'policy_holder_name': policy_holder_name,
                            'policy_holder_mobile': policy_holder_mobile,
                            'selected_policy': selected_policy,
                            'policy_holder_email': policy_holder_email,
                            'status': 'success',
                            'ic_id': ic_id
                        }
                        report['success'] += 1
                        try:
                            handle_DocAI_Batch_Quote_Sucess(success_data)
                        except Exception as e:
                            logger.error(f"An error occurred during saving data into database: {str(e)}")
                            continue
                            # return Response({'Error:' f'Got an error While saving data into database: {e}'},
                            #                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        logger.info(f"Successfully processed: {filename}")

            except Exception as e:
                move_file(sftp, filename, 'IDP_Batch_Failure', SFTP_CONFIG)
                report['failure'] += 1
                logger.error(f"Error processing {filename}: {str(e)}")
                missing_fields.append(str(e))
                failure_files.append({
                    'policy_holder_name': policy_holder_name,
                    'policy_holder_email': policy_holder_email,
                    'policy_holder_mobile': policy_holder_mobile,
                    'filename': filename,
                    'reason': "\n".join([f"- {field}" for field in missing_fields])
                })
                failure_data = {'policy_holder_name': policy_holder_name,
                                'policy_holder_email': policy_holder_email,
                                'policy_holder_mobile': policy_holder_mobile,
                                'filename': filename,
                                'extracted_data': extracted_text,
                                'reasons': missing_fields,
                                'status': 'failure',
                                'ic_id': ic_id}
                try:
                    handle_DocAI_Batch_Quote_Failure(failure_data)
                except Exception as e:
                    logger.error(f"An error occurred during saving data into database: {str(e)}")
                    # return Response({'Error:' f'Got an error While saving data into database: {e}'},
                    #                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                continue
        end_time = time.time()
        report['processing_time'] = round(end_time - start_time, 2)
        try:
            logger.info("Creating PDF report")
            local_report_path, sftp_report_path = create_pdf_report(report, success_files, failure_files, 'reports',
                                                                    company_data, sftp, SFTP_CONFIG)
            logger.info(f"PDF report created. Local path: {local_report_path}, SFTP path: {sftp_report_path}")
        except Exception as e:
            logger.error(f"Error creating PDF report: {str(e)}")
            return Response({'Error': f'Failed to create PDF report: {str(e)}', 'api': 'DocAI_Batch_Quote'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            logger.info("Sending report email")
            send_report_email(report, local_report_path, EMAIL_CONFIG)
            logger.info("Email sent successfully")
        except Exception as e:
            logger.error(f"Error sending report email: {str(e)}")
            return Response({'Error': f'Failed to send report email: {str(e)}','api': 'DocAI_Batch_Quote'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        logger.info("Batch job completed. Email report sent.")
        return Response({'Success': "Batch job completed. Email report sent.",
                         "Report": report}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"An error occurred during batch processing: {str(e)}")
        return Response({'Error:' f'Got an error While Processing the file: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        sftp.close()
        ssh.close()


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def fetch_docai_batch_quote(request):
    client, db = MongoDB.get_mongo_client_Batch_processes()
    success_collection = db['DocAI_Batch_Quote_Success']
    failure_collection = db['DocAI_Batch_Quote_Failure']

    def remove_id(doc):
        if '_id' in doc:
            del doc['_id']
        return doc

    # Use a single query to get both success and edited_success
    all_success_docs = list(success_collection.find(
        {'status': {'$in': ['success', 'edited_success']}},
        {'_id': 0}
    ))

    success_docs = [doc for doc in all_success_docs if doc['status'] == 'success']
    edited_success_docs = [doc for doc in all_success_docs if doc['status'] == 'edited_success']


    failure_docs = list(map(remove_id, failure_collection.find({}, {'_id': 0})))

    response_data = {
        'success_quotes': success_docs,
        'failure_quotes': failure_docs,
        'edited_success_quotes': edited_success_docs
    }

    return Response(response_data)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_batch_quote_document(request):
    file_name = request.data.get('file_name')
    policy_status = request.data.get('policy_status')
    ic_id = request.data.get('ic_id')
    if not ic_id or not file_name or not policy_status:
        return Response({'error': 'ic_id, file_name and policy status cannot be empty', 'api': 'get_batch_quote_document'},
                        status=status.HTTP_400_BAD_REQUEST)

    fnol_client, fnol_db = MongoDB.get_mongo_client_innoclaimfnol()
    client, db = MongoDB.get_mongo_client_Policy_intake()
    batch_client, batch_db = MongoDB.get_mongo_client_Batch_processes()
    companies_collection = fnol_db['insurancecompanies']
    DocAI_Batch_Quote_Failure_collection = batch_db['DocAI_Batch_Quote_Failure']
    extracted_text = ""
    reasons = ""

    company_data = companies_collection.find_one({'ic_id': ic_id})
    if not company_data:
        return Response({'error': f'No company found with the provided ic_id: {ic_id}', 'api': 'get_batch_quote_document'},
                        status=status.HTTP_400_BAD_REQUEST)

    SFTP_CONFIG = {
        'host': company_data.get('host'),
        'port': 22,
        'username': company_data.get('username'),
        'password': company_data.get('password'),
        'remote_folder': company_data.get('ic_name')
    }
    ssh = None
    sftp = None
    try:
        ssh, sftp = create_sftp_client(SFTP_CONFIG)

        # Navigate to the IDP_Batch_Failure folder
        if policy_status == 'failure':
            failed_data = DocAI_Batch_Quote_Failure_collection.find_one({'filename': file_name})
            if not failed_data:
                return Response({'error': f'No data related to this file_name found: {file_name}', 'api':'get_batch_quote_document'}, status=status.HTTP_404_NOT_FOUND)

            extracted_text = failed_data.get('extracted_data', {})
            reasons = failed_data.get('reasons', '')
            folder = f"{SFTP_CONFIG['remote_folder']}/IDP_Batch_Failure"
        else:

            folder = f"{SFTP_CONFIG['remote_folder']}/IDP_Batch_Success"

        # Check if the file exists in the failure folder
        if file_name not in sftp.listdir(folder):
            return Response({'error': f'File {file_name} not found in specified folder', 'api': 'get_batch_quote_document'},
                            status=status.HTTP_404_NOT_FOUND)

        # Read the file content
        file_path = f"{folder}/{file_name}"
        with sftp.open(file_path, 'rb') as file:
            file_content = file.read()

        # Encode the file content as base64
        file_content_base64 = base64.b64encode(file_content).decode('utf-8')

        # Prepare the response
        response_data = {
            'extracted_data': extracted_text,
            'file_content': file_content_base64,
            'file_name': file_name,
            'errors': reasons
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error processing file {file_name}: {str(e)}")
        return Response({'error': f'Failed to process file: {str(e)}', 'api': 'get_batch_quote_document'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def edit_docai_batch_quote_failure(request):
    policy_data_str = request.data.get('policy_data')
    file_name = request.data.get('file_name')
    ic_id = request.data.get('ic_id')

    # Validate required fields
    if not policy_data_str or not file_name or not ic_id:
        return Response({'error': 'policy_data, file_name, and ic_id are required', 'api': 'edit_docai_batch_quote_failure'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        policy_data = json.loads(policy_data_str)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON in policy_data', 'api': 'edit_docai_batch_quote_failure'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_Policy_intake()
    batch_client, batch_db = MongoDB.get_mongo_client_Batch_processes()

    failure_collection = batch_db['DocAI_Batch_Quote_Failure']
    failure_data = failure_collection.find_one({'filename': file_name})
    policy_data = Ai_utils.process_extracted_data(policy_data)

    if not failure_data:
        return Response({'error': f'No failure data found for file: {file_name}', 'api': 'edit_docai_batch_quote_failure'}, status=status.HTTP_404_NOT_FOUND)


    policy_holder_info = policy_data.get('PolicyInfo', {})
    property_info = policy_data.get('PropertyInfo', {})
    additional_info = policy_data.get('AdditionalInfo', {})
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
        'quote_number': next_quote_number,
        'process_document_name': file_name,
        'process_document_url': "SFTP"
    }

    try:
        result = Policy_utils.add_policy_info_to_db(policy_holder_info, property_info, coverage_and_additional_info)
    except Exception as e:
        logger.error(f"Error adding policy info to database: {str(e)}")
        return Response({'error': 'Failed to add policy info to database', 'api': 'edit_docai_batch_quote_failure'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if result == "Policy created successfully":
        failure_data['status'] = 'edited_success'
        failure_data['quote_number'] = next_quote_number
        failure_data['quote_amount'] = random_quote_amount

        try:
            move_result = move_data_to_collection(batch_db, failure_data, 'DocAI_Batch_Quote_Success')
            if not move_result['success']:
                logger.error(f"Failed to move data to success collection: {move_result['message']}")
                return Response({'error': 'Failed to update database collections', 'api': 'edit_docai_batch_quote_failure'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            failure_collection.delete_one({'_id': failure_data['_id']})
        except Exception as e:
            logger.error(f"Error updating database collections: {str(e)}")
            return Response({'error': 'Failed to update database collections', 'api': 'edit_docai_batch_quote_failure'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            move_result = move_attachments_to_folder(file_name, 'IDP_Batch_Failure', 'IDP_Batch_Success', ic_id)
            if not move_result['success']:
                logger.warning(f"Failed to move file {file_name}: {move_result['message']}")
                # Continue execution even if file move fails
        except Exception as e:
            logger.error(f"Error moving file: {str(e)}")
            # Continue execution even if file move fails

        return Response({
            'message': result,
            'quote_number': next_quote_number,
            'quote_amount': random_quote_amount
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Failed to create policy', 'api': 'edit_docai_batch_quote_failure'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def Trigger_DocAI_Classify(request):
    if request.method == 'POST':
        try:
            email_user = os.getenv('DOCAI_EMAIL_USER')
            email_password = os.getenv('DOCAI_PASSWORD_USER')

            if not email_user or not email_password:
                return Response(
                    {'status': 'error', 'message': 'Email credentials not found in environment variables.', 'api': 'Trigger_DocAI_Classify'},
                    status=status.HTTP_400_BAD_REQUEST
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
            return Response({'status': 'error', 'message': str(e), 'api': 'Trigger_DocAI_Classify'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'status': 'error', 'message': 'Invalid request method.', 'api': 'Trigger_DocAI_Classify'}, status=status.HTTP_400_BAD_REQUEST)


