import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/createGalleryPage.css';

const CreateGalleryPage = ({ closeOverlay }) => { // Accept closeOverlay prop
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await fetch('http://localhost:5000/api/galleries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create gallery');
                setLoading(false);
                return;
            }

            const gallery = await response.json();
            navigate(`/gallery/${gallery.id}`);
            closeOverlay(); // Close the overlay after successful submission
        } catch (err) {
            setError('Error creating gallery. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="create-gallery-page">
            <h2>Create New Gallery</h2>

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
                    {loading ? 'Creating...' : 'Create Gallery'}
                </button>
            </form>
        </div>
    );
};

export default CreateGalleryPage;
