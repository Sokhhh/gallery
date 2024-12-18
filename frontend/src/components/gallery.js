import React from 'react';
import '../styles/gallery.css';  // Ensure you create a CSS file for styling

const Gallery = ({ imageUrl, title, description }) => {
  return (
    <div className="gallery-container">
      <img
        src={imageUrl || 'https://via.placeholder.com/400x225?text=No+Image+Available'}  // Use the provided image or the placeholder
        alt={title || 'Gallery image'}
        className="gallery-image"
      />
      <div className="gallery-text">
        <h3>{title || 'Untitled Gallery'}</h3>
      </div>
    </div>
  );
};

export default Gallery;
