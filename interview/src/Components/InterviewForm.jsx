import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; // React Icons

function InterviewForm({ darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    setResume(file);
    
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/parse-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          const parsed = response.data.parsed_data;
          setName(parsed.name !== "Not found." ? parsed.name : '');
          setEmail(parsed.email !== "Not found." ? parsed.email : '');
          setPhone(parsed.phone !== "Not found." ? parsed.phone : '');
          setSkills(parsed.skills !== "Not found." ? parsed.skills : '');
          setExperience(parsed.experience !== "Not found." ? parsed.experience : '');
          setCoverLetter(''); 
        } else {
          alert(response.data.message || 'Resume parsing failed');
        }
      } catch (error) {
        console.error('Resume parsing error:', error);
        alert('Resume parsing failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('position', position);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);
    formData.append('skills', skills);
    formData.append('experience', experience);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/submit-interview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        alert('Interview form submitted successfully');
        setName('');
        setEmail('');
        setPhone('');
        setPosition('');
        setCoverLetter('');
        setResume(null);
        setSkills('');
        setExperience('');
      } else {
        alert(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed');
    }
  };

  return (
    <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} w-full rounded-lg shadow border md:mt-0 sm:max-w-lg xl:p-0`}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-bold leading-tight tracking-tight md:text-2xl`}>
              Job Application Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="flex items-center mb-4">
                <label htmlFor="resume" className={`flex items-center cursor-pointer ${darkMode ? 'text-white' : 'text-black'} mr-2`}>
                  <FaPlus className="w-6 h-6" />
                  <span className="ml-2 text-lg font-medium">Upload Resume</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  onChange={handleResumeUpload}
                  className="hidden"
                  accept=".pdf"
                />
              </div>
              <div>
                <label htmlFor="name" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+123 456 7890"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                />
              </div>
              <div>
                <label htmlFor="position" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Position Applied For</label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Software Engineer"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                />
              </div>
              <div>
                <label htmlFor="skills" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Skills</label>
                <textarea
                  name="skills"
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Your skills..."
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label htmlFor="experience" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Experience</label>
                <textarea
                  name="experience"
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Your experience..."
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label htmlFor="coverLetter" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Cover Letter</label>
                <textarea
                  name="coverLetter"
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InterviewForm;
