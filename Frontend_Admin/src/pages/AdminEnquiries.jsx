// src/pages/AdminEnquiries.jsx
import { useEffect, useState } from 'react';
import './AdminEnquiries.css';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('https://desire4travels-1.onrender.com/api/admin/enquiries');
        const data = await res.json();
        setEnquiries(data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div className="enquiries-container">
      <h1>Enquiry Submissions</h1>
      <table className="enquiries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Destination</th>
            <th>Travelers</th>
            <th>Travel Date</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map(enquiry => (
            <tr key={enquiry.id}>
              <td>{enquiry.name}</td>
              <td>{enquiry.phone}</td>
              <td>{enquiry.destination}</td>
              <td>{enquiry.travelers}</td>
              <td>{enquiry.travelDate}</td>
              <td>{enquiry.submittedAt
                ? new Date(enquiry.submittedAt).toLocaleString()
                : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEnquiries;
