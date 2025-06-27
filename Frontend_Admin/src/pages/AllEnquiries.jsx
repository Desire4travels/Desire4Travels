import './AllEnquiries.css';
import { Link } from 'react-router-dom';
import ProtectedCard from '../Components/ProtectedCard.jsx';
import { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

const AllEnquiriesContent = ({ onLogout }) => (
  <div className="all-enquiries-container">
    <button
      onClick={onLogout}
      style={{
        position: 'absolute',
        top: 20,
        right: 30,
        padding: '6px 16px',
        background: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
    <div className="manage-enquiries-card">
      <h1><Link to="/adminenquiries" className="link">Manage Enquiries</Link></h1>
    </div>
    <div className="manage-newsletter-card">
      <h1><Link to="/newsletteradmin" className="link">Manage Newsletter</Link></h1>
    </div>
    <div className="manage-planned-trips-card">
      <h1><Link to="/homeplannedtrips" className="link">Manage Planned Trips</Link></h1>
    </div>
    <div className="manage-custom-quotes-card">
      <h1><Link to="/admincustomquotes" className="link">Manage Custom Quotes</Link></h1>
    </div>
    <div className="manage-custom-quotes-card">
      <h1><Link to="/packageCallback" className="link">Package Callback</Link></h1>
    </div>
    <div className="manage-custom-quotes-card">
      <h1><Link to="/destinationCallback" className="link">Destination Callback</Link></h1>
    </div>
    <div className="manage-custom-quotes-card">
      <h1><Link to="/activityCallback" className="link">Activity Callback</Link></h1>
    </div>
    <div className="manage-upcoming-trip-card">
      <h1><Link to="/adminupcomingtrip" className="link">Manage Upcoming Trips</Link></h1>
    </div>
    <div className="manage-popup-enquiries-card">
      <h1><Link to="/adminpopupenquiries" className="link">Manage Popup Enquiries</Link></h1>
    </div>
    <div className="manage-contact-card">
      <h1><Link to="/managecontact" className="link">Manage Contact Enquiries</Link></h1>
    </div>
  </div>
);







const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

const AllEnquiries = () => {
   const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Add this line
  const navigate = useNavigate();
 const timerRef = useRef();

  useEffect(() => {
    const localAuth = localStorage.getItem('auth-enquiries');
    setIsAuthenticated(localAuth === 'true');
  }, []);


  
  // Auto logout effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, AUTO_LOGOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
    // eslint-disable-next-line
  }, [isAuthenticated]);


  const handleLogout = () => {
    // Remove auth for all cards
    localStorage.removeItem('auth-enquiries');
    localStorage.removeItem('auth-destinations');
    localStorage.removeItem('auth-packages');
    localStorage.removeItem('auth-blogs');
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page
  };

  if (!isAuthenticated) {
    return (
      <ProtectedCard cardKey="enquiries">
        <div className='all-enquiries-card'>
          <h1><Link to="/Allenquiries" className="link">All Enquiries</Link></h1>
        </div>
      </ProtectedCard>
    );
  }

  return <AllEnquiriesContent onLogout={handleLogout} />;
};

export default AllEnquiries;