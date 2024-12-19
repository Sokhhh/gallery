import React from 'react';
// import '../styles/image.css';  // Add a CSS file for styling

const Image = ({ src, alt, title, height, randomHeight = false }) => {
  // Placeholder image URL
  const placeholderImage = 'https://via.placeholder.com/600x400?text=No+Image+Available';

  // Fallback to placeholder if src is missing or invalid
  const imageSrc = placeholderImage;

  // Generate a random height if randomHeight is true
  const getRandomHeight = () => {
    return Math.floor(Math.random() * (500 - 200 + 1)) + 200;  // Random height between 200px and 500px
  };

  // Use randomized height or the provided height
  const finalHeight = randomHeight ? getRandomHeight() : height;

  return (
    <div className="image-container">
      <img
        src={imageSrc}  // Use the fallback image if src is not available
        alt={alt || 'Image'}  // Use the alt text passed in or fallback to 'Image'
        title={title}
        style={{ height: `${finalHeight}px`, width: '100%' }} // Dynamic height
        className="image-item"
      />
      {title && <div className="image-title">{title}</div>}
    </div>
  );
};

export default Image;
