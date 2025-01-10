import logging
import jwt
from datetime import timezone, timedelta, datetime
from .master_package_databases import MongoDB
from django.conf import settings
import secrets
import string
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
import pytz
from dateutil.parser import parse
from bson import ObjectId
import os
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64
 
logger = logging.getLogger(__name__)
load_dotenv()
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')
KEY = bytes.fromhex(ENCRYPTION_KEY)
passphrase = os.getenv('SALT')
salt = os.getenv('PASS_PHRASE')

class Authentication:

    @classmethod
    def authentication_required(cls, view_func=None, allow_refresh=False):
        def decorator(view_func):
            @wraps(view_func)
            def wrapper(request, *args, **kwargs):
                access_token = request.COOKIES.get('access_token')
                 # If access token is empty, check in the Authorization header
                if not access_token:
                    auth_header = request.headers.get('Authorization')
                    if auth_header:
                        if auth_header.startswith('Bearer'):  
                            access_token = auth_header.split(' ')[1]
                     
                if not access_token and allow_refresh:
                    refresh_response = Authentication.refresh_token(request)
                    if refresh_response.status_code == 200:
                        new_access_token = refresh_response.data.get('access_token')
                        new_refresh_token = refresh_response.data.get('refresh_token')
                        if new_access_token and new_refresh_token:
                            response = view_func(request, *args, **kwargs)
                            # Access token cookie
                            # response.set_cookie(
                            #     'access_token',
                            #     new_access_token,
                            #     max_age=2 * 60 * 60,   
                            #     httponly=True,
                            #     samesite='Strict', 
                            #     secure=True,  
                            #     domain='innovon.ai'  
                            # )
                            # # Refresh token cookie
                            # response.set_cookie(
                            #     'refresh_token',
                            #     new_refresh_token,
                            #     max_age=24 * 60 * 60,   
                            #     httponly=True,
                            #     samesite='Strict',   
                            #     secure=True,   
                            #     domain='innovon.ai'  
                            # )
                            # In the view where you set cookies (e.g., login view)
                            response.set_cookie(
                                'access_token',
                                new_access_token,
                                max_age=30 * 60,   
                                httponly=True,
                                samesite='None',  
                                secure=True,   
                                domain='localhost'  
                            )
                            response.set_cookie(
                                'refresh_token',
                                new_refresh_token,
                                max_age=24 * 60 * 60,   
                                httponly=True,
                                samesite='None',   
                                secure=True,   
                                domain='localhost'  
                            )
                            return response
                        else:
                            return refresh_response
                    else:
                        return refresh_response

                if not access_token:
                    return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

                try:
                    payload = jwt.decode(access_token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
                    print("came to authentication check by frontend", access_token, payload)
                    request.user = payload['user_data']
                    return view_func(request, *args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
                except jwt.InvalidTokenError:
                    return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

            return wrapper

        if view_func is not None:
            return decorator(view_func)
        else:
            return decorator

    @classmethod
    def refresh_token(cls, request):
        refresh_token_from_cookie = request.COOKIES.get('refresh_token')
        if not refresh_token_from_cookie:
            refresh_header = request.headers.get('x-refresh-token')
            if refresh_header:
                refresh_token_from_cookie = refresh_header
            logger.info(f"Attempting to refresh token. Refresh token from cookie: {refresh_token_from_cookie}")
    
        if not refresh_token_from_cookie:
            logger.warning("No refresh token provided in cookie")
            return Response({'error': 'No refresh token provided, Authentication required'},
                            status=status.HTTP_401_UNAUTHORIZED)

        client, db = MongoDB.get_mongo_client_Administration()
        refresh_tokens_collection = db['refresh_tokens']
        users_collection = db['users']

        try:
            # Find the token document
            refresh_token_doc = refresh_tokens_collection.find_one({"refresh_token": refresh_token_from_cookie})
            logger.info(f"Database query result for refresh token: {refresh_token_doc}")

            if not refresh_token_doc:
                logger.warning(f"No matching refresh token found in database for: {refresh_token_from_cookie}")
                response = Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
                response.delete_cookie('refresh_token')
                response.delete_cookie('access_token')
                return response

            # Check if the token has expired
            expires_at = parse(refresh_token_doc['expires_at'])
            current_time = datetime.now(pytz.timezone('Asia/Kolkata'))

            if expires_at < current_time:
                logger.warning(
                    f"Refresh token has expired. Token: {refresh_token_from_cookie}, Expiry: {expires_at}, Current time: {current_time}")
                refresh_tokens_collection.delete_one({"refresh_token": refresh_token_from_cookie})
                response = Response({'error': 'Refresh token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
                response.delete_cookie('refresh_token')
                response.delete_cookie('access_token')
                return response

            # Token is valid, proceed with refresh
            user_id = ObjectId(refresh_token_doc['user_id'])
            user = users_collection.find_one({"_id": user_id})

            if not user:
                logger.warning(f"User not found for refresh token: {refresh_token_from_cookie}")
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Generate new tokens
            user_data = {
                'email': user['email_id'],
                'user_id': str(user['_id']),
                'role': user.get('role', None),
            }
            new_access_token = Authentication.generate_jwt_token(user_data, expiration_minutes=120)
            new_refresh_token = Authentication.generate_refresh_token()

            # Update the database with the new refresh token
            new_expires_at = current_time + timedelta(days=1)
 
            # Use update_one with upsert=False to ensure we're only updating an existing document
            update_result = refresh_tokens_collection.update_one(
                {"refresh_token": refresh_token_from_cookie},
                {
                    "$set": {
                        "refresh_token": new_refresh_token,
                        "created_at": current_time.strftime('%Y-%m-%dT%H:%M:%S%z'),
                        "expires_at": new_expires_at.strftime('%Y-%m-%dT%H:%M:%S%z'),
                        "device_info": request.META.get('HTTP_USER_AGENT', '')
                    }
                },
                upsert=False
            )

            if update_result.modified_count == 0:
                logger.error(f"Failed to update refresh token in database. Old token: {refresh_token_from_cookie}")
                return Response({'error': 'Failed to refresh token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            logger.info(
                f"Refresh token updated successfully. Old: {refresh_token_from_cookie}, New: {new_refresh_token}")

            response = Response({
                'status': 'authenticated',
             }, status=status.HTTP_200_OK)
            # Set new cookies
            # response.set_cookie(
            #     'access_token',
            #     new_access_token,
            #     max_age=2 * 60 * 60,  
            #     httponly=True,
            #     samesite='Strict',   
            #     secure=True,  
            #     domain='innovon.ai'   
            # )
            # #  Refresh token cookie
            # response.set_cookie(
            #     'refresh_token',
            #     new_refresh_token,
            #     max_age=24 * 60 * 60,  
            #     httponly=True,
            #     samesite='Strict',   
            #     secure=True, 
            #     domain='innovon.ai' 
            # )
            response.set_cookie(
                'access_token',
                new_access_token,
                max_age=30 * 60,
                httponly=True,
                samesite='None',   
                secure=True, 
                domain=None   
            )
            response.set_cookie(
                'refresh_token',
                new_refresh_token,
                max_age=24 * 60 * 60,
                httponly=True,
                samesite='None',  
                secure=True,  
                domain=None   
            )
            logger.info(f"Token refresh successful for user: {user['email_id']}")
            return response

        except Exception as e:
            logger.error(f"An error occurred while refreshing the token: {str(e)}")
            return Response({'error': 'An error occurred while refreshing the token'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            client.close()

    @classmethod
    def generate_jwt_token(cls, user_data, expiration_minutes=120):
        """
        Generates a JWT token with user data and expiration.
        """
        current_time = datetime.now(timezone.utc)
        payload = {
            'user_data': user_data,
            'exp': current_time + timedelta(minutes=expiration_minutes)
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')
        return token

    @classmethod
    def generate_refresh_token(cls, length=32):
        """
        Generates a cryptographically secure refresh token.

        Args:
            length (int, optional): The desired length of the token. Defaults to 32.

        Returns:
            str: The generated refresh token.
        """
        # Use a strong source of randomness (secrets) and avoid easily guessable characters
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    @staticmethod
    def pkcs7_pad(data: str) -> bytes:
        """Applies PKCS7 padding to a string."""
        padder = padding.PKCS7(128).padder()  # Block size is 128 bits (16 bytes)
        padded_data = padder.update(data.encode()) + padder.finalize()
        return padded_data
 
    @staticmethod
    def pkcs7_unpad(data: bytes) -> str:
        """Removes PKCS7 padding from bytes."""
        unpadder = padding.PKCS7(128).unpadder()  # Block size is 128 bits (16 bytes)
        unpadded_data = unpadder.update(data) + unpadder.finalize()
        return unpadded_data.decode()
 
    @classmethod
    def encrypt_data(cls, data):
        """
        Recursively encrypts data for storing in the database, including nested dictionaries.
       
        Args:
            data (dict): Dictionary that may contain nested dictionaries
           
        Returns:
            dict: Encrypted dictionary with all nested dictionaries also encrypted
        """
        encrypted_data = {}
        cipher = Cipher(algorithms.AES(KEY), modes.ECB(), backend=default_backend())
        if isinstance(data, list):
            encrypted_data_list = []
            for value in data:
                if isinstance(value, list):
                    encrypted_value_list = Authentication.encrypt_data(value)
                    encrypted_data_list.append(encrypted_value_list)
                elif isinstance(value, dict):
                    encrypted_value_dict = Authentication.encrypt_data(value)
                    encrypted_data_list.append(encrypted_value_dict)
                else:
                    encryptor = cipher.encryptor()  # Create a new encryptor for each operation
                    padded_key = Authentication.pkcs7_pad(str(value))  # Proper padding
                    encrypted_value = encryptor.update(padded_key) + encryptor.finalize()
                    encrypted_data_list.append(base64.b64encode(encrypted_value).decode())
            return encrypted_data_list
       
        for key, value in data.items():
            # Encrypt the key
            encryptor = cipher.encryptor()  # Create a new encryptor for each operation
            padded_key = Authentication.pkcs7_pad(key)  # Proper padding
            encrypted_key = encryptor.update(padded_key) + encryptor.finalize()
           
            # If value is a dictionary, recursively encrypt it
            if isinstance(value, dict):
                encrypted_value = Authentication.encrypt_data(value)
            else:
                # Encrypt the value
                padded_value = Authentication.pkcs7_pad(str(value))
                encryptor = cipher.encryptor()  # Create a new encryptor for each operation
                encrypted_value = encryptor.update(padded_value) + encryptor.finalize()
           
            encrypted_data[base64.b64encode(encrypted_key).decode()] = (
                base64.b64encode(encrypted_value).decode() if not isinstance(value, dict) else encrypted_value
            )
       
        return encrypted_data
 
    @classmethod
    def decrypt_data(cls, data):
        """
        Recursively decrypts data from the database, including nested dictionaries.
       
        Args:
            data (dict): Encrypted dictionary that may contain nested dictionaries
           
        Returns:
            dict: Decrypted dictionary with all nested dictionaries also decrypted
        """
        cipher = Cipher(algorithms.AES(KEY), modes.ECB(), backend=default_backend())
        decrypted_data = {}
        if isinstance(data, list):
            decrypted_data_list = []
            for value in data:
                if isinstance(value, list):
                    decrypted_value_list = Authentication.decrypt_data(value)
                    decrypted_data_list.append(decrypted_value_list)
                elif isinstance(value, dict):
                    decrypted_value_dict = Authentication.decrypt_data(value)
                    decrypted_data_list.append(decrypted_value_dict)
                else:
                    decryptor = cipher.decryptor()  # Create a new decryptor for each operation
                    decoded_ciphertext = base64.b64decode(value)
                    decrypted_value = decryptor.update(decoded_ciphertext) + decryptor.finalize()
                    decrypted_value = Authentication.pkcs7_unpad(decrypted_value)
                    decrypted_data_list.append(decrypted_value)
            return decrypted_data_list
       
        for key, value in data.items():
            # Decrypt the key
            decryptor = cipher.decryptor()  # Create a new decryptor for each operation
            decoded_ciphertext = base64.b64decode(key)
            decrypted_key = decryptor.update(decoded_ciphertext) + decryptor.finalize()
            decrypted_key = Authentication.pkcs7_unpad(decrypted_key)
           
            # If value is a dictionary, recursively decrypt it
            if isinstance(value, dict):
                decrypted_value = Authentication.decrypt_data(value)
            else:
                # Decrypt the value
                decryptor = cipher.decryptor()  # Create a new decryptor for each operation
                decoded_ciphertext = base64.b64decode(value)
                decrypted_value = decryptor.update(decoded_ciphertext) + decryptor.finalize()
                decrypted_value = Authentication.pkcs7_unpad(decrypted_value)
           
            decrypted_data[decrypted_key] = decrypted_value
       
        return decrypted_data
   
    @classmethod
    def generate_key_from_passphrase(cls):
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        key = kdf.derive(passphrase.encode())
        hex_key = key.hex()
        return hex_key
 

