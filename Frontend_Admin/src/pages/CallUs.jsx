import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CallUs.css'; // Make sure the path is correct

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://desire4travels-1.onrender.com/contact-us');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Delete this contact?')) {
      try {
        await axios.delete(`https://desire4travels-1.onrender.com/contact-us/${id}`);
        setContacts(prev => prev.filter(contact => contact.id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) return <p>Loading contacts...</p>;

  return (
    <div className="contact-table-container">
      <h2>Contact Messages</h2>
      {contacts.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone No</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.phoneNo}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td className="actions">
                  <button onClick={() => alert(`Viewing ${contact.name} ${contact.message}`)}>View</button>
                  <button className="delete" onClick={() => deleteContact(contact.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactUs;
