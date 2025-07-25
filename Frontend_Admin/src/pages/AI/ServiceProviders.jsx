import React, { useEffect, useState } from "react";
import styles from "./ServiceProviders.module.css";

const API = "https://desire4travels-1.onrender.com";

const providerTypes = {
  all: "All Providers",
  hotel: "Hotel Partner",
  cab: "Cab Service Provider",
  adventure: "Adventure Activity Provider",
  bus: "Intercity Bus Operator",
};

const fieldLabels = {
  hotelName: "Hotel Name",
  city: "City",
  address: "Address",
  contactPerson: "Contact Person",
  contactMobile: "Contact Mobile",
  stayType: "Type of Stay",
  roomsAvailable: "Rooms Available",
  roomCategories: "Room Categories",
  facilities: "Facilities",
  meals: "Meals",
  onlineLink: "Online Link",
  company: "Company",
  baseCity: "Base City",
  baseAddress: "Base Address",
  vehicleTypes: "Vehicle Types",
  intercityLocal: "Intercity / Local",
  intercityCoverage: "Intercity Coverage",
  agencyName: "Agency Name",
  location: "Location",
  activityTypes: "Activities",
  companyName: "Company Name",
  routesCovered: "Routes Covered",
  busType: "Bus Type",
  emergencyContact: "Emergency Contact",
};

export default function ServiceProvidersList() {
  /* ------------ state ------------ */
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("all");
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
        const res = await fetch(`${API}/service-providers`);
        setItems(await res.json());
      } catch {
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------ helpers ------------ */
const filtered =
  selected === "all"
    ? [...items].reverse() // 👈 newest first
    : [...items].filter((p) => p.type === selected).reverse();


  function openEdit(item) {
    setEditItem(item);
    setEditData(item);
  }

  async function saveEdit() {
    try {
      await fetch(`${API}/service-providers/${editItem.type}/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setItems((p) => p.map((x) => (x.id === editItem.id ? editData : x)));
      setEditItem(null);
    } catch {
      alert("Update failed");
    }
  }

  async function confirmDelete() {
    try {
      await fetch(`${API}/service-providers/${deleteItem.type}/${deleteItem.id}`, {
        method: "DELETE",
      });
      setItems((p) => p.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    } catch {
      alert("Delete failed");
    }
  }

  /* ------------ UI ------------ */
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Service Providers List</h1>

      <label className={styles.dropdownLabel}>
        Filter&nbsp;
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={styles.dropdown}
        >
          {Object.entries(providerTypes).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.listGrid}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3 className={styles.cardTitle}>
              <strong>Type:</strong> {providerTypes[item.type]}
            </h3>
            <ul className={styles.cardList}>
              {Object.entries(item).map(([k, v]) => {
                if (["id", "type", "createdAt"].includes(k) || v === "") return null;
                return (
                  <li key={k}>
                    <strong>{fieldLabels[k] || k}:</strong> {String(v)}
                  </li>
                );
              })}
            </ul>
            <div className={styles.btnRow}>
              <button onClick={() => openEdit(item)} className={styles.editBtn}>
                Edit
              </button>
              <button onClick={() => setDeleteItem(item)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className={styles.noResult}>No providers found.</p>
        )}
      </div>

      {/* -------- EDIT MODAL -------- */}
      {editItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit – {providerTypes[editItem.type]}</h2>
            <div className={styles.editForm}>
              {Object.entries(editItem).map(([k, v]) => {
                if (["id", "type", "createdAt"].includes(k)) return null;
                return (
                  <label key={k} className={styles.editLabel}>
                    {fieldLabels[k] || k}
                    <input
                      name={k}
                      value={editData[k] || ""}
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
              <button onClick={() => setEditItem(null)} className={styles.cancelBtn}>
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
              Delete <strong>{providerTypes[deleteItem.type]}</strong> entry
              permanently?
            </p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.deleteBtn}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteItem(null)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
