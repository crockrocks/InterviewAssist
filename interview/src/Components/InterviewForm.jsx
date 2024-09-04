import React, { useState } from 'react';
import axios from 'axios';

function InterviewForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resume);

    try {
      const response = await axios.post('/api/submit-interview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        alert('Interview form submitted successfully');
      } else {
        alert('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}

export default InterviewForm;