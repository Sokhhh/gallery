import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/gallery.css';

const Gallery = ({ imageUrl, title, id }) => {
  console.log("Gallery ID:", id); // Debugging line to check if id is passed correctly
  
  return (
    <Link to={`/gallery/${id}`} className="gallery-link">
      <div className="gallery-container">
        <img
          src={imageUrl || 'https://via.placeholder.com/400x225?text=No+Image+Available'}
          alt={title || 'Gallery image'}
          className="gallery-image"
        />
        <div className="gallery-text">
          <h3>{title || 'Untitled Gallery'}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Gallery;
