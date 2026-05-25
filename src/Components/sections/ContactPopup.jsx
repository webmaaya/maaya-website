// ============================================================
//  ContactPopup.jsx — Contact Form Modal Popup
//  Shows on home page landing with close button
//  Responsive for mobile and desktop
// ============================================================

import { useState } from "react";
import "./ContactPopup.css";

// ── EmailJS Setup ────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_k35ifgl";
const EMAILJS_TEMPLATE_ID = "template_ujykcg8";
const EMAILJS_PUBLIC_KEY  = "kDsxO0icILJAiKwDx";

export default function ContactPopup({ onClose }) {
  const [form, setForm] = useState({
    name:    "",
    phone:   "",
    email:   "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!form.name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      // Dynamic import EmailJS
      const emailjs = await import("@emailjs/browser");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          phone:     form.phone,
          email:     form.email || "Not provided",
          course:    "General Enquiry - Popup",
          message:   form.message || "User sent an enquiry from home page popup",
          std:       "N/A",
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", message: "" });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send message. Please try again or contact us directly.");
    }

    setLoading(false);
  };

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="contact-popup-overlay" onClick={handleOverlayClick}>
      <div className="contact-popup-modal">
        {/* Close Button */}
        <button className="contact-popup-close" onClick={onClose}>
          ✕
        </button>

        {submitted ? (
          /* ── Success State ── */
          <div className="contact-popup-success">
            <span className="contact-popup-success-icon">✅</span>
            <h3 className="contact-popup-success-title">Message Sent!</h3>
            <p className="contact-popup-success-text">
              Thank you for reaching out.<br />
              Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <div>
            <h2 className="contact-popup-title">Send Us a Message</h2>
            <p className="contact-popup-sub">
              Fill the form below — we'll get back to you within 24 hours
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name + Phone row */}
              <div className="contact-popup-row">
                <div className="contact-popup-group">
                  <label className="contact-popup-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="contact-popup-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-popup-group">
                  <label className="contact-popup-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="contact-popup-input"
                    placeholder="+91 XXXXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="contact-popup-group">
                <label className="contact-popup-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="contact-popup-input"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {/* Message */}
              <div className="contact-popup-group">
                <label className="contact-popup-label">Message</label>
                <textarea
                  name="message"
                  className="contact-popup-textarea"
                  placeholder="Tell us about your query..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="contact-popup-error">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="contact-popup-submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
