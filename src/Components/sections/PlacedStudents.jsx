// ============================================================
//  PlacedStudents.jsx — "Our Placed Students" Section
//  Premium Carousel: Center focus, blur sides, auto-loop
// ============================================================

import { useRef, useState, useEffect } from "react";
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
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ── Intersection Observer — animate when section enters viewport ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Auto-loop carousel (5 seconds = slower) ────────────────────────────────────
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDENTS.length);
    }, 5000); // 5 seconds — slower animation

    return () => clearInterval(interval);
  }, [paused]);

  // ── Get position for card ─────────────────────────────
  const getPosition = (index) => {
    const total = STUDENTS.length;

    if (index === activeIndex) return "active";
    if (index === (activeIndex - 1 + total) % total) return "left";
    if (index === (activeIndex + 1) % total) return "right";

    return "hidden";
  };

  return (
    <section
      className={`placed ${visible ? "visible" : ""}`}
      ref={sectionRef}
    >
      {/* ── Header ── */}
      <div className="placed__header">
        <div className="section-badge">🎓 SUCCESS STORIES</div>
        <h2 className="section-title">Our Success Highlights</h2>
        <p className="placed__count">500+ students successfully placed</p>
      </div>

      {/* ── Carousel ── */}
      <div className="carousel">
        {/* Cards */}
        {STUDENTS.map((student, index) => (
          <div
            key={student.id}
            className={`student-card ${getPosition(index)}`}
            onMouseEnter={() => {
              if (getPosition(index) === "active") setPaused(true);
            }}
            onMouseLeave={() => {
              if (getPosition(index) === "active") setPaused(false);
            }}
            onTouchStart={() => {
              if (getPosition(index) === "active") setPaused(true);
            }}
            onTouchEnd={() => {
              if (getPosition(index) === "active") setPaused(false);
            }}
          >
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
              <div className="student-card__role">💼 {student.role}</div>
              {student.company && (
                <p className="student-card__company">🏢 {student.company}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}