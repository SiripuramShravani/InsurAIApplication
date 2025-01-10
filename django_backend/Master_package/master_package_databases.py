import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


class MongoDB:
    current_env = os.environ.get('CURRENT_ENVIRONMENT', 'development')
    if current_env == 'development':
        __mongo_uri = os.environ.get('LOCAL_MONGO_URI')
    else:
        __mongo_uri = os.environ.get('MONGO_URI')

    @classmethod
    def get_mongo_client_innoclaimfnol(cls):
        client = MongoClient(MongoDB.__mongo_uri)
        db = client['innoclaimfnol']
        return client, db

    @classmethod
    def get_mongo_client_Policy_intake(cls):
        client = MongoClient(MongoDB.__mongo_uri)
        db = client['Policy_intake']
        return client, db

    @classmethod
    def get_mongo_client_Administration(cls):
        client = MongoClient(MongoDB.__mongo_uri)
        db = client['Administration']
        return client, db

    @classmethod
    def get_mongo_client_Batch_processes(cls):
        client = MongoClient(MongoDB.__mongo_uri)
        db = client['Batch_processes']
        return client, db

    @classmethod
    def get_mongo_client_DocAI_Classify(cls):
        client = MongoClient(MongoDB.__mongo_uri)
        db = client['DocAI_Classify']
        return client, db