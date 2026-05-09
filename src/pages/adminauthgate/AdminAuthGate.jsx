// ============================================================
//  AdminAuthGate.jsx — Protects /admin route
//  If not admin → shows login popup
//  If admin → shows AdminPanel directly
// ============================================================

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminPanel from "../../pages/adminpanel/AdminPanel";
import "./AdminAuthGate.css";

const ADMIN_EMAIL = "webmaaya@gmail.com";

export default function AdminAuthGate() {
  const { currentUser, isAdmin } = useAuth();
  const [password, setPassword]  = useState("");
  const [loading,  setLoading]   = useState(false);
  const [error,    setError]     = useState("");
  const [showPwd,  setShowPwd]   = useState(false);

  // If already admin — show panel directly
  if (isAdmin) return <AdminPanel />;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) { setError("Please enter password"); return; }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      // onAuthStateChanged will update currentUser → isAdmin becomes true
    } catch (e) {
      setError("Incorrect password. Access denied.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate__box">
        {/* Lock icon */}
        <div className="admin-gate__icon">🔐</div>
        <h2 className="admin-gate__title">Admin Access</h2>
        <p className="admin-gate__sub">MAAYA Enterprises — Admin Panel</p>

        {error && (
          <div className="admin-gate__error">⚠️ {error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="admin-gate__group">
            <label className="admin-gate__label">Admin Password</label>
            <div className="admin-gate__input-wrap">
              <input
                className="admin-gate__input"
                type={showPwd ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                autoFocus
              />
              <button
                type="button"
                className="admin-gate__eye"
                onClick={() => setShowPwd(p => !p)}
                tabIndex={-1}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="admin-gate__btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Enter Admin Panel →"}
          </button>
        </form>

        <a href="/" className="admin-gate__back">← Back to Website</a>
      </div>
    </div>
  );
}
