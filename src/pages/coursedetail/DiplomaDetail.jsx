// ============================================================
//  DiplomaDetail.jsx — /diploma/:id
// ============================================================

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnquiryForm from "../../Components/sections/EnquiryForm";
import "./DiplomaDetail.css";

export default function DiplomaDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [diploma, setDiploma] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("Overview");

  // ONLY ONE MODULE OPEN
  const [openMods, setOpenMods] = useState({});

  // ONLY ONE SUBJECT OPEN
  const [openSubj, setOpenSubj] = useState({});

  const [showForm, setShowForm] = useState(false);

  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {

    (async () => {

      setLoading(true);

      try {

        let snap = await getDoc(
          doc(db, "diplomaCourses", id)
        );

        if (!snap.exists()) {

          snap = await getDoc(
            doc(db, "onlineCourses", id)
          );

        }

        if (snap.exists()) {

          setDiploma({
            id: snap.id,
            ...snap.data(),
          });

          // RESET STATES
          setOpenMods({});
          setOpenSubj({});

        }

      } catch (e) {

        console.error(e);

      }

      setLoading(false);

    })();

  }, [id]);

  // ============================================================
  // AUTO OPEN FIRST MODULE
  // ONLY WHEN USER MANUALLY OPENS SYLLABUS TAB
  // ============================================================

  useEffect(() => {

    if (
      tab === "Syllabus" &&
      diploma?.syllabus?.length > 0 &&
      Object.keys(openMods).length === 0
    ) {

      setOpenMods({
        0: true,
      });

    }

  }, [tab, diploma]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 24px",
        }}
      >
        <span style={{ fontSize: 40 }}>⏳</span>

        <p
          style={{
            marginTop: 16,
            color: "var(--text-muted)",
          }}
        >
          Loading...
        </p>
      </div>
    );

  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!diploma) {

    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        <h2>Program Not Found</h2>

        <Link
          to="/courses"
          className="btn-back"
          style={{
            marginTop: 20,
            display: "inline-block",
          }}
        >
          ← Back to Courses
        </Link>
      </div>
    );

  }

  // ============================================================
  // TABS
  // ============================================================

  const TABS = ["Overview"];

  if ((diploma.subjects || []).length > 0) {
    TABS.push("Subjects");
  }

  TABS.push("Syllabus", "Who Should Join");

  // ============================================================
  // TOGGLE MODULE
  // ONLY ONE OPEN
  // ============================================================

  const toggleMod = (i) => {

    setOpenMods((prev) => ({
      [i]: !prev[i],
    }));

  };

  // ============================================================
  // TOGGLE SUBJECT
  // ONLY ONE OPEN
  // ============================================================

  const toggleSubj = (i) => {

    setOpenSubj((prev) => ({
      [i]: !prev[i],
    }));

  };

  // ============================================================
  // ENROLL
  // ============================================================

  const handleEnroll = () => {

    if (diploma.isOnline) {

      navigate(`/enroll/${diploma.id}`);

    } else {

      setShowForm(true);

    }

  };

  // ============================================================
  // INCLUDED COURSE CLICK
  // ============================================================

  const handleIncludeClick = (subCourseName) => {

    if (!diploma?.syllabus?.length) return;

    const moduleIndex = diploma.syllabus.findIndex(
      (mod) =>
        mod.moduleTitle &&
        mod.moduleTitle
          .toLowerCase()
          .includes(subCourseName.toLowerCase())
    );

    if (moduleIndex === -1) return;

    // OPEN TAB

    setTab("Syllabus");

    // OPEN ONLY CURRENT MODULE

    setOpenMods({
      [moduleIndex]: true,
    });

    // AUTO SCROLL

    setTimeout(() => {

      const el = document.getElementById(
        `module-${moduleIndex}`
      );

      if (el) {

        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      }

    }, 250);

  };

  // ============================================================
  // RETURN
  // ============================================================

  return (

    <main>

      {/* HERO */}

      <section
        className={`dip-hero ${
          diploma.gradient || "grad-blue"
        }`}
      >

        <div className="dip-hero__inner">

          {/* LEFT */}

          <div>

            <div className="dip-hero__rating">

              <span className="dip-hero__stars">
                ★★★★★
              </span>

              <span className="dip-hero__rating-text">

                {diploma.isOnline
                  ? "🌐 Online Course"
                  : "MKCL Certified Program"}

              </span>

            </div>

            <h1 className="dip-hero__title">
              {diploma.title}
            </h1>

            <p className="dip-hero__sub">
              {diploma.overview}
            </p>

            <div className="dip-hero__duration">
              📅 {diploma.duration}
            </div>

          </div>

        </div>

      </section>

      {/* TABS */}

      <div className="dip-tabs-bar">

        <div className="dip-tabs-inner">

          {TABS.map((t) => (

            <button
              key={t}
              className={`dip-tab ${
                tab === t ? "active" : ""
              }`}
              onClick={() => {

                setTab(t);

                // RESET MODULES
                // WHEN SWITCHING TAB

                if (t !== "Syllabus") {

                  setOpenMods({});

                }

              }}
            >
              {t}
            </button>

          ))}

        </div>

      </div>

      {/* CONTENT */}

      <div className="dip-content">

        {/* OVERVIEW */}

        {tab === "Overview" && (

          <div>

            {!diploma.isOnline &&
              (diploma.includes || []).length > 0 && (

              <>
                <h2 className="dip-content-title">
                  What's Included
                </h2>

                <div className="dip-includes-grid">

                  {diploma.includes.map((item) => (

                    <div
                      key={item.name}
                      className="dip-include-card clickable"
                      onClick={() =>
                        handleIncludeClick(item.name)
                      }
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >

                      <span className="dip-include-card__icon">
                        {item.icon}
                      </span>

                      <div className="dip-include-card__name">
                        {item.name}
                      </div>

                      <div className="dip-include-card__duration">
                        📅 {item.duration}
                      </div>

                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#007bff",
                          marginTop: "0.5rem",
                        }}
                      >
                        View Syllabus →
                      </div>

                    </div>

                  ))}

                </div>
              </>

            )}

          </div>

        )}

        {/* SYLLABUS */}

        {tab === "Syllabus" && (

          <div>

            <h2 className="dip-content-title">
              Course Syllabus
            </h2>

            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                marginBottom: 20,
              }}
            >
              {diploma.syllabus?.length} modules
            </p>

            {(diploma.syllabus || []).map((mod, i) => (

              <div
                key={i}
                id={`module-${i}`}
                className="accordion-module"
              >

                <button
                  className={`accordion-module__header ${
                    openMods[i] ? "open" : ""
                  }`}
                  onClick={() => toggleMod(i)}
                >

                  <span className="accordion-module__title">

                    <span className="accordion-module__num">
                      {i + 1}
                    </span>

                    {mod.moduleTitle}

                  </span>

                  <span className="accordion-module__meta">
                    {mod.chapters?.length || 0} chapters
                  </span>

                  <span className="accordion-module__arrow">
                    {openMods[i] ? "∧" : "∨"}
                  </span>

                </button>

                {openMods[i] && (

                  <ul className="accordion-module__chapters">

                    {(mod.chapters || []).map((ch, ci) => (

                      <li
                        key={ci}
                        className="accordion-module__chapter"
                      >

                        <span className="accordion-module__dot">
                          •
                        </span>

                        {ch}

                      </li>

                    ))}

                  </ul>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* FORM */}

      {showForm && !diploma.isOnline && (

        <EnquiryForm
          preSelectedCourse={diploma.title}
          onClose={() => setShowForm(false)}
        />

      )}

    </main>

  );

}