import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.environ.get('MONGO_URI')
    DB_NAME = "SIH"
    COLLECTION_NAME = "interview"
    UPLOAD_FOLDER = 'uploads'
    GROQ_AI_KEY = os.environ.get('GROQ_AI_KEY')

    # Updated schema based on new task requirements
    TABLE_SCHEMA = {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "phone": "string",
        "position": "string",
        "coverLetter": "string",
        "skills": "string",
        "experience": "string or null",
        "resume_filename": "string",
        "parsed_data": {
            "name": "string",
            "phone": "string",
            "email": "string",
            "linkedin": "string",
            "skills": "string",
            "experience": "string or null",
            "certifications": "string",
            "education": "string"
        }
    }

    SCHEMA_DESCRIPTION = '''
Here is the description to determine what each key represents:
1. _id:
    - Description: Unique identifier for the document.
2. name:
    - Description: Candidate's full name.
3. email:
    - Description: Candidate's email address.
4. phone:
    - Description: Candidate's phone number.
5. position:
    - Description: Position for which the candidate is applying.
6. coverLetter:
    - Description: Cover letter submitted by the candidate.
7. skills:
    - Description: Skills listed by the candidate.
8. experience:
    - Description: Work experience of the candidate (can be null if not available).
9. resume_filename:
    - Description: Filename of the uploaded resume.
10. parsed_data:
    - Description: Parsed data from the resume.
    - Fields:
        - name: Candidate's full name.
        - phone: Candidate's phone number.
        - email: Candidate's email address.
        - linkedin: Candidate's LinkedIn profile URL.
        - skills: Skills listed in the resume.
        - experience: Work experience mentioned in the resume.
        - certifications: Certifications obtained by the candidate.
        - education: Candidate's educational background.
'''


    FEW_SHOT_EXAMPLE_1 = [
        {
            "$match": {
                "name": {"$regex": "Harshit", "$options": "i"}
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "email": 1,
                "phone": 1,
                "position": 1,
                "coverLetter": 1,
                "skills": 1,
                "experience": 1,
                "resume_filename": 1,
                "parsed_data": 1
            }
        }
    ]