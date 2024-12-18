import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage'; // Adjust the path if necessary
import RegisterPage from './pages/registerPage'; // Adjust the path if necessary
import GalleriesPage from './pages/galleriesPage';
import PageTemplate from './pages/templatePage'; // Import the PageTemplate
import './App.css'; // Optional: global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/galleries" element={<GalleriesPage />} />
        <Route path="/template" element={<PageTemplate />}> {/* The protected template page */}
          {/* Add more child routes here if necessary */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
