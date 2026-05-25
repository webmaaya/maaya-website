// ============================================================
//  Contact.jsx — MAAYA Enterprises Contact Page (/contact)
//  Sections: Hero → Info Cards → Contact Form → Map
// ============================================================

import { useState } from "react";
import { CONTACT_INFO, COURSES } from "../../constants/data";
import "./Contact.css";

// ── EmailJS Setup ────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_k35ifgl";
const EMAILJS_TEMPLATE_ID = "template_ujykcg8";
const EMAILJS_PUBLIC_KEY  = "kDsxO0icILJAiKwDx";

// ── Office Hours ─────────────────────────────────────────────
// TODO: Update with real timings
const HOURS = [
  { day: "Monday – Saturday", time: "8:30 AM – 6:00 PM" },
  { day: "Sunday",          time: "Closed" },
];

// ── Get all course titles from COURSES data ──────────────────
const COURSE_OPTIONS = COURSES.map(course => course.title);

export default function Contact() {
  // ── Form state ────────────────────────────────────────────
  const [form, setForm] = useState({
    name:    "",
    phone:   "",
    email:   "",
    course:  "",
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
          course:    form.course || "General Enquiry",
          message:   form.message || "User sent an enquiry from Contact page",
          std:       "N/A",
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", course: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send message. Please try again or contact us directly.");
    }

    setLoading(false);
  };

  return (
    <main>

      {/* ── Hero Banner ── */}
      <section className="contact-hero">
        <div className="contact-hero__badge">📞 Contact Us</div>
        <h1 className="contact-hero__title">
          Get In Touch With<br /><span>MAAYA Enterprises</span>
        </h1>
        <p className="contact-hero__sub">
          Have questions about a course? Want to enroll? We're here to help —
          reach out to us anytime!
        </p>
      </section>

      {/* ── Main Content: Info + Form ── */}
      <section className="contact-main">
        <div className="contact-main__inner">

          {/* ── LEFT: Contact Info Cards ── */}
          <div className="contact-info">

            {/* Address */}
            <div className="contact-info-card">
              <div className="contact-info-card__icon">📍</div>
              <div>
                <p className="contact-info-card__label">Address</p>
                {/* TODO: Fill address in constants/data.js → CONTACT_INFO.address */}
                <p className="contact-info-card__value">{CONTACT_INFO.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="contact-info-card">
              <div className="contact-info-card__icon">📞</div>
              <div>
                <p className="contact-info-card__label">Phone</p>
                <p className="contact-info-card__value">
                  {/* TODO: Fill phone in constants/data.js */}
                  <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="contact-info-card">
              <div className="contact-info-card__icon">💬</div>
              <div>
                <p className="contact-info-card__label">WhatsApp</p>
                <p className="contact-info-card__value">
                  {/* TODO: Fill whatsapp in constants/data.js */}
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="contact-info-card">
              <div className="contact-info-card__icon">✉️</div>
              <div>
                <p className="contact-info-card__label">Email</p>
                <p className="contact-info-card__value">
                  {/* TODO: Fill email in constants/data.js */}
                  <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="contact-hours">
              <h4 className="contact-hours__title">🕐 Office Hours</h4>
              {HOURS.map((h) => (
                <div key={h.day} className="contact-hours__row">
                  <span>{h.day}</span>
                  <strong>{h.time}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="contact-form-card">
            {submitted ? (
              /* ── Success Message ── */
              <div className="form-success">
                <span className="form-success__icon">✅</span>
                <h3 className="form-success__title">Message Sent!</h3>
                <p className="form-success__text">
                  Thank you for reaching out. Our team will contact you within 24 hours.
                </p>
                <button 
                  className="btn-submit"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: "1rem" }}
                >
                  Send Another Message →
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <h2 className="contact-form-card__title">Send Us a Message</h2>
                <p className="contact-form-card__sub">
                  Fill the form below — we'll get back to you within 24 hours
                </p>

                <form onSubmit={handleSubmit}>

                  {/* Name + Phone row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        placeholder="+91 XXXXXXXXXX"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Course Enquiry */}
                  <div className="form-group">
                    <label className="form-label">Course Enquiry</label>
                    <select
                      name="course"
                      className="form-select"
                      value={form.course}
                      onChange={handleChange}
                    >
                      <option value="">-- Select a Course --</option>
                      {COURSE_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      className="form-textarea"
                      placeholder="Tell us about your query, preferred batch timing, etc."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit */}
                  {error && (
                    <div className="form-error" style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>
                      ⚠️ {error}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Google Map Section ── */}
      <section className="contact-map">
        <div className="contact-map__inner">
          <h2 className="contact-map__title">📍 Find Us on the Map</h2>
          <div className="contact-map__frame">
            {/* TODO: Replace src with your actual Google Maps embed link
                Go to Google Maps → Search your institute → Share → Embed a map → Copy iframe src */}
            {CONTACT_INFO.mapLink && CONTACT_INFO.mapLink.startsWith("http") ? (
              <iframe
                src={CONTACT_INFO.mapLink}
                style={{ border: 0}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MAAYA Enterprises Location"
              />
            ) : (
              <p>📍 Google Map will appear here — add mapLink in constants/data.js</p>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
