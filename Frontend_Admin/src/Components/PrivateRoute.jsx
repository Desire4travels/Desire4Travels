import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ cardKey, children }) => {
  const [isAuthed, setIsAuthed] = useState(null);

  const BASE_URL = 'https://desire4travels-1.onrender.com'; 
 

  useEffect(() => {
    const localAuth = localStorage.getItem(`auth-${cardKey}`);

    if (localAuth === 'true') {
      setIsAuthed(true);
      return;
    }

    axios.get(`${BASE_URL}/api/card-status/${cardKey}`, { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          localStorage.setItem(`auth-${cardKey}`, 'true');
        }
        setIsAuthed(res.data.authenticated);
      })
      .catch(() => setIsAuthed(false));
  }, [cardKey]);

  if (isAuthed === null) return <div>Checking access...</div>;
  if (!isAuthed) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
