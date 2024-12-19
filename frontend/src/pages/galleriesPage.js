import React, { useState, useEffect } from 'react';
import TemplatePage from './templatePage';  // Import TemplatePage to wrap the content
import Gallery from '../components/gallery';  // Import Gallery component
import '../styles/galleriesPage.css';  // Add a CSS file for styling if needed

const GalleriesPage = () => {
  const [galleries, setGalleries] = useState([]); // State to store galleries
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    // Fetch galleries from the server
    const fetchGalleries = async () => {
      try {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        
        // If there's no token, handle it (perhaps redirect to login)
        if (!token) {
          setError('Authentication required. Please login.');
          setLoading(false);
          return;
        }

        // Add the token to the request headers
        const response = await fetch('http://localhost:5000/api/galleries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Send token in the Authorization header
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Log the raw response data before setting it
          console.log('Fetched Data:', data);
          
          // Update the galleries state
          setGalleries(data);  
        } else {
          setError('Failed to fetch galleries');
        }
      } catch (err) {
        setError('An error occurred while fetching galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries(); // Call the function to fetch galleries
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Log galleries data after it's been set
  useEffect(() => {
    if (galleries.length > 0) {
      console.log('Galleries state updated:', galleries);
    }
  }, [galleries]); // This effect will run whenever the galleries state changes

  return (
    <TemplatePage>
      <div className="galleries-page-container">
        {loading && <p>Loading galleries...</p>} {/* Show loading text while fetching */}
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
        
        {/* Display galleries if they are available */}
        <div className="galleries-container">
          {galleries.length > 0 ? (
            galleries.map((gallery) => (
              <Gallery 
                id={gallery.id}  // Ensure unique keys for each gallery
                imageUrl={'https://via.placeholder.com/400x225?text=No+Image+Available'} // Placeholder image for now
                title={gallery.name || 'Untitled Gallery'}  // Using 'name' from the fetched data as title
                description={gallery.description || 'No description available'} // Using 'description' from the fetched data
              />
            ))
          ) : (
            <p>No galleries available</p>  // Display message when no galleries are found
          )}
        </div>
      </div>
    </TemplatePage>
  );
};

export default GalleriesPage;
