from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
from parse import extract_text_from_pdf, parse_resume
from llm import get_candidate_data, generate_summary

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

client = MongoClient("mongodb+srv://anubhajarwal2003:Niharika021@candidates.fnkt3.mongodb.net/SIH?retryWrites=true&w=majority")
db = client['SIH']
users_collection = db['User']
employee_collection = db['Employee']
interviews_collection = db['Interview']
resume_collection = db['UserResume']

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
        return jsonify({'success': True})
    return jsonify({'success': False}), 401

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume_route():
    if 'resume' not in request.files:
        return jsonify({'success': False, 'message': 'No resume file provided.'}), 400

    resume = request.files['resume']
    if resume.filename == '':
        return jsonify({'success': False, 'message': 'No selected file.'}), 400

    if not allowed_file(resume.filename):
        return jsonify({'success': False, 'message': 'Invalid file type. Only PDF files are allowed.'}), 400

    filename = secure_filename(f"temp_{os.urandom(8).hex()}_{resume.filename}")
    resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    resume.save(resume_path)

    try:
        text = extract_text_from_pdf(resume_path)
        if not text:
            raise ValueError("No text extracted from the document")
        parsed_data = parse_resume(text)
        print(parsed_data)
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
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        position = request.form.get('position')
        linkedin = request.form.get('linkedin')
        github = request.form.get('github')
        coverLetter = request.form.get('coverLetter')
        skills = request.form.get('skills')
        experience = request.form.get('experiences')
        projects = request.form.get('projects')
        resume = request.files.get('resume')
        certifications = request.form.get('certifications')

        filename = None
        if resume:
            filename = f"{name}_{resume.filename}"
            resume_path = os.path.join(UPLOAD_FOLDER, filename)
            resume.save(resume_path)

        # Prepare the interview data
        interview_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'position': position,
            'linkedin': linkedin,
            'github': github,
            'coverLetter': coverLetter,
            'skills': skills,
            'experience': experience,
            'resume_filename': filename,
            'certifications': certifications
        }

        interviews_collection.insert_one(interview_data)

        return jsonify({'success': True, 'message': 'Interview submission successful.'})

    except Exception as e:
        return jsonify({'success': False, 'message': 'Error during interview submission.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)
