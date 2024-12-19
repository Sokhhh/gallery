import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to access the context
export const useUser = () => useContext(UserContext);

// UserProvider component to provide user data
export const UserProvider = ({ children }) => {
  // State to hold user info
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  // Optional: Fetch user info from localStorage, API, or authentication token
  useEffect(() => {
    // Example of fetching user data from localStorage or API
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    if (storedUserId && storedRole && storedUsername) {
      setUserId(storedUserId);
      setRole(storedRole);
      setUsername(storedUsername);
    }

    // Alternatively, you can fetch data from an API
    // Example:
    // fetch('/api/user')
    //   .then(response => response.json())
    //   .then(data => {
    //     setUserId(data.userId);
    //     setRole(data.role);
    //     setUsername(data.username);
    //   })
    //   .catch(err => console.error('Failed to fetch user data', err));
  }, []);

  return (
    <UserContext.Provider value={{ userId, role, username, setUserId, setRole, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
