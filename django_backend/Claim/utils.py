from Master_package.master_package_databases import MongoDB
import os
from django.conf import settings
from datetime import datetime
import pandas as pd
import pytz
from datetime import datetime, timedelta
from Master_package.master_package_utils import Claim_utils, Ai_utils, Address_validations, File_handling, Emails


def get_object_id_from_ic_id(ic_id):
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    company_collection = db['insurancecompanies']
    company = company_collection.find_one({'ic_id': ic_id})
    if company:
        return str(company['_id'])
    return None


def get_object_id_from_agent_id(agent_id):
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    agents_collection = db['agents']
    company = agents_collection.find_one({'agent_id': agent_id})
    if company:
        return str(company['_id'])
    return None


def get_claims_from_excel(company_name):
    """Fetches and processes claim data from an Excel file."""
    excel_files_dir = os.path.join(settings.MEDIA_ROOT, 'Excel_sheets')
    file_path = os.path.join(excel_files_dir, f"{company_name}.xlsx")
    print("file_Path", file_path)

    claims = []
    if os.path.exists(file_path):
        try:
            df = pd.read_excel(file_path)

            for index, row in df.iterrows():
                claim = row.to_dict()
                claim['policy_number'] = str(claim.get('policy_number', ''))
                claim['loss_date_and_time'] = str(claim.get('loss_date_and_time', ''))
                claim['loss_type'] = str(claim.get('loss_type', ''))
                claim['loss_property'] = str(claim.get('loss_property', ''))
                claim['loss_damage_description'] = str(claim.get('loss_damage_description', ''))
                claim['street_number'] = str(claim.get('street_number', ''))
                claim['street_name'] = str(claim.get('street_name', ''))
                claim['loss_city'] = str(claim.get('loss_city', ''))
                claim['loss_state'] = str(claim.get('loss_state', ''))
                claim['loss_zip'] = str(claim.get('loss_zip', ''))
                claim['loss_country'] = str(claim.get('loss_country', ''))
                claim['police_fire_contacted'] = bool(claim.get('police_fire_contacted', False))
                claim['report_number'] = str(claim.get('report_number', ''))
                claim['claim_reported_by'] = str(claim.get('claim_reported_by', ''))
                claim['claim_storage_type'] = str(claim.get('claim_storage_type', ''))
                claim['claim_id'] = str(claim.get('claim_id', ''))
                claim['non_insured_contact_details'] = str(claim.get('non_insured_contact_details', ''))
                claim['insured_contact_details'] = str(claim.get('insured_contact_details', ''))
                claim['claim_witness_document_names'] = str(claim.get('claim_witness_document_names', ''))
                claim['claim_witness_document_urls'] = str(claim.get('claim_witness_document_urls', ''))
                claim['claim_process_document_name'] = str(claim.get('claim_process_document_name', ''))
                claim['claim_process_document_url'] = str(claim.get('claim_process_document_url', ''))

                # Handle claim_created_at
                claim_created_at = claim.get('claim_created_at', '')
                if isinstance(claim_created_at, datetime):
                    claim['claim_created_at'] = claim_created_at.strftime('%Y-%m-%d %H:%M:%S')
                else:
                    claim['claim_created_at'] = str(claim_created_at)

                claims.append(claim)

        except Exception as e:
            print(f"Error reading Excel file: {e}")
    else:
        print(f"Excel file not found for {company_name}")

    return claims


def get_claims_from_csv(company_name):
    """Fetches and processes claim data from a CSV file."""
    csv_files_dir = os.path.join(settings.MEDIA_ROOT, 'csv_files')
    file_path = os.path.join(csv_files_dir, f"{company_name}.csv")

    claims = []
    if os.path.exists(file_path):
        try:
            df = pd.read_csv(file_path)

            for index, row in df.iterrows():
                claim = row.to_dict()
                claim['policy_number'] = str(claim.get('policy_number', ''))
                claim['loss_date_and_time'] = str(claim.get('loss_date_and_time', ''))
                claim['loss_type'] = str(claim.get('loss_type', ''))
                claim['loss_property'] = str(claim.get('loss_property', ''))
                claim['loss_damage_description'] = str(claim.get('loss_damage_description', ''))
                claim['street_number'] = str(claim.get('street_number', ''))
                claim['street_name'] = str(claim.get('street_name', ''))
                claim['loss_city'] = str(claim.get('loss_city', ''))
                claim['loss_state'] = str(claim.get('loss_state', ''))
                claim['loss_zip'] = str(claim.get('loss_zip', ''))
                claim['loss_country'] = str(claim.get('loss_country', ''))
                claim['police_fire_contacted'] = bool(claim.get('police_fire_contacted', False))
                claim['report_number'] = str(claim.get('report_number', ''))
                claim['claim_reported_by'] = str(claim.get('claim_reported_by', ''))
                claim['claim_storage_type'] = str(claim.get('claim_storage_type', ''))
                claim['claim_id'] = str(claim.get('claim_id', ''))
                claim['non_insured_contact_details'] = str(claim.get('non_insured_contact_details', ''))
                claim['insured_contact_details'] = str(claim.get('insured_contact_details', ''))
                claim['claim_witness_document_names'] = str(claim.get('claim_witness_document_names', ''))
                claim['claim_witness_document_urls'] = str(claim.get('claim_witness_document_urls', ''))
                claim['claim_process_document_name'] = str(claim.get('claim_process_document_name', ''))
                claim['claim_process_document_url'] = str(claim.get('claim_process_document_url', ''))
                claim['claim_created_at'] = str(claim.get('claim_created_at', ''))
                claims.append(claim)

        except Exception as e:
            print(f"Error reading CSV file: {e}")
    else:
        print(f"CSV file not found for {company_name}")

    return claims


def get_claims_from_flat_file(company_name):
    """Fetches and processes claim data from a fixed-width flat file."""
    flat_files_dir = os.path.join(settings.MEDIA_ROOT, 'flat_files')
    file_path = os.path.join(flat_files_dir, f"{company_name}.txt")

    claims = []
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                for line in f:
                    if line.strip():  # Skip empty lines
                        claim = {}

                        # Define field widths (must match save_to_flat_file)
                        field_widths = {
                            'policy_number': 10,
                            'loss_date_and_time': 19,
                            'loss_type': 30,
                            'loss_property': 221,
                            'loss_damage_description': 500,
                            'street_number': 12,
                            'street_name': 80,
                            'loss_city': 50,
                            'loss_state': 45,
                            'loss_zip': 10,
                            'loss_country': 24,
                            'police_fire_contacted': 4,
                            'report_number': 12,
                            'claim_reported_by': 30,
                            'claim_storage_type': 10,
                            'non_insured_contact_details': 440,
                            'insured_contact_details': 380,
                            'claim_witness_document_names': 75,
                            'claim_witness_document_urls': 75,
                            'claim_process_document_name': 75,
                            'claim_process_document_url': 75,
                            'claim_created_at': 35,
                            'claim_id': 13,
                        }

                        start = 0
                        for field, width in field_widths.items():
                            end = start + width
                            value = line[start:end].strip()
                            claim[field] = value
                            start = end

                        # Type conversions
                        claim['police_fire_contacted'] = bool(claim['police_fire_contacted'])
                        claims.append(claim)

        except Exception as e:
            print(f"Error reading flat file: {e}")
    else:
        print(f"Flat file not found for {company_name}")

    return claims


def parse_datetime(date_string):
    """Parse datetime string to datetime object."""
    print(f"Attempting to parse: {date_string}")

    if isinstance(date_string, datetime):
        print("Input is already a datetime object")
        return date_string

    if not isinstance(date_string, str):
        print(f"Input is not a string, it's a {type(date_string)}")
        return datetime.now(pytz.UTC)

    date_string = date_string.strip()

    formats_to_try = [
        '%Y-%m-%d %H:%M:%S.%f%z',  # Format with microseconds and timezone offset
        '%Y-%m-%dT%H:%M:%S.%f%z',  # ISO format with microseconds and timezone
        '%Y-%m-%dT%H:%M:%S%z',  # ISO format with timezone
        '%Y-%m-%dT%H:%M:%S.%fZ',  # ISO format with microseconds and Z
        '%Y-%m-%dT%H:%M:%SZ',  # ISO format with Z
        '%Y-%m-%d %H:%M:%S.%f',  # Format without timezone
        '%Y-%m-%d %H:%M:%S',  # Format without timezone and microseconds
        '%Y-%m-%d',  # Just date
        '%Y/%m/%d',  # Date with forward slashes
    ]

    for date_format in formats_to_try:
        try:
            dt = datetime.strptime(date_string, date_format)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=pytz.UTC)
            print(f"Successfully parsed using format: {date_format}")
            return dt
        except ValueError:
            print(f"Failed to parse with format: {date_format}")
            continue

    print(f"Warning: Unable to parse date string: {date_string}. Using current date.")
    return datetime.now(pytz.UTC)
 
def verify_policy_and_company(policy_number, pol_date_of_birth=None):
    print("utils details:",policy_number, pol_date_of_birth)
    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    policy_collection = db['policies']  # Assuming your collection name is 'Policy'
    company_collection = db['insurancecompanies']  # Assuming collection name is 'InsuranceCompany'

    try:
        policy = policy_collection.find_one({"policy_number": policy_number})
        print("utils policy",policy)
        if not policy:
            return None, None, 'No user exists with this policy number'
        if pol_date_of_birth != None:
            # Date formatting and comparison (adjust timezone if needed)
            original_date = datetime.strptime(pol_date_of_birth, "%d/%m/%Y").date()
            offset = timedelta(hours=5, minutes=30)  # Assuming UTC+5:30
            formatted_date = (original_date + offset).isoformat()

        if pol_date_of_birth!=None and policy['pol_date_of_birth'] != formatted_date:
            return None, None, 'The date of birth does not match with the records'

        company = company_collection.find_one({"ic_id": policy['ic_id']})
        if not company:
            return None, None, 'Company information not found'

        policy = Claim_utils.convert_objectid_to_str(policy)
        company = Claim_utils.convert_objectid_to_str(company)
        return policy, company, 'Verification successful'

    except Exception as error:
        return None, None, str(error)
