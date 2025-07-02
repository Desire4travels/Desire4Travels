import './Home.css';
import { Link } from 'react-router-dom';
import ProtectedCard from '../Components/ProtectedCard.jsx';

const Home = () => {
  return (
    <div className="home-container">

      <ProtectedCard cardKey="enquiries">
        <div className='all-enquiries-card'>
          <h1><Link to="/allenquiries" className="link">All Enquiries</Link></h1>
        </div>
      </ProtectedCard>

      <ProtectedCard cardKey="destinations">
        <div className="manage-destination-card">
          <h1><Link to="/managedestination" className="link">Manage Destinations</Link></h1>
        </div>
      </ProtectedCard>

      <ProtectedCard cardKey="packages">
        <div className="manage-package-card">
          <h1><Link to="/managepackage" className="link">Manage Packages</Link></h1>
        </div>
      </ProtectedCard>

      <ProtectedCard cardKey="blogs">
        <div className="manage-blog-card">
          <h1><Link to="/manageblog" className="link">Manage Blogs</Link></h1>
        </div>
      </ProtectedCard>

      <ProtectedCard cardKey="AI">
        <div className="manage-blog-card">
          <h1><Link to="/manage-ai" className="link">AI Tools Panel</Link></h1>
        </div>
      </ProtectedCard>
    </div>



  );
};

export default Home;
