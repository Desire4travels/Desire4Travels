import React, { useEffect, useState } from "react";
import styles from "./TripRequests.module.css";

const API = "https://desire4travels-1.onrender.com";

const getDestinationsArray = (dest) => {
  if (Array.isArray(dest)) {
    return dest.filter(Boolean);
  }
  if (typeof dest === 'string') {
    // This regex looks for any word characters inside quotes
    const regex = /"(\w+)"/g; 
    const matches = dest.match(regex);
    if (matches) {
      return matches.map(match => match.replace(/"/g, ''));
    }
    // Fallback for a standard comma-separated string
    return dest.split(',').map(s => s.trim()).filter(Boolean);
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
        setItems(data.reverse()); // Newest on top
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
    // Updated to use the getDestinationsArray helper
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

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.listGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3 className={styles.cardTitle}>
              {getDestinationsArray(item.destination).join(", ") ||
                "Destination not specified"}
            </h3>
            <ul className={styles.cardList}>
              {/* This is the section you need to change. */}
              {item.numPeople && (
                <li>
                  <strong>How many people are going for the trip?:</strong>{" "}
                  {item.numPeople}
                </li>
              )}
              {item.tripDate && (
                <li>
                  <strong>When are you planning for the trip?:</strong>{" "}
                  {item.tripDate}
                </li>
              )}
              {item.startLocation && (
                <li>
                  <strong>
                    From which location are you starting your trip?:
                  </strong>{" "}
                  {item.startLocation}
                </li>
              )}
              {/* Note: `item.destination` is used in the h3 title, so this might be redundant */}
              {getDestinationsArray(item.destination).length > 0 && (
                <li>
                  <strong>Where do you want to go ?:</strong>{" "}
                  {getDestinationsArray(item.destination).join(", ")}
                </li>
              )}
              {item.additionalLocations && (
                <li>
                  <strong>
                    Add all the locations that you are planning to visit:
                  </strong>{" "}
                  {formatValue("additionalLocations", item.additionalLocations)}
                </li>
              )}
            </ul>
            <div className={styles.btnRow}>
              <button onClick={() => openEdit(item)} className={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => setDeleteItem(item)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className={styles.noResult}>No trip requests found.</p>
        )}
      </div>

      {/* -------- EDIT MODAL -------- */}
      {editItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Trip Request</h2>
            <div className={styles.editForm}>
              {Object.entries(editItem).map(([k, v]) => {
                if (k === "id" || k === "createdAt") return null;
                return (
                  <label key={k} className={styles.editLabel}>
                    {k}
                    <input
                      name={k}
                      value={
                        (editData[k] &&
                          (typeof editData[k] === "object"
                            ? JSON.stringify(editData[k])
                            : editData[k])) ||
                        ""
                      }
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, [k]: e.target.value }))
                      }
                    />
                  </label>
                );
              })}
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
