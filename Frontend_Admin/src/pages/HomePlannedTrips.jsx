// import { useEffect, useState } from 'react';
// import './HomePlannedTrips.css';

// const HomePlannedTrips = () => {
//   const [trips, setTrips] = useState([]);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const res = await fetch('https://desire4travels-1.onrender.com/api/admin/planned-trips');
//         const data = await res.json();
//         setTrips(data);
//       } catch (err) {
//         console.error('Error fetching planned trips:', err);
//       }
//     };

//     fetchTrips();
//   }, []);

//   return (
//     <div className="planned-trips-container">
//       <h1>Home Planned Trips</h1>
//       <table className="planned-trips-table">
//         <thead>
//           <tr>
//             <th>Destination</th>
//             <th>Travel Date</th>
//             <th>Days</th>
//             <th>Travelers</th>
//             <th>Mobile Number</th>
//             <th>Submitted</th>
//           </tr>
//         </thead>
//         <tbody>
//           {trips.length > 0 ? (
//             trips.map((trip, index) => (
//               <tr key={trip.id || index}>
//                 <td>{trip.destination}</td>
//                 <td>
//                   {trip.startDate
//                     ? (trip.startDate._seconds
//                         ? new Date(trip.startDate._seconds * 1000).toLocaleDateString()
//                         : new Date(trip.startDate).toLocaleDateString())
//                     : 'N/A'}
//                 </td>
//                 <td>{trip.noofdays}</td>
//                 <td>{trip.travelers}</td>
//                 <td>{trip.mobileNumber || 'N/A'}</td>
//                 <td>
//                   {trip.createdAt
//                     ? new Date(trip.createdAt._seconds * 1000).toLocaleString()
//                     : 'N/A'}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ textAlign: 'center' }}>
//                 No planned trips found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HomePlannedTrips;


import { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePlannedTrips.css';

const HomePlannedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, [filter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://desire4travels-1.onrender.com/api/admin/planned-trips');
      
      let filteredData = response.data.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
        startDate: item.startDate ? new Date(item.startDate) : null
      }));
      
      if (filter === 'called') filteredData = filteredData.filter(item => item.called);
      else if (filter === 'not_called') filteredData = filteredData.filter(item => !item.called);
      
      setTrips(filteredData);
      setLoading(false);
      setSelectedAll(false);
      setSelectedIds([]);
    } catch (err) {
      console.error('Error fetching planned trips:', err);
      setError('Failed to fetch planned trips');
      setLoading(false);
    }
  };

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const handleMarkAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/api/admin/planned-trips/${id}`, { called: true });
      fetchTrips();
    } catch (err) {
      setError('Failed to update called status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const isOwner = localStorage.getItem('isOwner') === 'yes';
      const headers = isOwner ? { 'x-owner-key': 'OWNER-KEY-123' } : {};
  
      await axios.delete(`https://desire4travels-1.onrender.com/api/admin/planned-trips/${id}`, { headers });
      fetchTrips();
    } catch (err) {
      setError('Failed to delete trip');
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
  
    const isOwner = localStorage.getItem('isOwner') === 'yes';
    const headers = isOwner ? { 'x-owner-key': 'OWNER-KEY-123' } : {};
  
    try {
      await Promise.all(
        selectedIds.map(id =>
          axios.delete(`https://desire4travels-1.onrender.com/api/admin/planned-trips/${id}`, { headers })
        )
      );
      fetchTrips();
    } catch (err) {
      setError('Failed to delete selected trips');
    }
  };
  
  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL planned trips?')) return;
  
    const isOwner = localStorage.getItem('isOwner') === 'yes';
    const headers = isOwner ? { 'x-owner-key': 'OWNER-KEY-123' } : {};
  
    try {
      await axios.delete('https://desire4travels-1.onrender.com/api/admin/planned-trips', { headers });
      fetchTrips();
    } catch (err) {
      setError('Failed to delete all trips');
    }
  };
  

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(trips.map(trip => trip.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelectSingle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(tripId => tripId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <div className="planned-trips-container">
      <h1>Planned Trips</h1>
      {error && <div className="error-box">{error}</div>}

      <div className="controls">
        <div className="filter-buttons">
          {['all', 'called', 'not_called'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.replace('_', ' ').replace(/^./, str => str.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="bulk-actions">
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteSelected} className="btn red">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={handleDeleteAll} className="btn red">
            Delete All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : trips.length === 0 ? (
        <p className="no-data">No planned trips found.</p>
      ) : (
        <table className="planned-trips-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Destination</th>
              <th>Travel Date</th>
              <th>Days</th>
              <th>Travelers</th>
              <th>Mobile Number</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(trip.id)}
                    onChange={() => toggleSelectSingle(trip.id)}
                  />
                </td>
                <td>{trip.destination}</td>
                <td>{formatDate(trip.startDate)}</td>
                <td>{trip.noofdays}</td>
                <td>{trip.travelers}</td>
                <td>{trip.mobileNumber || 'N/A'}</td>
                <td>
                  <span className={`status ${trip.called ? 'called' : 'not-called'}`}>
                    {trip.called ? 'Contacted' : 'Not Contacted'}
                  </span>
                </td>
                <td>{formatDateTime(trip.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleCall(trip.mobileNumber)} 
                      className="btn blue"
                      disabled={!trip.mobileNumber}
                    >
                      Call
                    </button>
                    {!trip.called && (
                      <button 
                        onClick={() => handleMarkAsCalled(trip.id)} 
                        className="btn green"
                      >
                        Mark Contacted
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(trip.id)} 
                      className="btn red"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HomePlannedTrips;