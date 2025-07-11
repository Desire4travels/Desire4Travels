// // src/pages/AdminEnquiries.jsx
// import { useEffect, useState } from 'react';
// import './AdminEnquiries.css';

// const AdminEnquiries = () => {
//   const [enquiries, setEnquiries] = useState([]);

//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       try {
//         const res = await fetch('https://desire4travels-1.onrender.com/api/admin/enquiries');
//         const data = await res.json();
//         setEnquiries(data);
//       } catch (err) {
//         console.error('Error fetching enquiries:', err);
//       }
//     };

//     fetchEnquiries();
//   }, []);

//   return (
//     <div className="enquiries-container">
//       <h1>Enquiry Submissions</h1>
//       <table className="enquiries-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Destination</th>
//             <th>Travelers</th>
//             <th>Travel Date</th>
//             <th>Submitted</th>
//           </tr>
//         </thead>
//         <tbody>
//           {enquiries.map(enquiry => (
//             <tr key={enquiry.id}>
//               <td>{enquiry.name}</td>
//               <td>{enquiry.phone}</td>
//               <td>{enquiry.destination}</td>
//               <td>{enquiry.travelers}</td>
//               <td>{enquiry.travelDate}</td>
//               <td>{enquiry.submittedAt
//                 ? new Date(enquiry.submittedAt).toLocaleString()
//                 : 'N/A'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminEnquiries;


// // src/pages/AdminEnquiries.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminEnquiries.css';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');


    useEffect(() => {
    // ✅ Mark this section as visited on first load
    const markVisited = async () => {
      try {
        await axios.post('https://desire4travels-1.onrender.com/api/last-visit', {
          section: 'enquiries'
        });
      } catch (err) {
        console.error('Error updating last visit:', err);
      }
    };

    markVisited();
    fetchEnquiries();
  }, [filter]);


  // useEffect(() => {
  //   fetchEnquiries();
  // }, [filter]);

const fetchEnquiries = async () => {
  try {
    setLoading(true);
    const response = await axios.get('https://desire4travels-1.onrender.com/api/admin/enquiries');

    let data = response.data.map(item => ({
      ...item,
      submittedAt: item.submittedAt ? new Date(item.submittedAt) : new Date(0),
      called: item.called ?? false
    }));

    // Apply filters
    if (filter === 'called') {
      data = data.filter(item => item.called === true);
    } else if (filter === 'not_called') {
      data = data.filter(item => item.called === false);
    }

    // Sort by submittedAt (latest first)
    data.sort((a, b) => b.submittedAt - a.submittedAt);

    setEnquiries(data);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    setError('Failed to fetch enquiries');
    setLoading(false);
  }
};

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const handleMarkAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/api/admin/enquiries/${id}`, { called: true });
      fetchEnquiries();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update enquiry status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = {};
  
      if (localStorage.getItem('isOwner') === 'yes') {
        headers['x-owner-key'] = 'OWNER-KEY-123';
      }
  
      await axios.delete(`https://desire4travels-1.onrender.com/api/admin/enquiries/${id}`, {
        headers
      });
  
      fetchEnquiries();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete enquiry');
    }
  };
  

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <div className="enquiries-container">
      <h1>Enquiry Submissions</h1>
      {error && <div className="error-box">{error}</div>}

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

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Destination</th>
              <th>Travelers</th>
              <th>Travel Date</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No enquiries found</td>
              </tr>
            ) : (
              enquiries.map(enquiry => (
                <tr key={enquiry.id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.phone}</td>
                  <td>{enquiry.destination}</td>
                  <td>{enquiry.travelers}</td>
                  <td>{enquiry.travelDate}</td>
                  <td>{formatDate(enquiry.submittedAt)}</td>
                  <td>
                    <span className={`status ${enquiry.called ? 'called' : 'not-called'}`}>
                      {enquiry.called ? 'Called' : 'Not Called'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleCall(enquiry.phone)} className="btn blue">Call</button>
                      {!enquiry.called && (
                        <button onClick={() => handleMarkAsCalled(enquiry.id)} className="btn green">Mark as Called</button>
                      )}
                      <button onClick={() => handleDelete(enquiry.id)} className="btn red">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminEnquiries;