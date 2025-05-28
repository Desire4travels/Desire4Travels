import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">
        Desire<span>4</span>Travels_Admin
      </div>
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/managedestination" className="nav-link">Manage Destination</Link></li>
        <li><Link to="/managepackage" className="nav-link">Manage Packages</Link></li>    
        <li><Link to="/manageblog" className="nav-link">Manage Blog</Link></li>
        <li><Link to="/packageCallback" className="nav-link">Package Callback</Link></li>
        <li><Link to="/destinationCallback" className="nav-link">Package Callback</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
