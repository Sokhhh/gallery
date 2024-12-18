import React from 'react';
import Navbar from '../components/navbar'; // Import the Navbar component

const TemplatePage = ({ children }) => {
  return (
    <div className="page-template-container">
      <Navbar /> {/* Render the Navbar component */}
      
      <div className="content-container">
        {children} {/* This is where dynamic content passed as 'children' will be displayed */}
      </div>
    </div>
  );
};

export default TemplatePage;
