import React from 'react';
import Navbar from '../components/navbar'; // Import the Navbar component
import CreateGalleryPage from './createGalleryPage';
import UploadImageToGalleryPage from './uploadImageToGalleryPage';
import ActionButton from '../components/actionButton';

const TemplatePage = ({ children }) => {

  return (
    <div className="page-template-container">
      <Navbar /> {/* Render the Navbar component */}

      <div className="content-container">
        {children} {/* This is where dynamic content passed as 'children' will be displayed */}
        {/* <UploadImageToGalleryPage />
        <CreateGalleryPage /> */}
        <ActionButton />
      </div>
    </div>
  );
};

export default TemplatePage;
