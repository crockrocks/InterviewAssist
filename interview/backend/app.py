from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
import json
import traceback
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from score import summary_match
from parse import extract_text_from_pdf, parse_resume
from dotenv import load_dotenv
import os


load_dotenv()
uri = os.getenv("MONGO_URI")
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

client = MongoClient(uri)
db = client['SIH']
users_collection = db['User']
resume_collection = db['UserResume']
job_openings_collection = db['JobOpening']
application_collection = db['application']
employee_collection = db['Employee']


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

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume_route():
    if 'resume' not in request.files:
        return jsonify({'success': False, 'message': 'No resume file provided.'}), 400

    resume = request.files['resume']
    if resume.filename == '':
        return jsonify({'success': False, 'message': 'No selected file.'}), 400

    if not allowed_file(resume.filename):
        return jsonify({'success': False, 'message': 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.'}), 400

    filename = secure_filename(f"temp_{os.urandom(8).hex()}_{resume.filename}")
    resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    resume.save(resume_path)

    try:
        text = extract_text_from_pdf(resume_path)
        if not text:
            raise ValueError("No text extracted from the document")
        parsed_data = parse_resume(text)
        os.remove(resume_path)
        return jsonify({'success': True, 'parsed_data': parsed_data})

    except Exception as e:
        if os.path.exists(resume_path):
            os.remove(resume_path)
        print(f"Error during resume parsing: {str(e)}")
        return jsonify({'success': False, 'message': 'Error parsing resume.', 'error': str(e)}), 500

@app.route('/api/submit-interview', methods=['POST'])
def submit_interview():
    try:
        # Basic fields
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        position = request.form.get('position')
        linkedin = request.form.get('linkedin')
        github = request.form.get('github')
        coverLetter = request.form.get('coverLetter')

        # Array fields
        skills = json.loads(request.form.get('skills', '[]'))
        experiences = json.loads(request.form.get('experiences', '[]'))
        projects = json.loads(request.form.get('projects', '[]'))
        educations = json.loads(request.form.get('educations', '[]'))
        certifications = json.loads(request.form.get('certifications', '[]'))

        # Resume file handling
        resume = request.files.get('resume')
        filename = None
        if resume and allowed_file(resume.filename):
            filename = secure_filename(f"{name}_{resume.filename}")
            resume_path = os.path.join(UPLOAD_FOLDER, filename)
            resume.save(resume_path)

        interview_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'position': position,
            'linkedin': linkedin,
            'github': github,
            'coverLetter': coverLetter,
            'skills': skills,
            'experiences': experiences,
            'projects': projects,
            'educations': educations,
            'resume_filename': filename,
            'certifications': certifications
        }

        result = resume_collection.insert_one(interview_data)
        user_id = str(result.inserted_id)

        user_data = resume_collection.find_one({'_id': result.inserted_id})
        user_data['_id'] = str(user_data['_id'])  # Convert ObjectId to string

        return jsonify({
            'success': True, 
            'message': 'Interview submission successful.',
            'user_id': user_id,
            'userData': user_data
        })

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {str(e)}")
        return jsonify({'success': False, 'message': 'Invalid JSON data.', 'error': str(e)}), 400
    except Exception as e:
        print(f"Error during interview submission: {str(e)}")
        return jsonify({'success': False, 'message': 'Error during interview submission.', 'error': str(e)}), 500


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
            user_data.pop('password', None)

            # Fetch additional data from resume_collection
            resume_data = resume_collection.find_one({'email': user_data['email']})
            if resume_data:
                user_data['phone'] = resume_data.get('phone')
                user_data['position'] = resume_data.get('position')

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

@app.route('/api/score-candidate/<job_id>/<candidate_email>', methods=['GET'])
def score_candidate(job_id, candidate_email):
    try:
        # Log the incoming request
        print(f"Received request for job_id: {job_id}, candidate_email: {candidate_email}")

        # Fetch job details
        job = job_openings_collection.find_one({'_id': ObjectId(job_id)})
        if not job:
            print(f"Job not found for id: {job_id}")
            return jsonify({'error': 'Job not found'}), 404
        
        print(f"Job found: {job['title']}")

        # Fetch candidate resume
        candidate_resume = resume_collection.find_one({'email': candidate_email})
        if not candidate_resume:
            print(f"Candidate resume not found for email: {candidate_email}")
            return jsonify({'error': 'Candidate resume not found'}), 404
        
        print(f"Candidate resume found for: {candidate_resume['name']}")

        # Use the full description from the job posting
        job_description = job['fullDescription']
        
        # Get all experts from the Employee collection
        experts = list(employee_collection.find())
        print(f"Found {len(experts)} experts")

        # Calculate match result for each expert
        expert_results = []
        for expert in experts:
            try:
                match_result = summary_match(candidate_resume, job_description, expert)
                scores = parse_scores(match_result)
                expert_results.append({
                    'name': expert['name'],
                    'position': expert['position'],
                    'score': scores.get('Overall Score', 0)
                })
            except Exception as e:
                print(f"Error calculating match for expert {expert['name']}: {str(e)}")

        # Sort experts by score and get top 5
        top_experts = sorted(expert_results, key=lambda x: x['score'], reverse=True)[:5]
        
        # Calculate final match result using the candidate's resume and job description
        final_match_result = summary_match(candidate_resume, job_description, None)
        final_scores = parse_scores(final_match_result)
        
        response_data = {
            'matchResult': final_scores,
            'candidateName': candidate_resume['name'],
            'jobTitle': job['title'],
            'topExperts': top_experts
        }
        print("Successfully calculated scores and experts")
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error in score_candidate: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

def parse_scores(match_result):
    # Helper function to parse scores from the match_result string
    scores = {}
    for line in match_result.split('\n'):
        if ':' in line:
            key, value = line.split(':')
            try:
                scores[key.strip()] = float(value.strip().split('/')[0])
            except ValueError:
                print(f"Error parsing score: {line}")
    return scores

@app.route('/api/top-experts/<job_id>/<candidate_email>', methods=['GET'])
def get_top_experts(job_id, candidate_email):
    try:
        # Fetch job details
        job = job_openings_collection.find_one({'_id': ObjectId(job_id)})
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Fetch candidate resume
        candidate_resume = resume_collection.find_one({'email': candidate_email})
        if not candidate_resume:
            return jsonify({'error': 'Candidate resume not found'}), 404

        # Fetch all experts
        experts = list(employee_collection.find())

        # Calculate scores for each expert
        expert_scores = []
        for expert in experts:
            expert_profile = f"Name: {expert['name']}, Position: {expert['position']}, Skills: {', '.join(expert['skills'])}"
            match_result = summary_match(candidate_resume['skills'], job['fullDescription'], expert_profile)
            
            # Parse the overall score from the match_result
            overall_score = float(match_result.split('Overall Score: ')[1].split('/')[0])
            
            expert_scores.append({
                'name': expert['name'],
                'score': overall_score,
                'position': expert['position']
            })

        top_experts = nlargest(5, expert_scores, key=lambda x: x['score'])

        return jsonify(top_experts), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)