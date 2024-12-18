import React from 'react';
import Register from '../components/register';
import '../styles/loginPage.css'; // Add styles in a separate CSS file

const RegisterPage = () => {
  return (
    <div className="login-page">
      {/* Header section */}
      <header className="login-page-header">
        <h1>SKH//GLR</h1>
      </header>

      {/* Main section */}
      <main className="login-page-main">
        <div>
          <Register />
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
