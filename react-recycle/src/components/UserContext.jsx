import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const jwt = sessionStorage.getItem('jwt');
      if (!jwt) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch('http://localhost:8080/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); 
        setIsLoggedIn(true); 
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('프로필 데이터 로드 중 에러 발생:', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(); 
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
