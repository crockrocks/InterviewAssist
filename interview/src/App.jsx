import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/Login';
import InterviewForm from './Components/InterviewForm';
import Header from './Components/Header';
import AlternatePage from './Components/AlternatePage';
import Dashboard from './Components/Dashboard';

function App() {
  const [isAltLoggedIn, setIsAltLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = () => {
    setIsAltLoggedIn(false);  
  };

  const handleSignUpSuccess = () => {
    setIsAltLoggedIn(false);  
  };

  const handleInterviewComplete = () => {
    setIsAltLoggedIn(false);  
  };

  const handleAlternateLoginSuccess = () => {
    setIsAltLoggedIn(true); 
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        {isAltLoggedIn ? (
          <Routes>
            <Route
              path="/dashboard/client"
              element={<AlternatePage darkMode={darkMode} />}  
            />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <LoginForm 
                  onLoginSuccess={handleLoginSuccess}
                  onSignUpSuccess={handleSignUpSuccess}
                  onAlternateLoginSuccess={handleAlternateLoginSuccess} 
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/interview"
              element={
                <InterviewForm onComplete={handleInterviewComplete} darkMode={darkMode} />
              }
            />
            <Route
              path="/dashboard/:userId"
              element={<Dashboard darkMode={darkMode} />}
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
