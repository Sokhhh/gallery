import React, { useState, useEffect } from 'react';
import TemplatePage from './templatePage';  // Import TemplatePage to wrap the content
import Image from '../components/image';  // Import Image component (this component will render each image dynamically)
import '../styles/imagesPage.css';  // Add a CSS file for styling
import { useParams } from 'react-router-dom';  // React Router hook to get params
import Masonry from 'react-masonry-css';  // Import Masonry from react-masonry-css

const ImagesPage = () => {
  const { galleryId } = useParams();  // Extract galleryId from URL

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage

        if (!token) {
          setError('Authentication required. Please login.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/galleries/${galleryId}/images`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setImages(data);  // Set images data
        } else {
          setError('Failed to fetch images');
        }
      } catch (err) {
        setError('An error occurred while fetching images');
      } finally {
        setLoading(false);
      }
    };

    if (galleryId) {
      fetchImages();  // Fetch images if galleryId exists
    }
  }, [galleryId]);  // Run the effect when galleryId changes

  return (
    <TemplatePage>
      <div className="images-page-container">
        {loading && <p>Loading images...</p>}
        {error && <p className="error-message">{error}</p>}

        <Masonry
          breakpointCols={6} // Set breakpoints for columns
          className="images-grid" // Add a custom class for the grid
          columnClassName="images-column" // Add a custom class for the columns
        >
          {images.length > 0 ? (
            images.map((image) => (
              <Image
                imageId={image.id}
                galleryId={galleryId}
                src={"http://localhost:5000"+ image.url}
                alt={image.title || 'Untitled Image'}
                title={image.title}
                height={image.height}
                // randomHeight={true}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </Masonry>
      </div>
    </TemplatePage>
  );
};

export default ImagesPage;
