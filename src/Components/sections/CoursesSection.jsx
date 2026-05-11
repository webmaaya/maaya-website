// ============================================================
//  CoursesSection.jsx — Homepage Featured Courses Section
//  NOW: Shows Diploma courses from Firebase
//  Free courses bhi dikhata hai (first 3)
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import DiplomaCard from "../cards/DiplomaCard";
import EnquiryForm from "./EnquiryForm";
import "./Coursessection.css";

export default function CoursesSection() {
  const [diplomas,    setDiplomas]    = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading,     setLoading]     = useState(true);
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
        console.error("CoursesSection fetch error:", e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const openForm = (courseName) => {
    setSelCourse(courseName);
    setShowForm(true);
  };

  return (
    <section className="courses-section">
      <div className="courses-section__inner">

        {/* Header */}
        <div className="section-header">
          <div className="section-badge">📚 Our Programs</div>
          <h2 className="section-title">Diploma Programs</h2>
          <p className="section-sub">
            Government certified & industry-aligned programs to boost your career
          </p>
        </div>

        {/* Diploma Cards */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>
            ⏳ Loading courses...
          </div>
        ) : diplomas.length > 0 ? (
          <div className="courses-section__grid">
            {diplomas.slice(0, 6).map(diploma => (
              <DiplomaCard key={diploma.id} diploma={diploma} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"40px", color:"var(--text-muted)" }}>
            <p>No programs yet — add from Admin Panel: <a href="/admin">/admin</a></p>
          </div>
        )}

        {/* View All */}
        <div className="courses-section__footer">
          <Link to="/courses" className="btn-view-all">View All Programs →</Link>
        </div>

        {/* Free Courses — first 3 on homepage */}
        {freeCourses.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div className="section-header">
              <div className="section-badge">🆓 Free Programs</div>
              <h2 className="section-title">Free Courses</h2>
              <p className="section-sub">Enroll for free — fill a quick form!</p>
            </div>

            <div className="courses-section__grid">
              {freeCourses.slice(0, 3).map(fc => (
                <div key={fc.id} className="free-course-card">
                  <div className={`free-course-card__thumb ${fc.gradient || "grad-blue"}`}>
                    <span style={{ fontSize: 48 }}>{fc.icon}</span>
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

            {freeCourses.length > 3 && (
              <div className="courses-section__footer" style={{ marginTop: 24 }}>
                <Link to="/courses" className="btn-view-all">View All Free Courses →</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <EnquiryForm preSelectedCourse={selCourse} onClose={() => setShowForm(false)} />
      )}
    </section>
  );
}
