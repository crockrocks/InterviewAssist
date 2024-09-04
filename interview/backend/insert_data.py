from pymongo import MongoClient
from werkzeug.security import generate_password_hash


client = MongoClient('mongodb://localhost:27017/')
db = client['interview_app']
users_collection = db['users']
interviews_collection = db['interviews']

users_data = [
    {"username": "user1", "password": generate_password_hash("password1")},
    {"username": "user2", "password": generate_password_hash("password2")},
    {"username": "admin", "password": generate_password_hash("adminpass")}
]


interviews_data = [
    {"name": "John Doe", "email": "john@example.com", "resume_filename": "john_doe_resume.pdf"},
    {"name": "Jane Smith", "email": "jane@example.com", "resume_filename": "jane_smith_resume.pdf"},
    {"name": "Bob Johnson", "email": "bob@example.com", "resume_filename": "bob_johnson_resume.pdf"}
]

def insert_sample_data():
    users_result = users_collection.insert_many(users_data)
    print(f"Inserted {len(users_result.inserted_ids)} user documents")

    # Insert interviews
    interviews_result = interviews_collection.insert_many(interviews_data)
    print(f"Inserted {len(interviews_result.inserted_ids)} interview documents")

if __name__ == "__main__":
    insert_sample_data()
    print("Sample data insertion complete.")