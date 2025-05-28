import React, { useEffect, useState } from 'react';
import './AdminUpcomingTrip.css';

const API_BASE = 'https://desire4travels-1.onrender.com/api';

function AdminUpcomingTrip() {
  const [allPackages, setAllPackages] = useState([]);
  const [trips, setTrips] = useState([
    { packageId: '', travelDate: '' },
    { packageId: '', travelDate: '' },
    { packageId: '', travelDate: '' },
    { packageId: '', travelDate: '' }
  ]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/packages`)
      .then((res) => res.json())
      .then((data) => setAllPackages(data))
      .catch(() => setMessage('Failed to load packages.'));
  }, []);

  const handlePackageChange = (index, packageId) => {
    const updated = [...trips];
    updated[index].packageId = packageId;
    setTrips(updated);
  };

  const handleDateChange = (index, date) => {
    const updated = [...trips];
    updated[index].travelDate = date;
    setTrips(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (trips.some((t) => !t.packageId || !t.travelDate)) {
      setMessage('Please select all 4 packages and their travel dates.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/upcoming-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trips })
      });

      if (!res.ok) throw new Error('Failed to submit trips');
      setMessage('Upcoming trips saved successfully!');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="admin-trip-wrapper">
      <h2>Create 4 Upcoming Trips</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit} className="trip-form">
        {trips.map((trip, index) => (
          <div key={index} className="trip-slot">
            <label>Trip {index + 1}</label>
            <select
              value={trip.packageId}
              onChange={(e) => handlePackageChange(index, e.target.value)}
              required
            >
              <option value="">-- Select Package --</option>
              {allPackages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.packageName}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={trip.travelDate}
              onChange={(e) => handleDateChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Save Upcoming Trips</button>
      </form>
    </div>
  );
}

export default AdminUpcomingTrip;
