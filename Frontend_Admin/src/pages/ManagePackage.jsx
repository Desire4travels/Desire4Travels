import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
import ProtectedCard from '../Components/ProtectedCard.jsx'; // <-- Add this import
import './ManagePackage.css';

const AUTO_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

const ManagePackage = () => {

   const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Add this line
  const navigate = useNavigate(); // <-- Add this line
const timerRef = useRef();


  useEffect(() => {
    const localAuth = localStorage.getItem('auth-packages');
    setIsAuthenticated(localAuth === 'true');
  }, []);


   // Auto logout effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, AUTO_LOGOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  

  const handleLogout = () => {
    localStorage.removeItem('auth-enquiries');
    localStorage.removeItem('auth-destinations');
    localStorage.removeItem('auth-packages');
    localStorage.removeItem('auth-blogs');
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page
  };



  const [formData, setFormData] = useState({
    packageName: '',
    duration: '',
    price: '',
    description: '',
    inclusions: '',
    itinerary: '',
    photo: null,
    destinations: [],
  });

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);
  
  const fetchPackages = async () => {
    try {
      const res = await fetch('https://desire4travels-1.onrender.com/api/admin/packages');
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch('https://desire4travels-1.onrender.com/api/destinations');
      const data = await res.json();
      setDestinations(Array.isArray(data.destinations) ? data.destinations : []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'destinations') {
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedValues = selectedOptions.map(opt => opt.value);
      setFormData(prev => ({ ...prev, destinations: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));

      if (files && files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === 'destinations') {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    const url = editingId
      ? `https://desire4travels-1.onrender.com/api/admin/packages/${editingId}`
      : 'https://desire4travels-1.onrender.com/api/admin/packages';

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to submit package');

      alert(editingId ? 'Package updated!' : 'Package created!');
      setFormData({
        packageName: '',
        duration: '',
        price: '',
        description: '',
        inclusions: '',
        itinerary: '',
        photo: null,
        destinations: [],
      });
      setPreviewImage(null);
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      console.error(err);
      alert('Error submitting package');
    }
  };

const handleEdit = (pkg) => {
  console.log('Editing package:', pkg);

  setFormData({
    packageName: pkg.packageName,
    duration: pkg.duration,
    price: pkg.price,
    description: pkg.description,
    inclusions: pkg.inclusions,
    itinerary: pkg.itinerary,
    photo: null,
    destinations: Array.isArray(pkg.destinations) && pkg.destinations.length > 0
      ? pkg.destinations
      : [],
  });

  setPreviewImage(pkg.photo || null);
  setEditingId(pkg._id || pkg.id);
};


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const res = await fetch(`https://desire4travels-1.onrender.com/api/admin/packages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      alert('Package deleted');
      fetchPackages();
    } catch (err) {
      console.error(err);
      alert('Error deleting package');
    }
  };

    if (!isAuthenticated) {
    return (
      <ProtectedCard cardKey="packages">
        <div className="manage-package-card">
          <h1>Manage Packages</h1>
        </div>
      </ProtectedCard>
    );
  }


  return (
    <div className="manage-package">


      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 20,
          right: 30,
          padding: '6px 16px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        Logout
      </button>


      
      <div className="form-section">
        <h2>{editingId ? 'Edit Package' : 'Add Package'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="packageName"
            placeholder="Package Name"
            value={formData.packageName}
            onChange={handleChange}
            required
          />

          <label>Select Multiple Destinations (Ctrl/Cmd + Click to select multiple)</label>
          <select
            multiple
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            size={5}
          >
            {destinations.map(dest => (
              <option key={dest._id || dest.id} value={dest._id || dest.id}>
                {dest.name} - {dest.state}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <textarea
            name="inclusions"
            placeholder="Inclusions"
            value={formData.inclusions}
            onChange={handleChange}
            required
          />
          <textarea
            name="itinerary"
            placeholder="Itinerary"
            value={formData.itinerary}
            onChange={handleChange}
            required
          />
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          {previewImage && (
            <img src={previewImage} alt="Preview" style={{ maxHeight: 100, marginTop: 10 }} />
          )}
          <button type="submit">{editingId ? 'Update' : 'Add'} Package</button>
        </form>
      </div>

      <div className="table-section">
        <h3>Existing Packages</h3>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Package Name</th>
              <th>Destinations</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Description</th>
              <th>Inclusions</th>
              <th>Itinerary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => {
                const selectedDests = Array.isArray(pkg.destinations)
                  ? pkg.destinations
                      .map(destId => {
                        const dest = destinations.find(d => d._id === destId || d.id === destId);
                        return dest ? `${dest.name} (${dest.state})` : destId;
                      })
                      .join(', ')
                  : 'No destinations';


              return (
                <tr key={pkg._id || pkg.id}>
                  <td>
                    {pkg.photo ? (
                      <img
                        src={pkg.photo}
                        alt={pkg.packageName}
                        style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{pkg.packageName}</td>
                  <td>{selectedDests}</td>
                  <td>{pkg.duration}</td>
                  <td>{pkg.price}</td>
                  <td>
                    <div
                      className="table-content-cell"
                      dangerouslySetInnerHTML={{ __html: pkg.description }}
                    />
                  </td>
                  <td>
                    <div className="table-content-cell">{pkg.inclusions}</div>
                  </td>
                  <td>
                    <div className="table-content-cell">{pkg.itinerary}</div>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(pkg)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(pkg._id || pkg.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePackage;
