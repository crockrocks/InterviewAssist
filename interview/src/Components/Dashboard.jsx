import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userId } = useParams();

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Software Engineer', company: 'DRDO', description: 'Develop cutting-edge software solutions.' },
    { id: 2, title: 'Data Analyst', company: 'DRDO RAC', description: 'Analyze complex datasets to derive insights.' },
    { id: 3, title: 'UX Designer', company: 'DRDO', description: 'Create intuitive user experiences for web and mobile apps.' },
  ]);

  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || userId === 'undefined') {
        setError('Invalid or missing user ID.');
        setIsLoading(false);
        return;
      }
      
      const storedResumeData = localStorage.getItem('userResumeData');
      if (storedResumeData) {
        setUserData(JSON.parse(storedResumeData));
        setIsLoading(false);
      } else {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
          setUserData(response.data);

          localStorage.setItem('userResumeData', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error.response?.data?.error || 'Unable to fetch user data.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const applyForJob = (jobId) => {
    const jobToApply = jobs.find((job) => job.id === jobId);
    if (jobToApply) {
      setAppliedJobs([...appliedJobs, jobToApply]);
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-100 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Warning!</strong>
        <span className="block sm:inline"> No user data found. Please try again or contact support.</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen dark:bg-gray-800 dark:text-white">
      {/* Sidebar */}
      <div className={`bg-gray-100 dark:bg-gray-700 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <button onClick={toggleSidebar} className="w-full p-4 flex justify-end">
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
        {isSidebarOpen && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p className="mb-2"><strong>Name:</strong> {userData.name || 'Not available'}</p>
            <p className="mb-2"><strong>Email:</strong> {userData.email || 'Not available'}</p>
            <p className="mb-2"><strong>Phone:</strong> {userData.phone || 'Not available'}</p>
            <p className="mb-2"><strong>Position:</strong> {userData.position || 'Not available'}</p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userData.name || 'User'}!</h1>

        {/* Available Openings */}
        <h2 className="text-2xl font-semibold mb-4">Available Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-700 shadow-md rounded px-8 pt-6 pb-8">
              <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
              <p className="mb-4">{job.description}</p>
              <button 
                onClick={() => applyForJob(job.id)} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Apply
              </button>
            </div>
          ))}
        </div>

        {/* Applied Jobs */}
        {appliedJobs.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Applied Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appliedJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-700 shadow-md rounded px-8 pt-6 pb-8">
                  <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                  <p className="mb-4">{job.description}</p>
                  <p className="text-green-600 dark:text-green-300 font-bold">Applied</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex h-screen dark:bg-gray-800">
    <div className="w-64 bg-gray-100 dark:bg-gray-700">
      <div className="h-full animate-pulse bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="flex-1 p-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;
