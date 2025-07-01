import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './ServiceManager.css';

const API_URL = 'https://desire4travels-1.onrender.com/services'; // Adjust as per your server

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    city: '',
    serviceType: '',
    providerName: '',
    contactInfo: '',
    category: '',
    notes: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get(API_URL);
    setServices(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({
      city: '',
      serviceType: '',
      providerName: '',
      contactInfo: '',
      category: '',
      notes: ''
    });
    setEditId(null);
    fetchServices();
  };

  const handleEdit = (service) => {
    setForm(service);
    setEditId(service.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchServices();
  };

  const handleDeleteAll = async () => {
    const confirm = window.confirm('Are you sure you want to delete all services?');
    if (!confirm) return;

    try {
      await axios.delete(API_URL);
      fetchServices();
      alert('All services deleted.');
    } catch (err) {
      alert('Error deleting all services.');
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      for (const item of data) {
        const service = {
          city: item.City || '',
          serviceType: item['Service Type'] || '',
          providerName: item['Provider Name'] || '',
          contactInfo: item['Contact Info'] || '',
          category: item.Category || '',
          notes: item.Notes || ''
        };
        await axios.post(API_URL, service);
      }

      fetchServices();
      alert('Excel data uploaded successfully!');
    };
    reader.readAsBinaryString(file);
  };

  const grouped = services.reduce((acc, service) => {
    acc[service.serviceType] = acc[service.serviceType] || [];
    acc[service.serviceType].push(service);
    return acc;
  }, {});

  return (
    <div className="container">
      <h1>Service Manager</h1>

      <div className="upload-section">
        <label><strong>Upload Excel File (.xlsx):</strong></label><br />
        <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
        <button onClick={handleDeleteAll} className="delete-all-button">Delete All Services</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="serviceType" placeholder="Service Type" value={form.serviceType} onChange={handleChange} />
        <input name="providerName" placeholder="Provider Name" value={form.providerName} onChange={handleChange} />
        <input name="contactInfo" placeholder="Contact Info" value={form.contactInfo} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <button type="submit">{editId ? 'Update Service' : 'Add Service'}</button>
      </form>

      {Object.entries(grouped).map(([type, group]) => (
        <div key={type} className="group">
          <h2>{type}</h2>
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>Provider</th>
                <th>Contact</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {group.map(service => (
                <tr key={service.id}>
                  <td>{service.city}</td>
                  <td>{service.providerName}</td>
                  <td>{service.contactInfo}</td>
                  <td>{service.category}</td>
                  <td>{service.notes}</td>
                  <td className="actions">
                    <button className="edit" onClick={() => handleEdit(service)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(service.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ServiceManager;
