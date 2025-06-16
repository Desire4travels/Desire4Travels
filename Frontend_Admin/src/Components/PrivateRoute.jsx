import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ cardKey, children }) => {
  const [isAuthed, setIsAuthed] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const localAuth = localStorage.getItem(`auth-${cardKey}`);
      setIsAuthed(localAuth === 'true');
    };

    // Initialize
    checkAuth();
    localStorage.setItem('activeCard', cardKey);
  }, [cardKey]);

  // Watch for route changes to auto-lock old cards
  useEffect(() => {
    const activeCard = localStorage.getItem('activeCard');
    if (activeCard && activeCard !== cardKey) {
      localStorage.removeItem(`auth-${activeCard}`);
      localStorage.removeItem('activeCard');
    }
  }, [location.pathname, cardKey]);

  if (isAuthed === null) return <div>Checking access...</div>;
  if (!isAuthed) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
