// import './AllEnquiries.css';
// import { Link } from 'react-router-dom';
// import ProtectedCard from '../Components/ProtectedCard.jsx';
// import { useState, useEffect, useRef} from 'react';
// import { useNavigate } from 'react-router-dom';

// const AllEnquiriesContent = ({ onLogout }) => (
//   <div className="all-enquiries-container">
//     <button
//       onClick={onLogout}
//       style={{
//         position: 'absolute',
//         top: 20,
//         right: 30,
//         padding: '6px 16px',
//         background: '#2196F3',
//         color: 'white',
//         border: 'none',
//         borderRadius: 5,
//         cursor: 'pointer'
//       }}
//     >
//       Logout
//     </button>
//     <div className="manage-enquiries-card">
//       <h1><Link to="/adminenquiries" className="link">Manage Enquiries</Link></h1>
//     </div>
//     <div className="manage-newsletter-card">
//       <h1><Link to="/newsletteradmin" className="link">Manage Newsletter</Link></h1>
//     </div>
//     <div className="manage-planned-trips-card">
//       <h1><Link to="/homeplannedtrips" className="link">Manage Planned Trips</Link></h1>
//     </div>
//     <div className="manage-custom-quotes-card">
//       <h1><Link to="/admincustomquotes" className="link">Manage Custom Quotes</Link></h1>
//     </div>
//     <div className="manage-custom-quotes-card">
//       <h1><Link to="/packageCallback" className="link">Package Callback</Link></h1>
//     </div>
//     <div className="manage-custom-quotes-card">
//       <h1><Link to="/destinationCallback" className="link">Destination Callback</Link></h1>
//     </div>
//     <div className="manage-custom-quotes-card">
//       <h1><Link to="/activityCallback" className="link">Activity Callback</Link></h1>
//     </div>
//     <div className="manage-upcoming-trip-card">
//       <h1><Link to="/adminupcomingtrip" className="link">Manage Upcoming Trips</Link></h1>
//     </div>
//     <div className="manage-popup-enquiries-card">
//       <h1><Link to="/adminpopupenquiries" className="link">Manage Popup Enquiries</Link></h1>
//     </div>
//     <div className="manage-contact-card">
//       <h1><Link to="/managecontact" className="link">Manage Contact Enquiries</Link></h1>
//     </div>
//   </div>
// );







// const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

// const AllEnquiries = () => {
//    const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Add this line
//   const navigate = useNavigate();
//  const timerRef = useRef();

//   useEffect(() => {
//     const localAuth = localStorage.getItem('auth-enquiries');
//     setIsAuthenticated(localAuth === 'true');
//   }, []);



//   // Auto logout effect
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const resetTimer = () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         handleLogout();
//       }, AUTO_LOGOUT_MS);
//     };

//     const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
//     events.forEach(event => window.addEventListener(event, resetTimer));
//     resetTimer();

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       events.forEach(event => window.removeEventListener(event, resetTimer));
//     };
//     // eslint-disable-next-line
//   }, [isAuthenticated]);


//   const handleLogout = () => {
//     // Remove auth for all cards
//     localStorage.removeItem('auth-enquiries');
//     localStorage.removeItem('auth-destinations');
//     localStorage.removeItem('auth-packages');
//     localStorage.removeItem('auth-blogs');
//     setIsAuthenticated(false);
//     navigate('/'); // Redirect to home page
//   };

//   if (!isAuthenticated) {
//     return (
//       <ProtectedCard cardKey="enquiries">
//         <div className='all-enquiries-card'>
//           <h1><Link to="/Allenquiries" className="link">All Enquiries</Link></h1>
//         </div>
//       </ProtectedCard>
//     );
//   }

//   return <AllEnquiriesContent onLogout={handleLogout} />;
// };

// export default AllEnquiries;


// import './AllEnquiries.css';
// import { Link, useNavigate } from 'react-router-dom';
// import ProtectedCard from '../Components/ProtectedCard.jsx';
// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

// const AllEnquiriesContent = ({ onLogout, counts }) => (
//   <div className="all-enquiries-container">
//     <button
//       onClick={onLogout}
//       style={{
//         position: 'absolute',
//         top: 20,
//         right: 30,
//         padding: '6px 16px',
//         background: '#2196F3',
//         color: 'white',
//         border: 'none',
//         borderRadius: 5,
//         cursor: 'pointer'
//       }}
//     >
//       Logout
//     </button>

//     <div className="manage-enquiries-card">
//       <h1>
//         <Link to="/adminenquiries" className="link">
//           Manage Enquiries {counts.newEnquiryCount > 0 && <span className="badge">{counts.newEnquiryCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-newsletter-card">
//       <h1>
//         <Link to="/newsletteradmin" className="link">
//           Manage Newsletter {counts.newNewsletterCount > 0 && <span className="badge">{counts.newNewsletterCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     {/* <div className="manage-planned-trips-card">
//       <h1><Link to="/homeplannedtrips" className="link">Manage Planned Trips</Link></h1>
//     </div> */}

//     <div className="manage-planned-trips-card">
//       <h1>
//         <Link to="/homeplannedtrips" className="link">
//           Manage Planned Trips
//           {counts.newPlannedTripCount > 0 && (
//             <span className="badge">{counts.newPlannedTripCount}</span>
//           )}
//         </Link>
//       </h1>
//     </div>


//     {/* <div className="manage-custom-quotes-card">
//       <h1><Link to="/admincustomquotes" className="link">Manage Custom Quotes</Link></h1>
//     </div> */}

//     <div className="manage-custom-quotes-card">
//       <h1>
//         <Link to="/admincustomquotes" className="link">
//           Manage Custom Quotes
//           {counts.newCustomQuoteCount > 0 && (
//             <span className="badge">{counts.newCustomQuoteCount}</span>
//           )}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-custom-quotes-card">
//       <h1>
//         <Link to="/packageCallback" className="link">
//           Package Callback {counts.newPackageCallbackCount > 0 && <span className="badge">{counts.newPackageCallbackCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-custom-quotes-card">
//       <h1>
//         <Link to="/destinationCallback" className="link">
//           Destination Callback {counts.newDestinationCallbackCount > 0 && <span className="badge">{counts.newDestinationCallbackCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-custom-quotes-card">
//       <h1>
//         <Link to="/activityCallback" className="link">
//           Activity Callback {counts.newActivityCallbackCount > 0 && <span className="badge">{counts.newActivityCallbackCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-upcoming-trip-card">
//       <h1><Link to="/adminupcomingtrip" className="link">Manage Upcoming Trips</Link></h1>
//     </div>

//     <div className="manage-popup-enquiries-card">
//       <h1>
//         <Link to="/adminpopupenquiries" className="link">
//           Manage Popup Enquiries {counts.newPopupEnquiryCount > 0 && <span className="badge">{counts.newPopupEnquiryCount}</span>}
//         </Link>
//       </h1>
//     </div>

//     <div className="manage-contact-card">
//       <h1><Link to="/managecontact" className="link">Manage Contact Enquiries
//         {counts.newContactCount > 0 && <span className="badge">{counts.newContactCount}</span>}
//       </Link></h1>
//     </div>
//   </div>
// );

// const AllEnquiries = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();
//   const timerRef = useRef();

//   const [counts, setCounts] = useState({
//     newEnquiryCount: 0,
//     newActivityCallbackCount: 0,
//     newNewsletterCount: 0,
//     newPackageCallbackCount: 0,
//     newDestinationCallbackCount: 0,
//     newPopupEnquiryCount: 0,
//     newContactCount: 0,
//     newCustomQuoteCount: 0,
//     newPlannedTripCount: 0
//   });

//   // On mount, check auth
//   useEffect(() => {
//     const localAuth = localStorage.getItem('auth-enquiries');
//     setIsAuthenticated(localAuth === 'true');
//   }, []);

//   // Auto logout timer
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const resetTimer = () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => handleLogout(), AUTO_LOGOUT_MS);
//     };

//     const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
//     events.forEach(event => window.addEventListener(event, resetTimer));
//     resetTimer();

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       events.forEach(event => window.removeEventListener(event, resetTimer));
//     };
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem('auth-enquiries');
//     localStorage.removeItem('auth-destinations');
//     localStorage.removeItem('auth-packages');
//     localStorage.removeItem('auth-blogs');
//     setIsAuthenticated(false);
//     navigate('/');
//   };

//   // Fetch new data counts
//   useEffect(() => {
//     const fetchCounts = async () => {
//       const countFetchers = [
//         {
//           key: 'newEnquiryCount',
//           section: 'enquiries',
//           url: 'https://desire4travels-1.onrender.com/api/admin/enquiries',
//           dateKey: 'submittedAt'
//         },
//         {
//           key: 'newActivityCallbackCount',
//           section: 'activityCallback',
//           url: 'https://desire4travels-1.onrender.com/activity-callback',
//           dateKey: 'createdAt._seconds'
//         },
//         {
//           key: 'newNewsletterCount',
//           section: 'newsletter',
//           url: 'https://desire4travels-1.onrender.com/api/admin/newsletter',
//           dateKey: 'subscribedAt'
//         },
//         {
//           key: 'newPackageCallbackCount',
//           section: 'callback-package',
//           url: 'https://desire4travels-1.onrender.com/callback-package',
//           dateKey: 'createdAt._seconds'
//         },
//         {
//           key: 'newDestinationCallbackCount',
//           section: 'callback-destination',
//           url: 'https://desire4travels-1.onrender.com/callback-destination',
//           dateKey: 'createdAt._seconds'
//         },
//         {
//           key: 'newPopupEnquiryCount',
//           section: 'popupEnquiries',
//           url: 'https://desire4travels-1.onrender.com/api/popup-enquiries',
//           dateKey: 'createdAt._seconds'
//         },
//         {
//           key: 'newContactCount',
//           section: 'contact-us',
//           url: 'https://desire4travels-1.onrender.com/contact-us',
//           dateKey: 'createdAt._seconds'
//         },
//         {
//           key: 'newCustomQuoteCount',
//           section: 'customQuotes',
//           url: 'https://desire4travels-1.onrender.com/api/admin/custom-quotes',
//           dateKey: 'createdAt'
//         },
//         {
//           key: 'newPlannedTripCount',
//           section: 'plannedTrips',
//           url: 'https://desire4travels-1.onrender.com/api/admin/planned-trips',
//           dateKey: 'createdAt'
//         }
//       ];

//       const newCounts = {};

//       for (let { key, section, url, dateKey } of countFetchers) {
//         try {
//           const visitRes = await axios.get('https://desire4travels-1.onrender.com/api/last-visit', {
//             params: { section }
//           });
//           const lastVisit = visitRes.data.lastVisited ? new Date(visitRes.data.lastVisited) : null;

//           const dataRes = await axios.get(url);
//           const items = dataRes.data;

//           const count = items.filter(item => {
//             const raw = dateKey.split('.').reduce((obj, k) => obj?.[k], item);
//             const itemDate = raw ? new Date(raw * 1000 || raw) : null;
//             return lastVisit && itemDate && itemDate > lastVisit;
//           }).length;

//           newCounts[key] = count;
//         } catch (err) {
//           console.error(`${key} fetch failed:`, err);
//           newCounts[key] = 0;
//         }
//       }

//       setCounts(newCounts);
//     };

//     if (isAuthenticated) {
//       fetchCounts();
//     }
//   }, [isAuthenticated]);

//   if (!isAuthenticated) {
//     return (
//       <ProtectedCard cardKey="enquiries">
//         <div className='all-enquiries-card'>
//           <h1><Link to="/Allenquiries" className="link">All Enquiries</Link></h1>
//         </div>
//       </ProtectedCard>
//     );
//   }

//   return <AllEnquiriesContent onLogout={handleLogout} counts={counts} />;
// };

// export default AllEnquiries;




import './AllEnquiries.css';
import { Link, useNavigate } from 'react-router-dom';
import ProtectedCard from '../Components/ProtectedCard.jsx';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

const AllEnquiriesContent = ({ onLogout, counts }) => (
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

    <div className="manage-enquiries-card card-container">
      {counts.newEnquiryCount > 0 && <span className="badge">{counts.newEnquiryCount}</span>}
      <h1><Link to="/adminenquiries" className="link">Manage Enquiries</Link></h1>
    </div>

    <div className="manage-newsletter-card card-container">
      {counts.newNewsletterCount > 0 && <span className="badge">{counts.newNewsletterCount}</span>}
      <h1><Link to="/newsletteradmin" className="link">Manage Newsletter</Link></h1>
    </div>

    <div className="manage-planned-trips-card card-container">
      {counts.newPlannedTripCount > 0 && <span className="badge">{counts.newPlannedTripCount}</span>}
      <h1><Link to="/homeplannedtrips" className="link">Manage Planned Trips</Link></h1>
    </div>

    <div className="manage-custom-quotes-card card-container">
      {counts.newCustomQuoteCount > 0 && <span className="badge">{counts.newCustomQuoteCount}</span>}
      <h1><Link to="/admincustomquotes" className="link">Manage Custom Quotes</Link></h1>
    </div>

    <div className="manage-custom-quotes-card card-container">
      {counts.newPackageCallbackCount > 0 && <span className="badge">{counts.newPackageCallbackCount}</span>}
      <h1><Link to="/packageCallback" className="link">Package Callback</Link></h1>
    </div>

    <div className="manage-custom-quotes-card card-container">
      {counts.newDestinationCallbackCount > 0 && <span className="badge">{counts.newDestinationCallbackCount}</span>}
      <h1><Link to="/destinationCallback" className="link">Destination Callback</Link></h1>
    </div>

    <div className="manage-custom-quotes-card card-container">
      {counts.newActivityCallbackCount > 0 && <span className="badge">{counts.newActivityCallbackCount}</span>}
      <h1><Link to="/activityCallback" className="link">Activity Callback</Link></h1>
    </div>

    <div className="manage-upcoming-trip-card card-container">
      <h1><Link to="/adminupcomingtrip" className="link">Manage Upcoming Trips</Link></h1>
    </div>

    <div className="manage-popup-enquiries-card card-container">
      {counts.newPopupEnquiryCount > 0 && <span className="badge">{counts.newPopupEnquiryCount}</span>}
      <h1><Link to="/adminpopupenquiries" className="link">Manage Popup Enquiries</Link></h1>
    </div>

    <div className="manage-contact-card card-container">
      {counts.newContactCount > 0 && <span className="badge">{counts.newContactCount}</span>}
      <h1><Link to="/managecontact" className="link">Manage Contact Enquiries</Link></h1>
    </div>

    <div className="manage-upcoming-trip-card card-container">
      <h1><Link to="/hotel" className="link">Manage Hotel</Link></h1>
    </div>

        <div className="manage-upcoming-trip-card card-container">
      <h1><Link to="/services" className="link">LLM Data</Link></h1>
    </div>


  </div>
);

const AllEnquiries = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef();

  const [counts, setCounts] = useState({
    newEnquiryCount: 0,
    newActivityCallbackCount: 0,
    newNewsletterCount: 0,
    newPackageCallbackCount: 0,
    newDestinationCallbackCount: 0,
    newPopupEnquiryCount: 0,
    newContactCount: 0,
    newCustomQuoteCount: 0,
    newPlannedTripCount: 0
  });

  useEffect(() => {
    const localAuth = localStorage.getItem('auth-enquiries');
    setIsAuthenticated(localAuth === 'true');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => handleLogout(), AUTO_LOGOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('auth-enquiries');
    localStorage.removeItem('auth-destinations');
    localStorage.removeItem('auth-packages');
    localStorage.removeItem('auth-blogs');
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const countFetchers = [
        {
          key: 'newEnquiryCount',
          section: 'enquiries',
          url: 'https://desire4travels-1.onrender.com/api/admin/enquiries',
          dateKey: 'submittedAt'
        },
        {
          key: 'newActivityCallbackCount',
          section: 'activityCallback',
          url: 'https://desire4travels-1.onrender.com/activity-callback',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'newNewsletterCount',
          section: 'newsletter',
          url: 'https://desire4travels-1.onrender.com/api/admin/newsletter',
          dateKey: 'subscribedAt'
        },
        {
          key: 'newPackageCallbackCount',
          section: 'callback-package',
          url: 'https://desire4travels-1.onrender.com/callback-package',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'newDestinationCallbackCount',
          section: 'callback-destination',
          url: 'https://desire4travels-1.onrender.com/callback-destination',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'newPopupEnquiryCount',
          section: 'popupEnquiries',
          url: 'https://desire4travels-1.onrender.com/api/popup-enquiries',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'newContactCount',
          section: 'contact-us',
          url: 'https://desire4travels-1.onrender.com/contact-us',
          dateKey: 'createdAt._seconds'
        },
        {
          key: 'newCustomQuoteCount',
          section: 'customQuotes',
          url: 'https://desire4travels-1.onrender.com/api/admin/custom-quotes',
          dateKey: 'createdAt'
        },
        {
          key: 'newPlannedTripCount',
          section: 'plannedTrips',
          url: 'https://desire4travels-1.onrender.com/api/admin/planned-trips',
          dateKey: 'createdAt'
        }
      ];

      const newCounts = {};

      for (let { key, section, url, dateKey } of countFetchers) {
        try {
          const visitRes = await axios.get('https://desire4travels-1.onrender.com/api/last-visit', {
            params: { section }
          });
          const lastVisit = visitRes.data.lastVisited ? new Date(visitRes.data.lastVisited) : null;

          const dataRes = await axios.get(url);
          const items = dataRes.data;

          const count = items.filter(item => {
            const raw = dateKey.split('.').reduce((obj, k) => obj?.[k], item);
            const itemDate = raw ? new Date(raw * 1000 || raw) : null;
            return lastVisit && itemDate && itemDate > lastVisit;
          }).length;

          newCounts[key] = count;
        } catch (err) {
          console.error(`${key} fetch failed:`, err);
          newCounts[key] = 0;
        }
      }

      setCounts(newCounts);
    };

    if (isAuthenticated) {
      fetchCounts();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <ProtectedCard cardKey="enquiries">
        <div className='all-enquiries-card'>
          <h1><Link to="/Allenquiries" className="link">All Enquiries</Link></h1>
        </div>
      </ProtectedCard>
    );
  }

  return <AllEnquiriesContent onLogout={handleLogout} counts={counts} />;
};

export default AllEnquiries;
