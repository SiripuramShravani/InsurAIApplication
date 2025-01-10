from django.core.mail import send_mail, EmailMultiAlternatives
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import json
import logging
from .models import get_mongo_client
from datetime import datetime
import pytz  # Import pytz for timezone handling
import traceback
import platform
import sys
from django.template.loader import render_to_string
from django.utils.html import strip_tags

# Set up logging
logger = logging.getLogger(__name__)  

def parse_error_location(stack_trace):
    """Parse error location from stack trace"""    
    try:
        if stack_trace:
            stack_lines = stack_trace.split('\n') 
            for line in stack_lines:
                if 'at' in line and not ('node_modules' in line or 'webpack' in line):
                    parts = line.strip().split('at ')[1]
                    if '(' in parts:
                        file_info = parts.split('(')[1].replace(')', '')
                    else:
                        file_info = parts

                    location_parts = file_info.split(':')
                    return {
                        'file': location_parts[0],
                        'line_number': location_parts[1] if len(location_parts) > 1 else 'unknown',
                        'column': location_parts[2] if len(location_parts) > 2 else 'unknown',
                        'full_trace': stack_trace
                    }
    except Exception as e:
        logger.error(f"Error parsing stack trace: {str(e)}")
    
    return None

@csrf_exempt
def send_error_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            error_message = data.get("errorMessage")
            error_source = data.get("errorSource", "Unknown")
            user_ip = get_client_ip(request)
            username = data.get("username", 'Anonymous')  # Get the username from the request data
            print('username : ',username) 
            file_name = data.get("fileName", "No file uploaded")  # Get the file name
            file_type = data.get("fileType", "Unknown type")  # Get the file type
            request_method = request.method
            request_url = request.build_absolute_uri()

            # Get the current date and time in IST
            india_timezone = pytz.timezone('Asia/Kolkata')
            current_time = datetime.now(india_timezone).strftime("%Y-%m-%d %H:%M:%S")
            email_subject = f"{current_time} Innovontek Error Notification"

            # Render the HTML email template
            html_content = render_to_string('error_email_template.html', {
                'error_message': error_message,
                'error_source': error_source,
                'user_ip': user_ip,
                'username': username,
                'request_method': request_method,
                'request_url': request_url,
                'file_name': file_name,  # Include the file name
                'file_type': file_type,  # Include the file type 
            })
            plain_message = strip_tags(html_content)

            # Create and send the email
            email = EmailMultiAlternatives(
                subject=email_subject,
                body=plain_message,
                # from_email='armoorravikiran2@gmail.com',
                to=['armoorravikiran1617@gmail.com','shravani.siripuram@innovontek.com'],
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)

            # Save error with detailed information
            save_error_to_mongo(data, user_ip, username, request_method, request_url)

            return JsonResponse({'message': 'Error logged successfully'}, status=200)

        except Exception as e:
            logger.error(f"Error in send_error_email: {str(e)}")
            return JsonResponse({'error': 'Failed to process error'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

 

def save_error_to_mongo(error_data, user_ip, username, request_method, request_url):
    try:
        client, db = get_mongo_client()
        error_collection = db['error_logs']

        # Extract the required fields from error_data
        error_message = error_data.get('errorMessage', 'Unknown error')
        error_source = error_data.get('errorSource', 'Unknown source')
        file_name = error_data.get('fileName', 'No file uploaded')  # Get the file name
        file_type = error_data.get('fileType', 'Unknown type')  # Get the file type
        timestamp = datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()  # Get the current timestamp in IST

        # Create a structured error document
        error_document = {
            'timestamp': timestamp,
            'user_ip': user_ip,
            'username': username,
            'error_source': error_source,
            'error_message': error_message,
            'request_method': request_method,
            'request_url': request_url,
            'file_name': file_name,  # Include the file name
            'file_type': file_type   # Include the file type
        }

        # Insert the error document into MongoDB
        result = error_collection.insert_one(error_document)
        logger.info(f"Error log saved with ID: {result.inserted_id}")

        client.close()

    except Exception as e:
        logger.error(f"Error saving to MongoDB: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")

def get_client_ip(request):
    """Helper function to extract the client's IP address from the request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_csrf_token(request):
    """Return a dummy token since CSRF is disabled for send_error_email."""
    return JsonResponse({'csrfToken': 'dummy_csrf_token'})
