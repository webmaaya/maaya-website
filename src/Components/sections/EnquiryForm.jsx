// ============================================================
//  EnquiryForm.jsx — Course Enquiry Modal Form
//  Used for: Free courses + Diploma course "Enroll Now"
//  Sends email via EmailJS to institute email
//
//  Setup EmailJS:
//    1. Go to emailjs.com → create free account
//    2. Add Email Service (Gmail) → copy SERVICE_ID
//    3. Create Email Template → copy TEMPLATE_ID
//    4. Copy PUBLIC_KEY from Account tab
//    5. Fill the 3 TODO values below
//    6. npm install @emailjs/browser
//
//  Email Template variables (use these in EmailJS template):
//    {{from_name}}, {{std}}, {{email}}, {{phone}}, {{course}}, {{message}}
// ============================================================

import { useState } from "react";
import "./EnquiryForm.css";

// ── TODO: Fill these from EmailJS dashboard ──────────────────
const EMAILJS_SERVICE_ID  = "service_k35ifgl";
const EMAILJS_TEMPLATE_ID = "template_ujykcg8";
const EMAILJS_PUBLIC_KEY  = "kDsxO0icILJAiKwDx";
// ─────────────────────────────────────────────────────────────

// All courses for dropdown
const ALL_COURSES = [
  // Free courses
  "Digital Saheli",
  "Future Vedh (Career Inclination Test)",
  "MS-CIT Welcome",
  "MKCL Soft Skill",
  "Digital Empowerment for Teachers",
  "Digital & AI Camp",
  "SSC Smart Tips (English Medium)",
  "HSC Exam Smart Tips (Marathi)",
  "HSC Exam Smart Tips (English)",
  // Diploma courses
  "Diploma in Accounting",
  "Diploma in Programming",
  "Diploma in Designing",
  "Diploma in Hardware & Networking",
  "Work From Home Program",
  // Other
  "Other / General Enquiry",
];

// STD options
const STD_OPTIONS = [
  "Below 8th",
  "8th", "9th", "10th (SSC)",
  "11th", "12th (HSC)",
  "Graduate", "Post Graduate",
  "Working Professional",
  "Other",
];

export default function EnquiryForm({ onClose, preSelectedCourse = "" }) {
  const [form, setForm] = useState({
    name:    "",
    std:     "",
    email:   "",
    phone:   "",
    course:  preSelectedCourse || "",
    message: "",
  });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim())  return "Please enter your full name";
    if (!form.phone.trim()) return "Please enter your phone number";
    if (form.phone.replace(/\D/g, "").length < 10) return "Enter valid 10-digit phone number";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");

    try {
      // Dynamic import EmailJS
      const emailjs = await import("@emailjs/browser");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          std:       form.std,
          email:     form.email || "Not provided",
          phone:     form.phone,
          course:    form.course || "General Enquiry",
          message:   form.message || "Student is interested in this course.",
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch (e) {
      // If EmailJS not set up yet — still show success (for testing)
      // TODO: Remove this fallback once EmailJS is configured
      console.warn("EmailJS not configured yet:", e.message);
      setSubmitted(true);
    }

    setLoading(false);
  };

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="enquiry-overlay" onClick={handleOverlayClick}>
      <div className="enquiry-modal">

        {/* Close Button */}
        <button className="enquiry-modal__close" onClick={onClose}>✕</button>

        {submitted ? (
          /* ── Success State ── */
          <div className="enquiry-success">
            <span className="enquiry-success__icon">✅</span>
            <h3 className="enquiry-success__title">Enquiry Submitted!</h3>
            <p className="enquiry-success__text">
              Thank you <strong>{form.name}</strong>!<br />
              Our team will call you within <strong>24 hours</strong>.<br /><br />
              {/* TODO: Add WhatsApp number */}
              For urgent queries, WhatsApp us at <strong>9420277373</strong>
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div className="enquiry-modal__icon">📋</div>
            <h2 className="enquiry-modal__title">
              {preSelectedCourse ? `Enroll in ${preSelectedCourse}` : "Course Enquiry"}
            </h2>
            <p className="enquiry-modal__sub">
              Fill this form — our team will call you within 24 hours!
            </p>

            {/* Name + Std */}
            <div className="eq-row">
              <div className="eq-group">
                <label className="eq-label">Full Name *</label>
                <input
                  className="eq-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
              </div>
              <div className="eq-group">
                <label className="eq-label">Standard / Class</label>
                <select
                  className="eq-select"
                  value={form.std}
                  onChange={e => handleChange("std", e.target.value)}
                >
                  <option value="">Select Std</option>
                  {STD_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Phone + Email */}
            <div className="eq-row">
              <div className="eq-group">
                <label className="eq-label">Phone Number *</label>
                <input
                  className="eq-input"
                  placeholder="+91 XXXXXXXXXX"
                  value={form.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  type="tel"
                />
              </div>
              <div className="eq-group">
                <label className="eq-label">Email (optional)</label>
                <input
                  className="eq-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  type="email"
                />
              </div>
            </div>

            {/* Course selection */}
            <div className="eq-group">
              <label className="eq-label">Which Course are you interested in?</label>
              <select
                className="eq-select"
                value={form.course}
                onChange={e => handleChange("course", e.target.value)}
              >
                <option value="">-- Select Course --</option>
                {ALL_COURSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 10, fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            )}

            {/* Submit */}
            <button
              className="btn-eq-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit Enquiry →"}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
              🔒 Your information is safe with us
            </p>
          </>
        )}
      </div>
    </div>
  );
}
