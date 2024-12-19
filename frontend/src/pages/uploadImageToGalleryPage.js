import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/uploadImageToGalleryPage.css';

const UploadImageToGalleryPage = ({ closeOverlay }) => { // Accept closeOverlay prop
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserGalleries = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not authenticated');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/galleries/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const galleriesData = await response.json();
                    setGalleries(galleriesData);
                } else {
                    setError('Failed to fetch galleries');
                }
            } catch (err) {
                setError('Error fetching galleries');
            }
        };

        fetchUserGalleries();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedGallery || !image || !title) {
            setError('Please provide all required fields');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/galleries/${selectedGallery}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to upload image');
                setLoading(false);
                return;
            }

            const imageData = await response.json();
            navigate(`/gallery/${selectedGallery}`);
            closeOverlay(); // Close the overlay after successful upload
        } catch (err) {
            setError('Error uploading image');
            setLoading(false);
        }
    };

    return (
        <div className="upload-image-page">
            <h2>Upload Image to Gallery</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="gallery">Select Gallery</label>
                    <select
                        id="gallery"
                        value={selectedGallery}
                        onChange={(e) => setSelectedGallery(e.target.value)}
                        required
                    >
                        <option value="">Select a Gallery</option>
                        {galleries.map((gallery) => (
                            <option key={gallery.id} value={gallery.id}>
                                {gallery.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="title">Image Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={255}
                    />
                </div>

                <div>
                    <label htmlFor="image">Upload Image</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>
        </div>
    );
};

export default UploadImageToGalleryPage;
