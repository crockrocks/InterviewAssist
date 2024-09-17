import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Input,
  Textarea
} from './ui/custom-components';

const EditableCard = ({ title, content, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <FaEdit />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <FaTrash />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full"
          />
        ) : (
          <p>{content}</p>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const ExperienceCard = ({ experience, onEdit, onDelete, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperience, setEditedExperience] = useState(experience);

  const handleSave = () => {
    onEdit(editedExperience);
    setIsEditing(false);
  };

  return (
    <Card className={`mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <CardHeader className="flex justify-between items-center">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{experience.company}</h3>
        <div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <FaEdit />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <FaTrash />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedExperience.company}
              onChange={(e) => setEditedExperience({ ...editedExperience, company: e.target.value })}
              placeholder="Company"
            />
            <Input
              value={editedExperience.duration}
              onChange={(e) => setEditedExperience({ ...editedExperience, duration: e.target.value })}
              placeholder="Duration"
            />
            <Textarea
              value={editedExperience.responsibilities.join('\n')}
              onChange={(e) => setEditedExperience({ ...editedExperience, responsibilities: e.target.value.split('\n') })}
              placeholder="Responsibilities (one per line)"
            />
          </div>
        ) : (
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{experience.duration}</p>
            <ul className={`list-disc list-inside mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {experience.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const ProjectCard = ({ project, onEdit, onDelete, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleSave = () => {
    onEdit(editedProject);
    setIsEditing(false);
  };

  return (
    <Card className={`mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <CardHeader className="flex justify-between items-center">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{project.name}</h3>
        <div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <FaEdit />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <FaTrash />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedProject.name}
              onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
              placeholder="Project Name"
            />
            <Textarea
              value={editedProject.details.join('\n')}
              onChange={(e) => setEditedProject({ ...editedProject, details: e.target.value.split('\n') })}
              placeholder="Project Details (one per line)"
            />
          </div>
        ) : (
          <ul className={`list-disc list-inside mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const SkillsCard = ({ skills, availableSkills, onAddSkill, onRemoveSkill }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      onAddSkill(newSkill);
      setNewSkill('');
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">Skills</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
              {skill}
              <button onClick={() => onRemoveSkill(skill)} className="ml-2 text-red-500">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            list="availableSkills"
          />
          <datalist id="availableSkills">
            {availableSkills.map((skill, index) => (
              <option key={index} value={skill} />
            ))}
          </datalist>
          <Button onClick={handleAddSkill} className="ml-2">
            <FaPlus />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function InterviewForm({ darkMode, onLogout }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [certifications, setCertifications] = useState('');
  const [loading, setLoading] = useState(false);

  const availableSkills = ["JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB"];

  const addSkill = (newSkill) => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: '', duration: '', responsibilities: [] }]);
  };

  const editExperience = (index, updatedExperience) => {
    const newExperiences = [...experiences];
    newExperiences[index] = updatedExperience;
    setExperiences(newExperiences);
  };

  const deleteExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, { name: '', details: [] }]);
  };

  const editProject = (index, updatedProject) => {
    const newProjects = [...projects];
    newProjects[index] = updatedProject;
    setProjects(newProjects);
  };

  const deleteProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

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

          setName(parsed.name);
          setEmail(parsed.email);
          setPhone(parsed.phone);
          setLinkedin(parsed.linkedin);
          setSkills(parsed.skills.split(', '));
          setEducation(parsed.education);
          setCertifications(parsed.certifications);

          const experiencesArray = parsed.experience.split('\n\n').map(exp => {
            const lines = exp.split('\n');
            return {
              company: lines[0],
              duration: lines[1],
              responsibilities: lines.slice(2).map(resp => resp.trim().replace('• ', ''))
            };
          });
          setExperiences(experiencesArray);

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
    formData.append('skills', skills.join(', '));
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
        // Reset form fields here
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
      <Input
        type={type}
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );

  const renderTextArea = (label, value, setter, placeholder) => (
    <div>
      <label htmlFor={label.toLowerCase()} className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>{label}</label>
      <Textarea
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        rows="3"
      />
    </div>
  );

  return (
    <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} w-full rounded-lg shadow border md:mt-0 sm:max-w-2xl xl:p-0`}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-between items-center">
              <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-xl font-bold leading-tight tracking-tight md:text-2xl`}>
                Job Application Form
              </h1>
              <Button onClick={onLogout}>Logout</Button>
            </div>

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

              <EditableCard
                title="Personal Information"
                content={`Name: ${name}\nEmail: ${email}\nPhone: ${phone}`}
                onEdit={(content) => {
                  const [newName, newEmail, newPhone] = content.split('\n').map(line => line.split(': ')[1]);
                  setName(newName);
                  setEmail(newEmail);
                  setPhone(newPhone);
                }}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <EditableCard
                title="Position Applied For"
                content={position}
                onEdit={setPosition}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <EditableCard
                title="Cover Letter"
                content={coverLetter}
                onEdit={setCoverLetter}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <SkillsCard
                skills={skills}
                availableSkills={availableSkills}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
              />

              <div>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Experience</h2>
                {experiences.map((experience, index) => (
                  <ExperienceCard
                    key={index}
                    experience={experience}
                    onEdit={(updatedExperience) => editExperience(index, updatedExperience)}
                    onDelete={() => deleteExperience(index)}
                    darkMode={darkMode}
                  />
                ))}
                <Button onClick={addExperience} className="mt-2">
                  <FaPlus className="mr-2" /> Add Experience
                </Button>
              </div>

              <div>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Projects</h2>
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    project={project}
                    onEdit={(updatedProject) => editProject(index, updatedProject)}
                    onDelete={() => deleteProject(index)}
                    darkMode={darkMode}
                  />
                ))}
                <Button onClick={addProject} className="mt-2">
                  <FaPlus className="mr-2" /> Add Project
                </Button>
              </div>

              <EditableCard
                title="Education"
                content={education}
                onEdit={setEducation}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <EditableCard
                title="LinkedIn Profile"
                content={linkedin}
                onEdit={setLinkedin}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <EditableCard
                title="GitHub Profile"
                content={github}
                onEdit={setGithub}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <EditableCard
                title="Certifications"
                content={certifications}
                onEdit={setCertifications}
                onDelete={() => {/* Handle delete if needed */ }}
              />

              <Button type="submit" className="w-full">
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InterviewForm;