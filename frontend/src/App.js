import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage'; // Adjust the path if necessary
import RegisterPage from './pages/registerPage'; // Adjust the path if necessary
import GalleriesPage from './pages/galleriesPage';
import ImagesPage from './pages/imagesPage';
import ViewImage from './pages/viewImage';
import PageTemplate from './pages/templatePage'; // Import the PageTemplate
import { UserProvider } from './context/userContext'; // Import the UserProvider
import './App.css'; // Optional: global styles

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route path="/gallery/:galleryId" element={<ImagesPage />} />
          <Route path="/gallery/:galleryId/image/:imageId" element={<ViewImage />} />
          <Route path="/template" element={<PageTemplate />}>
            {/* Add more child routes here if necessary */}
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
