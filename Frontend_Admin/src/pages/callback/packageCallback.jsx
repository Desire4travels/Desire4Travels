import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageContact.css'; 

const packageCallback = () => {
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // default to 'all'
  const [loading, setLoading] = useState(true);

  // Fetch contacts from the backend
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://desire4travels-1.onrender.com/callback-package'); // Ensure the endpoint is correct
      setContacts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
      setLoading(false);
    }
  };

  // Mark a contact as called
  const markAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/callback-package/${id}`, { called: true });
      fetchContacts(); // Refresh the list after updating
    } catch (error) {
      console.error('Failed to mark as called', error);
    }
  };

  // Filter contacts based on the active tab
  const filterContacts = () => {
    if (activeTab === 'called') return contacts.filter(c => c.called);
    if (activeTab === 'notCalled') return contacts.filter(c => !c.called);
    return contacts; // all contacts
  };

  // Render each contact in a list
  const renderContacts = (list) => (
    <ul>
      {list.map(contact => (
        <li key={contact.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <div>
            <strong>{contact.package}</strong> — {contact.phoneNo} — Called: {contact.called ? 'Yes' : 'No'}

          </div>

              {/* Call Now button */}
          <a 
            href={`tel:${contact.phoneNo}`} 
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              display: 'inline-block' 
            }}
          >
            Call Now
          </a>

          {!contact.called && (
            <button 
              onClick={() => markAsCalled(contact.id)} 
              style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Mark as Called
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="contact-manager">
      <h2>Package Contact Requests</h2>

      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({contacts.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'notCalled' ? 'active' : ''}`}
          onClick={() => setActiveTab('notCalled')}
        >
          Not Called ({contacts.filter(c => !c.called).length})
        </button>
        <button
          className={`tab-button ${activeTab === 'called' ? 'active' : ''}`}
          onClick={() => setActiveTab('called')}
        >
          Called ({contacts.filter(c => c.called).length})
        </button>
      </div>

      {loading ? <p>Loading contacts...</p> : renderContacts(filterContacts())}
    </div>
  );
};

export default packageCallback;
