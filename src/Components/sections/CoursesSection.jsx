// ============================================================
//  CoursesSection.jsx — Homepage Featured Courses Section
//  Free courses: Mystery Box animation → reveal → redirect
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import OnlineCourseCard from "../cards/OnlineCourseCard";
import { db } from "../../firebase";
import DiplomaCard from "../cards/DiplomaCard";
import EnquiryForm from "./EnquiryForm";
import "./CoursesSection.css";

// ── Mystery Box Component ─────────────────────────────────────
function MysteryBox({ freeCourses }) {
  const navigate   = useNavigate();
  const [opened,   setOpened]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef   = useRef(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // Show courses briefly, then redirect
    timerRef.current = setTimeout(() => {
      setRevealed(true);
      // Redirect after user sees the courses pop out
      setTimeout(() => {
        navigate("/courses#free");
      }, 1800);
    }, 600); // wait for box open animation
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const preview = freeCourses.slice(0, 5);

  return (
    <div className="mbox-wrap">
      {/* Section badge */}
      <div className="section-badge" style={{ marginBottom: 12 }}>🆓 Free Programs</div>
      <h2 className="section-title" style={{ marginBottom: 6 }}>
        Learn <span style={{ color:"#2563EB" }}>100% Free</span> Computer Courses
      </h2>
      <p className="section-sub" style={{ marginBottom: 36 }}>
        Tap the box to reveal all free courses!
      </p>

      {/* The box */}
      <div
        className={`mbox ${opened ? "mbox--open" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && handleOpen()}
        aria-label="Tap to reveal free courses"
      >
        {/* Rotating glow ring */}
        <div className="mbox__ring" />
        <div className="mbox__ring mbox__ring--2" />

        {/* Box body */}
        <div className="mbox__body">
          <div className="mbox__lid">
            <div className="mbox__bow">🎀</div>
          </div>
          <div className="mbox__base">
            <span className="mbox__icon">🎁</span>
          </div>
        </div>

        {/* Label */}
        {!opened && (
          <div className="mbox__label">
            <span>✨ Tap to Reveal</span>
            <span className="mbox__label-sub">All Free Courses Inside!</span>
          </div>
        )}

        {/* Burst particles */}
        {opened && (
          <div className="mbox__burst">
            {["🌟","💫","⭐","✨","🎉","🎊","💥","🌈"].map((e, i) => (
              <span key={i} className="mbox__particle" style={{ "--i": i }}>{e}</span>
            ))}
          </div>
        )}
      </div>

      {/* Course cards fly out */}
      {revealed && (
        <div className="mbox__courses">
          {preview.map((fc, idx) => (
            <div
              key={fc.id}
              className="mbox__course-card"
              style={{ "--delay": `${idx * 0.07}s` }}
            >
              <div className={`mbox__course-thumb ${fc.gradient || "grad-blue"}`}>
                <span style={{ fontSize: 32 }}>{fc.icon}</span>
              </div>
              <div className="mbox__course-info">
                <span className="mbox__course-free">FREE</span>
                <div className="mbox__course-title">{fc.title}</div>
                {fc.originalPrice && (
                  <div className="mbox__course-price">
                    <span style={{ color:"#16A34A", fontWeight:800 }}>₹0</span>
                    <span style={{ color:"#94A3B8", textDecoration:"line-through", fontSize:11 }}>₹{fc.originalPrice}</span>
                    <span style={{ color:"#EF4444", fontWeight:700, fontSize:11 }}>100% OFF</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="mbox__redirect-note">
            🚀 Taking you to all free courses...
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main CoursesSection ───────────────────────────────────────
export default function CoursesSection() {
  const [diplomas,      setDiplomas]      = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);
  const [freeCourses,   setFreeCourses]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [selCourse,     setSelCourse]     = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [dipSnap, freeSnap, onlineSnap] = await Promise.all([
          getDocs(collection(db, "diplomaCourses")),
          getDocs(collection(db, "freeCourses")),
          getDocs(collection(db, "onlineCourses")),
        ]);
        setDiplomas(dipSnap.docs.map(d => ({ id:d.id, ...d.data() })));
        setFreeCourses(freeSnap.docs.map(d => ({ id:d.id, ...d.data() })));
        setOnlineCourses(onlineSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch (e) { console.error("CoursesSection fetch error:", e); }
      setLoading(false);
    })();
  }, []);

  const openForm = (courseName) => { setSelCourse(courseName); setShowForm(true); };

  return (
    <section className="courses-section">
      <div className="courses-section__inner">

        {/* ── FREE COURSES — Mystery Box ── */}
        {freeCourses.length > 0 && (
          <div style={{ marginBottom: 72 }}>
            <MysteryBox freeCourses={freeCourses} />
          </div>
        )}

        {/* ── ONLINE COURSES ── */}
        {onlineCourses.length > 0 && (
          <div style={{ marginTop: 0, marginBottom: 56 }}>
            <div className="section-header">
              <div className="section-badge">🌐 Learn Anywhere</div>
              <h2 className="section-title">Online Courses</h2>
              <p className="section-sub">Learn from home with flexible online programs</p>
            </div>
            {loading ? (
              <div style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>
                ⏳ Loading online courses...
              </div>
            ) : (
              <div className="courses-section__grid">
                {onlineCourses.slice(0, 2).map(course => (
                  <OnlineCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
            <div className="courses-section__footer">
              <Link to="/courses#online" className="btn-view-all">
                View All Online Courses →
              </Link>
            </div>
          </div>
        )}

        {/* ── DIPLOMA PROGRAMS ── */}
        <div style={{ marginTop: 0 }}>
          <div className="section-header">
            <div className="section-badge">📚 Our Programs</div>
            <h2 className="section-title">Internship Diploma Courses</h2>
            <p className="section-sub">Government certified & industry-aligned programs to boost your career</p>
          </div>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>
              ⏳ Loading courses...
            </div>
          ) : diplomas.length > 0 ? (
            <div className="courses-section__grid">
              {diplomas.slice(0, 3).map(diploma => (
                <DiplomaCard key={diploma.id} diploma={diploma} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>
              <p>No programs yet — add from Admin Panel: <a href="/admin">/admin</a></p>
            </div>
          )}
          <div className="courses-section__footer">
            <Link to="/courses#diploma" className="btn-view-all">View All Programs →</Link>
          </div>
        </div>

      </div>

      {showForm && (
        <EnquiryForm preSelectedCourse={selCourse} onClose={() => setShowForm(false)} />
      )}
    </section>
  );
}