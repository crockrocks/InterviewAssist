from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
import json
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

client = MongoClient("mongodb+srv://anubhajarwal2003:Niharika021@candidates.fnkt3.mongodb.net/SIH?retryWrites=true&w=majority")
db = client['SIH']
users_collection = db['User']
resume_collection = db['UserResume']
job_openings_collection = db['JobOpening']
application_collection = db['application']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if data.get('isEmployee'):
        existing_employee = users_collection.find_one({'emp_code': data['employeeId']})
        if existing_employee:
            return jsonify({'success': False, 'message': 'Employee ID already exists.'}), 400
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'success': False, 'message': 'Email already exists.'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password,
        'employee': data['isEmployee'],
        'emp_code': data['employeeId'] if data['isEmployee'] else None
    }
    result = users_collection.insert_one(new_user)
    return jsonify({
        'success': True, 
        'message': 'Registration successful.',
        'user_id': str(result.inserted_id),
        'is_employee': new_user['employee'],
        'employee_code': new_user['emp_code']
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'email': data['email']})
    if user and check_password_hash(user['password'], data['password']):
        resume_data = resume_collection.find_one({'email': data['email']})
        
        response_data = {
            'success': True,
            'userId': str(user['_id']),
            'isEmployee': user.get('employee', False),
            'employeeCode': user.get('emp_code')
        }
        
        if resume_data:
            resume_data.pop('_id', None)
            response_data['resumeData'] = resume_data
        
        return jsonify(response_data)
    return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user_data(user_id):
    try:
        if not user_id or user_id == 'null':
            return jsonify({'error': 'Invalid or missing user ID'}), 400

        if not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400

        user_object_id = ObjectId(user_id)
        user_data = users_collection.find_one({'_id': user_object_id})

        if user_data:
            user_data['_id'] = str(user_data['_id'])
            user_data.pop('password', None)  # Remove password from the response
            return jsonify(user_data)
        else:
            return jsonify({'error': 'User not found'}), 404

    except InvalidId:
        return jsonify({'error': 'Invalid user ID format'}), 400
    except Exception as e:
        print(f"Error fetching user data: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/job-openings', methods=['GET'])
def get_job_openings():
    try:
        job_openings = list(job_openings_collection.find())
        for job in job_openings:
            job['_id'] = str(job['_id'])
            # Count the number of applicants for this job
            applicant_count = application_collection.count_documents({'jobId': str(job['_id'])})
            job['applicantCount'] = applicant_count
        return jsonify(job_openings), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings', methods=['POST'])
def create_job_opening():
    try:
        job_data = request.json
        result = job_openings_collection.insert_one(job_data)
        job_data['_id'] = str(result.inserted_id)
        return jsonify(job_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>', methods=['PUT'])
def update_job_opening(job_id):
    try:
        job_data = request.json
        result = job_openings_collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': job_data}
        )
        if result.modified_count:
            return jsonify({'message': 'Job opening updated successfully'}), 200
        else:
            return jsonify({'message': 'No job opening found with that ID'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>', methods=['GET'])
def get_job_opening(job_id):
    try:
        job = job_openings_collection.find_one({'_id': ObjectId(job_id)})
        if job:
            job['_id'] = str(job['_id'])
            return jsonify(job), 200
        else:
            return jsonify({'error': 'Job not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>/candidates', methods=['GET'])
def get_job_candidates(job_id):
    try:
        candidates = list(application_collection.find({'jobId': job_id}))
        for candidate in candidates:
            candidate['_id'] = str(candidate['_id'])
            user = users_collection.find_one({'_id': ObjectId(candidate['userId'])})
            if user:
                candidate['name'] = user.get('name')
            resume = resume_collection.find_one({'email': candidate['email']})
            if resume:
                candidate['resumeData'] = resume
                candidate['resumeData']['_id'] = str(candidate['resumeData']['_id'])
        return jsonify(candidates), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>/select-candidate', methods=['POST'])
def select_candidate(job_id):
    try:
        applicant_email = request.json.get('email')
        if not applicant_email:
            return jsonify({'error': 'Email is required'}), 400
        result = application_collection.update_one(
            {'jobId': job_id, 'email': applicant_email},
            {'$set': {'status': 'selected'}}
        )
        if result.modified_count:
            return jsonify({'message': 'Candidate selected successfully'}), 200
        else:
            return jsonify({'message': 'No application found with that email for this job'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>/reject-candidate', methods=['POST'])
def reject_candidate(job_id):
    try:
        applicant_email = request.json.get('email')
        if not applicant_email:
            return jsonify({'error': 'Email is required'}), 400
        result = application_collection.update_one(
            {'jobId': job_id, 'email': applicant_email},
            {'$set': {'status': 'rejected'}}
        )
        if result.modified_count:
            return jsonify({'message': 'Candidate rejected successfully'}), 200
        else:
            return jsonify({'message': 'No application found with that email for this job'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   
@app.route('/api/job-openings/<job_id>', methods=['DELETE'])
def delete_job_opening(job_id):
    try:
        result = job_openings_collection.delete_one({'_id': ObjectId(job_id)})
        if result.deleted_count:
            return jsonify({'message': 'Job opening deleted successfully'}), 200
        else:
            return jsonify({'message': 'No job opening found with that ID'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-openings/<job_id>/apply', methods=['POST'])
def apply_for_job(job_id):
    try:
        user_id = request.json.get('userId')
        applicant_email = request.json.get('email')
        if not user_id or not applicant_email:
            return jsonify({'error': 'User ID and email are required'}), 400

        # Check if the user has already applied
        existing_application = application_collection.find_one({'userId': user_id, 'jobId': job_id})
        if existing_application:
            return jsonify({'message': 'You have already applied for this job'}), 400

        # Add the application
        new_application = {
            'userId': user_id,
            'jobId': job_id,
            'email': applicant_email,
            'status': 'applied',
            'appliedAt': datetime.utcnow()
        }
        result = application_collection.insert_one(new_application)

        if result.inserted_id:
            return jsonify({'message': 'Application submitted successfully', 'applicationId': str(result.inserted_id)}), 200
        else:
            return jsonify({'error': 'Failed to submit application'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user-applications/<user_id>', methods=['GET'])
def get_user_applications(user_id):
    try:
        # Fetch user applications
        user_applications = list(application_collection.find({'userId': user_id}))
        
        # Fetch job details for each application
        for app in user_applications:
            app['_id'] = str(app['_id'])
            job = job_openings_collection.find_one({'_id': ObjectId(app['jobId'])})
            if job:
                app['jobDetails'] = {
                    'title': job.get('title'),
                    'company': job.get('company'),
                    'shortDescription': job.get('shortDescription'),
                    'pay': job.get('pay'),
                    'level': job.get('level')
                }
            else:
                app['jobDetails'] = None

        return jsonify(user_applications), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user-resume', methods=['GET'])
def get_user_resume():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400
    
    try:
        user_resume = resume_collection.find_one({'email': email})
        if user_resume:
            user_resume['_id'] = str(user_resume['_id'])
            return jsonify(user_resume), 200
        else:
            return jsonify({'error': 'User resume not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)