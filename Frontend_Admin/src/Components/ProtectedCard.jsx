import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cardNames = {
  packages: "Manage Packages",
  blogs: "Manage Blogs",
  destinations: "Manage Destinations",
  enquiries: "Enquiry Panel"
};

const ProtectedCard = ({ cardKey, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const BASE_URL = 'https://desire4travels-1.onrender.com';

  useEffect(() => {
    axios.get(`${BASE_URL}/api/card-status/${cardKey}`, { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) setIsAuthenticated(true);
      });
  }, [cardKey]);

  const handleLogin = () => {
    axios.post(`https://desire4travels-1.onrender.com/api/card-login/${cardKey}`,
      { password },
      { withCredentials: true }
    )
    .then(() => setIsAuthenticated(true))
    .catch(() => setError("Invalid password"));
  };
  

  if (isAuthenticated) return <>{children}</>;

  return (
    <div style={{ background: '#c4e4ef', padding: 20, marginBottom: 10, borderRadius: 8 }}>
      <h3>{cardNames[cardKey] || cardKey}</h3>
      <p>Enter password to access this card:</p>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ padding: 8, borderRadius: 5, marginBottom: 10 }}
      />
      <div>
        <button onClick={handleLogin} style={{ padding: '5px 12px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 5 }}>
          Login
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProtectedCard;
