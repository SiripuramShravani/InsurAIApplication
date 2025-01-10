from pymongo.errors import CollectionInvalid
from django.core.cache import cache
from pydantic import BaseModel, Field
import json
from langchain_groq import ChatGroq
from Master_package.master_package_databases import MongoDB
from Master_package.master_package_utils import Emails, Ai_utils
import fitz
import uuid
from io import BytesIO
import base64
import re
import imaplib
from django.conf import settings
import email
import email.utils
from email.utils import parsedate_to_datetime
import os
from dotenv import load_dotenv
from datetime import datetime
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain
import pandas as pd
from shutil import move
from bson import ObjectId
from Master_package.master_package_security import Authentication
import pytz
load_dotenv()

Llama3_1_8b = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")
Llama3_70b = ChatGroq(temperature=0.3, model_name="Llama3-70b-8192")
Llama3_8b = ChatGroq(temperature=0, model_name="Llama3-8b-8192")
Llama3_3_70b = ChatGroq(temperature=0.3, model_name="llama-3.3-70b-versatile")

def ensure_user_collection(db, user_email):
    """
    Checks if a collection for the user exists.
    If not, creates it.

    Args:
        db: The MongoDB database object.
        user_email: The user's email address (used as the collection name).

    Returns:
        bool: True if the collection exists or was created successfully,
              False otherwise.
    """

    collection_name = user_email.replace('@', '_').replace('.', '_')  # Sanitize email for collection name

    try:
        db.create_collection(collection_name)
        return True
    except CollectionInvalid as e:
        # Collection already exists
        if "already exists" in str(e):
            return True
        else:
            print(f"Error creating collection: {e}")
            return False
        


def manage_conversation_data(request, message=None, intent=None, verification_status=None, verify_history=None):
    """Manages conversation history, intent, and verification status."""

    user_email = request.data.get('userEmail')

    if not user_email:
        return [], None, None

    cache_key_history = f"chat_history_{user_email}"
    cache_key_intent = f"chat_intent_{user_email}"
    cache_key_verification = f"policy_verification_{user_email}"
    cache_key_verify_history = f"verify_history_{user_email}"

    cached_history = cache.get(cache_key_history)
    conversation_history = json.loads(cached_history) if cached_history else []

    cached_intent = cache.get(cache_key_intent)
    current_intent = cached_intent if cached_intent is not None else "False"

    cached_verification = cache.get(cache_key_verification)
    verification_status = cached_verification if cached_verification is not None else "False"

    cached_verify_history = cache.get(cache_key_verify_history)
    verify_chat_history = json.loads(cached_verify_history) if cached_verify_history else []

    if message:
        conversation_history.append(message)
        cache.set(cache_key_history, json.dumps(conversation_history), timeout=3600)

    if intent is not None:
        current_intent = intent
        cache.set(cache_key_intent, current_intent, timeout=3600)

    if verification_status is not None:
        verification_status = verification_status
        cache.set(cache_key_verification, verification_status, timeout=3600)

    if verify_history:
        verify_chat_history.append(verify_history)
        cache.set(cache_key_verify_history, json.dumps(verify_chat_history), timeout=3600)

    return conversation_history, current_intent, verification_status, verify_chat_history


class Pydantic2(BaseModel):
    policy_number: str = Field(description="Policy number")
    loss_date_and_time: str = Field(description="The loss date and time, Use YYYY/MM/DD HH:MM:SS format")
    loss_type: str = Field(description="The cause for loss")
    street_number: int = Field(description="The street number")
    street_name: str = Field(description="The street name")
    loss_city: str = Field(description="The name of the city")
    loss_state: str = Field(description="The name of the state")
    loss_zip: int = Field(description="The zip/pincode")
    loss_country: str = Field(description="The name of the country")
    police_fire_contacted: bool = Field(description="True/False")
    report_number: str = Field(description="The report number provided by the authorities")
    loss_damage_description: str = Field(description="The loss_damage_description")


class Pydantic3(BaseModel):
    policy_number: str = Field(description="Policy number")
    loss_date_and_time: str = Field(description="The loss date and time, Use YYYY/MM/DD HH:MM:SS format")
    loss_type: str = Field(description="The cause for loss")
    street_number: int = Field(description="The Loss street number")
    street_name: str = Field(description="The Loss street name")
    loss_city: str = Field(description="The name of the Loss city")
    loss_state: str = Field(description="The name of the Loss state")
    loss_zip: int = Field(description="The Loss zip/pincode")
    loss_country: str = Field(description="The name of the Loss country")
    police_fire_contacted: bool = Field(description="True/False")
    report_number: str = Field(description="The report number provided by the authorities")
    loss_damage_description: str = Field(description="The loss_damage_description")
    First_Name: str = Field(description="First Name of Claimant")
    Middle_Name: str = Field(description="Middle Name of Claimant")
    Last_Name: str = Field(description="Last Name of Claimant")
    relationship_with_insured: str = Field(description="Relationship of claimant with insured")
    Mobile_Number: str = Field(description="Mobile number of Claimant")
    Claimant_street_number: str = Field(description="Claimants street number")
    Claimant_street_name: str = Field(description="Claimants street name")
    Claimant_city: str = Field(description="Claimants City")
    Claimant_state: str = Field(description="Claimants state")
    Claimant_zip: str = Field(description="Claimants Zip/pincode")
    Claimant_country: str = Field(description="Claimants Country name")
    Proof_of_Identity: str = Field(
        description="Proof of Identity type (Driver's Licence or State ID or Social Security Number)")
    Proof_of_Identity_Number: str = Field(description="Proof of Identity number")


parser1 = JsonOutputParser(pydantic_object=Pydantic2)
parser2 = JsonOutputParser(pydantic_object=Pydantic3)


def retriever_agent(conversation, role):
    if role == "Insured":
        prompt = PromptTemplate(
            template='''
                You are a expert data analyst who retrieves import data from the given context, and also rectify any error or spelling mistakes in the provided data
                if you dont find any details from the given context make them "Null" or leave them blank but dont assume and make mistakes.Make sure to only provide date and time in this format: Use YYYY/MM/DD HH:MM:SS format.
                and provide the output in this structure .\n{format_instructions}\n{text}.
                  If the 'report_number' field exists within the document, extract it precisely as presented. The report number can consist of any combination of letters, numbers, and symbols, and must not match the 'policy_number' field. Ensure that the extracted report number maintains its original format from the text. If the 'report_number' field is absent, return 'None'.
                ''',
            input_variables=["text"],
            partial_variables={"format_instructions": parser1.get_format_instructions()}
        )
        chain = prompt | Llama3_8b | parser1
        try:
            response = chain.invoke({
                "text": conversation
            })
            return response
        except Exception as e:
            return f"got an error: {e}"
    else:
        prompt = PromptTemplate(
            template='''
                        You are a expert data analyst who retrieves import data from the given context, and also rectify any error or spelling mistakes in the provided data
                        if you dont find any details from the given context make them "Null" or leave them blank but dont assume and make mistakes.Make sure to only provide date and time in this format: Use YYYY/MM/DD HH:MM:SS format.
                        and provide the output in this structure .\n{format_instructions}\n{text}.
                         If the 'report_number' field exists within the document, extract it precisely as presented. The report number can consist of any combination of letters, numbers, and symbols, and must not match the 'policy_number' field. Ensure that the extracted report number maintains its original format from the text. If the 'report_number' field is absent, return 'None'.
                        ''',
            input_variables=["text"],
            partial_variables={"format_instructions": parser2.get_format_instructions()}
        )
        chain = prompt | Llama3_8b | parser2
        try:
            response = chain.invoke({
                "text": conversation
            })
            return response
        except Exception as e:
            return f"got an error: {e}"
        

def clear_user_cache(user_email):
    """Clears all cache entries for a specific user."""
    cache_keys = [
        f"chat_history_{user_email}",
        f"chat_intent_{user_email}",
        f"policy_verification_{user_email}",
        f"verify_history_{user_email}"
    ]
    for key in cache_keys:
        cache.delete(key)
 

def classifier_agent(query):
    response1 = Llama3_1_8b.invoke(
        f"""check the query given below by the user if he wants to open a claim or file a claim return "True",
        and if he wants any other details or questions return "False"
        Note: Only return "True" if he directly asks for opening claim!!! dont return "True" even if he asks for details about opening claim!
        only return One word answers either "True" or "False".
        query:{query}
        """
    )
    return response1.content


def query_refiner_agent(conversation, query):
    response = Llama3_1_8b.invoke(
        f"""You are property and casualty insurance expert who refines users queries for better retrieval. Given the following user query and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
                              Make sure to only provide the formatted query nothing more!
                              ** If the query is not related to P&C insurance! or if it is a simple "Hi" or "Hello" or any greeting just dont refine it return it as it is! ok!
                              ** If he says any things like "Thank you" or "Thanks" or anything related to gratitude also just provide as it is! 
                              ** Simple if the query is not related to p&c just dont refine it ! reply as it is!
                              Conversation history: {conversation},\n
                              query: {query}"""
    )
    return response.content


def query_agent(user_question, docs):
    prompt_template = """
                You are a seasoned expert named "Ivan" in Property and Casualty (P&C) insurance who is working with the company "Innovon Technologies", with in-depth knowledge of industry concepts, regulations, and best practices. 
                Your expertise spans personal and commercial lines, including auto, home, liability, workers' compensation, and more.

                When responding to questions, please adhere to the following guidelines:

                1. **Stay within the P&C insurance domain**: Only answer questions directly related to P&C insurance. If the question is irrelevant or outside your expertise, politely respond that you can only assist with P&C insurance-related queries.
                2. **Provide accurate and informative answers**: Draw from your extensive knowledge to provide clear, concise, and accurate responses. Avoid speculation, opinions, or irrelevant information.
                3. **Avoid ambiguity and uncertainty**: If you're unsure or lack sufficient information to provide a accurate answer, please say so. Do not generate incorrect or misleading responses.
                4. **Always Make sure to provide Only the Main points in a concise and straight to the point way! never provide huge responses! make it short and simple and also informative.
                Context:\n {context}?\n
                Question: \n{question}\n

                Answer:
                """
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(Llama3_70b, chain_type="stuff", prompt=prompt)
    response = chain.invoke({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response['output_text']
    


def claim_agent(user_question, memory, role):
    if role == "Insured":
        prompt_template = PromptTemplate(
            input_variables=['history', 'input'],
            template="""
                Role:
                    You are an P&C insurance Assistant named "Ivan" from Innovon Technologies. Your task is to interact with customers and collect all the necessary details to complete their claim.
                    Required Details:
                    "Policy Number":
                    "Cause of Accident":
                    "Contacted Police/Fire Department":
                    "Report Number":
                    "Street Number":
                    "Street Name":
                    "City":
                    "State":
                    "Zip Code":
                    "Country":
                    "Loss Date and Time":
                    "Loss Damage Description":
                    Instructions:
                    Main_point: ** You are only designed for FNOL Creation/Claim Creation and you are still being 
                    developed for Policy intake, so if the user asks you to open a policy say them politely that you are
                    still under development and doesn't have that capability yet and you can only assist with FNOL 
                    creation For Now.
                    1. Ask One Question at a Time or Ask them if they have an Accident/Claim Form they can submit it you will take care of the rest or if they dont have ask one question at a time:
                    Ensure you ask the customer only one question at a time to avoid overwhelming them.
                    Make sure the conversation should be as formal as possible! never ask like you are asking questions! ask him in a way resembling you are collecting information as formally as possible.,
                    In the first Message Say sorry for their situation and from second message onwards dont say sorry again.
                    2. If the User asks to submit accord form don't say you don't have document processing capability, 
                    simply say please provide your document and I'll take care of the rest.
                    3. Process Multiple Information:
                    If the customer provides multiple pieces of information in a single response, process that information first.
                    Identify which details have been provided and only ask for the missing information.
                    4. Smart Segregation:
                    If the customer provides complete details in one response (e.g., full address or all required information), smartly segregate the input.
                    Only inquire about the details that were not provided in the response.
                    5. If you are asking for address make sure to ask it at a time (e.g: Please specify your address specifically your street name, street number ...etc).
                    6. Review and Confirm:
                    Once all the required information is collected, display it to the customer in a clear, point-wise format. Don't ask one by one for confirmation show them whole list and ask for confirmation.
                    Ask the customer if they want to change any information. ** Dont say You are going to assign an adjuster in this step just show all the values ok.
                    7. Handle Changes:
                    If the customer requests any changes, make the necessary adjustments.
                    Present the updated information again in a point-wise format for confirmation.
                    8. Final Confirmation:
                    If the customer does not need any changes, provide the complete list again in a neat and structured way.
                    Thank the customer for providing all the details.
                    First provide the whole list of information then Inform them that an adjuster will be assigned to process their claim. and stop the conversation dont say anything else.
                conversation history:
                {history}
                human:{input}
                AI:
                """
        )
        conversation_chain = LLMChain(
            llm=Llama3_70b,
            prompt=prompt_template,
            memory=memory,
        )
        response = conversation_chain.invoke({"input": user_question})
        return response['text']
    else:
        prompt_template = PromptTemplate(
            input_variables=['history', 'input'],
            template="""
                        Role:
                            You are an P&C insurance Assistant named "Ivan" from Innovon Technologies. Your task is to interact with customers and collect all the necessary details to complete their claim.
                        **Loss Details (Ask one by one)**
                            "Policy_number":
                            "Cause_of_accident":
                            "Contacted_Police/Fire_department":
                            "Report_Number":
                            "Loss_Street_number":
                            "Loss_Street_name":
                            "Loss_City":
                            "Loss_State":
                            "Loss_Zip_Code":
                            "Loss_Country":
                            "Loss_date and time":
                            "Loss damage description" :   
                        **Personal Details (Ask one by one)**
                            "First Name":
                            "Middle Name (Optional)":
                            "Last Name":
                            "relationship_with_insured":
                            "Mobile_number":
                            "Claimant street number":
                            "Claimant street name":
                            "Claimant city":
                            "Claimant state":
                            "Claimant zip":
                            "Claimant Country":
                            "Proof of identity (Driver's Licence or State ID or Social Security Number) Selection":
                            "Proof of identity Number":
                        Instructions:
                        Main_point: ** You are only designed for FNOL Creation/Claim Creation and you are still being 
                        developed for Policy intake, so if the user asks you to open a policy say them politely that you are
                        still under development and doesn't have that capability yet and you can only assist with FNOL 
                        creation For Now.
                            1. Ask One Question at a Time or Ask them if they have an Accident/Claim Form they can submit it you will take care of the rest or if they dont have ask one question at a time:
                            Ensure you ask the customer only one question at a time to avoid overwhelming them.
                            Make sure the conversation should be as formal as possible! never ask like you are asking questions! ask him in a way resembling you are collecting information as formally as possible.,
                            In the first Message Say sorry for their situation and from second message onwards dont say sorry again.
                            2. If the User asks to submit accord form don't say you don't have document processing capability, 
                            simply say please provide your document and I'll take care of the rest.
                            3. Process Multiple Information:
                            If the customer provides multiple pieces of information in a single response, process that information first.
                            Identify which details have been provided and only ask for the missing information.
                            4. Smart Segregation:
                            If the customer provides complete details in one response (e.g., full address or all required information), smartly segregate the input.
                            Only inquire about the details that were not provided in the response.
                            5. If you are asking for address make sure to ask it at a time (e.g: Please specify your address specifically your street name, street number ...etc).
                            6. Review and Confirm:
                            Once all the required information is collected, display it to the customer in a clear, point-wise format. Don't ask one by one for confirmation show them whole list and ask for confirmation.
                            Ask the customer if they want to change any information.
                            7. Handle Changes:
                            If the customer requests any changes, make the necessary adjustments.
                            Present the updated information again in a point-wise format for confirmation.
                            8. Final Confirmation:
                            If the customer does not need any changes, provide the complete list again in a neat and structured way.
                            Thank the customer for providing all the details.
                            First provide the whole list of information then Inform them that an adjuster will be assigned to process their claim. and stop the conversation dont say anything else.
                        conversation history:
                        {history}
                        human:{input}
                        AI:
                        """
        )
        conversation_chain = LLMChain(
            llm=Llama3_70b,
            prompt=prompt_template,
            memory=memory,
        )
        response = conversation_chain.invoke({"input": user_question})
        return response['text']
    

def verification_agent(conversation, database):
    response = Llama3_70b.invoke(f"""
        You are a specialist in retrieving Policy Numbers which are generally of 10 digits from conversations of our Users and AI chat bot.
        Your task is to Search for the policy number in the chat history provided below and retrieve the policy number from it.
        If he provides more than one Policy number, retrieve the latest policy, do as instructed in below instructions:
        Instructions:
        1. If you don't find a policy number in the conversation, return "False".
        2. If the policy number is found in the conversation then return the policy number only.
        3. If there are multiple policy numbers retrieve the latest one!.

        Respond with only one word: "False", policy_number if found.
        Conversation: {conversation}
    """)
    policy_number = response.content
    if policy_number != "False":
        if policy_number in database:
            return "True"
        else:
            return "Wrong"
    else:
        return "False"
    

def dict_to_markdown(data, role):
    markdown = "Thank you for providing all the necessary information. Here is the complete list of information:\n\n"

    # Mapping dictionary keys to desired output labels
    claim_info_mapping = {
        'policy_number': 'Policy Number',
        'loss_type': 'Cause of Accident',
        'police_fire_contacted': 'Contacted Police/Fire Department',
        'report_number': 'Report Number',
        'loss_date_and_time': 'Loss Date and Time',
        'loss_damage_description': 'Loss Damage Description'
    }

    personal_info_mapping = {
        'First_Name': 'First Name',
        'Middle_Name': 'Middle Name',
        'Last_Name': 'Last Name',
        'relationship_with_insured': 'Relationship with Insured',
        'Mobile_Number': 'Mobile Number',
        'Proof_of_Identity': 'Proof of Identity',
        'Proof_of_Identity_Number': 'Proof of Identity Number'
    }

    markdown += "Claim Details:\n"
    for key, label in claim_info_mapping.items():
        if key in data:
            value = data[key]

            # Special handling for boolean values
            if key == 'police_fire_contacted':
                value = 'Yes' if value else 'No'

            # Special handling for loss_date_and_time
            if key == 'loss_date_and_time':
                try:
                    # Parse the date and time from the format '2024/04/18 12:47:00'
                    dt = datetime.strptime(value, "%Y/%m/%d %H:%M:%S")
                    value = dt.strftime("%Y-%m-%d %H:%M:%S")
                except ValueError:
                    print("parsing of date time failed")
            markdown += f"* {label}: {value}\n"

    # Handle loss address
    loss_address = f"{data.get('street_number', '')} {data.get('street_name', '')}, {data.get('loss_city', '')}, {data.get('loss_state', '')}, {data.get('loss_zip', '')}, {data.get('loss_country', '')}"
    loss_address = ', '.join(part.strip() for part in loss_address.split(',') if part.strip())
    markdown += f"* Loss Address: {loss_address}\n"

    if role != "Insured":
        markdown += "\nPersonal Info:\n"
        for key, label in personal_info_mapping.items():
            if key in data:
                markdown += f"* {label}: {data[key]}\n"

        claimant_address = f"{data.get('Claimant_street_number', '')} {data.get('Claimant_street_name', '')}, {data.get('Claimant_city', '')}, {data.get('Claimant_state', '')}, {data.get('Claimant_zip', '')}, {data.get('Claimant_country', '')}"
        claimant_address = ', '.join(part.strip() for part in claimant_address.split(',') if part.strip())
        markdown += f"* Claimant Address: {claimant_address}\n"

    return markdown.strip()


def save_email_data_to_mongodb(email_data):
    """Saves email data to the "email_to_fnol" MongoDB collection."""

    client, db = MongoDB.get_mongo_client_innoclaimfnol()
    collection = db['email_to_fnol']

    try:
        result = collection.insert_one(email_data)
        print(f"Saved email data to MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error saving email data to MongoDB: {e}")


def save_attachments(msg, download_folder):
    """Extracts and saves attachments from an email message."""
    process_document_name = []
    process_document_url = []
    witness_document_names = []
    witness_document_urls = []
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
            if file_name.endswith(('.pdf', '.docx', '.txt')):
                folder_path = os.path.join(settings.MEDIA_ROOT, download_folder, "process_documents")
            else:
                folder_path = os.path.join(settings.MEDIA_ROOT, download_folder, "witness_documents")

            # Create the folder if it doesn't exist
            os.makedirs(folder_path, exist_ok=True)

            file_path = os.path.join(folder_path, new_filename)
            if folder_path.endswith("process_documents"):
                save_path = os.path.join(settings.MEDIA_URL, download_folder)
                save_path += f"/process_documents"
                save_path += f"/{new_filename}"
                process_document_name.append(file_name)
                process_document_url.append(save_path)
            else:
                save_path = os.path.join(settings.MEDIA_URL, download_folder)
                save_path += f"/witness_documents"
                save_path += f"/{new_filename}"
                witness_document_names.append(file_name)
                witness_document_urls.append(save_path)
            with open(file_path, 'wb') as f:
                f.write(part.get_payload(decode=True))
            print(f"Saved attachment: {file_name} to {folder_path}")

    return process_document_name, process_document_url, witness_document_names, witness_document_urls


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

                    process_document_name, process_document_url, witness_document_names, witness_document_urls = save_attachments(
                        msg, "email-to-fnol")
                    email_data = {
                        'subject': msg['subject'],
                        'body': body,
                        'sender_email': sender_email,
                        'email_time': email_time,  # Add the email time to the data
                        'process_document_name': process_document_name,
                        'process_document_url': process_document_url,
                        'witness_document_names': witness_document_names,
                        'witness_document_urls': witness_document_urls
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


def handle_failure(db, email, process_document_name, process_document_url, witness_document_names,
                   witness_document_urls, missing_fields, sender_email, subject, collection,
                   encoded_string=None, company=None, insured_name=None):
    if company and insured_name and encoded_string:
        Emails.send_claim_failure_email_missing(sender_email, missing_fields, company['ic_name'], insured_name, encoded_string,
                                     company['ic_email'], company['ic_mobile'], company['ic_primary_color'],
                                     company['ic_id'])
        print(f"Failure email sent to {sender_email} due to missing fields.")
    else:
        Emails.send_claim_failure_email(sender_email,missing_fields)
        print(f"Failure email sent to {sender_email} due to unseen errors.")
    move_email_data_to_collection(db, email, 'email_to_fnol_failure')
    collection.delete_one({'_id': email['_id']})
    print(f"Email with subject '{subject}' deleted from MongoDB.")
    # Delete the processed PDF file
    if process_document_name and process_document_url:
        move_attachments_to_folder(process_document_url, 'email-to-fnol', 'email-to-fnol-failure', 'process_documents')
    if witness_document_names and witness_document_urls:
        for doc_url in witness_document_urls:
            move_attachments_to_folder(doc_url, 'email-to-fnol', 'email-to-fnol-failure', 'witness_documents')


def move_attachments_to_folder_edit(source_url, destination_folder, subfolder, last_sub_folder):
    """Moves an attachment from source to destination within a specific subfolder."""
    source_path = os.path.join(settings.MEDIA_ROOT, 'email-to-fnol', 'email-to-fnol-failure', last_sub_folder,
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


def parse_currency(value):
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        # Remove currency symbols and commas
        cleaned = re.sub(r'[^\d.-]', '', value)
        try:
            return float(cleaned)
        except ValueError:
            return 0  # or you might want to return None or handle this differently
    return 0  # or None, depending on how you want to handle non-numeric, non-string values


def safe_sum(series):
    return sum(parse_currency(value) for value in series if pd.notna(value))


def find_company_name(row):
    # Iterate through the row and find the first non-empty cell that's not a column header
    for cell in row:
        if pd.notna(cell) and not cell.startswith('Unnamed:') and not cell.startswith('*'):
            return cell
    return "Company name not found"


class IdCard(BaseModel):
    first_name: str = Field(default_factory=str)
    last_name: str = Field(default_factory=str)
    document_type: str = Field(default_factory=str)
    document_number: str = Field(default_factory=str)
    date_of_birth: str = Field(default_factory=str)
    expiration_date: str = Field(default_factory=str)
    address: str = Field(default_factory=str)
    Height: str = Field(default_factory=str)
    Eye_Color: str = Field(default_factory=str)
    Weight: str = Field(default_factory=str)
    Sex: str = Field(default_factory=str)
    issuance_date: str = Field(default_factory=str)
    endorsements: str = Field(default_factory=str)
    class_type: str = Field(default_factory=str)
    hair_color: str = Field(default_factory=str)
    restrictions: str = Field(default_factory=str)
    real_id: str = Field(default_factory=str)


id_card_parser = JsonOutputParser(pydantic_object=IdCard)


def id_card_details_formatting(extracted_text):
    prompt = PromptTemplate(
        template='''
            Role: You are an Expert in ID card Data Extraction.
            Task: Extract the relevant details from the provided extracted text.
            Context: \n{extracted_text}  \n\n
            Follow these instructions to extract the information from the provided text: \n {format_instructions}
            ''',
        input_variables=["extracted_text"],
        partial_variables={"format_instructions": id_card_parser.get_format_instructions()}
    )
    chain = prompt | Llama3_70b
    response = chain.invoke({
        "extracted_text": extracted_text
    })
    output_tokens, input_tokens, total_tokens = Ai_utils.returns_token_count(response)
    try:
        response = id_card_parser.invoke(response)
        return response, output_tokens, input_tokens, total_tokens
    except Exception as e:
        error_message = str(e)
        extracted_data = Ai_utils.extract_data_from_error(error_message)
        if extracted_data:
            return extracted_data, output_tokens, input_tokens, total_tokens
        else:
            return f"got an error: {e}"
        

def extract_loss_runs(text):
    class pydantic(BaseModel):
        No_of_claims: int = Field(description="Total Number of claims")
        Total_amount: float = Field(description="Total Incurred Amount")
        Incurred_Claim_Amount: list = Field(
            description="List of all the provided Claim_amounts in float format upto 3 decimals")
        Total_Incurred_Medical_Losses: list = Field(description="List of all the Medical losses in the extracted text")
        Total_Incurred_Expenses: list = Field(
            description="List of all the total incurred Expenses in the extracted text")
        Reserved_Amounts: list = Field(description="List of all the Reserved Amounts in float format up to 3 decimals")
 
    parser = JsonOutputParser(pydantic_object=pydantic)
    prompt = PromptTemplate(
        template='''
        Role: You are an Expert in Analytics.
        Task: Follow the instructions provided and extract the required details from the given context.
        From this data provide these in a json format: {format_instructions}.
        Display the values exactly as they are found in the text, without mathematical operations. Return 0 if no value is present.
        Context: \n{text}\n''',
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    # chain = prompt | Llama3_70b | parser
    chain = prompt | Llama3_70b
    response = chain.invoke({
        "text": text
    })
    output_tokens, input_tokens, total_tokens = Ai_utils.returns_token_count(response)
 
 
    Total_Incurred_Claim_Amount = 0.0
    Total_Incurred_Medical_Losses = 0.0
    Total_Incurred_Expenses = 0.0
    Total_Reserved_Amounts = 0.0
 
    try:
        # response = chain.invoke({"text": text})
        response = parser.invoke(response)
 
        # Parse numeric values safely
        def parse_value(value):
            if isinstance(value, str):
                return float(value.replace(',', ''))
            return float(value)
 
        # Sum all claim amounts, medical losses, expenses, and reserved amounts
        for i in response.get('Incurred_Claim_Amount', []):
            Total_Incurred_Claim_Amount += parse_value(i)
 
        for i in response.get('Reserved_Amounts', []):
            Total_Reserved_Amounts += parse_value(i)
 
        for i in response.get('Total_Incurred_Medical_Losses', []):
            Total_Incurred_Medical_Losses += parse_value(i)
 
        for i in response.get('Total_Incurred_Expenses', []):
            Total_Incurred_Expenses += parse_value(i)
 
        Total_amount = response.get('Total_amount', 0.0)
        if Total_amount == 0:
            Total_amount = Total_Incurred_Claim_Amount
 
        if Total_amount < Total_Incurred_Claim_Amount:
            Total_amount, Total_Incurred_Claim_Amount = Total_Incurred_Claim_Amount, Total_amount
 
        No_of_claims = response.get('No_of_claims', 1)
        Average_Loss_per_claim = Total_amount / No_of_claims
 
        # Format numbers with commas and without changing your output structure
        formatted_json = {
            'No.of.claims': f"{response.get('No_of_claims', 0):,}",
            'Total_Loss_Amount': f"${Total_amount:,.2f}",
            'Total_Incurred_Claim_Amount': f"${Total_Incurred_Claim_Amount:,.2f}",
            'Average_Loss_per_claim': f"${Average_Loss_per_claim:,.2f}",
            'Total_Reserved_Amounts': f"${Total_Reserved_Amounts:,.2f}",
            'Total_Incurred_Medical_Losses': f"${Total_Incurred_Medical_Losses:,.2f}",
            'Total_Incurred_Expenses': f"${Total_Incurred_Expenses:,.2f}"
        }
 
    except Exception as e:
        error_message = str(e)
        formatted_json = {}
        print(f"Error: {e}") 
        # return {}, 0, 0, 0 # Return appropriate default values
 
    return formatted_json, output_tokens, input_tokens, total_tokens


def extract_subtotals(text):
    class pydantic1(BaseModel):
        policy_holder_name: str = Field(default_factory=str)
        policy_numbers_list: list[str] = Field(default_factory=list)
        sai_number: str = Field(default_factory=str)
        workers_comp_no_of_claims_list: list[int] = Field(default_factory=list)
        workers_comp_total_amounts: list[float] = Field(default_factory=list)
        workers_comp_reserved_amounts: list[float] = Field(default_factory=list)
        products_liability_no_of_claims_list: list[int] = Field(default_factory=list)
        products_liability_total_amounts: list[float] = Field(default_factory=list)
        products_liability_reserved_amounts: list[float] = Field(default_factory=list)
        auto_liability_no_of_claims_list: list[int] = Field(default_factory=list)
        auto_liability_total_amounts: list[float] = Field(default_factory=list)
        auto_liability_reserved_amounts: list[float] = Field(default_factory=list)
        general_liability_no_of_claims_list: list[int] = Field(default_factory=list)
        general_liability_total_amounts: list[float] = Field(default_factory=list)
        general_liability_reserved_amounts: list[float] = Field(default_factory=list)
        property_no_of_claims_list: list[int] = Field(default_factory=list)
        property_total_amounts: list[float] = Field(default_factory=list)
        property_reserved_amounts: list[float] = Field(default_factory=list)
 
    parser1 = JsonOutputParser(pydantic_object=pydantic1)
    prompt = PromptTemplate(
        template="""
        Role: You are an Expert in Insurance Analytics.
        Task: Extract the required details from the given context and provide them in the specified JSON format.
        Instructions:
        1. For each line of business extract:
           - List of all "Number of claims" values
           - List of all "Total Amount (INCURRED/INC)" values (convert to float)
           - List of all "Total Reserved Amount (O/S)" values (convert to float)
           - List of all unique policy numbers (ensure they are placed in an array format as policy_numbers_list)
        2. If a value is not found for a particular year or line of business, use 0.
        3. Do not perform any calculations; simply extract the values as they appear in the text.
        Output format:
        {format_instructions}
        Context:
        {text}
        """,
        input_variables=["text"],
        partial_variables={"format_instructions": parser1.get_format_instructions()}
    )
    # chain = prompt | Llama3_70b | parser1
     
    output_tokens = 0
    input_tokens = 0
    total_tokens = 0
 
    try:
        # response = chain.invoke({"text": text})
        chain = prompt | Llama3_70b
        response = chain.invoke({
            "text": text
        })
        output_tokens, input_tokens, total_tokens = Ai_utils.returns_token_count(response)
        response = parser1.invoke(response)
        Subtotals = {}
        lob_mapping = {
            "Workers_compensation": "workers_comp",
            "Products_Liability": "products_liability",
            "General_Liability": "general_liability",
            "Auto_Liability": "auto_liability",
            "Property": "property"
        }
        for lob, prefix in lob_mapping.items():
            no_of_claims = sum(response.get(f'{prefix}_no_of_claims_list', [0]))
            total_loss = round(sum(response.get(f'{prefix}_total_amounts', [0])), 2)
            total_reserved = round(sum(response.get(f'{prefix}_reserved_amounts', [0])), 2)
            if no_of_claims > 0 or total_loss > 0 or total_reserved > 0:
                Subtotals[lob] = {
                    "No.of.Claims": f"{no_of_claims:,}",
                    "Total_Loss": f"${total_loss:,.2f}",
                    "Total_Reserved_Amounts":  f"${total_reserved:,.2f}"
                }
        if not Subtotals:
            print("Warning: No non-zero data found for any line of business.")
        policy_numbers_list = response.get('policy_numbers_list', [])
        policy_holder_name = response.get('policy_holder_name')
        sai_number = response.get('sai_number')
        if policy_numbers_list:
            for number in policy_numbers_list:
                if len(number) < 6:
                    policy_numbers_list.remove(number)
        return Subtotals, policy_numbers_list, policy_holder_name, sai_number,output_tokens, input_tokens, total_tokens
 
    except Exception as e:
            print(f"Error occurred during data extraction: {e}")
            # Return default values for all expected return values
            return ({}, [], "", "", output_tokens, input_tokens, total_tokens)


def extract_image_from_pdf(pdf_bytes):
    """Processes a PDF by extracting the first page as an image and analyzing it."""
    if not pdf_bytes.getbuffer().nbytes:
        raise ValueError("The PDF file is empty or not readable.")

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")  # Open PDF from bytes
    page = doc[0]  # Select the first page (index 0)

    # Zoom if necessary (adjust zoom_x and zoom_y as needed)
    zoom_x = 3.0
    zoom_y = 3.0
    mat = fitz.Matrix(zoom_x, zoom_y)
    pix = page.get_pixmap(matrix=mat)
    # Convert pixmap to bytes
    image_bytes = pix.tobytes("png")
    return image_bytes


def extract_pdf_text_fitz(pdf_bytes):
    if not pdf_bytes.getbuffer().nbytes:
        raise ValueError("The PDF file is empty or not readable.")
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")  # Open PDF from bytes
    all_text = ""

    for page in doc:
        text = page.get_text()
        lines = text.split('\n')

        for line in lines:
            # Clean up the text
            line = re.sub(r'\s+', ' ', line).strip()

            if line:  # Only add non-empty lines
                all_text += line + "  "  # Add a space after each line instead of a newline

    doc.close()
    if len(all_text.strip()) <= 10:
        return "pdf_image"
    return all_text.strip()


def read_excel(uploaded_file):
    # Read the Excel file from the uploaded file object
    df = pd.read_excel(uploaded_file)
    row_strings = []
    # Iterate through each row
    for index, row in df.iterrows():
        # Check if the row contains any non-null value
        if row.notna().any():
            # Convert the row to a string
            row_string = " | ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
            row_strings.append(f"Row {index + 1}: {row_string}")
    return "\n".join(row_strings) if row_strings else " "


def image_to_base64(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def check_extraction_success(extracted_data):
    """Check if extraction was successful (no 'Not Found' values)"""
    if not extracted_data:
        return False
    return 'Not Found' not in extracted_data.values()

def serialize_mongodb_data(data):
    """Convert MongoDB data types to JSON serializable formats"""
    if isinstance(data, dict):
        return {key: serialize_mongodb_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize_mongodb_data(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data

def add_docaiclassify_metadata_to_database(is_index_have_all_data, results, is_anonymous=False):
    """Stores metadata in the appropriate database collection."""
    client, db = MongoDB.get_mongo_client_DocAI_Classify()
    if is_anonymous:
        collection_name = 'classify_workqueue_data'
        process_status = 'anonymous_workqueue'
    else:
        collection_name = 'classify_success_data' if is_index_have_all_data else 'classify_workqueue_data'
        process_status = 'success' if is_index_have_all_data else 'workqueue'
    docai_classify_collection = db[collection_name]
    try:
        if results:
            meta_data = results[-1].copy()
            meta_data['timestamp'] = datetime.now(pytz.utc)
            meta_data['process_status'] = process_status
            encrypted_meta_data = Authentication.encrypt_data(meta_data)
            result = docai_classify_collection.insert_one(encrypted_meta_data) 
            mongo_id = str(result.inserted_id)
            return True, mongo_id                    
        return False, None
    except Exception as e:
        print(f"Error storing in MongoDB: {str(e)}")
        return False, None

     
def data_summarize_agent(extracted_text):
    prompt = PromptTemplate(
    template='''You are an expert summarizer specializing in analyzing documents and providing concise, professional summaries. Your task is to identify the main ideas, key points, and critical details from the provided text, presenting them in a clear and structured format. Avoid redundancy, minor details, or subjective opinions unless explicitly requested.
 
                    **The summary must include two main sections:**
 
                    A. **Document Context**:  
                    1. Briefly describe the document's domain or purpose (e.g., legal, technical, academic, business).  
                    2. List key names mentioned in a professional manner (In a neat point wise manner).  
                    3. Highlight important details, such as report numbers or other significant identifiers (In a neat point wise manner).  
                    4. Include any additional relevant points in the most professional tone.  
 
                    B. **Main Summary**:  
                    1. Summarize the document's purpose and main arguments.  
                    2. Focus only on critical details and supporting points.  
                    3. Maintain the tone and style of the original document.  
                    4. Present the summary in [X format, e.g., bullet points, paragraphs].  
                    5. Limit the summary to approximately [X words or X% of the original document].  
                    6. For each every point you summarize provide the corresponding Page number and Paragraph it taken from mention these page numbers and paragraphs at each point end (eg: ..point... (page1, paragraph 2)), so that
                    users will have a proof that you extracted this content and summarized from the provided document only!
 
                   
                    **Just provide the summary don't repeat the requirements in your response.
                    ** Provide the answers in the best markdown format in the most proffessional way possible.
                   
                   
                    Text to Summarize:
                    "{extracted_text}"
                    ''',
 
        input_variables=["extracted_text"],
    )
    chain = prompt | Llama3_3_70b
    response = chain.invoke({
        "extracted_text": extracted_text
    })
    return response.content
 