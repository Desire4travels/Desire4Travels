import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./Components/Navbar/Navbar.jsx";
import Hero from "./Components/Hero/Hero.jsx";
import Destination from "./pages/Destination.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import PlanTrip from "./pages/PlanTrip.jsx";
import TopDestination from "./pages/TopDestination.jsx";
import TypeTrip from "./pages/TypeTrip.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import Package from "./pages/Package.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import AboutUs from './pages/Aboutus.jsx';
import Contact from './pages/Contact.jsx';
import UpcomingTrip from './pages/UpcomingTrip.jsx';
import Review from './pages/Review.jsx';
import CareerPage from './pages/CareerPage.jsx';
import Popup from './pages/PopUp.jsx';
import Faq from './pages/Faq.jsx';
import TripTypePage from './pages/TripTypePage.jsx';
import DestinationDetail from './pages/DestinationDetails.jsx';
import BlogPost from './pages/blogs/BlogPost.jsx';
import BlogList from './pages/blogs/BlogList.jsx';
import Tawk from './Components/Tawk/Tawk.jsx';
import TermandConditions from './pages/TermsandConditions.jsx';
import ScrollToTop from './Components/ScrollToTop.jsx';
import { Helmet } from "react-helmet";

import "./App.css";


const App = () => {
  const heroData = [
    {
      text1: "Manali, Himachal Pradesh",
      text2:
        "Manali offers snow, adventure, scenic beauty, skiing, trekking, paragliding, mountain views, local cuisine, and serene valleys.",
    },
    {
      text1: "Munnar, Kerala",
      text2:
        "Munnar, a picturesque hill station in Kerala, offers tea plantations, misty mountains, wildlife, and serene landscapes for a peaceful escape.",
    },
    {
      text1: "Rishikesh, Uttarakhand",
      text2:
        "Rishikesh, the Yoga Capital of the World, offers serene ashrams, yoga retreats, and adventure sports like rafting, set along the Ganges River.",
    },
  ];

  const [heroCount, setHeroCount] = useState(0);
  const planTripRef = useRef(null);
  const location = useLocation();
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  useEffect(() => {
    setIsPopupVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count === heroData.length - 1 ? 0 : count + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [heroData.length]);


  const excludedPaths = ["/login", "/signup"];
  const blurClass = isPopupVisible ? "blurred" : "";

  return (
    <div className="app-container">
      <Helmet>
        <title>Desire4travels | Best Tours and Holiday Packages | Plan your trip with us</title>
        <meta
          name="description"
          content="Plan your perfect getaway with travel guides, tips, and stories from around the globe. Journey begins at Desire4Travels."
        />
        <meta
          name="keywords"
          content="Desire4travels, destination tips, adventure travel, solo travel, family travel, vacation planning, world travel, India travel, Travel packages, Trekking packages, travel agency, personalized travel planning, tailor-made itineraries, 24/7 travel support, D4t"
        />
        <meta property="og:title" content="Desire4travels | Best Tours and Holiday Packages | Plan your trip with us" />
        <meta
          property="og:description"
          content="Plan your perfect getaway with travel guides, tips, and stories from around the globe. Journey begins at Desire4Travels."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <ScrollToTop />


      {!excludedPaths.includes(location.pathname) && isPopupVisible && (
        <Popup onClose={() => setIsPopupVisible(false)} />
      )}

      <Navbar />
      <div className={`app-content ${blurClass}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  heroData={heroData[heroCount]}
                  heroCount={heroCount}
                  setHeroCount={setHeroCount}
                  planTripRef={planTripRef}
                />
                <TopDestination />
                {/* <UpcomingTrip />*/}
                <TypeTrip />
                <Review />
                <div ref={planTripRef}>
                  <PlanTrip />
                </div>
              </>
            }
          />
          <Route path="/destination" element={<Destination />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plantrip" element={<PlanTrip />} />
          {/*<Route path="/blogs" element={<BlogPage />} />*/}
          <Route path="/package" element={<Package />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careerpage" element={<CareerPage />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/triptype/:type" element={<TripTypePage />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/terms" element={<TermandConditions />} />

          <Route path="/destination" element={<Destination />} />
          <Route path="/destination/triptype/:triptype" element={<Destination />} />

        </Routes>
      </div>
      <Tawk />
      <Footer />
    </div>
  );
};

export default App;
