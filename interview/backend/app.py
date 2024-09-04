from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
import os

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['interview_app']
users_collection = db['users']
interviews_collection = db['interviews']

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username']})
    if user and check_password_hash(user['password'], data['password']):
        return jsonify({'success': True})
    return jsonify({'success': False}), 401

@app.route('/api/submit-interview', methods=['POST'])
def submit_interview():
    name = request.form['name']
    email = request.form['email']
    resume = request.files['resume']

    # Save resume file
    if resume:
        filename = f"{name}_{resume.filename}"
        resume.save(os.path.join('uploads', filename))
    
    # Save interview data to MongoDB
    interview_data = {
        'name': name,
        'email': email,
        'resume_filename': filename if resume else None
    }
    interviews_collection.insert_one(interview_data)

    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)