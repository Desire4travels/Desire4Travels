import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ cardKey, children }) => {
  const isAuthorized = sessionStorage.getItem(`access_${cardKey}`) === 'true';

  return isAuthorized ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
