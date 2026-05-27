// ============================================================
//  DiplomaDetail.jsx — /diploma/:id
// ============================================================

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnquiryForm from "../../Components/sections/EnquiryForm";
import accountingCert from "../../assets/certificates/accounting.jpeg";
import programmingCert from "../../assets/certificates/programming.jpeg";
import designingCert from "../../assets/certificates/designing.jpeg";
import hardwareCert from "../../assets/certificates/hardware.jpg";
import mscitCert from "../../assets/certificates/mscit.jpeg";
import "./DiplomaDetail.css";

// ── Certificate data per course type ─────────────────────────
const CERTIFICATE_DATA = {
  default: {
    image : programmingCert,
    },

  accounting: {
    image: accountingCert,
  },

  programming: {
    image: programmingCert,
 },

  designing: {
    image: designingCert,

  },
  hardware: {
   image: hardwareCert,
  },

  workfromhome: {
    image: programmingCert,
  },

  online: {
    image: programmingCert,
  },
  
  mscit:{
    image: mscitCert,
  },


};



// ── Get certificate based on course track ────────────────────
const getCertificate = (diploma) => {

  if (!diploma)
    return CERTIFICATE_DATA.default;

  // Firebase certificate type
  const explicitType =
    (diploma.certificateType || "").toLowerCase();

  // Direct firebase match
  if (CERTIFICATE_DATA[explicitType]) {
    return CERTIFICATE_DATA[explicitType];
  }

  // Fallback track matching
  const track =
    (diploma.track || "").toLowerCase();

 if (
  track.includes("account") ||
  track.includes("finance")
)
  return CERTIFICATE_DATA.accounting;

if (
  track.includes("program") ||
  track.includes("development")
)
  return CERTIFICATE_DATA.programming;

if (
  track.includes("design") ||
  track.includes("multimedia")
)
  return CERTIFICATE_DATA.designing;

if (
  track.includes("hardware") ||
  track.includes("network")
)
  return CERTIFICATE_DATA.hardware;

if (
  track.includes("it and computer") ||
  track.includes("computer")
)
  return CERTIFICATE_DATA.mscit;

if (
  track.includes("professional")
)
  return CERTIFICATE_DATA.workfromhome;

if (
  track.includes("online")
)
  return CERTIFICATE_DATA.online;

  if (diploma.isOnline)
    return CERTIFICATE_DATA.online;

  return CERTIFICATE_DATA.default;
};




export default function DiplomaDetail() {

  const [videoLoaded, setVideoLoaded] = useState(false);

  const { id }   = useParams();

  const navigate = useNavigate();

  const [diploma,    setDiploma]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("Overview");
  const [openMods,   setOpenMods]   = useState({});
  const [openSubj,   setOpenSubj]   = useState({});
  const [showForm,   setShowForm]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let snap = await getDoc(doc(db, "diplomaCourses", id));
        if (!snap.exists()) snap = await getDoc(doc(db, "onlineCourses", id));
        if (snap.exists()) {
          setDiploma({ id: snap.id, ...snap.data() });
          setOpenMods({});
          setOpenSubj({});
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  // ── Auto open first module when Syllabus tab opens ─────────
  useEffect(() => {
    if (tab === "Syllabus" && diploma?.syllabus?.length > 0 && Object.keys(openMods).length === 0) {
      setOpenMods({ 0: true });
    }
  }, [tab, diploma]);

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

  const TABS = ["Overview"];
  if ((diploma.subjects || []).length > 0) TABS.push("Subjects");
  TABS.push("Syllabus", "Who Should Join");

  const toggleMod  = (i) => setOpenMods(prev => ({ [i]: !prev[i] }));
  const toggleSubj = (i) => setOpenSubj(prev => ({ [i]: !prev[i] }));

  const handleEnroll = () => {
    if (diploma.isOnline) navigate(`/enroll/${diploma.id}`);
    else setShowForm(true);
  };

  const cert = getCertificate(diploma);
  console.log(diploma);
console.log(diploma.track);
console.log(diploma.certificateType);
console.log(cert);
const certificateImage = cert.image;

  // ── Include card → open syllabus module ───────────────────
 const handleIncludeClick = (subCourseName) => {

  if (!diploma?.syllabus?.length) return;

  const normalize = (str = "") =>
    str
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const search = normalize(subCourseName);

  // EXACT MATCH FIRST
  let moduleIndex = diploma.syllabus.findIndex((mod) =>
    normalize(mod.moduleTitle) === search
  );

  // PARTIAL MATCH
  if (moduleIndex === -1) {
    moduleIndex = diploma.syllabus.findIndex((mod) =>
      normalize(mod.moduleTitle).includes(search)
    );
  }

  // REVERSE PARTIAL MATCH
  if (moduleIndex === -1) {
    moduleIndex = diploma.syllabus.findIndex((mod) =>
      search.includes(normalize(mod.moduleTitle))
    );
  }

  // AI SPECIAL CASE
  if (
    moduleIndex === -1 &&
    (search.includes("ai") ||
      search.includes("artificial intelligence"))
  ) {
    moduleIndex = diploma.syllabus.findIndex((mod) => {
      const title = normalize(mod.moduleTitle);
      return (
        title.includes("ai") ||
        title.includes("artificial intelligence")
      );
    });
  }

  if (moduleIndex === -1) {
    console.log("No syllabus module found for:", subCourseName);
    return;
  }

  setTab("Syllabus");

  setOpenMods({ [moduleIndex]: true });

  setTimeout(() => {
    const el = document.getElementById(`module-${moduleIndex}`);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 250);
};

  
  
// console.log(certificateImage);

  // ══════════════════════════════════════════════════════════
  return (
    <main>

      {/* ── HERO ── */}
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
                {diploma.originalPrice && <span className="dip-hero__price-old">₹{diploma.originalPrice}</span>}
                <span className="dip-hero__price-now">₹{diploma.price}</span>
              </div>
            )}
          </div>

          {/* Right — Enroll Card */}
         <div className="dip-enroll-card">

  {/* YouTube Video */}
  {(diploma.youtubeId || true) && (
    <div className="dip-enroll-card__video">

      {/* Thumbnail / Loader */}
      <div className="dip-video-loader">
        <img
          src={`https://img.youtube.com/vi/${diploma.youtubeId || "T1qMQTMu4tM"}/hqdefault.jpg`}
          alt={diploma.title}
          className="dip-video-thumb"
        />

        <div className="dip-video-overlay">
          <div className="dip-video-spinner"></div>
        </div>
      </div>

      {/* Real iframe */}
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${diploma.youtubeId || "T1qMQTMu4tM"}`}
        title={diploma.title}
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        className="dip-video-iframe"
      />
    </div>
  )}

  {diploma.isOnline ? (
    <>
      <h3 className="dip-enroll-card__title">
        🌐 Enroll in this Course
      </h3>

      <p className="dip-enroll-card__sub">
        Complete the enrollment form, pay the fees, and get instant access!
      </p>

      {diploma.price && (
        <div className="dip-enroll-card__price-box">
          {diploma.originalPrice && (
            <div className="dip-enroll-card__price-old">
              ₹{diploma.originalPrice}
            </div>
          )}

          <div className="dip-enroll-card__price-now">
            ₹{diploma.price}
          </div>

          <div className="dip-enroll-card__duration">
            ⏱ {diploma.duration}
          </div>
        </div>
      )}

      <button
        className="btn-enroll-diploma online"
        onClick={handleEnroll}
      >
        Enroll Now — Fill the Form →
      </button>

      <p className="dip-enroll-card__note">
        📞 Questions? Call: <strong>9420277373</strong>
      </p>
    </>
  ) : (
    <>
      <EnquiryForm
        preSelectedCourse={diploma.title}
        inline={true}
        onClose={() => {}}
      />
    </>
  )}

</div>

        </div>
      </section>

      {/* ── TABS ── */}
      <div className="dip-tabs-bar">
        <div className="dip-tabs-inner">
          {TABS.map(t => (
            <button key={t}
              className={`dip-tab ${tab === t ? "active" : ""}`}
              onClick={() => { setTab(t); if (t !== "Syllabus") setOpenMods({}); }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="dip-content">

        {/* ══ OVERVIEW ══ */}
        {tab === "Overview" && (
          <div>

            {/* What's Included */}
            {!diploma.isOnline && (diploma.includes || []).length > 0 && (
              <>
                <h2 className="dip-content-title">What's Included</h2>
                <div className="dip-includes-grid">
                  {diploma.includes.map(item => (
                    <div key={item.name} className="dip-include-card"
                      onClick={() => handleIncludeClick(item.name)}
                      style={{ cursor:"pointer" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                      <span className="dip-include-card__icon">{item.icon}</span>
                      <div className="dip-include-card__name">{item.name}</div>
                      <div className="dip-include-card__duration">📅 {item.duration}</div>
                      <div style={{ fontSize:"0.85rem", color:"#2563EB", marginTop:"0.5rem", fontWeight:600 }}>
                        View Syllabus →
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Basic Diploma subjects */}
            {(diploma.subjects || []).length > 0 && (
              <>
                <h2 className="dip-content-title">📚 What's Covered in This Course</h2>
                <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:20 }}>
                  {diploma.subjects.length} subjects · Click on a subject to see its modules
                </p>
                <div className="dip-subjects-overview">
                  {diploma.subjects.map((subj, si) => (
                    <div key={si}
                      className={`dip-subject-card ${subj.color || "grad-blue"}`}
                      onClick={() => {
                        setTab("Subjects");
                        setOpenSubj({ [si]: true });
                        setTimeout(() => document.querySelector(".dip-tabs-bar")?.scrollIntoView({ behavior:"smooth" }), 50);
                      }}
                      style={{ cursor:"pointer" }}>
                      <div className="dip-subject-card__icon">{subj.icon}</div>
                      <div className="dip-subject-card__name">{subj.name}</div>
                      <div className="dip-subject-card__count">
                        {subj.subCourses?.length > 0
                          ? `${subj.subCourses.length} sub-course${subj.subCourses.length > 1 ? "s" : ""}`
                          : "Core subject"}
                      </div>
                      <div className="dip-subject-card__cta">View Details →</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* What You'll Learn */}
            {(diploma.whatYouLearn || []).length > 0 && (
              <>
                <h2 className="dip-content-title" style={{ marginTop:40 }}>What You'll Learn</h2>
                <div className="dip-learn-grid">
                  {diploma.whatYouLearn.map(item => (
                    <div key={item} className="dip-learn-item">{item}</div>
                  ))}
                </div>
              </>
            )}

            {/* ── CERTIFICATE SECTION ── */}
            <div className="dip-certificate-section">
              <div className="dip-certificate-left">
                <h2 className="dip-content-title">🏆 Career Support That Works</h2>
                <div className="dip-certificate-points">
                  {[
                    { icon:"✅", title:"MKCL Certified Program", desc:"Government recognized certification accepted by top companies across India" },
                    { icon:"✅", title:"Placement Assistance", desc:"Our counsellors help you with job preparation, resume building and placement" },
                    { icon:"✅", title:"Verified Digital Certificate", desc:"Get a digital certificate with QR code verification after course completion" },
                  ].map(p => (
                    <div key={p.title} className="dip-certificate-point">
                      <span className="dip-certificate-point__icon">{p.icon}</span>
                      <div>
                        <strong>{p.title}</strong>
                        <p>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Preview Card */}
              <div className="dip-certificate-right">
                <div className="dip-cert-real">
              
          <img
          src={certificateImage}
          alt="Certificate"
          className="dip-cert-real__img"
         />
          

            
        </div>
              
                <p className="dip-cert-card__note">
                  🔒 Certificate includes QR code for  instant verification
                </p>
              </div>
            </div>

            {/* Online tags */}
            {diploma.isOnline && (diploma.tags || []).length > 0 && (
              <div style={{ marginTop:24, display:"flex", flexWrap:"wrap", gap:8 }}>
                {diploma.tags.map(t => (
                  <span key={t} style={{
                    padding:"4px 14px", background:"var(--primary-light)",
                    color:"var(--primary)", borderRadius:20, fontSize:13, fontWeight:600,
                  }}>{t}</span>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ══ SUBJECTS TAB ══ */}
        {tab === "Subjects" && (
          <div>
            <h2 className="dip-content-title">📚 Subjects & Sub-Courses</h2>
            <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:24 }}>
              Click on each subject to see its sub-courses and details
            </p>
            {(diploma.subjects || []).map((subj, si) => (
              <div key={si} className="dip-subject-accordion">
                <button
                  className={`dip-subject-accordion__header ${openSubj[si] ? "open" : ""}`}
                  onClick={() => toggleSubj(si)}>
                  <div className="dip-subject-accordion__left">
                    <span className="dip-subject-accordion__icon">{subj.icon}</span>
                    <span className="dip-subject-accordion__name">{subj.name}</span>
                  </div>
                  <div className="dip-subject-accordion__right">
                    <span className="dip-subject-accordion__count">
                      {subj.subCourses?.length > 0
                        ? `${subj.subCourses.length} sub-course${subj.subCourses.length > 1 ? "s" : ""}`
                        : "Core subject"}
                    </span>
                    <span className="dip-subject-accordion__arrow">{openSubj[si] ? "∧" : "∨"}</span>
                  </div>
                </button>
                {openSubj[si] && (
                  <div className="dip-subject-accordion__body">
                    {subj.subCourses?.length > 0 ? (
                      subj.subCourses.map((sc, sci) => (
                        <div key={sci} className="dip-subcourse-card">
                          <div className="dip-subcourse-card__header">
                            <div className="dip-subcourse-card__num">{sci + 1}</div>
                            <div className="dip-subcourse-card__info">
                              <div className="dip-subcourse-card__name">{sc.name}</div>
                              <div className="dip-subcourse-card__duration">⏱ {sc.duration}</div>
                            </div>
                          </div>
                          {sc.description && <p className="dip-subcourse-card__desc">{sc.description}</p>}
                        </div>
                      ))
                    ) : (
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
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ SYLLABUS ══ */}
        {tab === "Syllabus" && (
          <div>
            <h2 className="dip-content-title">Course Syllabus</h2>
            <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:20 }}>
              {diploma.syllabus?.length} modules · Click to expand chapters
            </p>
            {(diploma.syllabus || []).map((mod, i) => (
              <div key={i} id={`module-${i}`} className="accordion-module">
                <button
                  className={`accordion-module__header ${openMods[i] ? "open" : ""}`}
                  onClick={() => toggleMod(i)}>
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

        {/* ══ WHO SHOULD JOIN ══ */}
        {tab === "Who Should Join" && (
          <div>
            <h2 className="dip-content-title">Who Should Join?</h2>
            <ul className="dip-who-list">
              {(diploma.whoShouldJoin || []).map(item => <li key={item}>{item}</li>)}
            </ul>
            <div style={{
              background:"var(--primary-light)", border:"1.5px solid var(--primary)",
              borderRadius:"var(--radius-lg)", padding:"24px", marginTop:32, textAlign:"center",
            }}>
              <h3 style={{ fontFamily:"var(--font-heading)", fontSize:18, fontWeight:800, marginBottom:8 }}>
                Ready to start your journey?
              </h3>
              <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:16 }}>
                {diploma.isOnline ? "Enroll now — pay & get instant course access!" : "Enquire now — our counsellor will call you within 24 hours!"}
              </p>
              <button
                className={`btn-enroll-diploma ${diploma.isOnline ? "online" : ""}`}
                style={{ maxWidth:280, margin:"0 auto" }}
                onClick={handleEnroll}>
                {diploma.isOnline ? "Enroll Now →" : "Enquire Now →"}
              </button>
            </div>
          </div>
        )}

        <Link to="/courses" className="btn-back" style={{ marginTop:32, display:"inline-flex" }}>
          ← Back to Courses
        </Link>
      </div>

      {/* Enquiry Modal */}
      {showForm && !diploma.isOnline && (
        <EnquiryForm preSelectedCourse={diploma.title} onClose={() => setShowForm(false)} />
      )}

    </main>
  );
}