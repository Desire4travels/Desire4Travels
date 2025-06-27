// import { useState, useEffect } from 'react';
// import './ManageDestination.css';

// const ManageDestination = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     state: '',
//     type: [],
//     rating: '',
//     image: null,
//     description: '',
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [destinations, setDestinations] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchDestinations();
//   }, []);

//   const fetchDestinations = async () => {
//     try {
//       const res = await fetch('https://desire4travels-1.onrender.com/api/admin/destinations');
//       const data = await res.json();
//       setDestinations(data);
//     } catch (error) {
//       console.error('Error fetching destinations:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, multiple, selectedOptions } = e.target;
//     if (name === 'type' && multiple) {
//       const values = Array.from(selectedOptions, option => option.value);
//       setFormData(prev => ({ ...prev, type: values }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Submitting form with data:', formData);

//     const ratingValue = parseFloat(formData.rating);
//     if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
//       alert('Rating must be between 0 and 5');
//       return;
//     }

//     const data = new FormData();
//     Object.keys(formData).forEach(key => {
//       if (key === 'type') {
//         formData[key].forEach(type => data.append('type', type));
//       } else if (formData[key]) {
//         data.append(key, formData[key]);
//       }
//     });

//     for (let [key, value] of data.entries()) {
//       console.log(`FormData entry: ${key} =`, value);
//     }

//     const endpoint = editingId
//       ? `https://desire4travels-1.onrender.com/api/admin/destinations/${editingId}`
//       : 'https://desire4travels-1.onrender.com/api/admin/destinations';
//     const method = editingId ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(endpoint, {
//         method,
//         body: data,
//       });

//       console.log('Server response status:', res.status);

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       alert(editingId ? 'Destination updated!' : 'Destination added!');
//       setFormData({
//         name: '',
//         state: '',
//         type: [],
//         rating: '',
//         image: null,
//         description: '',
//       });
//       setPreviewImage(null);
//       setEditingId(null);
//       fetchDestinations();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to submit destination');
//     }
//   };

//   const handleEdit = (dest) => {
//     setFormData({
//       name: dest.name,
//       state: dest.state,
//       type: dest.type || [],
//       rating: dest.rating,
//       image: null,
//       description: dest.description || '',
//     });
//     setPreviewImage(`https://desire4travels-1.onrender.com/uploads/${dest.image}`);
//     setEditingId(dest.id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this destination?')) return;
//     try {
//       const res = await fetch(`https://desire4travels-1.onrender.com/api/admin/destinations/${id}`, {
//         method: 'DELETE',
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       alert('Destination deleted');
//       fetchDestinations();
//     } catch (error) {
//       console.error('Error deleting destination:', error);
//     }
//   };

//   return (
//     <div className="manage-destination">
//       <h2>{editingId ? 'Edit Destination' : 'Add Destination'}</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="name">Destination Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter destination name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="state">State</label>
//           <input
//             type="text"
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             placeholder="Enter state"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="type">Type</label>
//           <select
//             id="type"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             multiple
//             required
//           >
//             <option value="Mountain">Mountain</option>
//             <option value="Beach">Beach</option>
//             <option value="Religious">Religious</option>
//             <option value="Heritage">Heritage</option>
//             <option value="Offbeat">Offbeat</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="rating">Rating (0–5)</label>
//           <input
//             type="number"
//             id="rating"
//             name="rating"
//             value={formData.rating}
//             onChange={handleChange}
//             min="0"
//             max="5"
//             step="0.1"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="description">Description (HTML allowed)</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="You can use HTML like <p>, <h1> etc."
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="image">Destination Image</label>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             onChange={handleImageChange}
//             accept="image/*"
//           />
//           {previewImage && (
//             <div className="image-preview">
//               <img src={previewImage} alt="Preview" />
//             </div>
//           )}
//         </div>

//         <button type="submit">{editingId ? 'Update' : 'Add'} Destination</button>
//       </form>

//       <h2>Existing Destinations</h2>
//       <table className="destination-table">
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Name</th>
//             <th>State</th>
//             <th>Type</th>
//             <th>Rating</th>
//             <th>Description</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {destinations.map(dest => (
//             <tr key={dest.id}>
//               <td>
//                 <img
//                   src={`https://desire4travels-1.onrender.com/uploads/${dest.image}`}
//                   alt={dest.name}
//                   height="50"
//                 />
//               </td>
//               <td>{dest.name}</td>
//               <td>{dest.state}</td>
//               <td>{Array.isArray(dest.type) ? dest.type.join(', ') : dest.type}</td>
//               <td>{dest.rating}</td>
//               <td
//                 style={{
//                   maxHeight: '150px',
//                   overflowY: 'auto',
//                   display: 'block',
//                   textAlign: 'left',
//                   padding: '0.5rem'
//                 }}
//                 dangerouslySetInnerHTML={{ __html: dest.description }}
//               ></td>
//               <td>
//                 <button onClick={() => handleEdit(dest)}>Edit</button>
//                 <button onClick={() => handleDelete(dest.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageDestination;



import { useState, useEffect } from 'react';
import './ManageDestination.css';

const ManageDestination = () => {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    type: [],
    rating: '',
    image: null,
    description: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch('https://desire4travels-1.onrender.com/api/admin/destinations');
      const data = await res.json();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;
    if (name === 'type' && multiple) {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, type: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    const ratingValue = parseFloat(formData.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      alert('Rating must be between 0 and 5');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'type') {
        formData[key].forEach(type => data.append('type', type));
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    for (let [key, value] of data.entries()) {
      console.log(`FormData entry: ${key} =`, value);
    }

    const endpoint = editingId
      ? `https://desire4travels-1.onrender.com/api/admin/destinations/${editingId}`
      : 'https://desire4travels-1.onrender.com/api/admin/destinations';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        body: data,
      });

      console.log('Server response status:', res.status);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      alert(editingId ? 'Destination updated!' : 'Destination added!');
      setFormData({
        name: '',
        state: '',
        type: [],
        rating: '',
        image: null,
        description: '',
      });
      setPreviewImage(null);
      setEditingId(null);
      fetchDestinations();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit destination');
    }
  };

  const handleEdit = (dest) => {
    setFormData({
      name: dest.name,
      state: dest.state,
      type: dest.type || [],
      rating: dest.rating,
      image: null,
      description: dest.description || '',
    });
    setPreviewImage(`https://desire4travels-1.onrender.com/uploads/${dest.image}`);
    setEditingId(dest.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      const res = await fetch(`https://desire4travels-1.onrender.com/api/admin/destinations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      alert('Destination deleted');
      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  return (
    <div className="manage-destination">
      <div className="manage-destination-1">
        <h2>{editingId ? 'Edit Destination' : 'Add Destination'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Destination Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter destination name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              multiple
              required
            >
              <option value="Mountain">Mountain</option>
              <option value="Beach">Beach</option>
              <option value="Religious">Religious</option>
              <option value="Treks">Treks</option>
              <option value="Offbeat">Offbeat</option>
              <option value="Desert">Desert</option>
              <option value="Cityscape">Cityscape</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (0–5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (HTML allowed)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="You can use HTML like <p>, <h1> etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Destination Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit">{editingId ? 'Update' : 'Add'} Destination</button>
        </form>
      </div>
      <h2>Existing Destinations</h2>
      <table className="destination-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>State</th>
            <th>Type</th>
            <th>Rating</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map(dest => (
            <tr key={dest.id}>
              <td>
                <img
                  // src={`https://desire4travels-1.onrender.com/uploads/${dest.image}`}
                  src={dest.image}
                  alt={dest.name}
                  height="50"
                />
              </td>
              <td>{dest.name}</td>
              <td>{dest.state}</td>
              <td>{Array.isArray(dest.type) ? dest.type.join(', ') : dest.type}</td>
              <td>{dest.rating}</td>
              <td
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  display: 'block',
                  textAlign: 'left',
                  padding: '0.5rem'
                }}
                dangerouslySetInnerHTML={{ __html: dest.description }}
              ></td>
              <td>
                <button onClick={() => handleEdit(dest)}>Edit</button>
                <button onClick={() => handleDelete(dest.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDestination;
