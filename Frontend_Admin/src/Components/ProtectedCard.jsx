import { useState } from 'react';
import { accessConfig } from '../config/accessControl';

const ProtectedCard = ({ cardKey, children }) => {
  const [accessGranted, setAccessGranted] = useState(
    sessionStorage.getItem(`access_${cardKey}`) === 'true'
  );
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === accessConfig[cardKey]?.password) {
      setAccessGranted(true);
      sessionStorage.setItem(`access_${cardKey}`, 'true');
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
      />
      <button type="submit">Unlock</button>
    </form>
  );
};

export default ProtectedCard;
