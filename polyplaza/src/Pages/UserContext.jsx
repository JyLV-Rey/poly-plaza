import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    return stored ? JSON.parse(stored) : null;
  });

  const [userFirstName, setUserFirstName] = useState(() => {
    const stored = localStorage.getItem('userFirstName');
    return stored ? JSON.parse(stored) : null;
  });

  const [userLastName, setUserLastName] = useState(() => {
    const stored = localStorage.getItem('userLastName');
    return stored ? JSON.parse(stored) : null;
  });

  const [userEmail, setUserEmail] = useState(() => {
    const stored = localStorage.getItem('userEmail');
    return stored ? JSON.parse(stored) : null;
  });

  const [userSellerId, setUserSellerId] = useState(() => {
    const stored = localStorage.getItem('userSellerId');
    return stored ? JSON.parse(stored) : null;
  });

  const [userSellerName, setUserSellerName] = useState(() => {
    const stored = localStorage.getItem('userSellerName');
    return stored ? JSON.parse(stored) : null;
  });

  // Sync to localStorage
  useEffect(() => {
    userId !== null
      ? localStorage.setItem('userId', JSON.stringify(userId))
      : localStorage.removeItem('userId');
  }, [userId]);

  useEffect(() => {
    userFirstName !== null
      ? localStorage.setItem('userFirstName', JSON.stringify(userFirstName))
      : localStorage.removeItem('userFirstName');
  }, [userFirstName]);

  useEffect(() => {
    userLastName !== null
      ? localStorage.setItem('userLastName', JSON.stringify(userLastName))
      : localStorage.removeItem('userLastName');
  }, [userLastName]);

  useEffect(() => {
    userEmail !== null
      ? localStorage.setItem('userEmail', JSON.stringify(userEmail))
      : localStorage.removeItem('userEmail');
  }, [userEmail]);

  useEffect(() => {
    userSellerId !== null
      ? localStorage.setItem('userSellerId', JSON.stringify(userSellerId))
      : localStorage.removeItem('userSellerId');
  }, [userSellerId]);

  useEffect(() => {
    userSellerName !== null
      ? localStorage.setItem('userSellerName', JSON.stringify(userSellerName))
      : localStorage.removeItem('userSellerName');
  }, [userSellerName]);

  return (
    <UserContext.Provider
      value={{
        userId,
        userFirstName,
        userLastName,
        userEmail,
        userSellerName,
        userSellerId,
        setUserId,
        setUserFirstName,
        setUserLastName,
        setUserEmail,
        setUserSellerId,
        setUserSellerName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
