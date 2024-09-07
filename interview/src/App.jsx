import React, { useState, useEffect } from 'react';
import LoginForm from './Components/Login';
import InterviewForm from './Components/InterviewForm';
import Header from './Components/Header';
import AlternatePage from './Components/AlternatePage'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAltLoggedIn, setIsAltLoggedIn] = useState(false); 
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      {!isLoggedIn && !isAltLoggedIn ? (
        <LoginForm 
          onLoginSuccess={() => setIsLoggedIn(true)} 
          onAlternateLoginSuccess={() => setIsAltLoggedIn(true)} 
          darkMode={darkMode} 
        />
      ) : isLoggedIn ? (
        <InterviewForm darkMode={darkMode} />
      ) : (
        <AlternatePage darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
