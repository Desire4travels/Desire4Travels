// import './NewsletterAdmin.css';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProtectedCard from '../Components/ProtectedCard.jsx';

// const NewsletterAdmin = () => {
//   const [subscribers, setSubscribers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchSubscribers = async () => {
//       try {
//         const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/newsletter');
//         setSubscribers(res.data); 
//       } catch (err) {
//         setError('Failed to load subscribers.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubscribers();
//   }, []);

//   return (
//     <ProtectedCard cardKey="enquiries"> 
//     <div className="newsletter-admin-container">
//       <h2>Newsletter Subscribers</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="error">{error}</p>
//       ) : subscribers.length === 0 ? (
//         <p>No subscribers found.</p>
//       ) : (
//         <table className="subscribers-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Email</th>
//               <th>Subscribed At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {subscribers.map((subscriber, index) => (
//               <tr key={subscriber.id || index}>
//                 <td>{index + 1}</td>
//                 <td>{subscriber.email}</td>
//                 <td>{subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString() : '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//     </ProtectedCard>
//   );
// };

// export default NewsletterAdmin;


import './NewsletterAdmin.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedCard from '../Components/ProtectedCard.jsx';

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSubscribers();
  }, [filter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/newsletter');
      
      let filteredData = res.data.map(item => ({
        ...item,
        subscribedAt: item.subscribedAt ? new Date(item.subscribedAt) : null
      }));
      
      if (filter === 'called') filteredData = filteredData.filter(item => item.called);
      else if (filter === 'not_called') filteredData = filteredData.filter(item => !item.called);
      
      setSubscribers(filteredData);
      setLoading(false);
      setSelectedAll(false);
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to load subscribers.');
      setLoading(false);
    }
  };

  const handleMarkAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/api/newsletter/${id}`, { called: true });
      fetchSubscribers();
    } catch (err) {
      setError('Failed to update called status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://desire4travels-1.onrender.com/api/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      setError('Failed to delete subscriber.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await Promise.all(
        selectedIds.map(id => 
          axios.delete(`https://desire4travels-1.onrender.com/api/newsletter/${id}`)
        )
      );
      fetchSubscribers();
    } catch (err) {
      setError('Failed to delete selected subscribers.');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL subscribers?')) return;
    
    try {
      await axios.delete('https://desire4travels-1.onrender.com/api/newsletter');
      fetchSubscribers();
    } catch (err) {
      setError('Failed to delete all subscribers.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscribers.map(sub => sub.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelectSingle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(subId => subId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <ProtectedCard cardKey="enquiries"> 
      <div className="newsletter-admin-container">
        <h2>Newsletter Subscribers</h2>
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
        ) : subscribers.length === 0 ? (
          <p className="no-data">No subscribers found.</p>
        ) : (
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber.id || index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(subscriber.id)}
                      onChange={() => toggleSelectSingle(subscriber.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{subscriber.email}</td>
                  <td>
                    <span className={`status ${subscriber.called ? 'called' : 'not-called'}`}>
                      {subscriber.called ? 'Contacted' : 'Not Contacted'}
                    </span>
                  </td>
                  <td>{formatDate(subscriber.subscribedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      {!subscriber.called && (
                        <button 
                          onClick={() => handleMarkAsCalled(subscriber.id)} 
                          className="btn green"
                        >
                          Mark Contacted
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(subscriber.id)} 
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
    </ProtectedCard>
  );
};

export default NewsletterAdmin;