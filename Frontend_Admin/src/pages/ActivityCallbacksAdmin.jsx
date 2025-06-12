// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const ActivityCallbacksAdmin = () => {
//   const [callbacks, setCallbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filter, setFilter] = useState('all'); // 'all', 'called', 'not_called'
//   const [editingId, setEditingId] = useState(null);
//   const [editNumber, setEditNumber] = useState('');

//   useEffect(() => {
//     fetchCallbacks();
//   }, [filter]);

//   const fetchCallbacks = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://desire4travels-1.onrender.com/activity-callback');
//       let filteredData = response.data;
      
//       if (filter === 'called') {
//         filteredData = filteredData.filter(item => item.called);
//       } else if (filter === 'not_called') {
//         filteredData = filteredData.filter(item => !item.called);
//       }
      
//       setCallbacks(filteredData);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch callbacks');
//       setLoading(false);
//     }
//   };

//   const handleCall = (number) => {
//     // This would initiate a phone call in a real application
//     console.log(`Calling ${number}`);
//     window.open(`tel:${number}`);
//   };

//   const handleMarkAsCalled = async (id) => {
//     try {
//       await axios.put(`https://desire4travels-1.onrender.com/activity-callback/${id}`, { called: true });
//       fetchCallbacks();
//     } catch (err) {
//       setError('Failed to update callback status');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://desire4travels-1.onrender.com/activity-callback/${id}`);
//       fetchCallbacks();
//     } catch (err) {
//       setError('Failed to delete callback');
//     }
//   };

//   const startEditing = (id, number) => {
//     setEditingId(id);
//     setEditNumber(number);
//   };

//   const handleEditSubmit = async (id) => {
//     try {
//       await axios.put(`https://desire4travels-1.onrender.com/activity-callback/${id}`, { number: editNumber });
//       setEditingId(null);
//       fetchCallbacks();
//     } catch (err) {
//       setError('Failed to update number');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     const date = timestamp.toDate();
//     return date.toLocaleString();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Activity Callbacks</h1>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <div className="flex space-x-4 mb-6">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setFilter('called')}
//             className={`px-4 py-2 rounded ${filter === 'called' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
//           >
//             Called
//           </button>
//           <button
//             onClick={() => setFilter('not_called')}
//             className={`px-4 py-2 rounded ${filter === 'not_called' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
//           >
//             Not Called
//           </button>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created At
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {callbacks.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                       No callbacks found
//                     </td>
//                   </tr>
//                 ) : (
//                   callbacks.map((callback) => (
//                     <tr key={callback.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingId === callback.id ? (
//                           <input
//                             type="text"
//                             value={editNumber}
//                             onChange={(e) => setEditNumber(e.target.value)}
//                             className="border rounded px-2 py-1"
//                           />
//                         ) : (
//                           <div className="text-sm font-medium text-gray-900">{callback.number}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                             ${callback.called ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
//                         >
//                           {callback.called ? 'Called' : 'Not Called'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(callback.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           {editingId === callback.id ? (
//                             <>
//                               <button
//                                 onClick={() => handleEditSubmit(callback.id)}
//                                 className="text-green-600 hover:text-green-900"
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 onClick={() => setEditingId(null)}
//                                 className="text-gray-600 hover:text-gray-900"
//                               >
//                                 Cancel
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => handleCall(callback.number)}
//                                 className="text-blue-600 hover:text-blue-900"
//                               >
//                                 Call
//                               </button>
//                               <button
//                                 onClick={() => startEditing(callback.id, callback.number)}
//                                 className="text-indigo-600 hover:text-indigo-900"
//                               >
//                                 Edit
//                               </button>
//                               {!callback.called && (
//                                 <button
//                                   onClick={() => handleMarkAsCalled(callback.id)}
//                                   className="text-green-600 hover:text-green-900"
//                                 >
//                                   Mark as Called
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => handleDelete(callback.id)}
//                                 className="text-red-600 hover:text-red-900"
//                               >
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ActivityCallbacksAdmin;

import { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityCallbacksAdmin.css';

const ActivityCallbacksAdmin = () => {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editNumber, setEditNumber] = useState('');

  useEffect(() => {
    fetchCallbacks();
  }, [filter]);

  const fetchCallbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://desire4travels-1.onrender.com/activity-callback');
      let filteredData = response.data.map(item => ({
        ...item,
        // Convert Firestore timestamp to Date object
        createdAt: item.createdAt ? new Date(item.createdAt._seconds * 1000) : null
      }));
      
      if (filter === 'called') filteredData = filteredData.filter(item => item.called);
      else if (filter === 'not_called') filteredData = filteredData.filter(item => !item.called);
      
      setCallbacks(filteredData);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch callbacks');
      setLoading(false);
    }
  };

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const handleMarkAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/activity-callback/${id}`, { called: true });
      fetchCallbacks();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update callback status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://desire4travels-1.onrender.com/activity-callback/${id}`);
      fetchCallbacks();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete callback');
    }
  };

  const startEditing = (id, number) => {
    setEditingId(id);
    setEditNumber(number);
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/activity-callback/${id}`, { number: editNumber });
      setEditingId(null);
      fetchCallbacks();
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to update number');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Activity Callbacks</h1>
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
          <div className="table-container">
            <table className="callback-table">
              <thead>
                <tr>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">No callbacks found</td>
                  </tr>
                ) : (
                  callbacks.map(callback => (
                    <tr key={callback.id}>
                      <td>
                        {editingId === callback.id ? (
                          <input
                            type="text"
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                            className="input"
                          />
                        ) : (
                          <span className="phone">{callback.number}</span>
                        )}
                      </td>
                      <td>
                        <span className={`status ${callback.called ? 'called' : 'not-called'}`}>
                          {callback.called ? 'Called' : 'Not Called'}
                        </span>
                      </td>
                      <td>{formatDate(callback.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          {editingId === callback.id ? (
                            <>
                              <button onClick={() => handleEditSubmit(callback.id)} className="btn green">Save</button>
                              <button onClick={() => setEditingId(null)} className="btn gray">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleCall(callback.number)} className="btn blue">Call</button>
                              <button onClick={() => startEditing(callback.id, callback.number)} className="btn purple">Edit</button>
                              {!callback.called && (
                                <button onClick={() => handleMarkAsCalled(callback.id)} className="btn green">Mark as Called</button>
                              )}
                              <button onClick={() => handleDelete(callback.id)} className="btn red">Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCallbacksAdmin;