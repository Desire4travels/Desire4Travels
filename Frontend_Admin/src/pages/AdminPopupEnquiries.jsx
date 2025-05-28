import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPopupEnquiries.css';

export default function AdminPopupEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const renderDate = (createdAt) => {
    if (!createdAt) return 'N/A';

    if (createdAt._seconds && typeof createdAt._seconds === 'number') {
      const dateObj = new Date(createdAt._seconds * 1000);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    if (createdAt.seconds && typeof createdAt.seconds === 'number') {
      const dateObj = new Date(createdAt.seconds * 1000);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    if (typeof createdAt === 'string') {
      const dateObj = new Date(createdAt);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    if (createdAt instanceof Date) {
      return isNaN(createdAt.getTime()) ? 'Invalid Date' : createdAt.toLocaleString();
    }

    return 'Invalid Date';
  };

  useEffect(() => {
    document.title = 'Admin - Popup Enquiries';

    async function fetchEnquiries() {
      try {
        const response = await axios.get('https://desire4travels-1.onrender.com/api/admin/popup-enquiries');
        setEnquiries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch enquiries');
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  return (
    <div className="admin-popup-enquiries-container">
      <h1>Popup Enquiries</h1>

      {loading && <p>Loading enquiries...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && enquiries.length === 0 && <p>No popup enquiries found.</p>}

      {!loading && enquiries.length > 0 && (
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Mobile Number</th>
              <th>Destination</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.mobileNumber}</td>
                <td>{enquiry.destination}</td>
                <td>{renderDate(enquiry.createdAt || enquiry.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
