// pages/AI/ManageAi.jsx
import "./ManageAi.css";
import { Link, useNavigate } from "react-router-dom";
import ProtectedCard from "../../Components/ProtectedCard.jsx";
import { useState, useEffect, useRef } from "react";
// import axios from "axios";   // (keep if you’ll fetch counts)

const AUTO_LOGOUT_MS = 60 * 60 * 1000;     // 1 hour
const AUTH_KEY       = "auth-AI";          // SINGLE source of truth

export default function ManageAi() {
  /* ─── auth state ─── */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate  = useNavigate();
  const timerRef  = useRef();

  /* check localStorage once on mount */
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(AUTH_KEY) === "true");
  }, []);

  /* inactivity auto‑logout (same as other pages) */
  useEffect(() => {
    if (!isAuthenticated) return;

    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleLogout, AUTO_LOGOUT_MS);
    };
    ["mousemove","keydown","click","scroll","touchstart"].forEach(ev =>
      window.addEventListener(ev, reset)
    );
    reset();
    return () => {
      clearTimeout(timerRef.current);
      ["mousemove","keydown","click","scroll","touchstart"].forEach(ev =>
        window.removeEventListener(ev, reset)
      );
    };
  }, [isAuthenticated]);

  function handleLogout() {
   const AUTH_KEYS = ["auth-enquiries", "auth-destinations", "auth-packages", "auth-blogs", "auth-AI"];
AUTH_KEYS.forEach(k => localStorage.removeItem(k));

    navigate("/");
  }

  /* ---- optional counts ---- */
  const [counts, setCounts] = useState({ newServiceManager: 0, newServiceProviders: 0 });
  useEffect(() => {
    if (!isAuthenticated) return;
    /* fetchCounts() … */
  }, [isAuthenticated]);

  /* ---- guarded render ---- */
  if (!isAuthenticated) {
    return (
      <ProtectedCard cardKey="AI">
        <div className="all-enquiries-card">
          <h1><Link to="/manage-ai" className="link">AI Tools Panel</Link></h1>
        </div>
      </ProtectedCard>
    );
  }

  /* ---- main dashboard ---- */
  return (
    <div className="all-enquiries-container">
      <button className="logout-fixed-btn" onClick={handleLogout}>Logout</button>

      {/* SERVICE MANAGER */}
      <div className="manage-package-card card-container">
        {counts.newServiceManager > 0 && <span className="badge">{counts.newServiceManager}</span>}
        <h1><Link to="/servicemanager" className="link">Service Manager</Link></h1>
      </div>

      {/* SERVICE PROVIDERS */}
      <div className="manage-package-card card-container">
        {counts.newServiceProviders > 0 && <span className="badge">{counts.newServiceProviders}</span>}
        <h1><Link to="/serviceprovider" className="link">Service Providers</Link></h1>
      </div>

      <div className="manage-package-card card-container">
        {counts.newTripRequests > 0 && <span className="badge">{counts.newTripRequests}</span>}
        <h1><Link to="/trip-requests" className="link">Trip Requests</Link></h1>
      </div>
    </div>
  );
}
