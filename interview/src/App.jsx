import React, { useState } from 'react';
import LoginForm from './Components/Login';
import InterviewForm from './Components/InterviewForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interview Application</h1>
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <InterviewForm />
      )}
    </div>
  );
}

export default App;