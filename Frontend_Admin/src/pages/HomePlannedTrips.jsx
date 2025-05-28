import { useEffect, useState } from 'react';
import './HomePlannedTrips.css';

const HomePlannedTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('https://desire4travels-1.onrender.com/api/admin/planned-trips');
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error('Error fetching planned trips:', err);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="planned-trips-container">
      <h1>Home Planned Trips</h1>
      <table className="planned-trips-table">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Travel Date</th>
            <th>Days</th>
            <th>Travelers</th>
            <th>Mobile Number</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {trips.length > 0 ? (
            trips.map((trip, index) => (
              <tr key={trip.id || index}>
                <td>{trip.destination}</td>
                <td>
                  {trip.startDate
                    ? (trip.startDate._seconds
                        ? new Date(trip.startDate._seconds * 1000).toLocaleDateString()
                        : new Date(trip.startDate).toLocaleDateString())
                    : 'N/A'}
                </td>
                <td>{trip.noofdays}</td>
                <td>{trip.travelers}</td>
                <td>{trip.mobileNumber || 'N/A'}</td>
                <td>
                  {trip.createdAt
                    ? new Date(trip.createdAt._seconds * 1000).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No planned trips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HomePlannedTrips;
