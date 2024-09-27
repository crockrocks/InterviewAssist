import React, { useState } from 'react';
import { Edit, Trash2, X  } from 'lucide-react';

const CustomButton = ({ children, variant = 'primary', onClick, className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const CustomInput = ({ placeholder, value, onChange }) => (
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const CustomTextarea = ({ placeholder, value, onChange }) => (
  <textarea
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const CustomDialog = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomCard = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const AlternatePage = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'DRDO',
      shortDescription: 'Develop cutting-edge software solutions.',
      fullDescription: 'As a Software Engineer at DRDO, you will be responsible for designing, developing, and maintaining advanced software systems for defense applications. You will work on challenging projects that push the boundaries of technology.',
      pay: '₹15,00,000 - ₹25,00,000 per annum',
      level: 'Mid-Senior'
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'DRDO RAC',
      shortDescription: 'Analyze complex datasets to derive insights.',
      fullDescription: 'Join our team as a Data Analyst at DRDO RAC to work on critical data analysis projects. You will be responsible for processing large datasets, creating visualizations, and providing actionable insights to support decision-making processes.',
      pay: '₹12,00,000 - ₹18,00,000 per annum',
      level: 'Entry-Mid'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DRDO',
      shortDescription: 'Create intuitive user experiences for web and mobile apps.',
      fullDescription: 'As a UX Designer at DRDO, you will be responsible for creating user-centered designs for various digital platforms. Your work will involve user research, prototyping, and collaborating with cross-functional teams to deliver exceptional user experiences.',
      pay: '₹10,00,000 - ₹20,00,000 per annum',
      level: 'Junior-Mid'
    },
  ]);

  const [message, setMessage] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isReadMoreOpen, setReadMoreOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    shortDescription: '',
    fullDescription: '',
    pay: '',
    level: ''
  });

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const openJobModal = (job = null) => {
    if (job) {
      setNewJob({ ...job });
      setSelectedJob(job);
    } else {
      setNewJob({ title: '', company: '', shortDescription: '', fullDescription: '', pay: '', level: '' });
      setSelectedJob(null);
    }
    setModalOpen(true);
  };

  const handleSaveJob = () => {
    if (newJob.title && newJob.company && newJob.shortDescription) {
      if (selectedJob) {
        setJobs(jobs.map(job => job.id === selectedJob.id ? { ...newJob, id: job.id } : job));
        showMessage('Job opening updated successfully!');
      } else {
        const newJobEntry = {
          ...newJob,
          id: jobs.length + 1,
        };
        setJobs([...jobs, newJobEntry]);
        showMessage('New job opening created successfully!');
      }
      setModalOpen(false);
    }
  };

  const deleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    showMessage('Job opening deleted successfully!');
  };

  const JobCard = ({ job }) => (
    <CustomCard className="transition transform hover:shadow-xl">
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{job.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{job.company}</p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">{job.shortDescription}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pay: {job.pay}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Level: {job.level}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between">
        <CustomButton variant="outline" onClick={() => setReadMoreOpen(job)}>
          Read More
        </CustomButton>
        <div>
          <CustomButton variant="ghost" onClick={() => openJobModal(job)} className="mr-2">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </CustomButton>
          <CustomButton variant="ghost" onClick={() => deleteJob(job.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </CustomButton>
        </div>
      </div>
    </CustomCard>
  );

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Job Postings Dashboard</h1>

        {message && <div className="mb-4 p-4 bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 rounded">{message}</div>}

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Current Openings</h2>
            <CustomButton onClick={() => openJobModal()}>Create New Opening</CustomButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        <CustomDialog
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedJob ? 'Edit Job Opening' : 'Create New Job Opening'}
        >
          <div className="grid gap-4 py-4">
            <CustomInput
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <CustomInput
              placeholder="Company Name"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            />
            <CustomInput
              placeholder="Pay Range"
              value={newJob.pay}
              onChange={(e) => setNewJob({ ...newJob, pay: e.target.value })}
            />
            <CustomInput
              placeholder="Level"
              value={newJob.level}
              onChange={(e) => setNewJob({ ...newJob, level: e.target.value })}
            />
            <CustomTextarea
              placeholder="Short Description"
              value={newJob.shortDescription}
              onChange={(e) => setNewJob({ ...newJob, shortDescription: e.target.value })}
            />
            <CustomTextarea
              placeholder="Full Description"
              value={newJob.fullDescription}
              onChange={(e) => setNewJob({ ...newJob, fullDescription: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <CustomButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={handleSaveJob}>{selectedJob ? 'Update' : 'Create'}</CustomButton>
          </div>
        </CustomDialog>

        <CustomDialog
          isOpen={isReadMoreOpen}
          onClose={() => setReadMoreOpen(false)}
          title={isReadMoreOpen?.title}
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Company: {isReadMoreOpen?.company}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pay: {isReadMoreOpen?.pay}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Level: {isReadMoreOpen?.level}</p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{isReadMoreOpen?.fullDescription}</p>
          </div>
          <CustomButton onClick={() => setReadMoreOpen(false)}>Close</CustomButton>
        </CustomDialog>
      </div>
    </div>
  );
};

export default AlternatePage;