import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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

const CandidateDetailsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-7xl mx-auto p-8">
                <CustomButton
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </CustomButton>
                <h1 className="text-4xl font-bold mb-8">Candidate Details for Job ID: {jobId}</h1>
                <p className="text-xl mb-4">This page is currently empty. It will be used to display candidate details in the future.</p>

            </div>
        </div>
    );
};

export default CandidateDetailsPage;