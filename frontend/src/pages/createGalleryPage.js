import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/createGalleryPage.css';

const CreateGalleryPage = ({ closeOverlay }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track whether the user is editing an existing gallery
    const [galleries, setGalleries] = useState([]); // List of galleries for dropdown
    const [selectedGalleryId, setSelectedGalleryId] = useState(null); // Store selected gallery for editing
    const navigate = useNavigate();

    // Fetch the list of galleries when the component mounts
    useEffect(() => {
        const fetchGalleries = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required.');
                return;
            }

            try {
                const isAdmin = localStorage.getItem('role') === 'admin'; // Assuming 'role' is stored as 'admin' for admins

                // Fetch galleries based on the role (admin or non-admin)
                const galleriesResponse = await fetch(isAdmin ? 'http://localhost:5000/api/galleries' : 'http://localhost:5000/api/galleries/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!galleriesResponse.ok) {
                    setError('Failed to fetch galleries');
                    return;
                }

                const galleriesData = await galleriesResponse.json();
                setGalleries(galleriesData); // Set the list of galleries
            } catch (err) {
                setError('Error fetching galleries.');
            }
        };

        fetchGalleries();
    }, []);

    // Fetch the gallery details if the user selects a gallery for editing
    useEffect(() => {
        if (isEditing && selectedGalleryId) {
            const fetchGallery = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required.');
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5000/api/galleries/${selectedGalleryId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        setError('Failed to fetch gallery data');
                        return;
                    }

                    const data = await response.json();
                    setName(data.name || '');
                    setDescription(data.description || '');
                } catch (err) {
                    setError('Error fetching gallery data.');
                }
            };

            fetchGallery();
        } else {
            // Clear the form when switching to create mode
            setName('');
            setDescription('');
        }
    }, [isEditing, selectedGalleryId]);

    // Handle form submission (for creating or updating galleries)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            setError('User is not authenticated. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const requestData = {
                name,
                description,
            };

            let response;
            if (isEditing) {
                // If editing an existing gallery, send a PUT request
                response = await fetch(`http://localhost:5000/api/galleries/${selectedGalleryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData),
                });
            } else {
                // If creating a new gallery, send a POST request
                response = await fetch('http://localhost:5000/api/galleries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to save gallery');
                setLoading(false);
                return;
            }

            const gallery = await response.json();
            navigate(`/gallery/${gallery.id}`);
            closeOverlay(); // Close the overlay after successful submission
        } catch (err) {
            setError('Error saving gallery. Please try again.');
            setLoading(false);
        }
    };

    // Handle gallery deletion
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/galleries/${selectedGalleryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError('Failed to delete gallery');
                return;
            }

            // Refresh the page after successful deletion
            window.location.reload(); // Reload the current page to reflect the changes
        } catch (err) {
            setError('Error deleting gallery. Please try again.');
        }
    };

    return (
        <div className="create-gallery-page">
            <h2>Create or Edit Galleries</h2>

            <div>
                <label htmlFor="toggle-edit">Edit Existing Gallery</label>
                <input
                    type="checkbox"
                    id="toggle-edit"
                    checked={isEditing}
                    onChange={() => {
                        setIsEditing((prevState) => !prevState);
                        setSelectedGalleryId(null); // Reset the selected gallery when toggling
                    }}
                />
            </div>

            {isEditing ? (
                <div>
                    <label htmlFor="select-gallery">Select Gallery to Edit</label>
                    <select
                        id="select-gallery"
                        value={selectedGalleryId || ''}
                        onChange={(e) => setSelectedGalleryId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a gallery</option>
                        {galleries.map((gallery) => (
                            <option key={gallery.id} value={gallery.id}>
                                {gallery.name}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Gallery Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={255}
                    />
                </div>

                <div>
                    <label htmlFor="description">Gallery Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isEditing ? 'Update Gallery' : 'Create Gallery'}
                </button>
            </form>

            {isEditing && selectedGalleryId && (
                <div>
                    <button 
                        type="button" 
                        className="delete-gallery-button"
                        onClick={handleDelete}
                    >
                        Delete Gallery
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateGalleryPage;
