from Master_package.master_package_security import Authentication
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_utils import Claim_utils, Address_validations, File_handling, Emails, Sign_in_utils
from rest_framework.decorators import api_view, parser_classes
from datetime import datetime, timezone, timedelta
from rest_framework.parsers import MultiPartParser
import os
from .utils import *
import googlemaps
from django.conf import settings
import base64
from rest_framework import status
from rest_framework.response import Response
from bson.objectid import ObjectId
from bson.errors import InvalidId
import imghdr
from docx2python import docx2python
import bleach
from dotenv import load_dotenv
from Master_package.master_package_utils import Administration_utils
from Master_package.master_package_schemas import RefreshTokenDetails
from django.views.decorators.csrf import csrf_exempt
from corsheaders.decorators import cors_allow_all
from pymongo import MongoClient
from django.http import JsonResponse
import socket
from dotenv import load_dotenv


load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
verification_codes = {}

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_policy_details(request):
    email = request.data.get('email', '')
    if not email:
        return Response({'error': 'email_id cannot be empty', 'api': 'get_policy_details'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    policy_collection = db['policies']
    policy = policy_collection.find_one({"pol_email": email})
    if not policy:
        return Response({'error':"This user doesn't have any policy in our system", 'api': 'get_policy_details'}, status=status.HTTP_404_NOT_FOUND)
    policy_number = policy['policy_number']
    policy, company, message = Claim_utils.verify_policy_and_company(policy_number)
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
            if not policy:
                return Response({'message': message, 'api': 'get_policy_details'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'user': policy, 'company': company,
                                 'message1': message,}, status=status.HTTP_200_OK)
            

@api_view(['GET'])
@Authentication.authentication_required(allow_refresh=True)
def get_address(request):
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')

    if not latitude or not longitude:
        return Response({'error': 'Latitude and longitude are required.', 'api': 'get_address'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except ValueError:
        return Response({'error': 'Latitude and longitude must be numerical values.', 'api': 'get_address'}, status=status.HTTP_400_BAD_REQUEST)

    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    address_data = Address_validations.reverse_geocode(api_key, latitude, longitude)

    if address_data:
        return Response({'address': address_data}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Address not found.', 'api': 'get_address'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def validate_address(request):
    address = request.data.get('address')
    if not address:
        return Response({"error": "Address cannot be empty", 'api': 'validate_address'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Geocode the address
        result = gmaps.places(query=address)
        formatted_address = None
        if result['results']:
            # Extract the formatted address
            formatted_address = result['results'][0]['formatted_address']
            formatted_address_list = formatted_address.split()
            try:
                int(formatted_address_list[0])
                if formatted_address:
                    splitted_address = Address_validations.parse_address(formatted_address)
            except:
                return Response({"error": "Address Not validated", 'api': 'validate_address'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"validated_address": formatted_address, "splitted_address": splitted_address}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Address Not validated", 'api': 'validate_address'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e), 'api': 'validate_address'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@parser_classes([MultiPartParser])
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def add_claim_details(request):
    data = request.data.dict()
    documents = request.FILES.getlist('documents')
    storage_type = data['claim_storage_type']
    Role = data['role']
    email = data.get('email', None)
    if documents:
        # Save documents with unique IDs
        original_filenames, save_paths, message = File_handling.save_documents_with_unique_ids(documents, 'Claims_documents')
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
    data['claim_created_at'] = datetime.now(timezone.utc)
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
        data['insured_contact_details'] = claimants_contact_str

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
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if documents:
            # Remove 'documents' key as it's not needed
            del data_to_insert['documents']

        if Role == "Insured":
            converted_data = Claim_utils.get_dictionary_structure(data_to_insert, Role, policy)
        else:
            converted_data = Claim_utils.get_dictionary_structure(data_to_insert, Role, email=email)
        # Insert claim into the database
        inserted_claim = Claim_utils.add_claim_to_db(converted_data)
    elif storage_type == 'CSV':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if documents:
            # Remove 'documents' key as it's not needed
            del data_to_insert['documents']

        if Role == "Insured":
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role)
        else:
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role, email)
        inserted_claim, next_claim_id = File_handling.save_to_csv(converted_data, company['ic_name'])
    elif storage_type == 'Excel':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if documents:
            # Remove 'documents' key as it's not needed
            del data_to_insert['documents']
        if Role == "Insured":
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role)
        else:
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role, email)
        inserted_claim, next_claim_id = File_handling.save_to_excel(converted_data, company['ic_name'])

    elif storage_type == 'Flat File':
        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}
        if documents:
            # Remove 'documents' key as it's not needed
            del data_to_insert['documents']

        if Role == "Insured":
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role)
        else:
            converted_data = Claim_utils.get_dictionary_structure_for_documents(data_to_insert, Role, email)
        inserted_claim, next_claim_id = File_handling.save_to_flat_file(converted_data, company['ic_name'])

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
    if email:
        client, db = MongoDB.get_mongo_client_Administration()
        draft_data_collection = db['Portals_Draft']        
        existing_draft = draft_data_collection.find_one({
            'user_email': email,
            'portal_type': "claim"
        })
        if existing_draft:
                delete_result = Administration_utils.delete_draft_data_from_DB(email, "claim")
                if not delete_result.get('ok', 0.0) == 1.0:
                    error_msg = delete_result.get('error', "Unknown draft deletion error")
                    print(f"Error deleting draft: {error_msg}")
                    return Response({
                        'error': f"Error deleting draft: {error_msg}"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                if delete_result.get("n", 0) == 0:
                    return Response({
                        'error': f"Error deleting draft: No matching draft found for deletion."
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"No draft found for email {email}")
    return Response({
        'message': 'Claim details added successfully',
        'data': Claim_utils.convert_objectid_to_str(next_claim_id)
    }, status=status.HTTP_200_OK)


@parser_classes([MultiPartParser])
@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def add_company_details(request):
    try:
        data = request.data.dict()
        documents = request.FILES.getlist('documents')
        if documents:
            # Save documents with unique IDs
            original_filenames, save_paths, message = File_handling.save_documents_with_unique_ids(documents,'Insurance_company_logos')
            data['ic_logo_name'] = original_filenames
            data['ic_logo_path'] = save_paths
 
        # Check for existing company with the same name, email, or mobile
        client, db = MongoDB.get_mongo_client_innoclaimfnol()
        company_collection = db['insurancecompanies']

        existing_company = company_collection.find_one({"$or": [
            {"ic_name": data.get('ic_name')},
            {"ic_email": data.get('ic_email')},
            {"ic_mobile": data.get('ic_mobile')}
        ]})

        if existing_company:
            # Determine which field caused the conflict
            conflict_field = 'ic_name' if existing_company.get('ic_name') == data.get('ic_name') else \
                'ic_email' if existing_company.get('ic_email') == data.get('ic_email') else \
                    'ic_mobile'
            return Response({'message': f"Company with this {conflict_field} already exists", 'api': 'add_company_details'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate next company ID
        latest_company = company_collection.find().sort("ic_id", -1).limit(1)
        latest_company = list(latest_company)
        if latest_company != []:
            latest_ic_id = latest_company[0]['ic_id']
        else:
            latest_ic_id = None
        next_ic_id = Claim_utils.generate_next_ic_id(latest_ic_id)
        data['ic_id'] = next_ic_id
        # Fetch SFTP credentials from environment variables
        data['host'] = os.getenv('SFTP_HOST')
        data['username'] = os.getenv('SFTP_USERNAME')
        data['password'] = os.getenv('SFTP_PASSWORD')

        data_to_insert = {k: v[0] if isinstance(v, list) else v for k, v in data.items()}

        # Remove 'documents' key as it's not needed
        if documents:
            del data_to_insert['documents']
 
        # Insert company data into database
        inserted_company = Claim_utils.add_company_to_db(data_to_insert)

        return Response({
            'ic_id': next_ic_id,
            'message': 'Company details added successfully',
        }, status=201)

    except Exception as error:
        return Response({'message': str(error), 'api': 'add_company_details'}, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['GET'])
# # @Authentication.authentication_required(allow_refresh=True)
# def get_all_company_names(request):
#     client, db = MongoDB.get_mongo_client_innoclaimfnol()
#     company_collection = db['insurancecompanies']
#     try:
#         companies = company_collection.find({}, {'_id': 0, 'ic_name': 1})
#         company_names = [company['ic_name'] for company in companies]
#         return Response({
#             'message': 'Successfully fetched company names',
#             'company_names': company_names
#         }, status=status.HTTP_200_OK)
#     except Exception as error:
#         return Response({'message': str(error), 'api': 'get_all_company_names'}, status=status.HTTP_400_BAD_REQUEST)
#     finally:
#         client.close()
 
@csrf_exempt
@cors_allow_all
@api_view(['GET'])
def get_all_company_names(request):
    try:
        mongo_uri = os.getenv('MONGO_URI')
        if not mongo_uri:
            return Response({
                'message': 'MongoDB URI is not configured',
                'api': 'get_all_company_names'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Crucial:  Handle socket timeouts directly.
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000, socketTimeoutMS=5000)  # Add socketTimeoutMS
        client.server_info() # This line can raise socket timeout exceptions

        db = client[os.getenv('MONGO_DB_NAME')]
        company_collection = db['insurancecompanies']
        companies = list(company_collection.find({}, {'_id': 0, 'ic_name': 1}))

        return Response({
            'message': 'Successfully fetched company names',
            'company_names': [company['ic_name'] for company in companies]
        }, status=status.HTTP_200_OK)

    except socket.timeout as e:
        return Response({
            'message': f'Connection timed out: {e}',
            'api': 'get_all_company_names'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)  # Use 503 for connection issues

    except Exception as error:
        return Response({
            'message': f'Server error: {str(error)}',
            'api': 'get_all_company_names'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if 'client' in locals():
            client.close()

@api_view(['GET'])
def test_mongo_connection(request):
    try:
        # Get MongoDB connection details
        mongo_uri = os.getenv('MONGO_URI')
        
        # Try to connect
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        server_info = client.server_info()
        
        # Get App Service outbound IP
        hostname = 'your-app-name.azurewebsites.net'
        app_ip = socket.gethostbyname(hostname)
        
        return Response({
            'status': 'success',
            'mongo_connected': True,
            'server_info': server_info,
            'app_service_ip': app_ip,
            'environment': {
                'WEBSITES_PORT': os.getenv('WEBSITES_PORT'),
                'MONGO_URI_EXISTS': bool(mongo_uri),
            }
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e),
            'type': type(e).__name__
        }, status=500)
    
@api_view(['GET'])
def test_network(request):
    try:
        # Test MongoDB connection
        mongo_host = os.getenv('MONGO_URI').split('@')[1].split('/')[0]
        mongo_port = 27017  # Default MongoDB port
        
        # Try TCP connection
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((mongo_host, mongo_port))
        
        return Response({
            'can_connect_to_mongo': result == 0,
            'mongo_host': mongo_host,
            'app_service_ip': socket.gethostbyname(socket.gethostname()),
            'environment': dict(os.environ)
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=500)


@api_view(['GET'])
@Authentication.authentication_required(allow_refresh=True)
def get_company_by_name(request):
    company_name = request.GET.get('company_name')
    if not company_name:
        return Response({'message': 'Company name is required', 'api': 'get_company_by_name'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']

    try:
        company = company_collection.find_one({'ic_name': company_name})
        if not company:
            return Response({'message': 'Company not found', 'api': 'get_company_by_name'}, status=status.HTTP_404_NOT_FOUND)

        company = Claim_utils.convert_objectid_to_str(company)

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

        return Response({
            'message': 'Company data retrieved successfully',
            'company': company,
        }, status=status.HTTP_200_OK)

    except FileNotFoundError:
        return Response({'message': f'Image not found at: {image_path}', 'api': 'get_company_by_name'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({'message': str(error), 'api': 'get_company_by_name'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@parser_classes([MultiPartParser])
@Authentication.authentication_required(allow_refresh=True)
def update_company_by_id(request):
    data = request.data.dict()
    ic_id = data.get('ic_id')
    del data['ic_id']
    updated_data = data
    new_logo = request.FILES.get('new_logo')

    if not ic_id or not updated_data:
        return Response({'message': 'ic_id and updated_data are required', 'api': 'update_company_by_id'}, status=status.HTTP_400_BAD_REQUEST)

    object_id_str = get_object_id_from_ic_id(ic_id)
    if not object_id_str:
        return Response({'message': 'Company not found', 'api': 'update_company_by_id'}, status=status.HTTP_404_NOT_FOUND)

    try:
        ic_id = ObjectId(object_id_str)
    except InvalidId:
        return Response({'message': 'Invalid ic_id format', 'api': 'update_company_by_id'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']

    # --- Handle Logo Update ---
    if new_logo:
        # 1. Get existing logo path from database
        existing_company = company_collection.find_one({'_id': ic_id})
        old_logo_path = existing_company.get('ic_logo_path')[7:]
 
        # 2. Delete the old logo file
        if old_logo_path:
            try:
                old_logo_full_path = os.path.join(settings.MEDIA_ROOT, old_logo_path)
                os.remove(old_logo_full_path)
            except FileNotFoundError:
                pass  # Ignore if file not found

        # 3. Save new logo and update database fields
        original_filenames, save_paths, message = File_handling.save_documents_with_unique_ids(
            [new_logo], 'Insurance_company_logos'
        )
        updated_data['ic_logo_name'] = original_filenames[0]
        updated_data['ic_logo_path'] = save_paths[0]
        del updated_data['new_logo']

    # --- Check for Duplicate Data (Except for logo) ---
    for field in ['ic_name', 'ic_email', 'ic_mobile']:
        if field in updated_data:
            existing_company = company_collection.find_one(
                {field: updated_data[field], '_id': {'$ne': ic_id}}
            )
            if existing_company:
                return Response({'message': f'Company with this {field} already exists'}, status=400)

    try:
        result = company_collection.update_one({'_id': ic_id}, {'$set': updated_data})

        if result.matched_count == 0:
            return Response({'message': 'Company not found'}, status=404)

        return Response({'message': 'Company details updated successfully'}, status=200)
    except Exception as error:
        return Response({'message': str(error)}, status=400)
    

@api_view(['POST'])
def verify_noninsured_email(request):
    email = request.data.get('email')
    USER_COLLECTION = 'signinusers'
    role = 'user'
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    user = db[USER_COLLECTION].find_one({"email": email})
    if user:
        if user['role'] == 'user':
            return Response({'error': 'This email is linked with Insured, Please provide your email address', 'api': 'verify_noninsured_email'},
                            status=status.HTTP_400_BAD_REQUEST)
        elif user['role'] == 'carrier_admin':
            return Response({'error': 'This email is linked with Carrier Admin, Please provide your email address', 'api': 'verify_noninsured_email'},
                            status=status.HTTP_400_BAD_REQUEST)
        elif user['role'] == 'companies_admin':
            return Response({'error': 'This email is linked with Companies Admin, Please provide your email address', 'api': 'verify_noninsured_email'},
                            status=status.HTTP_400_BAD_REQUEST)
    else:
        verification_code = Sign_in_utils.generate_otp()
        verification_codes[email] = {
            'code': verification_code,
            'timestamp': datetime.now(timezone.utc)
        }
        Sign_in_utils.send_verification_email(email, verification_code)
        return Response({'message': 'OTP sent successfully', 'role': role,'token': True}, status=status.HTTP_200_OK)


@api_view(['POST'])
def verify_otp_view(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    role = request.data.get('role')
    privilege=request.data.get('privilege')
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    client, refresh_db = MongoDB.get_mongo_client_Administration()

    if not email or not otp:
        return Response({'error': 'Email and OTP are required'}, status=400)

    stored_code_data = verification_codes.get(email)
    if not stored_code_data:
        return Response({'error': 'Unable to verify, please try again'}, status=400)

    current_time = datetime.now(timezone.utc)
    expiry_time = verification_codes[email].get('timestamp') + timedelta(minutes=5)

    if current_time > expiry_time:
        del verification_codes[email]
        return Response({'error': 'Verification code has expired'}, status=400)

    if verification_codes[email].get('code') == otp:
        del verification_codes[email]
        user_data = {
            'email': email,  
            'user_id': str(privilege), 
            'role':role, 
        }
        access_token = Authentication.generate_jwt_token(user_data, expiration_minutes=120)
        refresh_token = Authentication.generate_refresh_token()
        refresh_tokens_collection = refresh_db['refresh_tokens']  
        refresh_token_data = RefreshTokenDetails(
            refresh_token=refresh_token,
            user_id=str(privilege),
            device_info=request.headers.get('User-Agent')  
        )
        refresh_tokens_collection.insert_one(refresh_token_data.dict())

        if privilege=='user':
            if role == "Insured":
                policy_collection = db['policies']
                policy = policy_collection.find_one({"pol_email": email})
                policy_number = policy['policy_number']
                policy, company, message = verify_policy_and_company(policy_number)
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
                        if not policy:
                            return Response({'message': message}, status=400)
                        else:
                            response = Response({'message': 'Verification successful', 'user': policy, 'company': company,
                                             'message1': message, 'privilege':privilege}, status=200)
                            
                            # Access token cookie
                            # response.set_cookie(
                            #     'access_token',
                            #     access_token,
                            #     max_age= 2 * 60 * 60,   
                            #     httponly=True,
                            #     samesite='Strict',  
                            #     secure=True,  
                            #     domain='innovon.ai'  
                            # )
                            # # Refresh token cookie
                            # response.set_cookie(
                            #     'refresh_token',
                            #     refresh_token,
                            #     max_age=24 * 60 * 60,  
                            #     httponly=True,
                            #     samesite='Strict',  
                            #     secure=True,  
                            #     domain='innovon.ai'   
                            # )
                            # In the view where you set cookies (e.g., login view)
                            response.set_cookie(
                                'access_token',
                                access_token,
                                max_age=30 * 60,   
                                httponly=True,
                                samesite='None',   
                                secure=True,  
                                domain=None   
                            )
                            response.set_cookie(
                                'refresh_token',
                                refresh_token,
                                max_age=24 * 60 * 60,   
                                httponly=True,
                                samesite='None',   
                                secure=True,   
                                domain=None  
                            )
                            return response
            else:
                response = Response({'message': 'Verification successful', 'privilege':privilege}, status=200)
                # Access token cookie
                # response.set_cookie(
                #     'access_token',
                #     access_token,
                #     max_age= 2 * 60 * 60,   
                #     httponly=True,
                #     samesite='Strict',  
                #     secure=True,  
                #     domain='innovon.ai'  
                # )
                # # Refresh token cookie
                # response.set_cookie(
                #     'refresh_token',
                #     refresh_token,
                #     max_age=24 * 60 * 60,  
                #     httponly=True,
                #     samesite='Strict', 
                #     secure=True, 
                #     domain='innovon.ai'  
                # )

                # In the view where you set cookies (e.g., login view)
                response.set_cookie(
                    'access_token',
                    access_token,
                    max_age=30 * 60,   
                    httponly=True,
                    samesite='None',  
                    secure=True,   
                    domain=None   
                )
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=24 * 60 * 60,  
                    httponly=True,
                    samesite='None',  
                    secure=True,   
                    domain=None   
                )
                return response
        elif privilege=='carrier_admin':
            client, db = MongoDB.get_mongo_client_innoclaimfnol()
            company_collection = db['insurancecompanies']
            try:
                company = company_collection.find_one({'ic_email': email})
                if not company:
                    return Response({'message': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

                company = Claim_utils.convert_objectid_to_str(company)
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

                return Response({
                    'message': 'Company data retrieved successfully',
                    'company': company,
                    'privilege':privilege
                }, status=status.HTTP_200_OK)

            except FileNotFoundError:
                return Response({'message': f'Image not found at: {image_path}'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as error:
                return Response({'message': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            response = Response({'message': 'Verification successful','privilege':privilege}, status=status.HTTP_200_OK)
            # Access token cookie
            # response.set_cookie(
            #     'access_token',
            #     access_token,
            #     max_age= 2 * 60 * 60,  
            #     httponly=True,
            #     samesite='Strict', 
            #     secure=True, 
            #     domain='innovon.ai' 
            # )
            # # Refresh token cookie
            # response.set_cookie(
            #     'refresh_token',
            #     refresh_token,
            #     max_age=24 * 60 * 60,   
            #     httponly=True,
            #     samesite='Strict',  
            #     secure=True,  
            #     domain='innovon.ai'  
            # )
            # In the view where you set cookies (e.g., login view)
            response.set_cookie(
                'access_token',
                access_token,
                max_age=30 * 60,  
                httponly=True,
                samesite='None',   
                secure=True,   
                domain=None   
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                max_age=24 * 60 * 60,   
                httponly=True,
                samesite='None',   
                secure=True,   
                domain=None  
            )
            return response
    else:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def verify_policy_number(request):
    login_form_data = request.data.get('loginFormValue')  
    if not login_form_data:
        return Response({'message': 'Missing loginFormValue data'}, status=400)

    policy_number = login_form_data.get('policy_number')
    pol_date_of_birth = login_form_data.get('pol_date_of_birth')
 
    if not policy_number or not pol_date_of_birth:
        return Response({'message': 'All fields are mandatory'}, status=400)

    policy, company, message = verify_policy_and_company(policy_number, pol_date_of_birth=pol_date_of_birth)
    if policy!= None and company!=None:
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

    if not policy:
        return Response({'message': message}, status=400)
 
    return Response({
        'user': policy,
        'company': company,
        'message': message,
     }, status=200)


@api_view(['GET'])
@Authentication.authentication_required(allow_refresh=True)
def get_company_by_id(request):
    ic_name = request.GET.get('ic_name')
    if not ic_name:
        return Response({'message': 'Company name is required', 'api': 'get_company_by_id'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']

    try:
        company = company_collection.find_one({'ic_name': ic_name})
        if not company:
            return Response({'message': 'Company not found', 'api': 'get_company_by_id'}, status=status.HTTP_404_NOT_FOUND)

        company = Claim_utils.convert_objectid_to_str(company)

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

        return Response({
            'message': 'Company data retrieved successfully',
            'company': company,
        }, status=status.HTTP_200_OK)

    except FileNotFoundError:
        return Response({'message': f'Image not found at: {image_path}', 'api': 'get_company_by_id'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({'message': str(error), 'api': 'get_company_by_id'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_details(request):
    company_id = request.data.get('ic_id')
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
 
    insurance_companies_collection = db['insurancecompanies']
    policies_collection = db['policies']
    claims_collection = db['claims']
    failure_emails_collection = db['email_to_fnol_failure']
 
    failure_count = failure_emails_collection.count_documents({})
    company_details = insurance_companies_collection.find_one({"ic_id": company_id})
    last_year = datetime.now().year - 1
 
    if company_details:
        ic_id = company_details['ic_id']
        claim_storage_type = company_details['claim_storage_type']
        company_name = company_details['ic_name'].strip()
 
        # 1. Fetch all relevant policies and create policy data structures
        policies = list(policies_collection.find({"ic_id": ic_id}))
        policy_numbers = [p['policy_number'] for p in policies]
        encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
        encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
        encrypted_key = list(encrypted_policy_number_key.keys())[0]
        policies_by_HO = {p['policy_number']: p['pol_lob'] for p in policies}
 
        # 2. Fetch claims (optimized based on storage type)
        if claim_storage_type == 'Database':
            claims = []
            db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
            for claim in db_claims:
                claims.append(Authentication.decrypt_data(claim))
            print(claims)
        elif claim_storage_type == 'Excel':
            claims = get_claims_from_excel(company_name)
        elif claim_storage_type == 'CSV':
            claims = get_claims_from_csv(company_name)
        elif claim_storage_type == 'Flat File':
            claims = get_claims_from_flat_file(company_name)
        else:
            return Response({"error": "Invalid claim storage type", 'api': 'get_all_details'}, status=status.HTTP_400_BAD_REQUEST)
 
        # 3. Aggregate data
        policy_type = {"HO-1": 0, "HO-2": 0, "HO-3": 0, "HO-4": 0, "HO-5": 0, "HO-6": 0, "HO-7": 0, "HO-8": 0}
        channels = {"FNOL": 0, "IDP_FNOL": 0, "Email-To-FNOL": 0, "AI_AGENT": 0}
        claims_by_HO = {"HO-1": 0, "HO-2": 0, "HO-3": 0, "HO-4": 0, "HO-5": 0, "HO-6": 0, "HO-7": 0, "HO-8": 0}
        total_premium = 0
        premium_by_H0_category = {"HO-1": 0, "HO-2": 0, "HO-3": 0, "HO-4": 0, "HO-5": 0, "HO-6": 0, "HO-7": 0,
                                  "HO-8": 0}
 
        # New: Monthly aggregations with month names
        current_year = datetime.now().year
        current_month = datetime.now().month
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        monthly_policies = {month: 0 for month in month_names}
        monthly_claims = {month: 0 for month in month_names}
        monthly_premium = {month: 0 for month in month_names}
        premium_by_year = {year: 0 for year in range(current_year - 4, current_year + 1)}
 
        # Variables to track current and previous month data
        current_month_policies = 0
        current_month_claims = 0
        current_month_premium = 0
        prev_month_policies = 0
        prev_month_claims = 0
        prev_month_premium = 0
 
        for policy in policies:
            policy['_id'] = str(policy['_id'])
            policy_type[policy['pol_lob']] = policy_type.get(policy['pol_lob'], 0) + 1
            total_premium += policy['pro_pol_premium']
            premium_by_H0_category[policy['pol_lob']] = premium_by_H0_category.get(policy['pol_lob'], 0) + policy[
                'pro_pol_premium']
 
            # Aggregate monthly policies
            try:
                policy_date = parse_datetime(policy.get('policy_created_at', ''))
                if policy_date.year == current_year:
                    month_name = month_names[policy_date.month - 1]
                    monthly_policies[month_name] += 1
                    monthly_premium[month_name] += policy['pro_pol_premium']
 
                    # Track current and previous month data
                    if policy_date.month == current_month:
                        current_month_policies += 1
                        current_month_premium += policy['pro_pol_premium']
                    elif policy_date.month == current_month - 1:
                        prev_month_policies += 1
                        prev_month_premium += policy['pro_pol_premium']
 
                # Add premium to the corresponding year
                policy_year = policy_date.year
                premium_by_year[policy_year] = premium_by_year.get(policy_year, 0) + policy['pro_pol_premium']
            except Exception as e:
                print(f"Error processing policy date for policy {policy.get('policy_number', 'Unknown')}: {e}")
 
        for claim in claims:
            # Ensure claim has 'policy_number' before accessing
            if 'policy_number' in claim and claim['policy_number'] in policies_by_HO:
                ho_category = policies_by_HO[claim['policy_number']]
                claims_by_HO[ho_category] = claims_by_HO.get(ho_category, 0) + 1
 
            if claim.get('claim_process_document_name') == "Null":
                channels["FNOL"] += 1
            elif claim.get('claim_process_document_name') == "Claimed Through AI Agent":
                channels["AI_AGENT"] += 1
            elif claim.get('claim_process_document_name', "").startswith("From_email"):
                channels["Email-To-FNOL"] += 1
            else:
                channels["IDP_FNOL"] += 1
 
            # Aggregate monthly claims
            claim_date = parse_datetime(claim['claim_created_at'])
            if claim_date.year == current_year:
                month_name = month_names[claim_date.month - 1]
                monthly_claims[month_name] += 1
 
                # Track current and previous month data
                if claim_date.month == current_month:
                    current_month_claims += 1
                elif claim_date.month == current_month - 1:
                    prev_month_claims += 1
 
        no_of_claims = len(claims)
        no_of_policies = len(policies)
        success_and_failure_claims = {"success_claims": no_of_claims, "failure_claims": failure_count}
 
        # Calculate percentage increases
        def calculate_percentage_increase(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return ((current - previous) / previous) * 100
 
        percentage_increases = {
            "policies_increase": calculate_percentage_increase(current_month_policies, prev_month_policies),
            "claims_increase": calculate_percentage_increase(current_month_claims, prev_month_claims),
            "premium_increase": calculate_percentage_increase(current_month_premium, prev_month_premium)
        }
 
        return Response({
            "ic_id": ic_id,
            "policies": no_of_policies,
            "Total_claims": no_of_claims,
            "Channels": channels,
            "Policy_Types": policy_type,
            "Total Premium": total_premium,
            "Success_and_Failure_Claims": success_and_failure_claims,
            "Total_claims_by_H0_Category": claims_by_HO,
            "Premium_by_H0_Category": premium_by_H0_category,
            "Monthly_Policies": monthly_policies,
            "Monthly_Claims": monthly_claims,
            "Premium_by_Year": premium_by_year,
            "monthly_premium": monthly_premium,
            "percentage_increases": percentage_increases
        }, status=200)
 
    else:
        return Response({"error": "Company not found", 'api': 'get_all_details'}, status=status.HTTP_404_NOT_FOUND)
 

@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_policy_details(request):
    ic_id = request.data.get('ic_id')
    if not ic_id:
        return Response({'error': "IC_ID must not be empty", 'api': 'get_all_policy_details'}, status=status.HTTP_400_BAD_REQUEST)

    current_date = datetime.now()
    current_year, current_month, current_day = current_date.year, current_date.month, current_date.day
    previous_month_date = current_date.replace(day=1) - timedelta(days=1)
    previous_month, previous_year = previous_month_date.month, previous_month_date.year

    client_policy, db_policy = MongoDB.get_mongo_client_Policy_intake()
    client_innoclaimfnol, db_innoclaimfnol = MongoDB.get_mongo_client_innoclaimfnol()
    # Collections for policies
    insurance_companies_collection = db_innoclaimfnol['insurancecompanies']
    policies_collection = db_innoclaimfnol['policies']    
    # Collections for quotes
    policy_holders_collection = db_policy['policy_holder_information']
    email_intake_success_collection = db_policy['email_to_policy_intake_success']
    email_intake_failure_collection = db_policy['email_to_policy_intake_failure']
    company = insurance_companies_collection.find_one({'ic_id': ic_id})

    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthly_policies = {month: 0 for month in month_names}
    monthly_premium = {month: 0 for month in month_names}
    premium_by_year = {year: 0 for year in range(current_year - 4, current_year + 1)}
    active_policies = 0
    active_policies_premium = 0
    previous_month_policies = 0
    previous_month_premium = 0
    previous_month_active_policies = 0
    previous_month_active_premium = 0

    # Get all policy holders and decrypt them
    policy_holders_db = list(policy_holders_collection.find({}, {'_id': 0}))
    all_policy_holders = [Authentication.decrypt_data(policy) for policy in policy_holders_db]
    # Count quotes by channel
    quote_counts = {
        'SmartQuote_Portal': len([
            policy for policy in all_policy_holders 
            if policy['policy_associated_ic_id'] == ic_id and 
            policy['policy_from_channel'] == 'SmartQuote Portal'
        ]),
        'DocAI_Quote': len([
            policy for policy in all_policy_holders 
            if policy['policy_associated_ic_id'] == ic_id and 
            policy['policy_from_channel'] == 'DocAI Quote'
        ]),
        'Mail2Quote': (
            email_intake_success_collection.count_documents({}) + 
            email_intake_failure_collection.count_documents({})
        )
    }
    if company:
        policies = list(policies_collection.find({'ic_id': company['ic_id']}))
        No_of_policies_by_HO = {f"HO-{i}": 0 for i in range(1, 9)}
        No_of_policies_by_year = {year: 0 for year in range(current_year - 4, current_year + 1)}
        Premium_by_type = {f"HO-{i}": 0 for i in range(1, 9)}
        Total_Premium = 0

        for policy in policies:
            policy_date = parse_datetime(policy.get('policy_created_at', '')).replace(tzinfo=None)
            policy_expiry_date = parse_datetime(policy.get('pro_pol_exp_date', '')).replace(tzinfo=None)
            premium = policy['pro_pol_premium']

            No_of_policies_by_HO[policy['pol_lob']] += 1
            premium_by_year[policy_date.year] += premium
            No_of_policies_by_year[policy_date.year] = No_of_policies_by_year.get(policy_date.year, 0) + 1
            Premium_by_type[policy['pol_lob']] += premium
            Total_Premium += premium

            if policy_date.year == current_year:
                month_name = month_names[policy_date.month - 1]
                monthly_policies[month_name] += 1
                monthly_premium[month_name] += premium

            # Check for active policies
            if policy_expiry_date > current_date:
                active_policies += 1
                active_policies_premium += premium

            # Previous month data
            if policy_date.year == previous_year and policy_date.month == previous_month:
                previous_month_policies += 1
                previous_month_premium += premium

            if policy_expiry_date.year == previous_year and policy_expiry_date.month > previous_month:
                previous_month_active_policies += 1
                previous_month_active_premium += premium

        Total_policies = len(policies)

        # Calculate percentage changes
        def calculate_percentage_increase(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return ((current - previous) / previous) * 100

        percentage_changes = {
            'policies': calculate_percentage_increase(monthly_policies[month_names[current_month - 1]],
                                                      previous_month_policies),
            'premium': calculate_percentage_increase(monthly_premium[month_names[current_month - 1]],
                                                     previous_month_premium),
            'active_policies': calculate_percentage_increase(active_policies, previous_month_active_policies),
            'active_premium': calculate_percentage_increase(active_policies_premium, previous_month_active_premium)
        }

    else:
        return Response({"error": f"No company found with this email {ic_id}", 'api': 'get_all_policy_details'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'No_of_policies_by_HO': No_of_policies_by_HO,
        'No_of_policies_by_year': No_of_policies_by_year,
        'Premium_by_type': Premium_by_type,
        'Total_Premium': Total_Premium,
        'Total_policies': Total_policies,
        'monthly_policies': monthly_policies,
        'monthly_premium': monthly_premium,
        'premium_by_year': premium_by_year,
        'active_policies': active_policies,
        'active_policies_premium': active_policies_premium,
        'percentage_changes': percentage_changes,
        'quote_counts': quote_counts
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_claims_details(request):
    ic_id = request.data.get('ic_id')
    if not ic_id:
        return Response({'error': "IC_ID must not be empty", 'api': 'get_all_claims_details'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    insurance_companies_collection = db['insurancecompanies']
    failure_emails_collection = db['email_to_fnol_failure']
    policies_collection = db['policies']
    claims_collection = db['claims']
    failure_count = failure_emails_collection.count_documents({})
    company = insurance_companies_collection.find_one({'ic_id': ic_id})
    current_month = datetime.now().month
    current_year = datetime.now().year
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthly_claims = {month: 0 for month in month_names}
    current_month_claims = 0
    prev_month_claims = 0
    if company:
        policies = list(policies_collection.find({'ic_id': ic_id}))
        policy_numbers = [p['policy_number'] for p in policies]
        encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
        encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
        encrypted_key = list(encrypted_policy_number_key.keys())[0]
        policies_by_HO = {p['policy_number']: p['pol_lob'] for p in policies}
        claim_storage_type = company['claim_storage_type']
        company_name = company['ic_name'].strip()
        channels = {"FNOL": 0, "IDP_FNOL": 0, "Email-To-FNOL": 0, "AI_AGENT": 0}
        total_claims_per_year = {year: 0 for year in range(current_year - 4, current_year + 1)}
        claims_by_HO = {"HO-1": 0, "HO-2": 0, "HO-3": 0, "HO-4": 0, "HO-5": 0, "HO-6": 0, "HO-7": 0, "HO-8": 0}
        # 2. Fetch claims (optimized based on storage type)
        if claim_storage_type == 'Database':
            claims = []
            db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
            for claim in db_claims:
                claims.append(Authentication.decrypt_data(claim))
        elif claim_storage_type == 'Excel':
            claims = get_claims_from_excel(company_name)
        elif claim_storage_type == 'CSV':
            claims = get_claims_from_csv(company_name)
        elif claim_storage_type == 'Flat File':
            claims = get_claims_from_flat_file(company_name)
        else:
            return Response({"error": "Invalid claim storage type", 'api': 'get_all_claims_details'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Count claims by channel
        claims_by_channel = {
            'FNOL': len([
                claim for claim in claims 
                if claim.get('claim_process_document_name') == "Null"
            ]),
            'IDP': len([
                claim for claim in claims 
                if claim.get('claim_process_document_name') != "Null" 
                and claim.get('claim_process_document_name') != "Claimed Through AI Agent"
                and not claim.get('claim_process_document_name', "").startswith("From_email")
            ]),
            'IVAN': len([
                claim for claim in claims 
                if claim.get('claim_process_document_name') == "Claimed Through AI Agent"
            ]),
            'Mail2Claim': (
                db['email_to_fnol_success'].count_documents({}) + 
                db['email_to_fnol_failure'].count_documents({})
            )
        }       
        
        for claim in claims:
            # Ensure claim has 'policy_number' before accessing
            claim_date = parse_datetime(claim['claim_created_at'])
            if 'policy_number' in claim and claim['policy_number'] in policies_by_HO:
                ho_category = policies_by_HO[claim['policy_number']]
                claims_by_HO[ho_category] = claims_by_HO.get(ho_category, 0) + 1

            if claim.get('claim_process_document_name') == "Null":
                channels["FNOL"] += 1
            elif claim.get('claim_process_document_name') == "Claimed Through AI Agent":
                channels["AI_AGENT"] += 1
            elif claim.get('claim_process_document_name', "").startswith("From_email"):
                channels["Email-To-FNOL"] += 1
            else:
                channels["IDP_FNOL"] += 1
            total_claims_per_year[claim_date.year] = total_claims_per_year.get(claim_date.year, 0) + 1

            if claim_date.year == current_year:
                month_name = month_names[claim_date.month - 1]
                monthly_claims[month_name] += 1
                # Track current and previous month data
                if claim_date.month == current_month:
                    current_month_claims += 1
                elif claim_date.month == current_month - 1:
                    prev_month_claims += 1

        no_of_claims = len(claims) + failure_count
        success_and_failure_claims = {"success_claims": no_of_claims, "failure_claims": failure_count}

        # Calculate percentage increases
        def calculate_percentage_increase(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return ((current - previous) / previous) * 100

        claims_increase = calculate_percentage_increase(current_month_claims, prev_month_claims)
    else:
        return Response({"error": f"No company found with this ic_id {ic_id}", 'api': 'get_all_claims_details'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'No_of_claims_by_channel': channels,
                     'percentage_claims_increase': claims_increase,
                     'total_claims_per_year': total_claims_per_year,
                     'No_of_Claims': no_of_claims,
                     'success_and_failure_claims': success_and_failure_claims,
                     'claims_by_HO': claims_by_HO,
                     'total_claims_per_month': monthly_claims,
                     'claims_by_channel': claims_by_channel,
                     }, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_channels_claims(request):
    ic_id = request.data.get('ic_id')
    channel = request.data.get('channel')
    if not ic_id or not channel:
        return Response({'error': "IC_ID and channel must not be empty", 'api': 'get_all_channels_claims'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    insurance_companies_collection = db['insurancecompanies']

    policies_collection = db['policies']
    claims_collection = db['claims']
    company = insurance_companies_collection.find_one({'ic_id': ic_id})
    claim_storage_type = company['claim_storage_type']
    company_name = company['ic_name'].strip()
    if company:
        policies = list(policies_collection.find({'ic_id': ic_id}))
        policy_numbers = [p['policy_number'] for p in policies]
        encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
        encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
        encrypted_key = list(encrypted_policy_number_key.keys())[0]
        if claim_storage_type == 'Database':
            claims = []
            db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
            for claim in db_claims:
                claims.append(Authentication.decrypt_data(claim))
        elif claim_storage_type == 'Excel':
            claims = get_claims_from_excel(company_name)
        elif claim_storage_type == 'CSV':
            claims = get_claims_from_csv(company_name)
        elif claim_storage_type == 'Flat File':
            claims = get_claims_from_flat_file(company_name)
        else:
            return Response({"error": "Invalid claim storage type"}, status=400)
        
        policy_numbers_set = set(policy_numbers)
        claims_details = {}
        for claim in claims:
            if channel == 'FNOL':
                if claim.get('claim_process_document_name') == "Null":
                    policy_number = claim['policy_number']
                    policy_holder_name = ""
                    if policy_number in policy_numbers_set:
                        policy = next((p for p in policies if p['policy_number'] == policy_number), None)
                        if policy:
                            policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                                             policy['pol_middle_name'],
                                                                             policy['pol_last_name']]
                                                           if name and name != "Null" and name != ""])
                    claim_id = claim['claim_id']
                    claim_created_at = claim['claim_created_at']
                    loss_date_and_time = claim['loss_date_and_time']
                    loss_location = [
                        claim.get('street_number', ''),
                        claim.get('street_name', ''),
                        claim.get('loss_city', ''),
                        claim.get('loss_state', ''),
                        claim.get('loss_zip', ''),
                        claim.get('loss_country', '')
                    ]
                    loss_location = " ".join(
                        str(part) for part in loss_location if part is not None and (part != "" and part != "Null"))
                    claims_details[claim_id] = {'policy_holder_name': policy_holder_name,
                                                'policy_number': policy_number,
                                                'claim_id': claim_id, 'claim_created_at': claim_created_at,
                                                'loss_date_and_time': loss_date_and_time,
                                                'loss_location': loss_location}
            elif channel == 'InsurAI':
                if claim.get('claim_process_document_name') == "Claimed Through AI Agent":
                    policy_number = claim['policy_number']
                    policy_holder_name = ""
                    if policy_number in policy_numbers_set:
                        policy = next((p for p in policies if p['policy_number'] == policy_number), None)
                        if policy:
                            policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                                             policy['pol_middle_name'],
                                                                             policy['pol_last_name']]
                                                           if name and name != "Null" and name != ""])
                    claim_id = claim['claim_id']
                    claim_created_at = claim['claim_created_at']
                    loss_date_and_time = claim['loss_date_and_time']
                    loss_location = [
                        claim.get('street_number', ''),
                        claim.get('street_name', ''),
                        claim.get('loss_city', ''),
                        claim.get('loss_state', ''),
                        claim.get('loss_zip', ''),
                        claim.get('loss_country', '')
                    ]
                    loss_location = " ".join(
                        str(part) for part in loss_location if part is not None and (part != "" and part != "Null"))
                    claims_details[claim_id] = {'policy_holder_name': policy_holder_name,
                                                'policy_number': policy_number,
                                                'claim_id': claim_id, 'claim_created_at': claim_created_at,
                                                'loss_date_and_time': loss_date_and_time,
                                                'loss_location': loss_location}

            elif channel == "IDP":
                if (
                        claim.get('claim_process_document_name') != "Claimed Through AI Agent"
                        and claim.get('claim_process_document_name') != "Null"
                        and not claim.get('claim_process_document_name', "").startswith("From_email")
                ):
                    policy_number = claim['policy_number']
                    policy_holder_name = ""
                    if policy_number in policy_numbers_set:
                        policy = next((p for p in policies if p['policy_number'] == policy_number), None)
                        if policy:
                            policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                                             policy['pol_middle_name'],
                                                                             policy['pol_last_name']]
                                                           if name and name != "Null" and name != ""])
                    claim_id = claim['claim_id']
                    claim_created_at = claim['claim_created_at']
                    loss_date_and_time = claim['loss_date_and_time']
                    loss_location = [
                        claim.get('street_number', ''),
                        claim.get('street_name', ''),
                        claim.get('loss_city', ''),
                        claim.get('loss_state', ''),
                        claim.get('loss_zip', ''),
                        claim.get('loss_country', '')
                    ]
                    loss_location = " ".join(
                        str(part) for part in loss_location if part is not None and (part != "" and part != "Null"))
                    claims_details[claim_id] = {'policy_holder_name': policy_holder_name,
                                                'policy_number': policy_number,
                                                'claim_id': claim_id, 'claim_created_at': claim_created_at,
                                                'loss_date_and_time': loss_date_and_time,
                                                'loss_location': loss_location}

        return Response({'claims_details': claims_details}, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_email_to_fnol_claims(request):
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    email_to_fnol_success_collection = db['email_to_fnol_success']
    email_to_fnol_failure_collection = db['email_to_fnol_failure']

    success_data = {}
    edited_success_data = {}  # Initialize edited success data
    failure_data = {}

    success_claims = list(email_to_fnol_success_collection.find())
    failure_claims = list(email_to_fnol_failure_collection.find())

    # Separate success and edited_success claims
    for index, claim in enumerate(success_claims, start=1):
        claim_data = {
            "email_id": claim.get('sender_email', ''),
            "subject": claim.get('subject', ''),
            "body": claim.get('body', ''),
            "email_time": claim.get('email_time', ''),
        }

        if claim.get('status') == 'edited_success':
            edited_success_data[index] = claim_data
        else:  # Assuming all others in this collection are "success"
            success_data[index] = claim_data

    for index, claim in enumerate(failure_claims, start=1):
        failure_data[index] = {
            "email_id": claim.get('sender_email', ''),
            "subject": claim.get('subject', ''),
            "body": claim.get('body', ''),
            "email_time": claim.get('email_time', ''),
            "missing_fields": claim.get('missing_fields', '')
        }

    return Response({
        'success_data': success_data,
        'edited_success_data': edited_success_data,  # Include in response
        'failure_data': failure_data,
        'no_of_success_mails': len(success_data),  # Count only "success"
        'no_of_edited_success_mails': len(edited_success_data),  # New count
        'no_of_failure_mails': len(failure_claims)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_agents_details(request):
    ic_id = request.data.get('ic_id')
    if not ic_id:
        return Response({'error': "IC_ID must not be empty", 'api': 'get_agents_details'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    agents_collection = db['agents']
    policies_collection = db['policies']

    # Use a single query with projection to fetch only required fields
    agents = agents_collection.find(
        {'ic_id': ic_id},
        {'agent_id': 1, 'agent_first_name': 1, 'agent_middle_name': 1, 'agent_last_name': 1, 'agent_mobile': 1,
         'agent_state': 1, '_id': 0}
    )

    agents_dic = {}
    for agent in agents:
        # Use list comprehension for more concise name handling
        agent_id = agent['agent_id']
        policies = list(policies_collection.find({'agent_id': agent_id}))
        full_name = " ".join(name for name in [agent.get("agent_first_name"), agent.get("agent_middle_name"),
                                               agent.get("agent_last_name")] if name and name != "Null")
        agents_dic[agent['agent_id']] = {"agent_name": full_name, "agent_mobile": agent['agent_mobile'],
                                         "agent_state": agent['agent_state'], "No_of_policies_sold": len(policies)}

    return Response({"agents_details": agents_dic}, status=200)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_agent_stats(request):
    agent_id = request.data.get('agent_id')
    if not agent_id:
        return Response({'error': 'agent_id must not be empty', 'api': 'get_agent_stats'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    agent_collection = db['agents']
    current_date = datetime.now().replace(tzinfo=None)  # Make current_date naive
    insurance_companies_collection = db['insurancecompanies']
    policies_collection = db['policies']
    claims_collection = db['claims']
    current_month = datetime.now().month
    current_year = datetime.now().year

    # Fetch agent and company in one query using MongoDB's $lookup
    agent_pipeline = [
        {'$match': {'agent_id': agent_id}},
        {'$lookup': {
            'from': 'insurancecompanies',
            'localField': 'ic_id',
            'foreignField': 'ic_id',
            'as': 'company'
        }},
        {'$unwind': '$company'}
    ]
    result = list(agent_collection.aggregate(agent_pipeline))

    if not result:
        return Response({'error': f'No Agent found with this id {agent_id}', 'api': 'get_agent_stats'}, status=status.HTTP_400_BAD_REQUEST)

    agent = result[0]
    agent['_id'] = str(agent['_id'])
    company = agent.pop('company')
    claim_storage_type = company['claim_storage_type']
    company_name = company['ic_name'].strip()

    # Fetch policies in one query
    policies = list(policies_collection.find({'agent_id': agent_id}))
    policy_numbers = [p['policy_number'] for p in policies]
    encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
    encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
    encrypted_key = list(encrypted_policy_number_key.keys())[0]
    policies_by_HO = {p['policy_number']: p['pol_lob'] for p in policies}
    No_of_policies_by_HO = {f"HO-{i}": 0 for i in range(1, 9)}
    claims_by_HO = {f"HO-{i}": 0 for i in range(1, 9)}
    claims_by_channels = {"FNOL": 0, "IDP_FNOL": 0, "Email-To-FNOL": 0, "AI_AGENT": 0}
    policy_details = {}
    active_policies = 0
    current_month_policies = 0
    current_month_claims = 0
    prev_month_policies = 0
    prev_month_claims = 0
    current_month_active_policies = 0
    prev_month_active_policies = 0

    for policy in policies:
        No_of_policies_by_HO[policy['pol_lob']] += 1
        policy_holder_name = " ".join(
            name for name in [policy.get("pol_first_name"), policy.get("pol_middle_name"), policy.get("pol_last_name")]
            if name and name != "Null")
        policy_details[policy['policy_number']] = {
            "policy_holder_name": policy_holder_name,
            "policy_type": policy['pol_lob'],
            "premium": policy["pro_pol_premium"],
            "mobile": policy["pol_mobile"],
            "eff_date": policy["pro_pol_eff_date"],
            "exp_date": policy["pro_pol_exp_date"]
        }
        policy_expiry_date = parse_datetime(policy.get('pro_pol_exp_date', '')).replace(
            tzinfo=None)  # Make expiry date naive
        policy_effective_date = parse_datetime(policy.get('pro_pol_eff_date', '')).replace(tzinfo=None)
        if policy_expiry_date > current_date:
            active_policies += 1
            if policy_effective_date.year == current_year:
                if policy_effective_date.month == current_month:
                    current_month_active_policies += 1
                elif policy_effective_date.month == current_month - 1:
                    prev_month_active_policies += 1
        policy_date = parse_datetime(policy.get('policy_created_at', ''))
        if policy_date.year == current_year:
            if policy_date.month == current_month:
                current_month_policies += 1
            elif policy_date.month == current_month - 1:
                prev_month_policies += 1

    # Fetch claims (optimized based on storage type)
    if claim_storage_type == 'Database':
        claims = []
        db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
        for claim in db_claims:
            claims.append(Authentication.decrypt_data(claim))
    elif claim_storage_type == 'Excel':
        claims = get_claims_from_excel(company_name)
    elif claim_storage_type == 'CSV':
        claims = get_claims_from_csv(company_name)
    elif claim_storage_type == 'Flat File':
        claims = get_claims_from_flat_file(company_name)
    else:
        return Response({"error": "Invalid claim storage type"}, status=400)

    claims_data = {}
    policy_numbers_set = set(policy_numbers)
    for claim in claims:
        policy_number = claim['policy_number']
        if policy_number in policy_numbers_set:
            policy = next((p for p in policies if p['policy_number'] == policy_number), None)
            if policy:
                policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                                 policy['pol_middle_name'],
                                                                 policy['pol_last_name']]
                                               if name and name != "Null" and name != ""])
                HO_type = policies_by_HO[policy_number]
                claim_date = parse_datetime(claim['claim_created_at']).replace(tzinfo=None)  # Make claim date naive
                date = claim_date.strftime("%Y-%m-%d")
                claims_data[claim['claim_id']] = {
                    "policy_holder_name": policy_holder_name,
                    "policy_number": policy_number,
                    "policy_type": HO_type,
                    "claim_date": date,
                    "claim_id": claim['claim_id']
                }

                claim_process_doc = claim.get('claim_process_document_name', '')
                if claim_process_doc == "Null":
                    claims_by_channels["FNOL"] += 1
                elif claim_process_doc == "Claimed Through AI Agent":
                    claims_by_channels["AI_AGENT"] += 1
                elif claim_process_doc.startswith("From_email"):
                    claims_by_channels["Email-To-FNOL"] += 1
                else:
                    claims_by_channels["IDP_FNOL"] += 1

                claims_by_HO[HO_type] += 1
                if claim_date.year == current_year:
                    # Track current and previous month data
                    if claim_date.month == current_month:
                        current_month_claims += 1
                    elif claim_date.month == current_month - 1:
                        prev_month_claims += 1

    # Calculate percentage increases
    def calculate_percentage_increase(current, previous):
        if previous == 0:
            return 100 if current > 0 else 0
        return ((current - previous) / previous) * 100

    percentage_increases = {
        "policies_increase": calculate_percentage_increase(current_month_policies, prev_month_policies),
        "claims_increase": calculate_percentage_increase(current_month_claims, prev_month_claims),
        "active_policies_increase": calculate_percentage_increase(current_month_active_policies,
                                                                  prev_month_active_policies)
    }

    return Response({
        'No_of_policies_by_HO': No_of_policies_by_HO,
        'policy_details': policy_details,
        'claim_details': claims_data,
        'agent_details': agent,
        'Total_No_of_policies_sold': len(policies),
        'Total_No_of_claims': len(claims_data),
        'claims_by_channels': claims_by_channels,
        'claims_by_HO': claims_by_HO,
        'active_policies': active_policies,
        'percentage_increases': percentage_increases
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_reports(request):
    ic_id = request.data.get('ic_id')
    if not ic_id:
        return Response({'error': 'ic_id should not be empty', 'api': 'get_all_reports'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    insurance_companies_collection = db['insurancecompanies']
    policies_collection = db['policies']
    agents_collection = db['agents']
    claims_collection = db['claims']
    company = insurance_companies_collection.find_one({'ic_id': ic_id})
    company_name = company['ic_name'].strip()
    if company:
        policies = list(policies_collection.find({'ic_id': ic_id}))
        policy_numbers = [p['policy_number'] for p in policies]
        encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
        encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
        encrypted_key = list(encrypted_policy_number_key.keys())[0]
        policy_data = {}
        for policy in policies:
            policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                             policy['pol_middle_name'],
                                                             policy['pol_last_name']]
                                           if name and name != "Null" or name != ""])
            policy_data[policy['policy_number']] = {"policy_holder_name": policy_holder_name,
                                                    "email": policy['pol_email'], "policy_type": policy['pol_lob'],
                                                    "Agent_id": policy['agent_id'],
                                                    "policy_holder_mobile_number": int(policy['pol_mobile']),
                                                    "policy_effective_date": policy['pro_pol_eff_date'],
                                                    "policy_expiry_date": policy['pro_pol_exp_date']}

        agents = list(agents_collection.find({'ic_id': ic_id}))
        agents_details = {}
        for agent in agents:
            agent_id = agent['agent_id']
            agent_policies = len(list(policies_collection.find({'agent_id': agent_id})))
            full_name = " ".join(name for name in [agent.get("agent_first_name"), agent.get("agent_middle_name"),
                                                   agent.get("agent_last_name")] if name and name != "Null")
            agents_details[agent_id] = {"Agent_name": full_name, "No_of_policies": agent_policies,
                                        "Agent_number": int(agent['agent_mobile']), "Agent_state": agent['agent_state'],
                                        "Agent_email": agent["agent_email"]}

        claim_storage_type = company['claim_storage_type']
        if claim_storage_type == 'Database':
            claims = []
            db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
            for claim in db_claims:
                claims.append(Authentication.decrypt_data(claim))
        elif claim_storage_type == 'Excel':
            claims = get_claims_from_excel(company_name)
        elif claim_storage_type == 'CSV':
            claims = get_claims_from_csv(company_name)
        elif claim_storage_type == 'Flat File':
            claims = get_claims_from_flat_file(company_name)
        else:
            return Response({"error": "Invalid claim storage type", 'api': 'get_all_reports'}, status=status.HTTP_400_BAD_REQUEST)

        claims_details = {}
        for claim in claims:
            claim_id = claim['claim_id']
            policy_number = claim['policy_number']
            policy = policies_collection.find_one({'policy_number': policy_number})
            policy_holder_name = " ".join([name for name in [policy['pol_first_name'],
                                                             policy['pol_middle_name'],
                                                             policy['pol_last_name']]
                                           if name and name != "Null" or name != ""])
            agent_id = policy['agent_id']
            agent_details = agents_collection.find_one({'agent_id': agent_id})
            agent_name = " ".join(
                [name for name in [agent_details['agent_first_name'], agent_details['agent_middle_name'],
                                   agent_details['agent_last_name']]
                 if name and name != "Null" or name != ""])
            claim_date = parse_datetime(claim['claim_created_at'])
            date = f"{claim_date.year}-{claim_date.month}-{claim_date.day}"
            claims_details[claim_id] = {"Name": policy_holder_name, "email": policy['pol_email'],
                                        "Type": policy['pol_lob'], "claim_created_at": date,
                                        "policy_number": policy_number, "agent_id": agent_id,
                                        "agent_name": agent_name}

    else:
        return Response({'error': f'No company found with this ic_id: {ic_id}', 'api': 'get_all_reports'}, status=status.HTTP_404_NOT_FOUND)

    return Response({"Policies_data": policy_data,
                     "Agents_data": agents_details,
                     "claims_data": claims_details}, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_verification_for_demo(request):
    email = request.data.get('companyEmail')
    if not email:
        return Response({'error': 'email is not provided'}, status=400)
    verification_code = Sign_in_utils.generate_otp()
    verification_codes[email] = {
        'code': verification_code,
        'timestamp': datetime.now(timezone.utc)
    }
    Sign_in_utils.send_verification_email(email, verification_code)
    return Response({'message': 'Verification email sent successfully'}, status=200)


@api_view(['POST'])
def verify_otp_and_add_demo(request):
    email = request.data.get('companyEmail')
    otp = request.data.get('otp')
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    demo_requests_collection = db['demo_requests']
    if not email or not otp:
        return Response({'error': 'Email and OTP are required', 'api': 'verify_otp_and_add_demo'}, status=status.HTTP_400_BAD_REQUEST)

    stored_code_data = verification_codes.get(email)
    if not stored_code_data:
        return Response({'error': 'Unable to verify, please try again', 'api': 'verify_otp_and_add_demo'}, status=status.HTTP_400_BAD_REQUEST)

    current_time = datetime.now(timezone.utc)
    expiry_time = verification_codes[email].get('timestamp') + timedelta(minutes=5)

    if current_time > expiry_time:
        del verification_codes[email]
        return Response({'error': 'Verification code has expired', 'api': 'verify_otp_and_add_demo'}, status=status.HTTP_400_BAD_REQUEST)

    if verification_codes[email].get('code') == otp:
        del verification_codes[email]
        details = {"first_name": request.data.get('firstName'),
                   "last_name": request.data.get('lastName'),
                   "company_name": request.data.get('companyName'),
                   "company_email": request.data.get('companyEmail'),
                   "mobile_number": request.data.get('mobileNumber'),
                   "job_role": request.data.get('jobtitle'),
                   "reason": request.data.get('reason')}
        demo_requests_collection.insert_one(details)
        Emails.send_demo_alert_email(details)
        return Response({'Message': 'Your details have been added successfully and we will contact you soon.'})
    else:
        return Response({'error': 'Invalid verification code', 'api': 'verify_otp_and_add_demo'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_idp_process_documents(request):
    claim_id = request.data.get('claim_id')
    ic_id = request.data.get('ic_id')
    if not claim_id or not ic_id:
        return Response({'Error': 'claim_id and ic_id should not be empty', 'api': 'get_idp_process_documents'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    insurance_companies_collection = db['insurancecompanies']
    policies_collection = db['policies']
    claims_collection = db['claims']

    company = insurance_companies_collection.find_one({'ic_id': ic_id})
    if not company:
        return Response({'Error': 'Company not found', 'api': 'get_idp_process_documents'}, status=status.HTTP_404_NOT_FOUND)

    policies = list(policies_collection.find({'ic_id': ic_id}))
    policy_numbers = [p['policy_number'] for p in policies]
    encrypted_policy_numbers = Authentication.encrypt_data(policy_numbers)
    encrypted_policy_number_key = Authentication.encrypt_data({'policy_number': 1})
    encrypted_key = list(encrypted_policy_number_key.keys())[0]
    claim_storage_type = company['claim_storage_type']
    company_name = company['ic_name'].strip()

    if claim_storage_type == 'Database':
        claims = []
        db_claims = list(claims_collection.find({encrypted_key:{"$in": encrypted_policy_numbers}},{'_id':0}))
        for claim in db_claims:
            claims.append(Authentication.decrypt_data(claim))
    elif claim_storage_type == 'Excel':
        claims = get_claims_from_excel(company_name)
    elif claim_storage_type == 'CSV':
        claims = get_claims_from_csv(company_name)
    elif claim_storage_type == 'Flat File':
        claims = get_claims_from_flat_file(company_name)
    else:
        return Response({"error": "Invalid claim storage type", 'api': 'get_idp_process_documents'}, status=status.HTTP_400_BAD_REQUEST)

    matching_claim = next((claim for claim in claims if claim['claim_id'] == claim_id), None)
    if not matching_claim:
        return Response({"error": "Claim not found", 'api': 'get_idp_process_documents'}, status=status.HTTP_404_NOT_FOUND)

    claim_process_document_name = matching_claim.get('claim_process_document_name', '')
    claim_process_document_url = matching_claim.get('claim_process_document_url', '')

    if not claim_process_document_name and not claim_process_document_url:
        return Response({"error": "Document not found for the claim", 'api': 'get_idp_process_documents'}, status=status.HTTP_404_NOT_FOUND)

    actual_path = claim_process_document_url.split("/")[-1]
    document_name = claim_process_document_name
    file_path = os.path.join(settings.MEDIA_ROOT, "IDP_files", "process_documents", actual_path)

    if not os.path.exists(file_path):
        return Response({"error": "Document file not found", 'api': 'get_idp_process_documents'}, status=status.HTTP_404_NOT_FOUND)

    try:
        if document_name.lower().endswith(('.docx', '.doc')):
            with docx2python(file_path, html=True) as docx_content:
                html_content = docx_content.text
            html_content = bleach.clean(html_content,
                                        tags=bleach.sanitizer.ALLOWED_TAGS,
                                        attributes=bleach.sanitizer.ALLOWED_ATTRIBUTES)
            encoded_content = html_content
            content_type = 'html'
        elif document_name.endswith('.txt'):
            with open(file_path, 'r') as file:
                html_content = f"<pre>{file.read()}</pre>"
            encoded_content = html_content
            content_type = 'html'
        elif document_name.endswith('.pdf'):
            with open(file_path, 'rb') as file:
                encoded_content = base64.b64encode(file.read()).decode('utf-8')
            content_type = 'pdf'
        elif document_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            with open(file_path, 'rb') as file:
                encoded_content = base64.b64encode(file.read()).decode('utf-8')
            content_type = imghdr.what(file_path)
        else:
            return Response({'error': 'Unsupported file type', 'api': 'get_idp_process_documents'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'document_name': document_name,
            'encoded_content': encoded_content,
            'content_type': content_type
        })
    except Exception as e:
        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_idp_process_documents'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_email_to_fnol_documents(request):
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
                            return Response({'error': 'Unsupported file type', 'api': 'get_email_to_fnol_documents'}, status=status.HTTP_400_BAD_REQUEST)

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
                        return Response({'error': f'Error processing file: {str(e)}', 'api': 'get_email_to_fnol_documents'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    print("7. File not found:", file_path)
                    return Response({'error': 'File not found', 'api': 'get_email_to_fnol_documents'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'File path or document name is missing', 'api': 'get_email_to_fnol_documents'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Email not found', 'api': 'get_email_to_fnol_documents'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@Authentication.authentication_required(allow_refresh=True)
def update_agent_details(request):
    data = request.data.get('dataToSend')
    agent_id = data.get('agent_id')
    del data['agent_id']
    updated_data = data
 
    if not agent_id or not updated_data:
        return Response({'message': 'agent_id and updated_data are required', 'api':'update_agent_details'}, status=status.HTTP_400_BAD_REQUEST)

    object_id_str = get_object_id_from_agent_id(agent_id)
    try:
        agent_id = ObjectId(object_id_str)
    except InvalidId:
        return Response({'message': 'Invalid agent_id format', 'api':'update_agent_details'}, status=status.HTTP_400_BAD_REQUEST)

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    agent_collection = db['agents']

    # Check for duplicate data
    unique_fields = ['agent_mobile', 'agent_email', 'agent_id', 'agent_fax']
    for field in unique_fields:
        if field in updated_data:
            existing_agent = agent_collection.find_one(
                {field: updated_data[field], '_id': {'$ne': agent_id}}
            )
            if existing_agent:
                return Response({'message': f'Agent with this {field} already exists', 'api':'update_agent_details'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = agent_collection.update_one({'_id': agent_id}, {'$set': updated_data})

        if result.matched_count == 0:
            return Response({'message': 'Agent not found', 'api':'update_agent_details'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Agent details updated successfully'}, status=status.HTTP_200_OK)
    except Exception as error:
        return Response({'message': str(error), 'api':'update_agent_details'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_ic_id_for_company_Admin(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required', 'api':'get_ic_id_for_company_Admin'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']
    company = company_collection.find_one({'ic_email': email})
    if not company:
        return Response({'error': 'Company not found', 'api':'get_ic_id_for_company_Admin'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'ic_id': company['ic_id'], 'ic_name': company['ic_name']})


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_ic_email_by_ic_name(request):
    companyName = request.data.get('companyName')
    if not companyName:
        return Response({'error': 'CompanyName is required', 'api':'get_ic_email_by_ic_name'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']
    company = company_collection.find_one({'ic_name': companyName})
    if not company:
        return Response({'error': 'Company not found', 'api': 'get_ic_email_by_ic_name'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'ic_email': company['ic_email']})


