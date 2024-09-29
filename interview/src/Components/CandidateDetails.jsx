import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Calendar, Mail, Phone, Github, Linkedin, Award, Briefcase, Book, FileText } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CustomButton = ({ children, variant = 'primary', onClick, className = '' }) => {
    const baseClasses = 'px-3 py-1 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm';
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

const CustomCard = ({ children, className = '' }) => (
    <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${className} transition-all duration-200`}
    >
        {children}
    </motion.div>
);

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CandidateCard = ({ candidate, onSelect, onReject, onSchedule, isSelected }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const IconLink = ({ href, icon: Icon, label, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
            onClick={(e) => e.stopPropagation()}
        >
            <Icon size={16} className="mr-2" />
            <span>{label}</span>
            {children}
        </a>
    );

    const ModalSection = ({ title, icon: Icon, children }) => (
        <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-200">
                <Icon className="mr-2" size={20} />
                {title}
            </h4>
            {children}
        </div>
    );

    return (
        <>
            <CustomCard className="mb-4">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{candidate.position}</p>
                    <div className="flex space-x-2 mb-2">
                        <IconLink href={`mailto:${candidate.email}`} icon={Mail} label="Email" />
                        <IconLink href={`tel:${candidate.phone}`} icon={Phone} label="Phone" />
                        <IconLink href={candidate.github} icon={Github} label="GitHub" />
                        <IconLink href={candidate.linkedin} icon={Linkedin} label="LinkedIn" />
                    </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                    <CustomButton variant="outline" onClick={openModal}>
                        See More
                    </CustomButton>
                    <div>
                        {!isSelected ? (
                            <>
                                <CustomButton
                                    variant="outline"
                                    onClick={() => onReject(candidate)}
                                    className="mr-2"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                </CustomButton>
                                <CustomButton onClick={() => onSelect(candidate)}>
                                    <Check className="w-4 h-4 mr-1" />
                                    Select
                                </CustomButton>
                            </>
                        ) : (
                            <CustomButton onClick={() => onSchedule(candidate)}>
                                <Calendar className="w-4 h-4 mr-1" />
                                Schedule Interview
                            </CustomButton>
                        )}
                    </div>
                </div>
            </CustomCard>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{candidate.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{candidate.position}</p>
                        <div className="space-y-2">
                            <IconLink href={`mailto:${candidate.email}`} icon={Mail} label="Email">
                                <span className="ml-2">{candidate.email}</span>
                            </IconLink>
                            <IconLink href={`tel:${candidate.phone}`} icon={Phone} label="Phone">
                                <span className="ml-2">{candidate.phone}</span>
                            </IconLink>
                            <IconLink href={candidate.github} icon={Github} label="GitHub">
                                <span className="ml-2">GitHub Profile</span>
                            </IconLink>
                            <IconLink href={candidate.linkedin} icon={Linkedin} label="LinkedIn">
                                <span className="ml-2">LinkedIn Profile</span>
                            </IconLink>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <ModalSection title="Skills" icon={Award}>
                            <p className="text-gray-700 dark:text-gray-300">{candidate.skills.join(', ')}</p>
                        </ModalSection>
                        <ModalSection title="Experience" icon={Briefcase}>
                            {candidate.experiences.map((exp, index) => (
                                <div key={index} className="mb-4">
                                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">{exp.company}</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.duration}</p>
                                    <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
                                        {exp.responsibilities.map((resp, respIndex) => (
                                            <li key={respIndex}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ModalSection>
                        <ModalSection title="Projects" icon={FileText}>
                            {candidate.projects.map((project, index) => (
                                <div key={index} className="mb-4">
                                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">{project.name}</h5>
                                    <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
                                        {project.details.map((detail, detailIndex) => (
                                            <li key={detailIndex}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ModalSection>
                        <ModalSection title="Education" icon={Book}>
                            {candidate.educations.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">{edu.institution}</h5>
                                    <p className="text-gray-700 dark:text-gray-300">{edu.degree} ({edu.year})</p>
                                </div>
                            ))}
                        </ModalSection>
                        {candidate.certifications.length > 0 && (
                            <ModalSection title="Certifications" icon={Award}>
                                <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
                                    {candidate.certifications.map((cert, index) => (
                                        <li key={index}>{cert}</li>
                                    ))}
                                </ul>
                            </ModalSection>
                        )}
                        {candidate.coverLetter && (
                            <ModalSection title="Cover Letter" icon={FileText}>
                                <p className="text-gray-700 dark:text-gray-300">{candidate.coverLetter}</p>
                            </ModalSection>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

const UserInfoCard = ({ user }) => (
    <CustomCard className="mb-8">
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <p className="mb-2"><strong>Name:</strong> {user.name || 'Not available'}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email || 'Not available'}</p>
            <p className="mb-2"><strong>Phone:</strong> {user.phone || 'Not available'}</p>
            <p className="mb-2"><strong>Position:</strong> {user.position || 'Not available'}</p>
        </div>
    </CustomCard>
);

const CandidateDetailsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [jobDetails, setJobDetails] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/job-openings/${jobId}`);
                setJobDetails(response.data);
                if (response.data.applicants) {
                    fetchCandidates(response.data.applicants);
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchJobDetails();
        fetchUserData();
    }, [jobId]);

    const fetchCandidates = async (emails) => {
        try {
            const candidatesData = await Promise.all(
                emails.map(email => axios.get(`http://localhost:5000/api/user-resume?email=${email}`))
            );
            setCandidates(candidatesData.map(response => response.data));
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const handleSelect = (candidate) => {
        setSelectedCandidates([...selectedCandidates, candidate]);
        setCandidates(candidates.filter(c => c.email !== candidate.email));
    };

    const handleReject = (candidate) => {
        setCandidates(candidates.filter(c => c.email !== candidate.email));
    };

    const handleSchedule = (candidate) => {
        console.log('Scheduling interview for', candidate.name);
        // Implement the scheduling logic here
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto p-8">
                <CustomButton
                    variant="ghost"
                    onClick={() => navigate('/dashboard/client')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </CustomButton>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8"
                >
                    Candidate Details for {jobDetails?.title}
                </motion.h1>

                {userData && <UserInfoCard user={userData} />}

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-semibold mb-4">To Review</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {candidates.map(candidate => (
                                <motion.div
                                    key={candidate.email}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <CandidateCard
                                        candidate={candidate}
                                        onSelect={handleSelect}
                                        onReject={handleReject}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Schedule Interview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {selectedCandidates.map(candidate => (
                                <motion.div
                                    key={candidate.email}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <CandidateCard
                                        candidate={candidate}
                                        onSchedule={handleSchedule}
                                        isSelected={true}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default CandidateDetailsPage;