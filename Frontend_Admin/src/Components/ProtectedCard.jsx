import { useState, useEffect } from 'react';
import { accessConfig } from '../Config/accessControl';
// import { accessConfig } from './accessControl';


const AUTO_LOCK_TIME = 5 * 60 * 1000; // 5 minutes 

const ProtectedCard = ({ cardKey, children }) => {
  const [accessGranted, setAccessGranted] = useState(
    sessionStorage.getItem(`access_${cardKey}`) === 'true'
  );
  const [password, setPassword] = useState('');

  useEffect(() => {
    let timer;

    if (accessGranted) {
      // Start auto-lock timer
      timer = setTimeout(() => {
        setAccessGranted(false);
        sessionStorage.removeItem(`access_${cardKey}`);
        alert(`Access to ${cardKey} has been locked due to inactivity.`);
      }, AUTO_LOCK_TIME);
    }

    // Cleanup on unmount or if accessGranted changes
    return () => clearTimeout(timer);
  }, [accessGranted, cardKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === accessConfig[cardKey]?.password) {
      setAccessGranted(true);
      sessionStorage.setItem(`access_${cardKey}`, 'true');
      setPassword('');
    } else {
      alert('Invalid password!');
    }
  };

  if (accessGranted) return children;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter password for {cardKey}</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button type="submit">Unlock</button>
    </form>
  );
};

export default ProtectedCard;
