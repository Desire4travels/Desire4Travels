"use client";
import { useEffect, useState } from "react";
import styles from "./TripRequests.module.css";
import axios from "axios";

const API = "https://desire4travels-1.onrender.com";

const getDestinationsArray = (dest) => {
  if (Array.isArray(dest)) {
    return dest.filter(Boolean);
  }
  if (typeof dest === "string") {
    const regex = /"(\w+)"/g;
    const matches = dest.match(regex);
    if (matches) {
      return matches.map((match) => match.replace(/"/g, ""));
    }
    return dest
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

export default function TripRequestsList() {
  /* ------------ state ------------ */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* modal state */
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editData, setEditData] = useState({});

  /* ------------ fetch ------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/trip-requests`);
        const data = await res.json();
        setItems(data.reverse()); // newest on top
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load trip requests.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------ helpers ------------ */
  function openEdit(item) {
    console.log("Editing item:", item);
    setEditItem(item);
    setEditData(item);
  }

  async function saveEdit() {
    try {
      await fetch(`${API}/trip-requests/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setItems((p) =>
        p.map((x) => (x.id === editItem.id ? { ...editData, id: x.id } : x))
      );
      setEditItem(null);
    } catch (err) {
      alert("Update failed. Please check the console for details.");
    }
  }

  async function confirmDelete() {
    try {
      await fetch(`${API}/trip-requests/${deleteItem.id}`, {
        method: "DELETE",
      });
      setItems((p) => p.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    } catch (err) {
      alert("Delete failed. Please check the console for details.");
    }
  }

  const formatValue = (key, value) => {
    if (key === "createdAt") {
      const date = new Date(value._seconds * 1000);
      return date.toLocaleString();
    }
    if (
      key === "destination" &&
      (Array.isArray(value) || typeof value === "string")
    ) {
      return getDestinationsArray(value).join(", ");
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  /* ------------ UI ------------ */
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Trip Requests</h1>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && items.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Destination</th>
              <th>People</th>
              <th>Trip Date</th>
              <th>Contact Number</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label="Destination">
                  {getDestinationsArray(item.destination).join(", ") || "N/A"}
                </td>
                <td data-label="People">{item.numPeople || "N/A"}</td>
                <td data-label="Trip Date">{item.tripDate || "N/A"}</td>
                <td data-label="Contact Number">
                  {item.contactNumber || "N/A"}
                </td>
                <td data-label="Created At">
                  {item.createdAt?._seconds
                    ? new Date(item.createdAt._seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button onClick={() => openEdit(item)} className={styles.editBtn}>
  Edit
</button>


                  <button onClick={() => setDeleteItem(item)} className={styles.deleteBtn}>
  Delete
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className={styles.noResult}>No trip requests found.</p>
      )}

      {/* -------- EDIT MODAL -------- */}
      {editItem && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2>Edit Trip Request</h2>
      <div className={styles.editForm}>
        <label>
          Destination
          <input
            value={editData.destination || ""}
            onChange={(e) =>
              setEditData((d) => ({ ...d, destination: e.target.value }))
            }
          />
        </label>

        <label>
          People
          <input
            type="number"
            value={editData.numPeople || ""}
            onChange={(e) =>
              setEditData((d) => ({ ...d, numPeople: e.target.value }))
            }
          />
        </label>

        <label>
          Trip Date
          <input
            type="date"
            value={editData.tripDate || ""}
            onChange={(e) =>
              setEditData((d) => ({ ...d, tripDate: e.target.value }))
            }
          />
        </label>

        <label>
          Contact Number
          <input
            value={editData.contactNumber || ""}
            onChange={(e) =>
              setEditData((d) => ({ ...d, contactNumber: e.target.value }))
            }
          />
        </label>
      </div>

      <div className={styles.modalActions}>
        <button onClick={saveEdit} className={styles.saveBtn}>
          Save
        </button>
        <button
          onClick={() => setEditItem(null)}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* -------- DELETE CONFIRM -------- */}
      {deleteItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete the trip request for{" "}
              <strong>{deleteItem.destination}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.deleteBtn}>
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteItem(null)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
