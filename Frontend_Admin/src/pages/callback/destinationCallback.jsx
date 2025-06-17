import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageContact.css';

const destinationCallback = () => {
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://desire4travels-1.onrender.com/callback-destination');
      setContacts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
      setLoading(false);
    }
  };

  const markAsCalled = async (id) => {
    try {
      await axios.put(`https://desire4travels-1.onrender.com/callback-destination/${id}`, { called: true });
      fetchContacts();
    } catch (error) {
      console.error('Failed to mark as called', error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`https://desire4travels-1.onrender.com/callback-destination/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact', error);
    }
  };

  const filterContacts = () => {
    if (activeTab === 'called') return contacts.filter(c => c.called);
    if (activeTab === 'notCalled') return contacts.filter(c => !c.called);
    return contacts;
  };

  const renderContacts = (list) => (
    <ul>
      {list.map(contact => (
        <li
          key={contact.id}
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        >
          <div>
            <strong>{contact.destination}</strong> — {contact.phoneNo} — Called: {contact.called ? 'Yes' : 'No'}
          </div>

          <div style={{ marginTop: '10px' }}>
            <a
              href={`tel:${contact.phoneNo}`}
              style={{
                padding: '5px 10px',
                backgroundColor: '#2196F3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '10px',
                display: 'inline-block'
              }}
            >
              Call Now
            </a>

            {!contact.called && (
              <button
                onClick={() => markAsCalled(contact.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              >
                Mark as Called
              </button>
            )}

            <button
              onClick={() => deleteContact(contact.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="contact-manager">
      <h2>Destination Contact Requests</h2>

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

export default destinationCallback;
