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
import AllEnquiries from './pages/AllEnquiries.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import ActivityCallbacksAdmin from './pages/ActivityCallbacksAdmin.jsx';
import ManageContact from './pages/callback/ManageContact.jsx';
import HotelManager from './pages/AI/HotelManager.jsx';
import ServiceManager from './pages/AI/ServiceManager.jsx';
import ServiceProvidersList from './pages/AI/ServiceProviders.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/managepackage" element={<PrivateRoute cardKey="packages"><ManagePackage /></PrivateRoute>} />
        <Route path="/manageblog" element={<PrivateRoute cardKey="blogs"><ManageBlog /></PrivateRoute>} />
        <Route path="/managedestination" element={<PrivateRoute cardKey="destinations"><ManageDestination /></PrivateRoute>} />
        <Route path="/adminenquiries" element={<PrivateRoute cardKey="enquiries"><AdminEnquiries /></PrivateRoute>} />
        <Route path="/newsletteradmin" element={<PrivateRoute cardKey="enquiries"><NewsletterAdmin /></PrivateRoute >} />
        <Route path="/homeplannedtrips" element={<PrivateRoute cardKey="enquiries"><HomePlannedTrips /></PrivateRoute>} />
        <Route path="/admincustomquotes" element={<PrivateRoute cardKey="enquiries"><AdminCustomQuotes /></PrivateRoute>} />
        <Route path="/packageCallback" element={<PrivateRoute cardKey="enquiries"><PackageCallback /></PrivateRoute>} />
        <Route path="/destinationCallback" element={<PrivateRoute cardKey="enquiries"><DestinationCallback /></PrivateRoute>} />
        <Route path="/adminupcomingtrip" element={<PrivateRoute cardKey="enquiries"><AdminUpcomingTrip /></PrivateRoute>} />
        <Route path="/adminpopupenquiries" element={<PrivateRoute cardKey="enquiries"><AdminPopupEnquiries /></PrivateRoute>} />
        <Route path="/activityCallback" element={<PrivateRoute cardKey="enquiries"><ActivityCallbacksAdmin /></PrivateRoute>} />
        <Route path="/managecontact" element={<PrivateRoute cardKey="enquiries"><ManageContact /></PrivateRoute>} />
        {/* <Route path="/hotel" element={<PrivateRoute cardKey="enquiries"><HotelManager /></PrivateRoute>} /> */}
        
        <Route path="/manage-ai" element={<PrivateRoute cardKey="AI"><ServiceManager /></PrivateRoute>} />
        <Route path="/serviceprovider" element={<PrivateRoute cardKey="AI"><ServiceProvidersList /></PrivateRoute>} />
        
        <Route path="/allenquiries" element={<AllEnquiries />} />
      </Routes>
    </div>
  );
}

export default App;
