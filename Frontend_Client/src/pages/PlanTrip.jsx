import React, { useState, useRef, useEffect } from 'react';
import './PlanTrip.css';
import { Helmet } from 'react-helmet';

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    noofdays: '',
    travelers: '',
    preference: '',
    mobileNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://desire4travels-1.onrender.com/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Trip planned successfully!');
        setFormData({
          destination: '',
          startDate: '',
          noofdays: '',
          travelers: '',
          preference: '',
          mobileNumber: ''
        });
      } else {
        alert('Failed to plan trip. Try again.');
      }
    } catch (error) {
      console.error('Error submitting trip:', error);
      alert('Server error. Please try later.');
    }
  };

  return (
    <div className="trip-container">
      <div className="trip-boxes">
        <Helmet>
          <title>Plan Your Trip</title>
        </Helmet>
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="startDate"
            placeholder="When to Travel?"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="noofdays"
            placeholder="Number of Days"
            value={formData.noofdays}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="text"
            name="travelers"
            placeholder="Number of Travelers"
            value={formData.travelers}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;
