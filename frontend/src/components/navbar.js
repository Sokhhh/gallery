import React from 'react';
import '../styles/navbar.css'; // Make sure to import the CSS file

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="black-square"></div> {/* Empty black square */}
      <span className="navbar-text">SKH//GLR</span> {/* The text */}
      <div className="black-square"></div> {/* Empty black square */}
      <button className="home-button">Home</button> {/* Home button */}
    </div>
  );
};

export default Navbar;
