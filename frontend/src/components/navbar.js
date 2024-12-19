import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../styles/navbar.css'; // Make sure to import the CSS file

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation to /galleries
  const goToGalleries = () => {
    navigate('/galleries'); // Navigate to /galleries route
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('role'); // Optionally, remove role
    localStorage.removeItem('id'); // Optionally, remove username
    localStorage.removeItem('username'); // Optionally, remove username
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="navbar-container">
      <div className="black-square"></div> {/* Empty black square */}
      <span className="navbar-text">SKH//GLR</span> {/* The text */}
      <div className="black-square"></div> {/* Empty black square */}
      <button className="home-button" onClick={goToGalleries}>Home</button> {/* Home button */}
      <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
    </div>
  );
};

export default Navbar;
