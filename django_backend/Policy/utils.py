import os
import uuid
from django.conf import settings
from Master_package.master_package_databases import MongoDB
import imaplib
import email
from email.utils import parsedate_to_datetime
from shutil import move
from Master_package.master_package_utils import Ai_utils, Policy_utils, File_handling, Address_validations
from PIL import Image
import base64
from io import BytesIO
from rest_framework.response import Response
from rest_framework import status



def save_attachments(msg, download_folder):
    """Extracts and saves attachments from an email message."""
    process_document_name = []
    process_document_url = []
    for part in msg.walk():
        if part.get_content_maintype() == 'multipart':
            continue
        if part.get('Content-Disposition') is None:
            continue
        file_name = part.get_filename()
        unique_id = str(uuid.uuid4())
        folder_path = ""
        if file_name:
            original_filename, original_extension = os.path.splitext(file_name)
            new_filename = f"{unique_id}{original_extension}"
            if file_name.endswith(('.pdf', '.docx', '.txt')):
                folder_path = os.path.join(settings.MEDIA_ROOT, download_folder, "process_documents")
            else:
                pass

            # Create the folder if it doesn't exist
            if folder_path:
                os.makedirs(folder_path, exist_ok=True)
                file_path = os.path.join(folder_path, new_filename)
                if folder_path.endswith("process_documents"):
                    save_path = os.path.join(settings.MEDIA_URL, download_folder)
                    save_path += f"/process_documents"
                    save_path += f"/{new_filename}"
                    process_document_name.append(file_name)
                    process_document_url.append(save_path)
                else:
                    pass
                with open(file_path, 'wb') as f:
                    f.write(part.get_payload(decode=True))
                print(f"Saved attachment: {file_name} to {folder_path}")

    return process_document_name, process_document_url


def save_email_data_to_mongodb(email_data):
    """Saves email data to the "email_to_policy_intake" MongoDB collection."""
    client, db = MongoDB.get_mongo_client_Policy_intake()
    collection = db['email_to_policy_intake']

    try:
        result = collection.insert_one(email_data)
        print(f"Saved email data to MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error saving email data to MongoDB: {e}")


def parse_and_save_emails(email_user, email_password):
    """Parses emails, saves data to MongoDB, and returns a list of sender emails."""
    sender_emails = []
    try:
        M = imaplib.IMAP4_SSL('imap.gmail.com')
        M.login(email_user, email_password)
        M.select("Inbox")

        rv, data = M.search(None, "UNSEEN")
        if rv == 'OK':
            for num in data[0].split():
                rv, data = M.fetch(num, '(RFC822)')
                if rv == 'OK':
                    msg = email.message_from_bytes(data[0][1])
                    sender_name, sender_email = email.utils.parseaddr(msg['from'])
                    sender_emails.append([sender_email, msg['subject']])

                    body = ""
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            body += part.get_payload()

                    # Extract the email time
                    email_time = parsedate_to_datetime(msg['Date'])

                    process_document_name, process_document_url = save_attachments(
                        msg, "email_to_policy_intake")
                    email_data = {
                        'subject': msg['subject'],
                        'body': body,
                        'sender_email': sender_email,
                        'email_time': email_time,  # Add the email time to the data
                        'process_document_name': process_document_name,
                        'process_document_url': process_document_url,
                    }
                    save_email_data_to_mongodb(email_data)
                else:
                    print("ERROR getting message", num)

        else:
            print("No messages found!")
        M.close()
        M.logout()
        return sender_emails

    except Exception as e:
        print(f"Error during email parsing: {e}")
        raise  # Re-raise to be handled in the view


def move_email_data_to_collection(db, email_data, destination_collection_name):
    """Moves email data from one MongoDB collection to another."""
    try:
        db[destination_collection_name].insert_one(email_data)
        print(f"Email data moved to '{destination_collection_name}'")
    except Exception as e:
        print(f"Error moving email data to MongoDB: {e}")


def move_attachments_to_folder(source_url, destination_folder, subfolder, last_sub_folder):
    """Moves an attachment from source to destination within a specific subfolder."""
    source_path = os.path.join(settings.MEDIA_ROOT, source_url[len(settings.MEDIA_URL):])
    destination_path = os.path.join(settings.MEDIA_ROOT, destination_folder, subfolder, last_sub_folder,
                                    source_url.split('/')[-1])
    source_path = os.path.normpath(source_path)
    destination_path = os.path.normpath(destination_path)
    source_path = source_path.replace("/", r"\\")
    destination_path = destination_path.replace("/", r"\\")

    try:
        move(source_path, destination_path)
        print(f"Moved file from '{source_path}' to '{destination_path}'")
    except FileNotFoundError:
        print(f"Error: File not found at '{source_path}'")
    except Exception as e:
        print(f"Error moving file: {e}")


def handle_failure(db, email, process_document_name, process_document_url, missing_fields, sender_email, subject,
                   collection, policy_holder_name):
    if sender_email and missing_fields:
        # send_claim_failure_email(sender_email,missing_fields, policy_holder_name)
        print(f"Failure email sent to {sender_email} due to unseen errors.")

    move_email_data_to_collection(db, email, 'email_to_policy_intake_failure')
    collection.delete_one({'_id': email['_id']})
    print(f"Email with subject '{subject}' deleted from MongoDB.")
    # Delete the processed PDF file
    if process_document_name and process_document_url:
        move_attachments_to_folder(process_document_url, 'email_to_policy_intake', 'email_to_policy_intake_failure','process_documents')
 

def move_attachments_to_folder_edit(source_url, destination_folder, subfolder, last_sub_folder):
    """Moves an attachment from source to destination within a specific subfolder."""
    source_path = os.path.join(settings.MEDIA_ROOT, 'email_to_policy_intake', 'email_to_policy_intake_failure',
                               last_sub_folder,
                               source_url.split('/')[-1])
    destination_path = os.path.join(settings.MEDIA_ROOT, destination_folder, subfolder, last_sub_folder,
                                    source_url.split('/')[-1])

    source_path = os.path.normpath(source_path)
    destination_path = os.path.normpath(destination_path)
    source_path = source_path.replace("/", r"\\")
    destination_path = destination_path.replace("/", r"\\")

    try:
        move(source_path, destination_path)
        print(f"Moved file from '{source_path}' to '{destination_path}'")
    except FileNotFoundError:
        print(f"Error: File not found at '{source_path}'")
    except Exception as e:
        print(f"Error moving file: {e}")

def handle_image(file_content):
    img = Image.open(BytesIO(file_content))
    base64_image = image_to_base64(img)
    return Response({'image': [base64_image]}, status=status.HTTP_200_OK)

def image_to_base64(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')
 
def handle_pdf_images(file_content):
    images_data = File_handling.extract_images_from_pdf(BytesIO(file_content))
    return [base64.b64encode(img).decode('utf-8') for img in images_data]
 
def validate_and_update_addresses(extracted_text):
    policy_info = extracted_text.get('PolicyInfo', {})
    property_info = extracted_text.get('PropertyInfo', {})
   
    if not policy_info or not property_info:
        return
   
    policy_holder_address = Address_validations.format_address(policy_info, 'policy_holder')
    property_address = Address_validations.format_address(property_info, 'CoverageLocation')
   
    if policy_holder_address and not property_address:
        property_address = policy_holder_address
        property_info.update({
            'CoverageLocation_street_number': policy_info.get('policy_holder_street_number', ''),
            'CoverageLocation_street_name': policy_info.get('policy_holder_street_name', ''),
            'CoverageLocation_city': policy_info.get('policy_holder_city', ''),
            'CoverageLocation_state': policy_info.get('policy_holder_state', ''),
            'CoverageLocation_zip': policy_info.get('policy_holder_zip', ''),
            'CoverageLocation_country': policy_info.get('policy_holder_country', '')
        })
   
    policy_info['validated_address'] = Address_validations.validate_address(policy_holder_address)
    property_info['validated_address'] = Address_validations.validate_address(property_address)
   
    if policy_info['validated_address'] != "Address Not validated":
        policy_info['splitted_address'] = Address_validations.parse_address(policy_info['validated_address'])
    if property_info['validated_address'] != "Address Not validated":
        property_info['splitted_address'] = Address_validations.parse_address(property_info['validated_address'])
   
    extracted_text['PolicyInfo'] = policy_info
    extracted_text['PropertyInfo'] = property_info
 
def build_response_data(extracted_text, input_tokens, output_tokens, total_tokens, accuracy, reason):
    return {
        'extracted_text': extracted_text,
        'policy_holder_splitted_address': extracted_text['PolicyInfo'].get('splitted_address', ''),
        'property_splitted_address': extracted_text['PropertyInfo'].get('splitted_address', ''),
        'input_tokens': input_tokens,
        'output_tokens': output_tokens,
        'total_tokens': total_tokens,
        'accuracy': accuracy,
        'reason': reason
    }    
