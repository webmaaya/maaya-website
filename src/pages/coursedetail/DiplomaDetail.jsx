// ============================================================
//  DiplomaDetail.jsx — /diploma/:id
//  Handles: Diploma courses + Online courses + Basic Diploma
//  Tabs: Overview | Subjects (if exists) | Syllabus | Who Should Join
// ============================================================

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnquiryForm from "../../components/sections/EnquiryForm";
import "./DiplomaDetail.css";

export default function DiplomaDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [diploma,   setDiploma]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("Overview");
  const [openMods,  setOpenMods]  = useState({ 0: true });
  const [openSubj,  setOpenSubj]  = useState({});
  const [showForm,  setShowForm]  = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let snap = await getDoc(doc(db, "diplomaCourses", id));
        if (!snap.exists()) snap = await getDoc(doc(db, "onlineCourses", id));
        if (snap.exists()) {
          setDiploma({ id: snap.id, ...snap.data() });
          setOpenMods({ 0: true });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={{ textAlign:"center", padding:"100px 24px" }}>
      <span style={{ fontSize:40 }}>⏳</span>
      <p style={{ marginTop:16, color:"var(--text-muted)" }}>Loading...</p>
    </div>
  );

  if (!diploma) return (
    <div style={{ textAlign:"center", padding:"80px 24px" }}>
      <h2>Program Not Found</h2>
      <Link to="/courses" className="btn-back" style={{ marginTop:20, display:"inline-block" }}>
        ← Back to Courses
      </Link>
    </div>
  );

  // ── Dynamic tabs based on course data ──────────────────────
  const TABS = ["Overview"];
  if ((diploma.subjects || []).length > 0) TABS.push("Subjects");
  TABS.push("Syllabus", "Who Should Join");

  const toggleMod  = (i) => setOpenMods(p => ({ ...p, [i]: !p[i] }));
  const toggleSubj = (i) => setOpenSubj(p => ({ ...p, [i]: !p[i] }));

  const handleEnroll = () => {
    if (diploma.isOnline) navigate(`/enroll/${diploma.id}`);
    else setShowForm(true);
  };

  return (
    <main>

      {/* ── Hero ── */}
      <section className={`dip-hero ${diploma.gradient || "grad-blue"}`}>
        <div className="dip-hero__inner">

          {/* Left */}
          <div>
            <div className="dip-hero__rating">
              <span className="dip-hero__stars">★★★★★</span>
              <span className="dip-hero__rating-text">
                {diploma.isOnline ? "🌐 Online Course" : "MKCL Certified Program"}
              </span>
            </div>
            <h1 className="dip-hero__title">{diploma.title}</h1>
            <p className="dip-hero__sub">{diploma.overview}</p>
            <div className="dip-hero__duration">📅 {diploma.duration}</div>

            {/* Subject pills for Basic Diploma */}
            {(diploma.subjects || []).length > 0 && (
              <div className="dip-hero__subject-pills">
                {diploma.subjects.map(s => (
                  <span key={s.name} className="dip-hero__subject-pill">
                    {s.icon} {s.name.replace(/^[^\w]*/, "")}
                  </span>
                ))}
              </div>
            )}

            {diploma.isOnline && diploma.price && (
              <div className="dip-hero__price-row">
                {diploma.originalPrice && (
                  <span className="dip-hero__price-old">₹{diploma.originalPrice}</span>
                )}
                <span className="dip-hero__price-now">₹{diploma.price}</span>
              </div>
            )}
          </div>

          {/* Right — Enroll Card */}
          <div className="dip-enroll-card">
            {diploma.isOnline ? (
              <>
                <h3 className="dip-enroll-card__title">🌐 Enroll in this Course</h3>
                <p className="dip-enroll-card__sub">
                  Complete the enrollment form, pay the fees, and get instant access!
                </p>
                <div className="dip-enroll-card__price-box">
                  {diploma.originalPrice && (
                    <div className="dip-enroll-card__price-old">₹{diploma.originalPrice}</div>
                  )}
                  <div className="dip-enroll-card__price-now">₹{diploma.price}</div>
                  <div className="dip-enroll-card__duration">⏱ {diploma.duration}</div>
                </div>
                <button className="btn-enroll-diploma online" onClick={handleEnroll}>
                  Enroll Now — Fill the Form →
                </button>
                <p className="dip-enroll-card__note">
                  📞 Questions? Call: <strong>9420277373</strong>
                </p>
              </>
            ) : (
              <>
                <h3 className="dip-enroll-card__title">Interested in this Program?</h3>
                <p className="dip-enroll-card__sub">
                  Fill a quick form — our counsellor will call you within 24 hours.
                </p>
                <button className="btn-enroll-diploma" onClick={handleEnroll}>
                  Enroll Now — It's Free to Enquire!
                </button>
                <p className="dip-enroll-card__note">
                  📞 Or call us: <strong>9420277373</strong>
                </p>
              </>
            )}

            <ul className="dip-features-list">
              {(diploma.features || []).map(f => <li key={f}>✅ {f}</li>)}
            </ul>
          </div>

        </div>
      </section>

      {/* ── Tabs Bar ── */}
      <div className="dip-tabs-bar">
        <div className="dip-tabs-inner">
          {TABS.map(t => (
            <button key={t}
              className={`dip-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="dip-content">

        {/* ══════ OVERVIEW ══════ */}
        {tab === "Overview" && (
          <div>
            {/* Diploma — included sub-courses */}
            {!diploma.isOnline && (diploma.includes || []).length > 0 && (
              <>
                <h2 className="dip-content-title">What's Included</h2>
                <div className="dip-includes-grid">
                  {diploma.includes.map(item => (
                    <div key={item.name} className="dip-include-card">
                      <span className="dip-include-card__icon">{item.icon}</span>
                      <div className="dip-include-card__name">{item.name}</div>
                      <div className="dip-include-card__duration">📅 {item.duration}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Basic Diploma — 5 subject overview cards */}
            {(diploma.subjects || []).length > 0 && (
              <>
                <h2 className="dip-content-title">📚 What's Covered in This Course</h2>
                <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:20 }}>
                  {diploma.subjects.length} subjects · Click on a subject to see its modules
                </p>
                <div className="dip-subjects-overview">
                  {diploma.subjects.map((subj, si) => (
                    <div
                      key={si}
                      className={`dip-subject-card clickable ${subj.color || "grad-blue"}`}
                      onClick={() => {
                        setTab("Subjects");
                        setOpenSubj({ [si]: true });
                        setTimeout(() => {
                          document.querySelector(".dip-tabs-bar")?.scrollIntoView({ behavior:"smooth" });
                        }, 50);
                      }}
                    >
                      <div className="dip-subject-card__icon">{subj.icon}</div>
                      <div className="dip-subject-card__name">{subj.name}</div>
                      {subj.subCourses?.length > 0 ? (
                        <div className="dip-subject-card__count">
                          {subj.subCourses.length} sub-course{subj.subCourses.length > 1 ? "s" : ""}
                        </div>
                      ) : (
                        <div className="dip-subject-card__count">Core subject</div>
                      )}
                      <div className="dip-subject-card__cta">View Details →</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* What you'll learn */}
            {(diploma.whatYouLearn || []).length > 0 && (
              <>
                <h2 className="dip-content-title" style={{ marginTop:32 }}>What You'll Learn</h2>
                <div className="dip-learn-grid">
                  {diploma.whatYouLearn.map(item => (
                    <div key={item} className="dip-learn-item">{item}</div>
                  ))}
                </div>
              </>
            )}

            {/* Tags */}
            {diploma.isOnline && (diploma.tags || []).length > 0 && (
              <div className="dip-tags-row" style={{ marginTop:24 }}>
                {diploma.tags.map(t => (
                  <span key={t} className="dip-tag">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════ SUBJECTS TAB (Basic Diploma) ══════ */}
        {tab === "Subjects" && (
          <div>
            <h2 className="dip-content-title">📚 Subjects & Sub-Courses</h2>
            <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:24 }}>
              Click on each subject to see its sub-courses and details
            </p>

            {(diploma.subjects || []).map((subj, si) => (
              <div key={si} className="dip-subject-accordion">

                {/* Subject Header */}
                <button
                  className={`dip-subject-accordion__header ${openSubj[si] ? "open" : ""}`}
                  onClick={() => toggleSubj(si)}
                >
                  <div className="dip-subject-accordion__left">
                    <span className="dip-subject-accordion__icon">{subj.icon}</span>
                    <span className="dip-subject-accordion__name">{subj.name}</span>
                  </div>
                  <div className="dip-subject-accordion__right">
                    {subj.subCourses?.length > 0
                      ? <span className="dip-subject-accordion__count">{subj.subCourses.length} sub-course{subj.subCourses.length > 1 ? "s" : ""}</span>
                      : <span className="dip-subject-accordion__count">Core subject</span>
                    }
                    <span className="dip-subject-accordion__arrow">
                      {openSubj[si] ? "∧" : "∨"}
                    </span>
                  </div>
                </button>

                {/* Subject Content */}
                {openSubj[si] && (
                  <div className="dip-subject-accordion__body">
                    {subj.subCourses?.length > 0 ? (
                      // Sub-courses list
                      subj.subCourses.map((sc, sci) => (
                        <div key={sci} className="dip-subcourse-card">
                          <div className="dip-subcourse-card__header">
                            <div className="dip-subcourse-card__num">{sci + 1}</div>
                            <div className="dip-subcourse-card__info">
                              <div className="dip-subcourse-card__name">{sc.name}</div>
                              <div className="dip-subcourse-card__duration">⏱ {sc.duration}</div>
                            </div>
                          </div>
                          {sc.description && (
                            <p className="dip-subcourse-card__desc">{sc.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      // AI — no sub-courses, direct content
                      <div className="dip-subcourse-card">
                        <div className="dip-subcourse-card__header">
                          <div className="dip-subcourse-card__num">🤖</div>
                          <div className="dip-subcourse-card__info">
                            <div className="dip-subcourse-card__name">Artificial Intelligence</div>
                            <div className="dip-subcourse-card__duration">⏱ Included in course</div>
                          </div>
                        </div>
                        <p className="dip-subcourse-card__desc">
                          Learn AI fundamentals, Machine Learning basics, Neural Networks, NLP,
                          Computer Vision, and real-world AI tools like ChatGPT & Midjourney.
                          Build a simple AI chatbot using Python as your final project.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══════ SYLLABUS ══════ */}
        {tab === "Syllabus" && (
          <div>
            <h2 className="dip-content-title">Course Syllabus</h2>
            <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:20 }}>
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
                        <span className="accordion-module__dot">•</span>{ch}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══════ WHO SHOULD JOIN ══════ */}
        {tab === "Who Should Join" && (
          <div>
            <h2 className="dip-content-title">Who Should Join?</h2>
            <ul className="dip-who-list">
              {(diploma.whoShouldJoin || []).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div style={{
              background:"var(--primary-light)", border:"1.5px solid var(--primary)",
              borderRadius:"var(--radius-lg)", padding:"24px", marginTop:32, textAlign:"center",
            }}>
              <h3 style={{ fontFamily:"var(--font-heading)", fontSize:18, fontWeight:800, marginBottom:8 }}>
                Ready to start your journey?
              </h3>
              <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:16 }}>
                {diploma.isOnline
                  ? "Enroll now — pay & get instant course access!"
                  : "Enquire now — our counsellor will call you within 24 hours!"}
              </p>
              <button
                className={`btn-enroll-diploma ${diploma.isOnline ? "online" : ""}`}
                style={{ maxWidth:280, margin:"0 auto" }}
                onClick={handleEnroll}
              >
                {diploma.isOnline ? "Enroll Now →" : "Enquire Now →"}
              </button>
            </div>
          </div>
        )}

        <Link to="/courses" className="btn-back">← Back to Courses</Link>
      </div>

      {/* Enquiry Modal */}
      {showForm && !diploma.isOnline && (
        <EnquiryForm preSelectedCourse={diploma.title} onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}
