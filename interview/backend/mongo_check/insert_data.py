from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()
uri = os.getenv("MONGO_URI")

jobs = [
    {
        'id': 1,
        'title': 'Software Engineer',
        'company': 'DRDO',
        'shortDescription': 'Develop cutting-edge software solutions.',
        'fullDescription': 'As a Software Engineer at DRDO, you will be responsible for designing, developing, and maintaining advanced software systems for defense applications. You will work on challenging projects that push the boundaries of technology.',
        'pay': '₹15,00,000 - ₹25,00,000 per annum',
        'level': 'Mid-Senior'
    },
    {
        'id': 2,
        'title': 'Data Analyst',
        'company': 'DRDO RAC',
        'shortDescription': 'Analyze complex datasets to derive insights.',
        'fullDescription': 'Join our team as a Data Analyst at DRDO RAC to work on critical data analysis projects. You will be responsible for processing large datasets, creating visualizations, and providing actionable insights to support decision-making processes.',
        'pay': '₹12,00,000 - ₹18,00,000 per annum',
        'level': 'Entry-Mid'
    },
    {
        'id': 3,
        'title': 'UX Designer',
        'company': 'DRDO',
        'shortDescription': 'Create intuitive user experiences for web and mobile apps.',
        'fullDescription': 'As a UX Designer at DRDO, you will be responsible for creating user-centered designs for various digital platforms. Your work will involve user research, prototyping, and collaborating with cross-functional teams to deliver exceptional user experiences.',
        'pay': '₹10,00,000 - ₹20,00,000 per annum',
        'level': 'Junior-Mid'
    }
]

def insert_jobs():
    client = MongoClient(uri)
    db = client['SIH']  
    collection = db['JobOpening']

    try:
        result = collection.insert_many(jobs)
        print(f"{len(result.inserted_ids)} jobs were successfully inserted.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    insert_jobs()
