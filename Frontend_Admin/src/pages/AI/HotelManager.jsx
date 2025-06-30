// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './HotelManager.css';

// const API_URL = 'https://desire4travels-1.onrender.com/hotels';

// const HotelManager = () => {
//   const [hotels, setHotels] = useState([]);
//   const [form, setForm] = useState({
//     hotelId: '',
//     hotelName: '',
//     location: '',
//     typeOfProperty: '',
//     starRating: '',
//     contactPerson: '',
//     contactNumber: '',
//     notes: '',
//   });
//   const [editMode, setEditMode] = useState(false);

//   const fetchHotels = async () => {
//     const res = await axios.get(API_URL);
//     setHotels(res.data);
//   };

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await axios.put(`${API_URL}/${form.hotelId}`, form);
//         setEditMode(false);
//       } else {
//         await axios.post(API_URL, form);
//       }
//       setForm({
//         hotelId: '',
//         hotelName: '',
//         location: '',
//         typeOfProperty: '',
//         starRating: '',
//         contactPerson: '',
//         contactNumber: '',
//         notes: '',
//       });
//       fetchHotels();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (hotel) => {
//     setForm(hotel);
//     setEditMode(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Delete this hotel?')) {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchHotels();
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="title">Hotel Management</h1>

//       <form onSubmit={handleSubmit} className="form">
//         {Object.keys(form).map((field) => (
//           <input
//             key={field}
//             type="text"
//             name={field}
//             placeholder={field}
//             value={form[field]}
//             onChange={handleChange}
//             required={field === 'hotelId'}
//             disabled={editMode && field === 'hotelId'}
//             className="input"
//           />
//         ))}
//         <button type="submit" className="submit-button">
//           {editMode ? 'Update Hotel' : 'Add Hotel'}
//         </button>
//       </form>

//       {/* Table */}
//       <div className="table-container">
//         <table className="hotel-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Location</th>
//               <th>Type</th>
//               <th>Stars</th>
//               <th>Contact Person</th>
//               <th>Contact Number</th>
//               <th>Notes</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {hotels.map((hotel) => (
//               <tr key={hotel.hotelId}>
//                 <td>{hotel.hotelId}</td>
//                 <td>{hotel.hotelName}</td>
//                 <td>{hotel.location}</td>
//                 <td>{hotel.typeOfProperty}</td>
//                 <td>{hotel.starRating}</td>
//                 <td>{hotel.contactPerson}</td>
//                 <td>{hotel.contactNumber}</td>
//                 <td>{hotel.notes}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEdit(hotel)}>Edit</button>
//                   <button className="delete-btn" onClick={() => handleDelete(hotel.hotelId)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HotelManager;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './HotelManager.css';

const API_URL = 'https://desire4travels-1.onrender.com/hotels';

const HotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    hotelId: '',
    hotelName: '',
    location: '',
    typeOfProperty: '',
    starRating: '',
    contactPerson: '',
    contactNumber: '',
    notes: '',
  });
  const [editMode, setEditMode] = useState(false);

  const fetchHotels = async () => {
    const res = await axios.get(API_URL);
    setHotels(res.data);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${form.hotelId}`, form);
        setEditMode(false);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({
        hotelId: '',
        hotelName: '',
        location: '',
        typeOfProperty: '',
        starRating: '',
        contactPerson: '',
        contactNumber: '',
        notes: '',
      });
      fetchHotels();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (hotel) => {
    setForm(hotel);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this hotel?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchHotels();
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const row of rows) {
        if (!row.hotelId) continue;

        const hotel = {
          hotelId: String(row.hotelId),
          hotelName: row.hotelName || '',
          location: row.location || '',
          typeOfProperty: row.typeOfProperty || '',
          starRating: row.starRating || '',
          contactPerson: row.contactPerson || '',
          contactNumber: row.contactNumber || '',
          notes: row.notes || '',
        };

        try {
          await axios.post(API_URL, hotel);
        } catch (err) {
          console.error(`Error uploading hotel ID ${hotel.hotelId}: ${err.message}`);
        }
      }

      alert('Excel data uploaded successfully');
      fetchHotels();
    } catch (err) {
      alert('Failed to process Excel file');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Hotel Management</h1>

      <div className="upload-container">
        <label htmlFor="excelUpload" className="upload-label">
          Upload Excel:
        </label>
        <input
          type="file"
          id="excelUpload"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="upload-input"
        />
      </div>

      <form onSubmit={handleSubmit} className="form">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required={field === 'hotelId'}
            disabled={editMode && field === 'hotelId'}
            className="input"
          />
        ))}
        <button type="submit" className="submit-button">
          {editMode ? 'Update Hotel' : 'Add Hotel'}
        </button>
      </form>

      <div className="table-container">
        <table className="hotel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Stars</th>
              <th>Contact Person</th>
              <th>Contact Number</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.hotelId}>
                <td>{hotel.hotelId}</td>
                <td>{hotel.hotelName}</td>
                <td>{hotel.location}</td>
                <td>{hotel.typeOfProperty}</td>
                <td>{hotel.starRating}</td>
                <td>{hotel.contactPerson}</td>
                <td>{hotel.contactNumber}</td>
                <td>{hotel.notes}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(hotel)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(hotel.hotelId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelManager;
