// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AdminCustomQuotes.css';

// const AdminCustomQuotes = () => {
//   const [quotes, setQuotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const renderDate = (createdAt) => {
//     if (!createdAt) return 'N/A';

//     // Handle Firestore timestamp with _seconds
//     if (createdAt._seconds && typeof createdAt._seconds === 'number') {
//       const dateObj = new Date(createdAt._seconds * 1000);
//       return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
//     }

//     // Handle Firestore timestamp with seconds (some formats)
//     if (createdAt.seconds && typeof createdAt.seconds === 'number') {
//       const dateObj = new Date(createdAt.seconds * 1000);
//       return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
//     }

//     // Handle ISO string or other string formats
//     if (typeof createdAt === 'string') {
//       let dateObj = new Date(createdAt);
//       if (!isNaN(dateObj.getTime())) return dateObj.toLocaleString();

//       // Try fixing common formatting issues
//       const fixedStr = createdAt.replace(' at ', ' ').replace(' UTC+5:30', '+05:30');
//       dateObj = new Date(fixedStr);
//       return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString();
//     }

//     return 'Invalid Date';
//   };

//   useEffect(() => {
//     const fetchQuotes = async () => {
//       try {
//         const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/custom-quotes');
//         setQuotes(res.data);
//       } catch (err) {
//         setError('Failed to fetch custom quotes');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuotes();
//   }, []);

//   if (loading) return <p>Loading custom quotes...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   return (
//     <div style={{ padding: '20px', maxWidth: 900, margin: 'auto' }}>
//       <h2>Custom Quote Requests</h2>
//       {quotes.length === 0 ? (
//         <p>No custom quotes found.</p>
//       ) : (
//         <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Travelers</th>
//               <th>Preferred Date</th>
//               <th>Package Name</th>
//               <th>Requested At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quotes.map(({ id, name, mobile, travelers, date, packageName, createdAt }) => (
//               <tr key={id}>
//                 <td>{name}</td>
//                 <td>{mobile}</td>
//                 <td>{travelers}</td>
//                 <td>{date}</td>
//                 <td>{packageName || 'N/A'}</td>
//                 <td>{renderDate(createdAt)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminCustomQuotes;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCustomQuotes.css';

const AdminCustomQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://desire4travels-1.onrender.com/api/admin/custom-quotes');
      
      let filteredData = res.data.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : null
      }));
      
      if (filter === 'called') filteredData = filteredData.filter(item => item.called);
      else if (filter === 'not_called') filteredData = filteredData.filter(item => !item.called);
      
      setQuotes(filteredData);
      setLoading(false);
      setSelectedAll(false);
      setSelectedIds([]);
    } catch (err) {
      setError('Failed to fetch custom quotes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const handleMarkAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/api/custom-quotes/${id}`, { called: true });
      fetchQuotes();
    } catch (err) {
      setError('Failed to update called status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://desire4travels-1.onrender.com/api/custom-quotes/${id}`);
      fetchQuotes();
    } catch (err) {
      setError('Failed to delete quote');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await Promise.all(
        selectedIds.map(id => 
          axios.delete(`https://desire4travels-1.onrender.com/api/custom-quotes/${id}`)
        )
      );
      fetchQuotes();
    } catch (err) {
      setError('Failed to delete selected quotes');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL custom quotes?')) return;
    
    try {
      await axios.delete('https://desire4travels-1.onrender.com/api/custom-quotes');
      fetchQuotes();
    } catch (err) {
      setError('Failed to delete all quotes');
    }
  };

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(quotes.map(quote => quote.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelectSingle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(quoteId => quoteId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderDate = (createdAt) => {
    if (!createdAt) return 'N/A';
    return new Date(createdAt).toLocaleString();
  };

  return (
    <div className="custom-quotes-container">
      <h2>Custom Quote Requests</h2>
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
      ) : quotes.length === 0 ? (
        <p className="no-data">No custom quotes found.</p>
      ) : (
        <table className="quotes-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Travelers</th>
              <th>Preferred Date</th>
              <th>Package Name</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(quote.id)}
                    onChange={() => toggleSelectSingle(quote.id)}
                  />
                </td>
                <td>{quote.name}</td>
                <td>{quote.mobile}</td>
                <td>{quote.travelers}</td>
                <td>{quote.date}</td>
                <td>{quote.packageName || 'N/A'}</td>
                <td>
                  <span className={`status ${quote.called ? 'called' : 'not-called'}`}>
                    {quote.called ? 'Contacted' : 'Not Contacted'}
                  </span>
                </td>
                <td>{renderDate(quote.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleCall(quote.mobile)} 
                      className="btn blue"
                    >
                      Call
                    </button>
                    {!quote.called && (
                      <button 
                        onClick={() => handleMarkAsCalled(quote.id)} 
                        className="btn green"
                      >
                        Mark Contacted
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(quote.id)} 
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

export default AdminCustomQuotes;