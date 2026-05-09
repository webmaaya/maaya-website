// ============================================================
//  Courses.jsx — /courses — Shows Diploma + Free courses only
//  No single courses shown
// ============================================================

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import DiplomaCard from "../../Components/cards/DiplomaCard";
import EnquiryForm from "../../Components/sections/EnquiryForm";
import "./Courses.css";

const TRACKS = ["All", "Accounting", "Programming", "Designing", "IT Hardware", "Work From Home"];

export default function Courses() {
  const [diplomas,    setDiplomas]    = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [track,       setTrack]       = useState("All");
  const [showForm,    setShowForm]    = useState(false);
  const [selCourse,   setSelCourse]   = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [dipSnap, freeSnap] = await Promise.all([
          getDocs(collection(db, "diplomaCourses")),
          getDocs(collection(db, "freeCourses")),
        ]);
        setDiplomas(dipSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setFreeCourses(freeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filteredDiplomas = diplomas.filter(d =>
    track === "All" || d.track === track
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
            Choose a diploma program and start your career journey today
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

        {/* ── Diploma Programs ── */}
        <div style={{ marginBottom: 56 }}>
          <div className="section-header" style={{ textAlign: "left", marginBottom: 24 }}>
            <div className="section-badge">🎓 Diploma Programs</div>
            <h2 className="section-title">Diploma Courses</h2>
          </div>

          {loading ? (
            <div className="courses-page__empty"><span>⏳</span><p>Loading programs...</p></div>
          ) : filteredDiplomas.length > 0 ? (
            <div className="courses-page__grid">
              {filteredDiplomas.map(d => <DiplomaCard key={d.id} diploma={d} />)}
            </div>
          ) : (
            <div className="courses-page__empty"><span>😕</span><p>No programs found</p></div>
          )}
        </div>

        {/* ── Free Courses ── */}
        {(track === "All") && (
          <div>
            <div className="section-header" style={{ textAlign: "left", marginBottom: 24 }}>
              <div className="section-badge">🆓 Free Programs</div>
              <h2 className="section-title">Free Courses</h2>
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
                    <button
                      className="btn-enroll free"
                      onClick={() => openForm(fc.title)}
                    >
                      Register Free →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Form Modal */}
      {showForm && (
        <EnquiryForm
          preSelectedCourse={selCourse}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
