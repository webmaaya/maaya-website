// ============================================================
//  Courses.jsx — /courses
//  Sections order:
//    1. 🎓 Diploma Programs  (diplomaCourses collection)
//    2. 🌐 Online Courses    (onlineCourses collection) ← NEW
//    3. 🆓 Free Courses      (freeCourses collection)
// ============================================================

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate,useLocation } from "react-router-dom";
import DiplomaCard from "../../Components/cards/DiplomaCard";
import EnquiryForm from "../../Components/sections/EnquiryForm";
import "./Courses.css";
import mscitLogo from "../../assets/logo/mscit logo.png";

const THUMB_LOGOS = {
  mscit: mscitLogo,
};

const TRACKS = ["All","Accounting","Programming","Designing","IT Hardware","Work From Home"];

export default function Courses() {
  const [diplomas,    setDiplomas]    = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [track,       setTrack]       = useState("All");
  const [showForm,    setShowForm]    = useState(false);
  const [selCourse,   setSelCourse]   = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [dipSnap, onSnap, freeSnap] = await Promise.all([
          getDocs(collection(db, "diplomaCourses")),
          getDocs(collection(db, "onlineCourses")),
          getDocs(collection(db, "freeCourses")),
        ]);
        setDiplomas(dipSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setOnlineCourses(onSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setFreeCourses(freeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
  const scrollToSection = () => {
    if (location.hash) {
      const el = document.querySelector(location.hash);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // wait until data renders
  setTimeout(scrollToSection, 500);

}, [location, diplomas, onlineCourses, freeCourses]);


  const filteredDiplomas = diplomas.filter(d =>
    track === "All" || d.track === track
  );

  const filteredOnline = onlineCourses.filter(c =>
    track === "All" || c.track === track
  );

  const openForm = (courseName) => {
    setSelCourse(courseName);
    setShowForm(true);
  };

  return (
    <main className="courses-page">
      <div className="courses-page__inner">

        {/* Header */}
        <div className="courses-page__header">
          <h1 className="courses-page__title">Our Programs</h1>
          <p className="courses-page__sub">
            Choose a program and start your career journey today
          </p>
        </div>

        {/* Track Filter */}
        <div className="courses-page__filters">
          {TRACKS.map(t => (
            <button
              key={t}
              className={`filter-btn ${track === t ? "active" : ""}`}
              onClick={() => setTrack(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            1. DIPLOMA PROGRAMS
        ══════════════════════════════════════ */}
        <div id="diploma" style={{ marginBottom: 56 }}>
          <div className="section-header" style={{ textAlign:"left", marginBottom:24 }}>
            <div className="section-badge">🎓 Internship Programs</div>
            <h2 className="section-title">Internship Diploma Courses</h2>
          </div>

          {loading ? (
            <div className="courses-page__empty"><span>⏳</span><p>Loading programs...</p></div>
          ) : filteredDiplomas.length > 0 ? (
            <div className="courses-page__grid">
              {filteredDiplomas.map(d => <DiplomaCard key={d.id} diploma={d} />)}
            </div>
          ) : (
            <div className="courses-page__empty"><span>😕</span><p>No diploma programs found</p></div>
          )}
        </div>

        {/* ══════════════════════════════════════
            2. ONLINE COURSES (show only if exist)
        ══════════════════════════════════════ */}
        {!loading && filteredOnline.length > 0 && (
          <div id="online" style={{ marginBottom: 56 }}>
            <div className="section-header" style={{ textAlign:"left", marginBottom:24 }}>
              <div className="section-badge">🌐 Online Programs</div>
              <h2 className="section-title">Online Courses</h2>
              <p className="section-sub">Learn from anywhere — pay & get instant access</p>
            </div>

            <div className="online-courses-grid">
              {filteredOnline.map(c => (
                <div key={c.id} className="online-course-card"
                  onClick={() => navigate(`/diploma/${c.id}`)}>
                  <div className={`online-course-card__thumb ${c.gradient || "grad-blue"}`}>
                    {c.thumbLogo && THUMB_LOGOS[c.thumbLogo] ? (
                      <img
                        src={THUMB_LOGOS[c.thumbLogo]}
                        alt={c.title}
                        className="diploma-card__thumb-logo"
                        style={{ width: "200px", height: "auto" }}
                      />
                    ) : (
                      <span>{c.icon}</span>
                    )}
                    {c.badge && <span className="online-course-card__badge">{c.badge}</span>}
                    <span className="online-course-card__online-pill">🌐 Online</span>
                  </div>
                  <div className="online-course-card__body">
                    <div className="online-course-card__track">{c.track}</div>
                    <h3 className="online-course-card__title">{c.title}</h3>
                    {c.description && (
                      <p className="online-course-card__desc">{c.description}</p>
                    )}
                    {(c.tags || []).length > 0 && (
                      <div className="online-course-card__tags">
                        {c.tags.slice(0,3).map(t => (
                          <span key={t} className="online-course-card__tag">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="online-course-card__footer">
                      <div className="online-course-card__meta">
                        {c.duration && <span>⏱ {c.duration}</span>}
                      </div>
                      <div className="online-course-card__price">
                        {c.originalPrice && (
                          <span className="online-course-card__price-old">₹{c.originalPrice}</span>
                        )}
                        <span className="online-course-card__price-now">₹{c.price}</span>
                      </div>
                    </div>
                    <button className="btn-enroll-online"
                      onClick={e => { e.stopPropagation(); navigate(`/diploma/${c.id}`); }}>
                      Enroll Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            3. FREE COURSES
        ══════════════════════════════════════ */}
        {track === "All" && (
          <div>
            <div id="free" className="section-header" style={{ textAlign:"left", marginBottom:24 }}>
              <div className="section-badge">🆓 Free Programs</div>
              <h2 className="section-title">Learn 100% Free Computer Courses</h2>
              <p className="section-sub">Enroll for free — fill a quick form!</p>
            </div>

            <div className="free-courses-grid">
              {freeCourses.map(fc => (
                <div key={fc.id} className="free-course-card">
                  <div className={`free-course-card__thumb ${fc.gradient || "grad-blue"}`}>
                    <span>{fc.icon}</span>
                  </div>
                  <div className="free-course-card__body">
                    <span className="free-course-card__badge">FREE</span>
                    <h3 className="free-course-card__title">{fc.title}</h3>
                    <p className="free-course-card__desc">{fc.description}</p>
                    <p className="free-course-card__whom">👤 {fc.forWhom}</p>
                    <button className="btn-enroll free" onClick={() => openForm(fc.title)}>
                      Register Free →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showForm && (
        <EnquiryForm preSelectedCourse={selCourse} onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}
