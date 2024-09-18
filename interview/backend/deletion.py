import pymongo
from pymongo import MongoClient



mongo_uri = "mongodb+srv://anubhajarwal2003:Niharika021@candidates.fnkt3.mongodb.net/SIH?retryWrites=true&w=majority" 
client = MongoClient(mongo_uri)

db_name = "SIH"
collections_to_clear = ["User", "Employee", "Interview"] 

db = client[db_name]

for collection_name in collections_to_clear:
    collection = db[collection_name]
    result = collection.delete_many({})
    print(f"Deleted {result.deleted_count} documents from the '{collection_name}' collection.")

client.close()
