import React from 'react';
import Login from '../components/login'; // Assuming Login component is in the same directory
import '../styles/loginPage.css'; // Add styles in a separate CSS file

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Header section */}
      <header className="login-page-header">
        <h1>SKH//GLR</h1>
      </header>

      {/* Main section */}
      <main className="login-page-main">
        <div>
          <Login />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
