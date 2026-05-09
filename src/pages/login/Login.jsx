// ============================================================
//  Login.jsx — MAAYA Enterprises Login Page
//  src/pages/login/Login.jsx
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../assets/logo/MAAYA.png";
import "../register/Register.css"; // reuse same CSS

const ADMIN_EMAIL = "webmaaya@gmail.com";

export default function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      // Admin goes to admin panel, users go to home
      if (form.email.trim() === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (e) {
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-card__logo">
          <img src={logo} alt="MAAYA" />
        </div>

        <h1 className="auth-card__title">Welcome Back!</h1>
        <p className="auth-card__sub">Sign in to your MAAYA account</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="auth-group">
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPwd ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)} tabIndex={-1}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">Register Free</Link>
        </div>

        <Link to="/" className="auth-back">← Back to Website</Link>
      </div>
    </div>
  );
}
