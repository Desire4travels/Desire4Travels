import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">

      <div className="manage-enquiries-card">
        <h1><Link to="/adminenquiries" className="link">Manage Enquiries</Link></h1>
      </div>

      <div className="manage-newsletter-card">
        <h1><Link to="/newsletteradmin" className="link">Manage Newsletter</Link></h1>
      </div>

      <div className="manage-destination-card">
        <h1><Link to="/managedestination" className="link">Manage Destinations</Link></h1>
      </div>

      <div className="manage-package-card">
        <h1><Link to="/managepackage" className="link">Manage Packages</Link></h1>
      </div>

      <div className="manage-blog-card">
        <h1><Link to="/manageblog" className="link">Manage Blogs</Link></h1>
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

      <div className="manage-upcoming-trip-card">
        <h1><Link to="/adminupcomingtrip" className="link">Manage Upcoming Trips</Link></h1>
      </div>

      <div className="manage-popup-enquiries-card">
        <h1><Link to="/adminpopupenquiries" className="link">Manage Popup Enquiries</Link></h1>
      </div>

    </div>

  );
};

export default Home;
