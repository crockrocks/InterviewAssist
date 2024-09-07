import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLoginSuccess, onAlternateLoginSuccess, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const testUser = {
      email: 'test@example.com',
      password: 'test',
    };

    const altUser = {
      email: 'client@example.com',
      password: 'client',
    };

    if (isLogin) {
      if (email === testUser.email && password === testUser.password) {
        onLoginSuccess();
        return;
      } else if (email === altUser.email && password === altUser.password) {
        onAlternateLoginSuccess();
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
        if (response.data.success) {
          onLoginSuccess();
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
      }
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/register', { email, password });
        if (response.data.success) {
          onLoginSuccess();
        } else {
          alert('Sign-up failed');
        }
      } catch (error) {
        console.error('Sign-up error:', error);
        alert('Sign-up failed');
      }
    }
  };

  return (
    <section className={`${darkMode ? 'bg-dark-background' : 'bg-light-background'} min-h-screen`}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <a href="#" className={`flex items-center mb-6 text-2xl font-semibold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          Interview
        </a>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0`}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className={`${darkMode ? 'text-dark-text' : 'text-light-text'} text-xl font-bold leading-tight tracking-tight md:text-2xl`}>
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-dark-text' : 'bg-gray-200 border-gray-400 text-light-text'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-dark-text' : 'bg-gray-200 border-gray-400 text-light-text'} sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-3 focus:ring-blue-600"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className={`${darkMode ? 'text-dark-text' : 'text-light-text'}`}>Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</a>
                </div>
              )}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
              <p className={`text-sm font-light ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                <button type="button" onClick={toggleForm} className="font-medium text-blue-500 hover:underline">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
