import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCustomQuotes.css';

const AdminCustomQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const renderDate = (createdAt) => {
    if (!createdAt) return 'N/A';

    // Handle Firestore timestamp with _seconds
    if (createdAt._seconds && typeof createdAt._seconds === 'number') {
      const dateObj = new Date(createdAt._seconds * 1000);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    // Handle Firestore timestamp with seconds (some formats)
    if (createdAt.seconds && typeof createdAt.seconds === 'number') {
      const dateObj = new Date(createdAt.seconds * 1000);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    // Handle ISO string or other string formats
    if (typeof createdAt === 'string') {
      let dateObj = new Date(createdAt);
      if (!isNaN(dateObj.getTime())) return dateObj.toLocaleString();

      // Try fixing common formatting issues
      const fixedStr = createdAt.replace(' at ', ' ').replace(' UTC+5:30', '+05:30');
      dateObj = new Date(fixedStr);
      return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
    }

    return 'Invalid Date';
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/custom-quotes');
        setQuotes(res.data);
      } catch (err) {
        setError('Failed to fetch custom quotes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) return <p>Loading custom quotes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: 900, margin: 'auto' }}>
      <h2>Custom Quote Requests</h2>
      {quotes.length === 0 ? (
        <p>No custom quotes found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Travelers</th>
              <th>Preferred Date</th>
              <th>Package Name</th>
              <th>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(({ id, name, mobile, travelers, date, packageName, createdAt }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{mobile}</td>
                <td>{travelers}</td>
                <td>{date}</td>
                <td>{packageName || 'N/A'}</td>
                <td>{renderDate(createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCustomQuotes;
