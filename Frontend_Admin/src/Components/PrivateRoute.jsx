import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

const PrivateRoute = ({ cardKey, children }) => {
  const [isAuthed, setIsAuthed] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const localAuth = localStorage.getItem(`auth-${cardKey}`);
      setIsAuthed(localAuth === 'true');
    };

    const resetInactivityTimer = () => {
      if (timerId) clearTimeout(timerId);
      const id = setTimeout(() => {
        localStorage.removeItem(`auth-${cardKey}`);
        localStorage.removeItem('activeCard');
        setIsAuthed(false);
      }, INACTIVITY_LIMIT);
      setTimerId(id);
    };

    const handleActivity = () => resetInactivityTimer();

    // Initialize
    checkAuth();
    localStorage.setItem('activeCard', cardKey);
    resetInactivityTimer();

    // Attach activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (timerId) clearTimeout(timerId);
    };
  }, [cardKey]);

  // Watch for route changes to auto-lock old cards
  useEffect(() => {
    const activeCard = localStorage.getItem('activeCard');
    if (activeCard && activeCard !== cardKey) {
      localStorage.removeItem(`auth-${activeCard}`);
      localStorage.removeItem('activeCard');
    }
  }, [location.pathname]);

  if (isAuthed === null) return <div>Checking access...</div>;
  if (!isAuthed) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
