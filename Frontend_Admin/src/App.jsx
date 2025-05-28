import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ManagePackage from './pages/ManagePackage.jsx';
import ManageBlog from './pages/ManageBlog.jsx';``
import ManageDestination from './pages/ManageDestination.jsx';
import AdminEnquiries from './pages/AdminEnquiries.jsx';
import './App.css';
import NewsletterAdmin from './pages/NewsletterAdmin.jsx';
import HomePlannedTrips from './pages/HomePlannedTrips.jsx';
import AdminCustomQuotes from './pages/AdminCustomQuotes.jsx';
import PackageCallback from './pages/callback/packageCallback.jsx';
import DestinationCallback from './pages/callback/destinationCallback.jsx';
import AdminUpcomingTrip from './pages/AdminUpcomingTrip.jsx';
import AdminPopupEnquiries from './pages/AdminPopupEnquiries.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/managepackage" element={<ManagePackage />} />
        <Route path="/manageblog" element={<ManageBlog />} />
        <Route path="/managedestination" element={<ManageDestination />} />
        <Route path="/adminenquiries" element={<AdminEnquiries />} />
        <Route path="/newsletteradmin" element={<NewsletterAdmin />} />
        <Route path="/homeplannedtrips" element={<HomePlannedTrips />} />
        <Route path="/admincustomquotes" element={<AdminCustomQuotes />} />
        <Route path="/packageCallback" element={<PackageCallback />} />
        <Route path="/destinationCallback" element={<DestinationCallback />} />
        <Route path="/adminupcomingtrip" element={<AdminUpcomingTrip />} />
        <Route path="/adminpopupenquiries" element={<AdminPopupEnquiries />} />
      </Routes>
    </div>
  );
}

export default App;
