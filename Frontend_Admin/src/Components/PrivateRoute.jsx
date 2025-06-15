import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ cardKey, children }) => {
  const [isAuthed, setIsAuthed] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/card-status/${cardKey}`, { withCredentials: true })
      .then(res => setIsAuthed(res.data.authenticated))
      .catch(() => setIsAuthed(false));
  }, [cardKey]);

  if (isAuthed === null) return <div>Checking access...</div>;
  if (!isAuthed) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
