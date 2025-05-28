import React, { useEffect, useState } from 'react';
import './Destination.css';
import DestinationCard from '../Components/Destination/DestinationCard';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";

const ITEMS_PER_PAGE = 12;

const tripTypes = ['All', 'Mountain', 'Beach', 'Religious', 'Treks', 'Offbeat', 'Other'];

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [filteredType, setFilteredType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { triptype } = useParams();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    fetch('https://desire4travels-1.onrender.com/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch destinations');
        return res.json();
      })
      .then(data => {
        setDestinations(data.destinations);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const normalizeType = (type) => {
    if (typeof type === 'string') return type.trim().toLowerCase();
    return '';
  };

  useEffect(() => {
    const normalizedParam = triptype ? triptype.toLowerCase() : 'all';

    const matchedType = tripTypes.find(t => t.toLowerCase() === normalizedParam) || 'All';

    setFilteredType(matchedType);
    setCurrentPage(1);

    if (matchedType === 'All') {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter(dest => {
        if (Array.isArray(dest.type)) {
          return dest.type.some(t => normalizeType(t) === normalizedParam);
        }
        return normalizeType(dest.type) === normalizedParam;
      });
      setFilteredDestinations(filtered);
    }
  }, [triptype, destinations, location.pathname]);

  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTypeChange = (e) => {
    const selected = e.target.value;
    if (selected === 'All') {
      navigate('/destination');
    } else {
      navigate(`/destination/triptype/${selected.toLowerCase()}`);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="destination-page">
      <Helmet>
        <title>Best Places to Visit – Travel Guides & Tips | Desire4Travels</title>
        <meta name="description" content="Discover stunning travel destinations across continents with Desire4Travels. Browse curated guides, local insights, and inspiration for your next trip." />
        <meta name="keywords" content="travel destinations, top places to visit, destination guides, travel spots, international travel, exotic destinations, Indian destinations, adventure travel locations, tropical vacations, best cities to visit, travel planning, cultural destinations, bucket list places, best places to visit" />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Best Places to Visit – Travel Guides & Tips | Desire4Travels" />
        <meta property="og:description" content="Discover stunning travel destinations across continents with Desire4Travels. Browse curated guides, local insights, and inspiration for your next trip." />
      </Helmet>

      <header className="destination-hero">
        <div className="destination-hero-content" style={{ position: 'relative' }}>
          <h1 className="destination-title">Destinations</h1>
          <select
            value={filteredType}
            onChange={handleTypeChange}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '8px 12px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
            aria-label="Filter by Trip Type"
          >
            {tripTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="cards-container">
        {loading ? (
          <p className="loading-message">Loading destinations</p>
        ) : paginatedDestinations.length > 0 ? (
          paginatedDestinations.map(dest => (
            <DestinationCard
              key={dest.id}
              imgSrc={dest.image}
              title={dest.name}
              location={dest.state}
              tripType={dest.type}
              rating={parseFloat(dest.rating || 0).toFixed(1)}
              onClick={() => navigate(`/destination/${dest.id}`, { state: { destinationName: dest.name } })}
            />
          ))
        ) : (
          <p>No destinations available.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            style={{ marginRight: '1rem', padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{ marginLeft: '1rem', padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Destination;
