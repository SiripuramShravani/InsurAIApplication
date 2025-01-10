import paramiko
import time
from paramiko.ssh_exception import SSHException, AuthenticationException
from Master_package.master_package_utils import File_handling
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_schemas import PolicyInfo, PropertyInfo, AdditionalInfo, Coverages
from typing import Dict, Any
import re
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser
import imaplib
from langchain_groq import ChatGroq
from email.utils import parsedate_to_datetime
import email
import email.utils
import uuid
from langchain_core.prompts import PromptTemplate
import io
from datetime import datetime, timezone, timedelta
from fpdf import FPDF
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
import smtplib
from django.conf import settings
import logging
from dotenv import load_dotenv
from docx2python import docx2python
import bleach
import base64

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

Llama3_8b = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")

def process_file(sftp: paramiko.SFTPClient, filename: str, SFTP_CONFIG) -> Dict[str, Any]:
    """Process a single file from the SFTP server."""
    file_data = io.BytesIO()
    sftp.getfo(f'{SFTP_CONFIG["remote_folder"]}/{filename}', file_data)
    file_data.seek(0)

    if filename.endswith('.txt'):
        content = file_data.getvalue().decode('utf-8')
    elif filename.endswith('.pdf'):
        content = File_handling.extract_text_from_pdf(file_data)
    elif filename.endswith('.docx'):
        content = File_handling.extract_text_from_docx(file_data)
    else:
        raise ValueError(f"Unsupported file type: {filename}")

    return {'filename': filename, 'content': content}


def move_file(sftp: paramiko.SFTPClient, filename: str, destination: str, SFTP_CONFIG):
    """Move a file to the specified destination subfolder on the SFTP server."""
    try:
        # Ensure the destination subfolder exists
        try:
            sftp.stat(f'{SFTP_CONFIG["remote_folder"]}/{destination}')
        except IOError:
            sftp.mkdir(f'{SFTP_CONFIG["remote_folder"]}/{destination}')

        # Move the file to the destination subfolder
        sftp.rename(f'{SFTP_CONFIG["remote_folder"]}/{filename}',
                    f'{SFTP_CONFIG["remote_folder"]}/{destination}/{filename}')
        logger.info(f"Moved {filename} to {destination}")
    except Exception as e:
        logger.error(f"Error moving file {filename} to {destination}: {str(e)}")
        raise


def create_sftp_client(SFTP_CONFIG, retries=3, delay=5):
    for attempt in range(retries):
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(
                SFTP_CONFIG['host'],
                port=SFTP_CONFIG['port'],
                username=SFTP_CONFIG['username'],
                password=SFTP_CONFIG['password'],
                timeout=30
            )
            sftp = ssh.open_sftp()
            return ssh, sftp
        except (SSHException, AuthenticationException, ConnectionResetError) as e:
            logger.error(f"SFTP connection attempt {attempt + 1} failed: {str(e)}")
            if attempt < retries - 1:
                logger.info(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                logger.error("Max retries reached. Unable to establish SFTP connection.")
                raise


def handle_DocAI_Batch_Quote_Failure(data):
    client, db = MongoDB.get_mongo_client_Batch_processes()
    DocAI_Batch_Quote_Failure_collection = db['DocAI_Batch_Quote_Failure']
    data = DocAI_Batch_Quote_Failure_collection.insert_one(data)


def handle_DocAI_Batch_Quote_Sucess(data):
    client, db = MongoDB.get_mongo_client_Batch_processes()
    DocAI_Batch_Quote_Success_collection = db['DocAI_Batch_Quote_Success']
    DocAI_Batch_Quote_Success_collection.insert_one(data)


def create_policy_info(extracted_data, company_data):
    policy_info_data = extracted_data.get('PolicyInfo', {}).copy()  # Create a copy of the dictionary
    # # Add additional fields to the dictionary
    policy_info_data['policy_from_channel'] = 'IDP_Batch'
    policy_info_data['policy_associated_ic_id'] = company_data.get('ic_id')
    # policy_info_data['policy_holder_ssn'] = str(policy_info_data.get('policy_holder_ssn', ''))
    return policy_info_data


def process_extracted_data_into_dict(extracted_text, company_data):
    policy_info = create_policy_info(extracted_text, company_data)

    property_info_data = extracted_text.get('PropertyInfo', {})

    additional_info_data = extracted_text.get('AdditionalInfo', {})
    additional_info_data['mortgageeZip'] = str(additional_info_data.get('mortgageeZip', ''))
    coverages_data = extracted_text.get('Coverages', {})

    return policy_info, property_info_data, additional_info_data, coverages_data


class PDFReport(FPDF):
    def __init__(self, company_data):
        super().__init__(orientation='L', unit='mm', format='A4')
        self.company_data = company_data
        self.set_margins(10, 20, 10)
        self.primary_color = (41, 128, 185)  # Professional blue
        self.bg_color = (255, 255, 255)  # White background

    def header(self):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*self.primary_color)
        self.cell(0, 15, f'{self.company_data.get("ic_name")}', ln=True, align='C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(*self.primary_color)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

    def add_title(self, title):
        self.set_font('Helvetica', 'B', 24)
        self.set_text_color(*self.primary_color)
        self.cell(0, 20, txt=title, ln=True, align='C')
        self.ln(5)

    def add_section_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*self.primary_color)
        self.cell(0, 10, title, ln=True)
        self.ln(2)

    def add_table(self, headers, rows, max_width=277):
        # Calculate column widths
        col_widths = [self.get_string_width(header) + 6 for header in headers]
        for row in rows:
            for i, cell in enumerate(row):
                col_widths[i] = max(col_widths[i], self.get_string_width(str(cell)) + 6)

        # Adjust column widths if they exceed max_width
        total_width = sum(col_widths)
        if total_width > max_width:
            scale_factor = max_width / total_width
            col_widths = [width * scale_factor for width in col_widths]

        # Draw header
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(*self.primary_color)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, align='C', fill=True)
        self.ln()

        # Draw rows
        self.set_font('Helvetica', '', 10)
        self.set_text_color(0, 0, 0)
        for row in rows:
            for i, item in enumerate(row):
                self.cell(col_widths[i], 8, str(item), border=1, align='C')
            self.ln()
        self.ln(5)

    def add_dynamic_table(self, headers, rows, max_width=277):
        self.set_font('Helvetica', '', 10)

        # Calculate column widths
        col_widths = [self.get_string_width(header) + 6 for header in headers]
        for row in rows:
            for i, cell in enumerate(row):
                content = self.format_cell_content(cell)
                col_widths[i] = max(col_widths[i], max(self.get_string_width(line) for line in content.split('\n')) + 6)

        # Adjust column widths if they exceed max_width
        total_width = sum(col_widths)
        if total_width > max_width:
            scale_factor = max_width / total_width
            col_widths = [width * scale_factor for width in col_widths]

        # Draw header
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(*self.primary_color)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, align='C', fill=True)
        self.ln()

        # Draw rows
        self.set_font('Helvetica', '', 10)
        self.set_text_color(0, 0, 0)
        for row in rows:
            row_height = self.get_row_height(row, col_widths)
            start_x = self.get_x()
            start_y = self.get_y()
            for i, item in enumerate(row):
                content = self.format_cell_content(item)
                self.rect(start_x, start_y, col_widths[i], row_height)
                self.set_xy(start_x, start_y)
                self.multi_cell(col_widths[i], 5, content, align='L')
                start_x += col_widths[i]
            self.ln(row_height)

    def get_row_height(self, row, col_widths):
        max_height = 0
        for item, width in zip(row, col_widths):
            content = self.format_cell_content(item)
            lines = content.split('\n')
            height = len(lines) * 5  # 5 is the line height
            max_height = max(max_height, height)
        return max_height + 2  # Add a small padding

    def format_cell_content(self, content):
        if isinstance(content, list):
            return "\n".join(f"- {item}" for item in content)
        return str(content)


def create_pdf_report(report, success_files, failure_files, folder, company_data, sftp, SFTP_CONFIG):
    now_utc = datetime.now(timezone.utc)
    formatted_datetime = now_utc.strftime("%Y.%m.%d %H:%M:%S UTC")
    pdf = PDFReport(company_data)
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Title Section
    pdf.add_title(f"{formatted_datetime} - Batch Processing Report")

    # Summary Table
    pdf.add_section_title("Summary")
    summary_data = [
        ["Total Files Processed", str(report['total_files'])],
        ["Successful Files", str(report['success'])],
        ["Failed Files", str(report['failure'])]
    ]
    pdf.add_table(["Attribute", "Count"], summary_data)

    # Success Section
    if success_files:
        pdf.add_section_title("Successful Files")
        success_data = [
            [file.get('customer_name', 'N/A'),
             file.get('policy_holder_email', 'N/A'),
             file.get('selected_policy', 'N/A'),
             file.get('quote_number', 'N/A'),
             file.get('quote_amount', 'N/A'),
             file.get('filename', 'Unknown')]
            for file in success_files
        ]
        pdf.add_table(["Customer Name", "Customer Email", "Selected Policy", "Quote Number", "Quote Amount", "File Name"],
                      success_data)

    # Failure Section
    if failure_files:
        pdf.add_page()  # Start failure section on a new page
        pdf.add_section_title("Failed Files")
        failure_data = [
            [failure.get('policy_holder_name', 'N/A'),
             failure.get('policy_holder_email', 'N/A'),
             failure.get('policy_holder_mobile', 'N/A'),
             failure.get('filename', 'Unknown'),
             failure.get('reason', 'N/A')]
            for failure in failure_files
        ]
        pdf.add_dynamic_table(["Customer Name", "Customer Email", "Customer Mobile", "File Name", "Failure Reasons"],
                              failure_data)

    # Save and upload PDF
    filename = f"Batch_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    report_dir = os.path.join(settings.MEDIA_ROOT, "reports")
    os.makedirs(report_dir, exist_ok=True)
    local_report_path = os.path.join(report_dir, filename)
    pdf.output(local_report_path)

    sftp_report_path = f'{SFTP_CONFIG["remote_folder"]}/{folder}/{filename}'
    with open(local_report_path, 'rb') as file:
        sftp.putfo(file, sftp_report_path)

    logger.info(f"PDF report saved locally to {local_report_path} and on SFTP to {sftp_report_path}")
    return local_report_path, sftp_report_path


def send_report_email(report: Dict[str, int], report_path, EMAIL_CONFIG):
    """Send a highly professional email report of the batch job results."""
    now_utc = datetime.now(timezone.utc)
    formatted_datetime = now_utc.strftime("%B %d, %Y %H:%M:%S UTC")

    subject = "IDP Submission Batch Job Report"

    # Calculate percentages and other metrics
    total = report['success'] + report['failure']
    success_percent = round((report['success'] / total) * 100, 1) if total > 0 else 0
    failure_percent = round(100 - success_percent, 1)
    processing_rate = round(total / report['processing_time'], 2) if report['processing_time'] > 0 else 0

    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a5f7a; font-size: 28px; margin: 0;">IDP Submission Batch Job Report</h1>
                <p style="color: #666666; font-size: 14px; margin-top: 5px;">{formatted_datetime}</p>
            </div>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h2 style="color: #1a5f7a; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Summary</h2>
                <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div style="flex: 1;">
                        <div style="font-size: 24px; font-weight: bold; color: #1a5f7a;">{report['total_files']}</div>
                        <div style="font-size: 14px; color: #666666;">Total Files</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 24px; font-weight: bold; color: #28a745;">{report['success']}</div>
                        <div style="font-size: 14px; color: #666666;">Successful</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc3545;">{report['failure']}</div>
                        <div style="font-size: 14px; color: #666666;">Failed</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="color: #1a5f7a; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Performance Metrics</h2>
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span style="font-size: 14px; color: #666666;">Success Rate</span>
                        <span style="font-size: 14px; font-weight: bold; color: #28a745;">{success_percent}%</span>
                    </div>
                    <div style="background-color: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="width: {success_percent}%; height: 100%; background-color: #28a745;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span style="font-size: 14px; color: #666666;">Failure Rate</span>
                        <span style="font-size: 14px; font-weight: bold; color: #dc3545;">{failure_percent}%</span>
                    </div>
                    <div style="background-color: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="width: {failure_percent}%; height: 100%; background-color: #dc3545;"></div>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 14px; color: #666666;">Processing Rate</span>
                        <span style="font-size: 14px; font-weight: bold; color: #1a5f7a;">{processing_rate} files/second</span>
                    </div>
                </div>
            </div>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                <h2 style="color: #1a5f7a; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Additional Information</h2>
                <ul style="padding-left: 20px; margin: 0;">
                    <li style="color: #666666; margin-bottom: 10px;">Total processing time: {report['processing_time']} seconds</li>
                    <li style="color: #666666; margin-bottom: 10px;">Average processing time per file: {round(report['processing_time'] / total, 3) if total > 0 else 0} seconds</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 12px; color: #999999;">This is an automated report. For any queries, please contact the IT department.</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MIMEMultipart('alternative')
    message['Subject'] = subject
    message['From'] = EMAIL_CONFIG['sender_email']
    message['To'] = EMAIL_CONFIG['recipient_email']

    # Attach both plain text and HTML versions
    text_content = f"""
    IDP Submission Batch Job Report

    Generated on: {formatted_datetime}

    Summary:
    - Total Files: {report['total_files']}
    - Successful submissions: {report['success']}
    - Failed submissions: {report['failure']}

    Performance Metrics:
    - Success Rate: {success_percent}%
    - Failure Rate: {failure_percent}%
    - Processing Rate: {processing_rate} files/second

    Additional Information:
    - Total processing time: {report['processing_time']} seconds
    - Average processing time per file: {round(report['processing_time'] / total, 3) if total > 0 else 0} seconds

    This is an automated report. For any queries, please contact the IT department.
    """

    message.attach(MIMEText(text_content, 'plain'))
    message.attach(MIMEText(html_content, 'html'))
    # Attach the PDF report from the FTP
    filename = f"Batch_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    with open(report_path, 'rb') as file:
        attachment = MIMEApplication(file.read(), _subtype='pdf')
        attachment.add_header('Content-Disposition', 'attachment', filename=filename)
        message.attach(attachment)

    with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
        server.starttls()
        server.login(EMAIL_CONFIG['sender_email'], EMAIL_CONFIG['sender_password'])
        server.send_message(message)


def move_data_to_collection(db, data, destination_collection):
    """Moves email data from one MongoDB collection to another."""
    try:
        db[destination_collection].insert_one(data)
        logger.info(f"Email data moved to '{destination_collection}'")
        return {'success': True, 'message': f"Data moved to '{destination_collection}'"}
    except Exception as e:
        logger.error(f"Error moving email data to MongoDB: {e}")
        return {'success': False, 'message': str(e)}
    

def move_attachments_to_folder(file_name, current_folder, destination_folder, ic_id):
    fnol_client, fnol_db = MongoDB.get_mongo_client_innoclaimfnol()
    companies_collection = fnol_db['insurancecompanies']
    company_data = companies_collection.find_one({'ic_id': ic_id})
    if not company_data:
        return {'success': False, 'message': f"No company found with ic_id: {ic_id}"}

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

        current_path = f"{SFTP_CONFIG['remote_folder']}/{current_folder}/{file_name}"
        destination_path = f"{SFTP_CONFIG['remote_folder']}/{destination_folder}/{file_name}"

        if file_name not in sftp.listdir(f"{SFTP_CONFIG['remote_folder']}/{current_folder}"):
            return {'success': False, 'message': f"File {file_name} not found in {current_folder}"}

        sftp.rename(current_path, destination_path)

        logger.info(f"Successfully moved {file_name} from {current_folder} to {destination_folder}")
        return {'success': True, 'message': "File moved successfully"}

    except Exception as e:
        logger.error(f"Failed to move file {file_name}: {str(e)}")
        return {'success': False, 'message': str(e)}

    finally:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()


def save_email_data_to_mongodb(email_data):
    """Saves email data to the "email_to_fnol" MongoDB collection."""

    client, db = MongoDB.get_mongo_client_Batch_processes()
    collection = db['DocAI_Classify']

    try:
        result = collection.insert_one(email_data)
        print(f"Saved email data to MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error saving email data to MongoDB: {e}")


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
        if file_name:
            original_filename, original_extension = os.path.splitext(file_name)
            new_filename = f"{unique_id}{original_extension}"
            folder_path = os.path.join(settings.MEDIA_ROOT, download_folder)

            # Create the folder if it doesn't exist
            os.makedirs(folder_path, exist_ok=True)

            file_path = os.path.join(folder_path, new_filename)
            save_path = os.path.join(settings.MEDIA_URL, download_folder)
            save_path += f"/{new_filename}"
            process_document_name.append(file_name)
            process_document_url.append(save_path)
            with open(file_path, 'wb') as f:
                f.write(part.get_payload(decode=True))
            print(f"Saved attachment: {file_name} to {folder_path}")

    return process_document_name, process_document_url


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

                    process_document_name, process_document_url = save_attachments(msg, "DocAI_Classify")
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


class ClassificationData(BaseModel):
    claim_document: bool = Field(default_factory=bool)
    medical_bill: bool = Field(default_factory=bool)
    policy_document: bool = Field(default_factory=bool)


classification_parser = JsonOutputParser(pydantic_object=ClassificationData)


def classification_agent(extracted_text):
    prompt = PromptTemplate(
        template='''You are an expert at document classification
        and your job is to classify the given document based on the given extracted details.
        if the document content related to Claim you have to provide "True" for the document and remaining all "False",
        Similarly if the document content related to Opening a new Policy or Quote and then provide "True" for policy_document
        and "False" for remaining ones, and also if the document content related to Medical_Bill then provide "True"
        for that medical_bill and "False" for remaining documents, follow the output pattern with these below
        instructions:
        {format_instructions}

        Extracted Text:
        {extracted_text}''',

        input_variables=["extracted_text"],
        partial_variables={"format_instructions": classification_parser.get_format_instructions()}
    )
    chain = prompt | Llama3_8b | classification_parser
    try:
        response = chain.invoke({
            "extracted_text": extracted_text
        })
        return response
    except Exception as e:
        error_message = str(e)
        print('error Message: ', error_message)
        # Improved Regex to capture more data types
        extracted_data = dict(re.findall(r'"([^"]+)":\s*("?[^",\n}]+"?|\d+)', error_message))
        if extracted_data:
            for key, value in extracted_data.items():
                # Remove leading/trailing quotes
                extracted_data[key] = value.strip('"')
                # Convert to integer if possible
                if extracted_data[key].isdigit():
                    extracted_data[key] = int(extracted_data[key])
            return extracted_data
        else:
            return {"error": "Could not extract data from error message"}
        

def get_object_data(file_path, document_name):
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

            # Encode content as base64 (if needed - for PDF)
            if content_type == 'pdf':
                encoded_content = encoded_content
            else:  # For HTML, don't base64 encode
                encoded_content = html_content
            return encoded_content
        except Exception as e:
            print("6. Error processing file:", e)