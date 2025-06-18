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
    if (!window.confirm('Are you sure you want to delete this callback?')) return;
  
    try {
      const isOwner = localStorage.getItem('isOwner') === 'yes';
      const headers = isOwner ? { 'x-owner-key': 'OWNER-KEY-123' } : {};
  
      await axios.delete(`https://desire4travels-1.onrender.com/activity-callback/${id}`, { headers });
      fetchCallbacks();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete callback');
    }
  };
  

  // const startEditing = (id, number) => {
  //   setEditingId(id);
  //   setEditNumber(number);
  // };

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
                              {/* <button onClick={() => startEditing(callback.id, callback.number)} className="btn purple">Edit</button> */}
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