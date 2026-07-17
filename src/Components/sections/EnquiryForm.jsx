
import { COURSES } from "../../constants/data";
import { useState } from "react";
import "./EnquiryForm.css";

const EMAILJS_SERVICE_ID  = "service_k35ifgl";
const EMAILJS_TEMPLATE_ID = "template_ujykcg8";
const EMAILJS_PUBLIC_KEY  = "kDsxO0icILJAiKwDx";

// ── Security Utils ────────────────────────────────────────
// Sanitize input — remove HTML tags & dangerous characters
const sanitize = (str) =>
  String(str || "")
    .replace(/<[^>]*>/g, "")           // remove HTML tags
    .replace(/[<>"'`]/g, "")           // remove dangerous chars
    .replace(/javascript:/gi, "")      // remove js injection
    .trim()
    .slice(0, 500);                    // max 500 chars

// Rate limit — max 3 submissions per 10 minutes
const checkRateLimit = () => {
  const key       = "eq_submissions";
  const now       = Date.now();
  const window_ms = 10 * 60 * 1000;   // 10 minutes
  const max_tries = 3;

  const stored = JSON.parse(localStorage.getItem(key) || "[]");
  // Remove old timestamps outside window
  const recent = stored.filter(t => now - t < window_ms);

  if (recent.length >= max_tries) {
    const waitMin = Math.ceil((window_ms - (now - recent[0])) / 60000);
    return { allowed: false, waitMin };
  }

  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  return { allowed: true };
};



const STD_OPTIONS = [
  "Below 8th", "8th", "9th", "10th (SSC)",
  "11th", "12th (HSC)",
  "Graduate", "Post Graduate",
  "Working Professional", "Other",
];

export default function EnquiryForm({ onClose, preSelectedCourse = "", inline = false }) {
  const [form, setForm] = useState({
    name: "", std: "", email: "",
    phone: "", course: preSelectedCourse || "", message: "",
  });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

 const validate = () => {
    const cleanPhone = form.phone.replace(/\D/g, ""); 
    
    if (!form.name.trim()) return "Please enter your full name";
    if (form.name.trim().length < 2) return "Name must be at least 2 characters";
    if (!form.phone.trim()) return "Please enter your phone number";
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Enter valid 10-digit Indian mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter valid email address";
    if (form.message && form.message.length > 1000) return "Message too long (max 1000 characters)";
    
    return null;
  };

const handleSubmit = async () => {
  // Rate limit check
  const { allowed, waitMin } = checkRateLimit();
  if (!allowed) {
    setError(`Too many submissions. Please wait ${waitMin} minute(s) and try again.`);
    return;
  }

  const err = validate();
  if (err) { setError(err); return; 
  }

  setLoading(true);
  setError("");
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        {
          from_name: sanitize(form.name),
          std:      sanitize(form.std),
          email:     sanitize(form.email) || "Not provided",
          phone:     sanitize(form.phone),
          course:    sanitize(form.course) || "General Enquiry",
          message:   sanitize(form.message) || "Student is interested in this course.",
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (e) {
      console.warn("EmailJS error:", e.message);
      setSubmitted(true);
    }
    setLoading(false);
  };

  // ── Form Content (shared between inline & popup) ───────────
  const formContent = (
    <>
      {submitted ? (
        <div className={`enquiry-success ${inline ? "enquiry-success--inline" : ""}`}>
          <span className="enquiry-success__icon">✅</span>
          <h3 className="enquiry-success__title">Enquiry Submitted!</h3>
          <p className="enquiry-success__text">
            Thank you <strong>{form.name}</strong>!<br />
            Our team will call you within <strong>24 hours</strong>.<br /><br />
            WhatsApp: <strong>9420277373</strong>
          </p>
        </div>
      ) : (
        <>
          {/* Header — only shown in popup */}
          {!inline && (
            <>
              <div className="enquiry-modal__icon">📋</div>
              <h2 className="enquiry-modal__title">
                {preSelectedCourse ? `Enroll in ${preSelectedCourse}` : "Course Enquiry"}
              </h2>
              <p className="enquiry-modal__sub">
                Fill this form — our team will call you within 24 hours!
              </p>
            </>
          )}

          {/* Inline header */}
          {inline && (
            <div className="eq-inline-header">
              <span className="eq-inline-header__icon">📋</span>
              <div>
                <div className="eq-inline-header__title">Free Enquiry</div>
                <div className="eq-inline-header__sub">Our team calls you within 24 hrs</div>
              </div>
            </div>
          )}

          {/* Name + Std */}
          <div className="eq-row">
            <div className="eq-group">
              <label className="eq-label">Full Name *</label>
              <input className="eq-input" placeholder="Your full name"
                value={form.name} onChange={e => handleChange("name", e.target.value)} />
            </div>
            <div className="eq-group">
              <label className="eq-label">Standard / Class</label>
              <select className="eq-select" value={form.std}
                onChange={e => handleChange("std", e.target.value)}>
                <option value="">Select Std</option>
                {STD_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Phone + Email */}
          <div className="eq-row">
            <div className="eq-group">
              <label className="eq-label">Phone Number *</label>
              <input className="eq-input" placeholder="+91 XXXXXXXXXX"
                value={form.phone} type="tel"
                onChange={e => handleChange("phone", e.target.value)} />
            </div>
            <div className="eq-group">
              <label className="eq-label">Email (optional)</label>
              <input className="eq-input" placeholder="your@email.com"
                value={form.email} type="email"
                onChange={e => handleChange("email", e.target.value)} />
            </div>
          </div>

          {/* Course */}
          <div className="eq-group">
            <label className="eq-label">Course Interested In</label>
            <select className="eq-select" value={form.course}
              onChange={e => handleChange("course", e.target.value)}>
              <option value="">-- Select Course --</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <p style={{ color:"var(--danger)", fontSize:13, marginBottom:10, fontWeight:600 }}>
              ⚠️ {error}
            </p>
          )}

          <button className="btn-eq-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Submit Enquiry →"}
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:"var(--text-muted)", marginTop:10 }}>
            🔒 Your information is safe with us
          </p>
        </>
      )}
    </>
  );

  // ── INLINE MODE — no overlay, no modal box ─────────────────
  if (inline) {
    return (
      <div className="eq-inline">
        {formContent}
      </div>
    );
  }

  // ── POPUP MODE — with overlay (free courses) ───────────────
  return (
    <div className="enquiry-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="enquiry-modal">
        <button className="enquiry-modal__close" onClick={onClose}>✕</button>
        {formContent}
      </div>
    </div>
  );
}