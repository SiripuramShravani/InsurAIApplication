import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()
# load_dotenv(r"/var/www/inno-claim-fnol/back_end/django_backend/Innovontech/.env")

uri=os.getenv('MONGO_URI') 
def get_mongo_client():
    current_env = os.environ.get('CURRENT_ENVIRONMENT', 'development')      
    if current_env == 'development':
        mongo_uri = os.environ.get('LOCAL_MONGO_URI') 
    else:
        mongo_uri = os.environ.get('MONGO_URI') 
    client = MongoClient(mongo_uri)
    db = client['Administration']
    return client,db

 
