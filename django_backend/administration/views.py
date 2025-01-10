from Master_package.master_package_databases import MongoDB
from Master_package.master_package_security import Authentication
from Master_package.master_package_schemas import User_details, RefreshTokenDetails
from Master_package.master_package_utils import Sign_in_utils
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta, timezone
import jwt
import logging
import pytz
from django.conf import settings
verification_codes = {}
logger = logging.getLogger(__name__)



@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_roles(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        roles_collection = db['roles']  # Access collection using square brackets

        # Retrieve all documents (roles) from the collection
        roles = list(roles_collection.find({}, {'_id': 0}))  # Exclude _id field

        return Response(roles, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def update_role(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        roles_collection = db['roles']
        updated_role_data = request.data.get('editedRole')
        role_to_update = request.data.get('old_role', '')

        if not role_to_update:
            return Response({'error': "Role should not be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Find the document to update (assuming you have a field like 'name' to identify the role)
        existing_role = roles_collection.find_one({'role': role_to_update})
        if not existing_role:
            return Response({'error': f"Role '{role_to_update}' not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update the document with the new data
        result = roles_collection.update_one(
            {'role': role_to_update},  # Filter to find the document
            {'$set': updated_role_data}  # Use $set to update fields
        )

        if result.modified_count == 1:
            return Response({'message': f"Role '{role_to_update}' updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to update role'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def add_new_role(request):
    role = request.data.get('role', '')
    access = request.data.get('access', '')
    if not role or not access:
        return Response({'error': 'role or access details should not be empty'},
                        status=status.HTTP_400_BAD_REQUEST)

    description = request.data.get('description', '')
    new_role = {'role': role, 'Description': description, 'Access': access}

    try:
        client, db = MongoDB.get_mongo_client_Administration()
        roles_collection = db['roles']

        # Check if a role with the same name already exists
        existing_role = roles_collection.find_one({'role': role})
        if existing_role:
            return Response({'error': f"Role '{role}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Insert the new role
        result = roles_collection.insert_one(new_role)

        if result.inserted_id:
            return Response({'message': f"Role '{role}' added successfully", 'id': str(result.inserted_id)},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to add new role'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])  # Or use ['DELETE'] if you prefer a DELETE request
@Authentication.authentication_required(allow_refresh=True)
def delete_role(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        roles_collection = db['roles']

        role_to_delete = request.data.get('role')
        if not role_to_delete:
            return Response({'error': 'Role name is required for deletion'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Delete the role document
        result = roles_collection.delete_one({'role': role_to_delete})

        if result.deleted_count == 1:
            return Response({'message': f"Role '{role_to_delete}' deleted successfully"},
                            status=status.HTTP_204_NO_CONTENT)
        elif result.deleted_count == 0:
            return Response({'error': f"Role '{role_to_delete}' not found"},
                            status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Failed to delete role'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def get_all_users(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        users_collection = db['users']  # Access collection using square brackets

        # Retrieve all documents (roles) from the collection
        users = list(users_collection.find({}, {'_id': 0}))  # Exclude _id field

        return Response(users, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def update_user(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        users_collection = db['users']
        updated_user_data = request.data.get('updated_data')
        user_to_update = request.data.get('old_email', '')

        if not user_to_update:
            return Response({'error': "email should not be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Find the document to update (assuming you have a field like 'name' to identify the role)
        existing_role = users_collection.find_one({'email_id': user_to_update})

        if not existing_role:
            return Response({'error': f"user with this email: '{user_to_update}' not found"},
                            status=status.HTTP_404_NOT_FOUND)
        updated_user_data_info = User_details(**updated_user_data)
        updated_user_data_dict = updated_user_data_info.dict()
        # Update the document with the new data
        result = users_collection.update_one(
            {'email_id': user_to_update},  # Filter to find the document
            {'$set': updated_user_data_dict}  # Use $set to update fields
        )

        if result.modified_count == 1:
            return Response({'message': f"user with the email: '{user_to_update}' updated successfully"},
                            status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to update user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def add_new_user(request):
    email_id = request.data.get('email_id', '')
    mobile_number = request.data.get('mobile_number', '')
    if not email_id or not mobile_number:
        return Response({'error': 'email_id and mobile_number details should not be empty'},
                        status=status.HTTP_400_BAD_REQUEST)

    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    role = request.data.get('role', '')
    company_name = request.data.get('company_name', '')
    new_user_data = {'first_name': first_name,
                     'last_name': last_name,
                     'mobile_number': mobile_number,
                     'email_id': email_id,
                     'role': role,
                     'company_name': company_name}
    new_user_data_info = User_details(**new_user_data)
    new_user_data_dict = new_user_data_info.dict()
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        users_collection = db['users']

        # Check if a user with the same name already exists
        existing_user = users_collection.find_one({'email_id': email_id})
        if existing_user:
            return Response({'error': f"User with this email_id: '{email_id}' already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Insert the new role
        result = users_collection.insert_one(new_user_data_dict)

        if result.inserted_id:
            return Response({'message': f"User added successfully", 'id': str(result.inserted_id)},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to add new user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@Authentication.authentication_required(allow_refresh=True)
def delete_user(request):
    try:
        client, db = MongoDB.get_mongo_client_Administration()
        users_collection = db['users']

        email_id_to_delete = request.data.get('email_id')
        if not email_id_to_delete:
            return Response({'error': 'email_id is required for deletion'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Delete the role document
        result = users_collection.delete_one({'email_id': email_id_to_delete})

        if result.deleted_count == 1:
            return Response({'message': f"User deleted successfully"},
                            status=status.HTTP_204_NO_CONTENT)
        elif result.deleted_count == 0:
            return Response({'error': f"User with this email: {email_id_to_delete} not found"},
                            status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Failed to delete user'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def single_sign_in(request):
    """
    API endpoint to initiate user login/registration.
    - Checks if the email exists in the database.
    - Sends an OTP to the user's email (if registered or new).
    - Does NOT generate the JWT yet (we do that after OTP verification).
    """
    email_id = request.data.get('email_id')
    if not email_id:
        return Response({'error': 'email_id should not be empty'}, status=status.HTTP_404_NOT_FOUND)
    client, db = MongoDB.get_mongo_client_Administration()
    users_collection = db['users']
    verify_email_id = users_collection.find_one({'email_id': email_id})
    if verify_email_id:
        verification_code = Sign_in_utils.generate_otp()
        verification_codes[email_id] = {
            'code': verification_code,
            'timestamp': datetime.now(timezone.utc)
        }

        Sign_in_utils.send_verification_email(email_id, verification_code)
        return Response({'message': 'OTP sent Successfully to the email_id', 'token': True}, status=status.HTTP_200_OK)
    else:
        return Response({'email_error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def verify_email_otp(request):
    """
    API endpoint to verify the user-entered OTP.
    - If OTP is valid:
        - Generates the JWT.
        - Sets the JWT as an HttpOnly cookie in the response.
        - Sends user data back to the frontend.
    """
    email_id = request.data.get('email_id', '')
    otp = request.data.get('otp', '')
    if not email_id or not otp:
        return Response({'error': 'email_id and otp cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
    client, db = MongoDB.get_mongo_client_Administration()
    users_collection = db['users']
    roles_collection = db['roles']
    verify_email_id = users_collection.find_one({'email_id': email_id})
    if not verify_email_id:
        return Response({'error': 'Invalid email_id'}, status=status.HTTP_400_BAD_REQUEST)
    user_fullname = verify_email_id.get('first_name', '') + " " + verify_email_id.get('last_name', '')
    user_email = verify_email_id.get('email_id', '')
    mobile_number = verify_email_id.get('mobile_number')
    company_name = verify_email_id.get('company_name')
    user_details = {'user_name': user_fullname,
                    'user_email': user_email,
                    'mobile_number': mobile_number,
                    'company_name': company_name,
                    }
    role = verify_email_id.get('role', '')
    if not role:
        return Response({'error': 'Role not found for this user'}, status=status.HTTP_404_NOT_FOUND)
    role_info = roles_collection.find_one({'role': role})
    if not role_info:
        return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
    access = role_info.get('Access', '')
    if not access:
        return Response({'error': "This user doesn't have access to any portals"},
                        status=status.HTTP_400_BAD_REQUEST)
    user_details['Access'] = access
    stored_code_data = verification_codes.get(email_id)
    if not stored_code_data:
        return Response({'error': 'Unable to verify, please try again'}, status=status.HTTP_400_BAD_REQUEST)
    current_time = datetime.now(timezone.utc)
    expiry_time = verification_codes[email_id].get('timestamp') + timedelta(minutes=5)
    if current_time > expiry_time:
        del verification_codes[email_id]
        return Response({'error': 'Verification code has expired'}, status=status.HTTP_408_REQUEST_TIMEOUT)
    if verification_codes[email_id].get('code') == otp:
        del verification_codes[email_id]
        user_data = {
            'email': verify_email_id['email_id'], 
            'user_id': str(verify_email_id['_id']),  
            'role': verify_email_id.get('role', None), 
        }
        access_token = Authentication.generate_jwt_token(user_data, expiration_minutes=120)
        refresh_token = Authentication.generate_refresh_token()
        refresh_tokens_collection = db['refresh_tokens'] 
        refresh_token_data = RefreshTokenDetails(
            refresh_token=refresh_token,
            user_id=str(verify_email_id['_id']),
            device_info=request.headers.get('User-Agent') 
        )
        refresh_tokens_collection.insert_one(refresh_token_data.dict())
        response_data = {
            'message': 'Verification successful',
            'user_data': user_details
        }
        response = Response(response_data, status=status.HTTP_202_ACCEPTED)
        #Access token cookie
        # response.set_cookie(
        #     'access_token',
        #     access_token,
        #     max_age= 2 * 60 * 60,  
        #     httponly=True,
        #     samesite='Strict',   
        #     secure=True,  
        #     domain='innovon.ai'  
        # )
        # #Refresh token cookie
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
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['POST'])
def logout_view(request):
    """
    API endpoint to log out the user.
    - Clears the JWT cookie.
    - Removes the refresh token from the database.
    - Returns a success message.
    """
    refresh_token = request.COOKIES.get('refresh_token') 
    if refresh_token:
        client, db = MongoDB.get_mongo_client_Administration()
        try:
            refresh_tokens_collection = db['refresh_tokens']
            result = refresh_tokens_collection.delete_one({"refresh_token": refresh_token})
            if result.deleted_count == 0:
                print("Warning: Refresh token not found in the database during logout.")
        except Exception as e:
            print(f"Error removing refresh token from database: {str(e)}")
        finally:
            client.close()
    response = Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token', domain=None, path='/', samesite='None')
    response.delete_cookie('refresh_token', domain=None, path='/', samesite='None')
    # response.delete_cookie('access_token', domain='innovon.ai', path='/',samesite='Strict')
    # response.delete_cookie('refresh_token', domain='innovon.ai', path='/',samesite='Strict')
    return response


@api_view(['GET'])
def check_auth_status(request):
    access_token = request.COOKIES.get('access_token')
    if not access_token:
        auth_header = request.headers.get('Authorization')
        if auth_header:  
            if auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]
                print(access_token,'access_tokenaccess_tokenaccess_token')
    refresh_token_from_cookie = request.COOKIES.get('refresh_token')
    logger.info(f"In auth state - Access token: {access_token}, Refresh token: {refresh_token_from_cookie}")

    if not access_token and refresh_token_from_cookie:
        logger.info("No access token, attempting to refresh")
        return Authentication.refresh_token(request)

    if not access_token:
        logger.warning("No access token provided")
        return Response({'error': 'No access token provided'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        payload = jwt.decode(access_token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        logger.info(
            f"Access token decoded successfully for user: {payload} email {payload.get('user_data', {}).get('email')}")
        return Response({'status': 'authenticated'}, status=status.HTTP_200_OK)
    except jwt.ExpiredSignatureError:
        logger.warning("Access token expired, attempting to refresh")
        if refresh_token_from_cookie:
            return Authentication.refresh_token(request)
        else:
            logger.warning("Token expired and no refresh token provided")
            return Response({'error': 'Token expired and no refresh token provided'},
                            status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        logger.warning("Invalid access token")
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(["POST"])
@Authentication.authentication_required(allow_refresh=True)
def save_or_update_draft(request):
    user_email = request.data.get('user_email')
    form_data = request.data.get('form_data')
    current_completed_step = request.data.get('current_completed_step')
    portal_type = request.data.get('portal_type')
    required_fields = ['user_email', 'form_data', 'current_completed_step']
    # Explicitly check for None to handle 0 correctly
    missing_fields = [field for field in required_fields if request.data.get(field) is None]
    if missing_fields:
        return Response({'error': 'Missing required fields', 'missing_fields': missing_fields}, status=status.HTTP_400_BAD_REQUEST)
    try:
        client, db = MongoDB.get_mongo_client_Administration()  
        draft_collection = db["Portals_Draft"]
        update_result = draft_collection.update_one(
            {'user_email': user_email,
             'portal_type': portal_type
            },
            {
                '$set': {
                    'draft_data': form_data,
                    'current_completed_step': current_completed_step,
                    'updated_at': datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%Y-%m-%dT%H:%M:%S%z')
                },
                '$setOnInsert': {  
                    'created_at': datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%Y-%m-%dT%H:%M:%S%z'),
                }
            },
            upsert=True
        )
        if update_result.upserted_id: 
            return Response({'status': 'Draft saved successfully'}, status=status.HTTP_201_CREATED)  
        elif update_result.modified_count > 0: 
            return Response({'status': 'Draft updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Draft not updated'}, status=status.HTTP_304_NOT_MODIFIED)
    except Exception as e:
        print(f"Error saving or updating draft: {e}") 
        return Response({'error': 'Error saving or updating draft'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST"])
@Authentication.authentication_required(allow_refresh=True)
def fetch_draft(request):
    user_email = request.data.get('user_email')
    portal_type = request.data.get('portal_type')
    required_fields = ['user_email', 'portal_type']
    missing_fields = [field for field in required_fields if not request.data.get(field)]
    if missing_fields:
        return Response({'error': 'Missing required fields', 'missing_fields': missing_fields}, status=status.HTTP_400_BAD_REQUEST)
    try:
        client, db = MongoDB.get_mongo_client_Administration()  
        draft_collection = db["Portals_Draft"]
        draft = draft_collection.find_one({
            'user_email': user_email,
            'portal_type': portal_type
        })
        if draft:
            return Response({
                'draft_data': draft.get('draft_data'),  
                'current_completed_step': draft.get('current_completed_step')
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No draft found for this user and portal type. Fresh start.'}, status=status.HTTP_204_NO_CONTENT)  
    except Exception as e:
        print(f"Error fetching draft: {e}") 
        return Response({'error': 'Error fetching draft'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                

