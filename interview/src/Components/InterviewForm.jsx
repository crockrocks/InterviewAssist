import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

// Component to display experiences
const ExperienceCard = ({ experience, darkMode }) => (
  <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{experience.company}</h3>
    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{experience.duration}</p>
    <ul className={`list-disc list-inside mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {experience.responsibilities.map((resp, index) => (
        <li key={index}>{resp}</li>
      ))}
    </ul>
  </div>
);

// Component to display projects
const ProjectCard = ({ project, darkMode }) => (
  <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{project.name}</h3>
    <ul className={`list-disc list-inside mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {project.details.map((detail, index) => (
        <li key={index}>{detail}</li>
      ))}
    </ul>
  </div>
);

// Main form component
function InterviewForm({ darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [certifications, setCertifications] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle resume upload and parsing
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

          // Set parsed data
          setName(parsed.name);
          setEmail(parsed.email);
          setPhone(parsed.phone);
          setLinkedin(parsed.linkedin);
          setSkills(parsed.skills);
          setEducation(parsed.education);
          setCertifications(parsed.certifications);

          // Process experience data
          const experiencesArray = parsed.experience.split('\n\n').map(exp => {
            const lines = exp.split('\n');
            return {
              company: lines[0],
              duration: lines[1],
              responsibilities: lines.slice(2).map(resp => resp.trim().replace('• ', ''))
            };
          });
          setExperiences(experiencesArray);

          // Process project data (assuming `projects` is structured similarly to experience)
          const projectsArray = parsed.projects.split('\n\n').map(proj => {
            const lines = proj.split('\n');
            return {
              name: lines[0],
              details: lines.slice(1).map(detail => detail.trim().replace('• ', ''))
            };
          });
          setProjects(projectsArray);

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
    formData.append('experiences', JSON.stringify(experiences));
    formData.append('projects', JSON.stringify(projects));
    formData.append('education', education);
    formData.append('linkedin', linkedin);
    formData.append('github', github);
    formData.append('certifications', certifications);

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
        setExperiences([]);
        setProjects([]);
        setEducation('');
        setLinkedin('');
        setGithub('');
        setCertifications('');
      } else {
        alert(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed');
    }
  };

  const renderInput = (label, value, setter, placeholder, type = "text") => (
    <div>
      <label htmlFor={label.toLowerCase()} className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>{label}</label>
      <input
        type={type}
        name={label.toLowerCase()}
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        required
      />
    </div>
  );

  const renderTextArea = (label, value, setter, placeholder) => (
    <div>
      <label htmlFor={label.toLowerCase()} className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>{label}</label>
      <textarea
        name={label.toLowerCase()}
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        rows="3"
      ></textarea>
    </div>
  );

  return (
    <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} w-full rounded-lg shadow border md:mt-0 sm:max-w-2xl xl:p-0`}>
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

              {renderInput("Full Name", name, setName, "John Doe")}
              {renderInput("Email", email, setEmail, "name@company.com", "email")}
              {renderInput("Phone Number", phone, setPhone, "+123 456 7890", "tel")}
              {renderInput("Position Applied For", position, setPosition, "Software Engineer")}
              {renderInput("LinkedIn", linkedin, setLinkedin, "linkedin.com/in/yourprofile")}
              {renderInput("GitHub", github, setGithub, "github.com/yourusername")}
              {renderTextArea("Cover Letter", coverLetter, setCoverLetter, "Why do you want this job?")}

              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Skills</label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="List your skills"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  rows="3"
                ></textarea>
              </div>

              <div className="mt-6">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Experience</h2>
                {experiences.map((experience, index) => (
                  <ExperienceCard key={index} experience={experience} darkMode={darkMode} />
                ))}
              </div>

              <div className="mt-6">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Projects</h2>
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} darkMode={darkMode} />
                ))}
              </div>

              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Education</label>
                <textarea
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Your education details"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  rows="2"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Certifications</label>
                <textarea
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="Any certifications"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-400 text-black'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  rows="2"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loading ? 'Loading...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InterviewForm;