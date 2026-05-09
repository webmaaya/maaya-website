// ============================================================
//  Register.jsx — MAAYA Enterprises Register Page
//  src/pages/register/Register.jsx
//
//  Features:
//  ✅ Full Name field
//  ✅ Email + Password
//  ✅ Password rules — uppercase, number, special char, 8+ chars
//  ✅ Password strength bar (Weak / Medium / Strong)
//  ✅ Show/hide password toggle
//  ✅ Firebase Auth — createUserWithEmailAndPassword
//  ✅ Saves displayName to Firebase user profile
//  ✅ Permanent session — never logs out
//  ✅ After register → auto logged in → goes to Home
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../assets/logo/MAAYA.png";
import "./Register.css";

// ── Password validation rules ─────────────────────────────────
const RULES = [
  { id: "len",     label: "At least 8 characters",          test: (p) => p.length >= 8 },
  { id: "upper",   label: "At least 1 uppercase letter",    test: (p) => /[A-Z]/.test(p) },
  { id: "number",  label: "At least 1 number",              test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "At least 1 special character",   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

// ── Password strength calc ────────────────────────────────────
const getStrength = (password, passed) => {
  if (!password) return { level: 0, label: "", color: "" };
  if (passed < 2)  return { level: 1, label: "Weak",   color: "weak" };
  if (passed < 4)  return { level: 2, label: "Medium", color: "medium" };
  return            { level: 3, label: "Strong", color: "strong" };
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const passedRules = RULES.filter(r => r.test(form.password));
  const strength    = getStrength(form.password, passedRules.length);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.fullName.trim())        return "Please enter your full name";
    if (form.fullName.trim().length < 3) return "Name must be at least 3 characters";
    if (!form.email.trim())           return "Please enter your email";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email";
    if (passedRules.length < 4)       return "Password does not meet all requirements";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");

    try {
      // Create user with Firebase Auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      // Save full name to Firebase profile
      await updateProfile(user, {
        displayName: form.fullName.trim(),
      });

      // ✅ Registered + logged in → go to Home
      navigate("/");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-card__logo">
          {/* TODO: Replace with real logo */}
          <img src={logo} alt="MAAYA" /> 
          {/* <div className="auth-card__logo-placeholder">
            MAAYA<br />
            <span style={{ fontSize: 10, fontWeight: 500 }}>माया संगणक प्रशिक्षण केंद्र</span>
          </div> */}
        </div>

        <h1 className="auth-card__title">Create Your Account</h1>
        <p className="auth-card__sub">Join MAAYA — start your learning journey today!</p>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              className={`auth-input ${error && !form.fullName ? "error" : ""}`}
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={e => handleChange("fullName", e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="auth-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPwd ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPwd(p => !p)}
                tabIndex={-1}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="auth-strength">
                <div className="auth-strength__bars">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`auth-strength__bar ${i <= strength.level ? strength.color : ""}`}
                    />
                  ))}
                </div>
                <span className="auth-strength__text">
                  Password strength: <strong>{strength.label}</strong>
                </span>
              </div>
            )}

            {/* Rules checklist */}
            <ul className="auth-rules">
              {RULES.map(rule => {
                const ok = rule.test(form.password);
                return (
                  <li key={rule.id} className={ok ? "ok" : ""}>
                    <span className="rule-dot">{ok ? "✓" : ""}</span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-auth"
            disabled={loading || passedRules.length < 4}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-bottom">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </div>

        <Link to="/" className="auth-back">← Back to Website</Link>
      </div>
    </div>
  );
}
