import React, { useState } from 'react';
import '../styles/login.css'; // Ensure this imports the CSS

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false); // State to track username error

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Password matching validation
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    try {
      setLoading(true);
      setError('');

      // Sending data to the register endpoint
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.status === 409) {
        // If status is 409, it means the username already exists
        setUsernameError(true);
        setLoading(false);
        return; // Stop further execution
      } else {
        setUsernameError(false); // Reset username error if valid
      }

      const data = await response.json();

      if (response.ok) {
        alert('Registration Successful');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">REGISTER</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`form-input ${usernameError ? 'error-input' : ''}`} // Apply error class if username exists
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
              className={`form-input ${passwordError ? 'error-input' : ''}`} // Add error class if passwords don't match
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`form-input ${passwordError ? 'error-input' : ''}`} // Add error class if passwords don't match
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
