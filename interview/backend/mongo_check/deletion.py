import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

db_name = "SIH"
collections_to_clear = ["User","UserResume","application"] 

db = client[db_name]

for collection_name in collections_to_clear:
    collection = db[collection_name]
    result = collection.delete_many({})
    print(f"Deleted {result.deleted_count} documents from the '{collection_name}' collection.")

client.close()
