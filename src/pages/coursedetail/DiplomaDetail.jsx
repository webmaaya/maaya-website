// ============================================================
//  DiplomaDetail.jsx — /diploma/:id
//  Shows: Overview, Syllabus (accordion), Who Should Join
//  Enroll Now → opens EnquiryForm modal
// ============================================================

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnquiryForm from "../../Components/sections/EnquiryForm";
import "./DiplomaDetail.css";

const TABS = ["Overview", "Syllabus", "Who Should Join"];

export default function DiplomaDetail() {
  const { id }    = useParams();
  const [diploma,  setDiploma]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("Overview");
  const [openMods, setOpenMods] = useState({ 0: true });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "diplomaCourses", id));
        if (snap.exists()) {
          setDiploma({ id: snap.id, ...snap.data() });
          setOpenMods({ 0: true });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <span style={{ fontSize: 40 }}>⏳</span>
      <p style={{ marginTop: 16, color: "var(--text-muted)" }}>Loading...</p>
    </div>
  );

  if (!diploma) return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <h2>Program Not Found</h2>
      <Link to="/courses" className="btn-back" style={{ marginTop: 20, display: "inline-block" }}>
        ← Back to Courses
      </Link>
    </div>
  );

  const toggleMod = (i) => setOpenMods(p => ({ ...p, [i]: !p[i] }));

  return (
    <main>

      {/* ── Hero ── */}
      <section className={`dip-hero ${diploma.gradient || "grad-blue"}`}>
        <div className="dip-hero__inner">

          {/* Left */}
          <div>
            <div className="dip-hero__rating">
              <span className="dip-hero__stars">★★★★★</span>
              <span className="dip-hero__rating-text">MKCL Certified Program</span>
            </div>
            <h1 className="dip-hero__title">{diploma.title}</h1>
            <p className="dip-hero__sub">{diploma.overview}</p>
            <div className="dip-hero__duration">📅 {diploma.duration}</div>
          </div>

          {/* Right — Enroll Card */}
          <div className="dip-enroll-card">
            <h3 className="dip-enroll-card__title">Interested in this Program?</h3>
            <p className="dip-enroll-card__sub">
              Fill a quick form — our counsellor will call you within 24 hours and guide you through the admission process.
            </p>

            <button
              className="btn-enroll-diploma"
              onClick={() => setShowForm(true)}
            >
              Enroll Now — It's Free to Enquire!
            </button>

            <p className="dip-enroll-card__note">
              📞 Or call us: <strong>9420277373</strong>
            </p>

            {/* Features */}
            <ul className="dip-features-list">
              {(diploma.features || []).map(f => (
                <li key={f}>✅ {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Tabs Bar ── */}
      <div className="dip-tabs-bar">
        <div className="dip-tabs-inner">
          {TABS.map(t => (
            <button
              key={t}
              className={`dip-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="dip-content">

        {/* OVERVIEW */}
        {tab === "Overview" && (
          <div>
            <h2 className="dip-content-title">What's Included</h2>
            <div className="dip-includes-grid">
              {(diploma.includes || []).map(item => (
                <div key={item.name} className="dip-include-card">
                  <span className="dip-include-card__icon">{item.icon}</span>
                  <div className="dip-include-card__name">{item.name}</div>
                  <div className="dip-include-card__duration">📅 {item.duration}</div>
                </div>
              ))}
            </div>

            <h2 className="dip-content-title">What You'll Learn</h2>
            <div className="dip-learn-grid">
              {(diploma.whatYouLearn || []).map(item => (
                <div key={item} className="dip-learn-item">{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* SYLLABUS — Accordion */}
        {tab === "Syllabus" && (
          <div>
            <h2 className="dip-content-title">Course Syllabus</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              {diploma.syllabus?.length} modules · Click to expand chapters
            </p>
            {(diploma.syllabus || []).map((mod, i) => (
              <div key={i} className="accordion-module">
                <button
                  className={`accordion-module__header ${openMods[i] ? "open" : ""}`}
                  onClick={() => toggleMod(i)}
                >
                  <span className="accordion-module__title">
                    <span className="accordion-module__num">{i + 1}</span>
                    {mod.moduleTitle}
                  </span>
                  <span className="accordion-module__meta">{mod.chapters?.length || 0} chapters</span>
                  <span className="accordion-module__arrow">{openMods[i] ? "∧" : "∨"}</span>
                </button>
                {openMods[i] && (
                  <ul className="accordion-module__chapters">
                    {(mod.chapters || []).map((ch, ci) => (
                      <li key={ci} className="accordion-module__chapter">
                        <span className="accordion-module__dot">•</span>
                        {ch}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* WHO SHOULD JOIN */}
        {tab === "Who Should Join" && (
          <div>
            <h2 className="dip-content-title">Who Should Join?</h2>
            <ul className="dip-who-list">
              {(diploma.whoShouldJoin || []).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {/* CTA at bottom */}
            <div style={{
              background: "var(--primary-light)",
              border: "1.5px solid var(--primary)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              marginTop: 32,
              textAlign: "center",
            }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                Ready to start your journey?
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
                Enquire now — our counsellor will call you within 24 hours!
              </p>
              <button className="btn-enroll-diploma" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => setShowForm(true)}>
                Enroll Now →
              </button>
            </div>
          </div>
        )}

        <Link to="/courses" className="btn-back">← Back to Courses</Link>
      </div>

      {/* ── Enquiry Form Modal ── */}
      {showForm && (
        <EnquiryForm
          preSelectedCourse={diploma.title}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
