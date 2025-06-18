import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPopupEnquiries.css';

export default function AdminPopupEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const renderDate = (createdAt) => {
    if (!createdAt) return 'N/A';
    if (createdAt._seconds) return new Date(createdAt._seconds * 1000).toLocaleString();
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();
    if (typeof createdAt === 'string') return new Date(createdAt).toLocaleString();
    if (createdAt instanceof Date) return createdAt.toLocaleString();
    return 'Invalid Date';
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://desire4travels-1.onrender.com/api/admin/popup-enquiries');
      setEnquiries(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enquiries');
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const isOwner = localStorage.getItem('isOwner') === 'yes';
      const headers = isOwner ? { 'x-owner-key': 'OWNER-KEY-123' } : {};

      await axios.delete(`https://desire4travels-1.onrender.com/api/admin/popup-enquiries/${id}`, { headers });
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
      setError('Failed to delete enquiry');
    }
  };

  useEffect(() => {
    document.title = 'Admin - Popup Enquiries';
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.mobileNumber}</td>
                <td>{enquiry.destination}</td>
                <td>{renderDate(enquiry.createdAt || enquiry.submittedAt)}</td>
                <td>
                  <button
                    onClick={() => deleteEnquiry(enquiry.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
