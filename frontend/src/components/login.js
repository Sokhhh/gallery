import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import { jwtDecode } from 'jwt-decode';
import '../styles/login.css'; // Add this for external CSS styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false); // Track username error
  const [passwordError, setPasswordError] = useState(false); // Track password error
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      setUsernameError(false); // Reset username error
      setPasswordError(false); // Reset password error
  
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      // Check the response status code and handle errors accordingly
      if (response.ok) {
        // On success, save the JWT token in localStorage
        const token = data.token;
        localStorage.setItem('token', token); // Save the token in localStorage
  
        try {
          // Decode the token and extract user data
          const decodedToken = jwtDecode(token);
          const { id, username, role } = decodedToken; // Assuming the token contains these fields
  
          // Store user data in localStorage
          localStorage.setItem('userId', id);
          localStorage.setItem('username', username);
          localStorage.setItem('role', role);
  
          alert('Login Successful');
  
          // Redirect to /galleries page after successful login
          navigate('/galleries');
        } catch (error) {
          console.error('Invalid token:', error);
          alert('Invalid token received. Please try again.');
        }
      } else {
        // Handle server-side errors
        if (response.status === 401) {
          setPasswordError(true); // Incorrect password
        } else if (response.status === 404) {
          setUsernameError(true); // User not found
        } else {
          // Handle other errors
          alert('An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`form-input ${usernameError ? 'error-input' : ''}`}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`form-input ${passwordError ? 'error-input' : ''}`}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Add the clickable link to the register page */}
        <p className="register-link">
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
