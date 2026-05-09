// ============================================================
//  PlacedStudents.jsx — "Our Placed Students" Section
//  Horizontal scroll — like Google Shopping cards
//  Desktop: arrow buttons | Mobile: swipe/drag
// ============================================================

import { useRef,useState,useEffect } from "react";
import "./PlacedStudents.css";
import vikrantPhoto from "../../assets/students/vikrantPhoto.jpg";
import aniketPhoto from "../../assets/students/aniketPhoto.jpg";
import atharvPhoto from "../../assets/students/atharvPhoto.jpg";
import shraddhaPhoto from "../../assets/students/shraddhaPhoto.jpg";
import raniPhoto from "../../assets/students/raniPhoto.jpg";
import milanPhoto from "../../assets/students/milanPhoto.jpg";
import maheshPhoto from "../../assets/students/maheshPhoto.jpg";
import savitaPhoto from "../../assets/students/savitaPhoto.jpg";
import prajyotiPhoto from "../../assets/students/prajyotiPhoto.jpg";
import ramchandraPhoto from "../../assets/students/ramchandraPhoto.jpg";
import tejasPhoto from "../../assets/students/tejasPhoto.jpg";
import yuvarajPhoto from "../../assets/students/yuvarajPhoto.jpg";
import virajPhoto from "../../assets/students/virajPhoto.jpg";
import gangotriPhoto from "../../assets/students/gangotriPhoto.jpg";
import harishPhoto from "../../assets/students/harishPhoto.jpg";
import prachitiPhoto from "../../assets/students/prachitiPhoto.jpg";
import lalitaPhoto from "../../assets/students/lalitaPhoto.jpg";
import eshaPhoto from "../../assets/students/eshaPhoto.jpg";
import swagatPhoto from "../../assets/students/swagatPhoto.jpg";
import sanketPhoto from "../../assets/students/sanketPhoto.jpg";



 // Example photo import
 // Example photo import

// ============================================================
//  STUDENTS DATA — 20 students
//  TODO: Replace EVERY student entry with real data:
//    name    → student ka naam
//    course  → course jo unhone kiya
//    role    → job role jisme place hua
//    company → company name (optional — rakhna hai toh "" mat karo)
//    photo   → import karke yahan daalo (niche example hai)
//
//  Photo kaise add karein:
//    1. Photo ko src/assets/students/ folder mein daalo
//       jaise: vikrant.jpg
//    2. Is file ke upar import karo:
//       import vikrantPhoto from "../../assets/students/vikrant.jpg";
//    3. Niche student object mein:
//       photo: vikrantPhoto
//
//  Abhi photo: null rakha hai — placeholder emoji dikhega
// ============================================================

const STUDENTS = [
  {
    id: 1,
    name:    "Vikrant Pednekar",          // ← real name from image
    course:  "Diploma in Accounting & Finance",
    role:    "Front Desk Officer",
    company: "",                           // TODO: add company if known
    photo:   vikrantPhoto,                         // TODO: import & add photo
  },
  {
    id: 2,
    name:    "Swagat Gawade",            // ← real name from image
    course:  "Diploma in Hardware & Networking",
    role:    "Network Technician",
    company: "",
    photo:   swagatPhoto,                        // TODO: import & add photo
  },
  {
    id: 3,
    name:    "Prachiti Varne",
    course:  "Diploma in Designing",
    role:    "Sales Marketting ",
    company: "",
    photo:   prachitiPhoto,
  },
  {
    id: 4,
    name:    "Savita Narvekar",
    course:  "Diploma in Full Stack Development",
    role:    "Accountant",
    company: "",
    photo:   savitaPhoto,
  },
  {
    id: 5,
    name:    "Aniket Masurkar",
    course:  "Diploma in Accounting & Finance",
    role:    "Accountant",
    company: "",
    photo:   aniketPhoto,
  },
  {
    id: 6,
    name:    "Tejas Gawas",
    course:  "Diploma in Hardware & Networking",
    role:    "IT Support-L1",
    company: "",
    photo:   tejasPhoto,
  },
  {
    id: 7,
    name:    "Ramchandra Madkholkar",
    course:  "Diploma in Designing",
    role:    "Auto Desk Operator",
    company: "",
    photo:   ramchandraPhoto,
  },
  {
    id: 8,
    name:    "Esha Rane",
    course:  "Diploma in Full Stack Development",
    role:    "Call Center Executive",
    company: "",
    photo:   eshaPhoto,
  },
  {
    id: 9,
    name:    "Lalita Naik",
    course:  "Diploma in Accounting & Finance",
    role:    "Data Entry Operator",
    company: "",
    photo:   lalitaPhoto,
  },
  {
    id: 10,
    name:    "Mahesh Malwade",
    course:  "Diploma in Hardware & Networking",
    role:    "IT Support-L2",
    company: "",
    photo:   maheshPhoto,
  },
  {
    id: 11,
    name:    "Rani Sawant",
    course:  "Diploma in Designing",
    role:    "DTP Operator",
    company: "",
    photo:   raniPhoto,
  },
  {
    id: 12,
    name:    "Shraddha Bandekar",
    course:  "Diploma in Full Stack Development",
    role:    "Software Tester",
    company: "",
    photo:   shraddhaPhoto,
  },
  {
    id: 13,
    name:    "Milan Sawant",
    course:  "Diploma in Accounting & Finance",
    role:    "Accountant",
    company: "",
    photo:   milanPhoto,
  },
  {
    id: 14,
    name:    "Viraj Bondre",
    course:  "Diploma in Hardware & Networking",
    role:    "Network Technician",
    company: "",
    photo:   virajPhoto,
  },
  {
    id: 15,
    name:    "Harish Sawant",
    course:  "Diploma in Designing",
    role:    "DTP Operator",
    company: "",
    photo:   harishPhoto,
  },
  {
    id: 16,
    name:    "Prajyoti Gawade",
    course:  "Diploma in Accounting & Finance",
    role:    "Data Entry Operator",
    company: "",
    photo:   prajyotiPhoto,
  },
  {
    id: 17,
    name:    "Yuvaraj Sadekar",
    course:  "Diploma in Hardware & Networking",
    role:    "IT Support-L2",
    company: "",
    photo:   yuvarajPhoto,
  },
  {
    id: 18,
    name:    "Ahtharv Thakur",
    course:  "Diploma in Designing",
    role:    "DTP Operator",
    company: "",
    photo:   atharvPhoto,
  },
  {
    id: 19,
    name:    "Gangaotri Shetakar",
    course:  "Diploma in Accounting & Finance",
    role:    "Accountant",
    company: "",
    photo:   gangotriPhoto,
  },
  {
    id: 20,
    name:    "Sanket Konduskar",
    course:  "Diploma in Hardware & Networking",
    role:    "Network Technician-L1",
    company: "",
    photo:   sanketPhoto,
  },
];

// ============================================================
//  Component
// ============================================================
export default function PlacedStudents() {
  const trackRef   = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // ── Intersection Observer — animate when section enters viewport ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold: 0.15 } // trigger when 15% visible
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Arrow scroll ──────────────────────────────────────────
  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: dir === "right" ? 640 : -640,
      behavior: "smooth",
    });
  };

  // ── Mouse drag scroll ─────────────────────────────────────
  let isDown = false, startX = 0, scrollLeft = 0;

  const onMouseDown = (e) => {
    isDown     = true;
    startX     = e.pageX - trackRef.current.offsetLeft;
    scrollLeft = trackRef.current.scrollLeft;
  };
  const onMouseLeave = () => { isDown = false; };
  const onMouseUp    = () => { isDown = false; };
  const onMouseMove  = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      className={`placed ${visible ? "visible" : ""}`}
      ref={sectionRef}
    >
      {/* ── Header ── */}
      <div className="placed__header">
        <div>
          <div className="section-badge">🎓 Success Stories</div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Our Placed Students
          </h2>
          <p className="placed__count">
            400+ students successfully placed
          </p>
        </div>
      </div>

      {/* ── Scrollable Track ── */}
      <div className="placed__track-wrapper">

        {/* Left Arrow */}
        <button
          className="placed__arrow placed__arrow--left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Cards */}
        <div
          className="placed__track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {STUDENTS.map((student) => (
            <div key={student.id} className="student-card">

              {/* Photo */}
              <div className="student-card__photo-wrap">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="student-card__photo"
                    draggable="false"
                  />
                ) : (
                  <div className="student-card__photo-placeholder">👤</div>
                )}
                <span className="placed-badge">✓ Placed</span>
              </div>

              {/* Info */}
              <div className="student-card__body">
                <h3 className="student-card__name">{student.name}</h3>
                <span className="student-card__course">{student.course}</span>
                <div className="student-card__divider" />
                <div className="student-card__role-row">
                  <span className="student-card__role">💼 {student.role}</span>
                </div>
                {student.company && (
                  <p className="student-card__company">🏢 {student.company}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="placed__arrow placed__arrow--right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
