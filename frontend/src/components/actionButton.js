import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGalleryPage from '../pages/createGalleryPage';
import UploadImageToGalleryPage from '../pages/uploadImageToGalleryPage';
import '../styles/actionButton.css';

const ActionButton = () => {
    const [expanded, setExpanded] = useState(false);
    const [overlayContent, setOverlayContent] = useState(null);
    const navigate = useNavigate();

    const toggleExpand = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const openCreateGallery = () => {
        setOverlayContent(<CreateGalleryPage closeOverlay={closeOverlay} />);
    };

    const openUploadImage = () => {
        setOverlayContent(<UploadImageToGalleryPage closeOverlay={closeOverlay} />);
    };

    const closeOverlay = () => {
        setOverlayContent(null);
    };

    const handleOverlayClick = (e) => {
        // Close the overlay if the backdrop (overlay) itself is clicked, not the content
        if (e.target.classList.contains('overlay')) {
            closeOverlay();
        }
    };

    return (
        <div>
            {/* Main Action Button with Inline SVG Icon */}
            <button className="action-button" onClick={toggleExpand}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>

            {/* Expanded Buttons with Inline SVGs */}
            {expanded && (
                <div className="expanded-buttons">
                    <button onClick={openUploadImage} title="Upload Image to Gallery">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                        </svg>
                    </button>
                    <button onClick={openCreateGallery} title="Create a New Gallery">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Overlay for Pages */}
            {overlayContent && (
                <div className="overlay" onClick={handleOverlayClick}>
                    <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                        {overlayContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionButton;
