import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminUpcomingTrip.css";

const API_BASE_URL = "https://desire4travels-1.onrender.com/api/upcoming-trips";

const ManageUpcomingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    tripName: "",
    travelDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Logout function (just redirect to home)
  const handleLogout = () => {
    navigate('/');
  };

  // Fetch trips
  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_BASE_URL);
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      await fetchTrips();
    } catch {
      alert("Failed to delete trip.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (trip, idx) => {
    setFormData({
      tripName: trip.tripName,
      travelDate: trip.travelDate ? trip.travelDate.slice(0, 10) : "",
    });
    setEditIndex(idx);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        tripName: formData.tripName,
        travelDate: formData.travelDate,
      };

      if (editIndex !== null) {
        const id = trips[editIndex].id;
        await axios.put(`${API_BASE_URL}/${id}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }

      setFormData({ tripName: "", travelDate: "" });
      setIsModalOpen(false);
      setEditIndex(null);
      await fetchTrips();
    } catch {
      alert("Failed to save trip.");
    } finally {
      setIsLoading(false);
    }
  };

  const tripOptions = [
    "Western Trio Bliss",
    "Hill & Temple Retreat",
    "Alibaug Beach Break",
    "Blessed Weekend in Shirdi",
    "Mahabaleshwar Hill Escape",
    "Lonavala Quick Gateway",
    "Divine Retreat+Kashmir Bliss",
    "Serenity and Snow",
    "Jammu to the Jewels of Kashmir",
    "Soulful Kashmir",
    "Pahalgam Nature Escape",
    "Weekend in Heaven",
    "Complete Kashmir Circuit",
    "Snow Trails of Gulmarg",
    "Valley Explorer",
    "Scenic Kashmir Delight",
    "Complete Himchal Explorer",
    "Chamba-Bharmour-Holi Cultural Tour",
    "Manali Snow and Solang Adventure",
    "Sangla-Chitkul-Kalpa",
    "Dalhousie-Khajjar-Chamba",
    "Himachal Backpacker Trail",
    "Kasol-Jibhi-Tirthan Valley Combo",
    "Shimla- Manali Romantic Escape",
    "Manali-Atal Tunnel-Sissu Adventure",
    "Triund trek & Temple trail",
    "Serene Shimla-Chitkul Circuit",
    "Tosh & Kheerganga Trek Adventure",
    "Nature Escape in Chitkul",
    "Mcleod-Dharamshala Spritual Trip",
    "Colonial & Monastery Trial",
    "Valley of Gods",
    "Offbeat Himachal",
    "Parvati Valley Explorer",
    "Mini Himachal Retreat",
    "Classic Kullu Manali",
    "Pearls of Agra",
    "Manali Chitkul Trip Package",
  ];

  return (
    <div className="manage-upcoming-container" style={{ position: "relative" }}>
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
      <h1 className="page-title">Manage Upcoming Trips</h1>

      <button className="create-btn" onClick={() => setIsModalOpen(true)}>
        + Create New Trip
      </button>

      {isModalOpen && (
        <div className="modal-overlay visible">
          <div className="modal">
            <h2 className="modal-title">
              {editIndex !== null ? "Edit Trip" : "Add Upcoming Trip"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Trip Name*</label>
                <select
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Trip Name --</option>
                  {tripOptions.map((trip) => (
                    <option key={trip} value={trip}>
                      {trip}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Travel Date*</label>
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading
                    ? editIndex !== null
                      ? "Updating..."
                      : "Adding..."
                    : editIndex !== null
                    ? "Update Trip"
                    : "Add Trip"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditIndex(null);
                    setFormData({ tripName: "", travelDate: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading trips...</p>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.length > 0 ? (
            trips.map((trip, idx) => (
              <div className="trip-card" key={idx}>
                <div className="trip-card-header">
                  <h3 className="trip-title">{decodeHtml(trip.tripName)}</h3>
                  <span className="status-badge published">Upcoming</span>
                </div>
                <p className="trip-meta">
                  Date:{" "}
                  {trip.travelDate
                    ? new Date(trip.travelDate).toLocaleDateString("en-GB")
                    : ""}
                </p>
                <div className="trip-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(trip, idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(trip.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming trips available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUpcomingTrips;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ManageBlog.css";

// const API_BASE_URL = "https://desire4travels-1.onrender.com/api/upcoming-trips";

// const ManageUpcomingTrips = () => {
//   const [trips, setTrips] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     packageId: "",
//     travelDate: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch trips from API
//   useEffect(() => {
//     fetchTrips();
//   }, []);

//   const fetchTrips = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(API_BASE_URL);
//       if (Array.isArray(res.data) && res.data.length > 0 && Array.isArray(res.data[0].trips)) {
//         setTrips(res.data[0].trips);
//       } else {
//         setTrips([]);
//       }
//     } catch (err) {
//       console.error("Error fetching trips:", err);
//       setTrips([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       // POST to the same API (your backend should handle adding to the array)
//       await axios.post(API_BASE_URL, formData);
//       setFormData({ packageId: "", travelDate: "" });
//       await fetchTrips();
//     } catch (err) {
//       alert("Failed to add trip.");
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="manage-blog-container">
//       <h1 className="page-title">Manage Upcoming Trips</h1>

//       {/* Add Trip Form */}
//       <form className="add-trip-form" onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
//         <div className="form-group">
//           <label>Package Name*</label>
//           <input
//             type="text"
//             name="packageId"
//             value={formData.packageId}
//             onChange={handleChange}
//             required
//             placeholder="Enter package name"
//           />
//         </div>
//         <div className="form-group">
//           <label>Travel Date*</label>
//           <input
//             type="date"
//             name="travelDate"
//             value={formData.travelDate}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="submit-btn" disabled={submitting}>
//           {submitting ? "Adding..." : "Add Trip"}
//         </button>
//       </form>

//       {isLoading ? (
//         <div className="loading-animation">
//           <div className="spinner"></div>
//           <p>Loading trips...</p>
//         </div>
//       ) : (
//         <div className="blog-list">
//           {trips.length > 0 ? (
//             trips.map((trip, idx) => (
//               <div key={idx} className="blog-card">
//                 <h3 className="blog-title">Package ID: {trip.packageId}</h3>
//                 <p className="blog-meta">Date: {trip.travelDate}</p>
//                 {trip.image && (
//                   <img
//                     src={trip.image}
//                     alt={`Trip to ${trip.packageId}`}
//                     className="trip-image-preview"
//                     onError={e => (e.target.style.display = "none")}
//                   />
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No upcoming trips available.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUpcomingTrips;