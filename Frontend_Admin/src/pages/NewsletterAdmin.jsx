import './NewsletterAdmin.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/newsletter');
        setSubscribers(res.data); 
      } catch (err) {
        setError('Failed to load subscribers.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="newsletter-admin-container">
      <h2>Newsletter Subscribers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : subscribers.length === 0 ? (
        <p>No subscribers found.</p>
      ) : (
        <table className="subscribers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr key={subscriber.id || index}>
                <td>{index + 1}</td>
                <td>{subscriber.email}</td>
                <td>{subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NewsletterAdmin;
