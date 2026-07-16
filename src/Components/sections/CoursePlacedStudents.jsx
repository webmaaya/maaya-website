// ============================================================
//  CoursePlacedStudents.jsx
//  Shows placed students for a specific course track
//  Continuous horizontal auto-scroll loop
//  Usage: <CoursePlacedStudents track="Accounting" />
//
//  To add images later:
//    1. Import: import vikrantPhoto from "../../assets/placed/vikrant.jpg"
//    2. Add to student object: photo: vikrantPhoto
// ============================================================
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
import shubhamPhoto from "../../assets/students/shubhamPhoto.jpeg";
import karanPhoto from "../../assets/students/karanPhoto.jpeg";
import chaitanyaPhoto from "../../assets/students/chaitanyaPhoto.jpeg";
import athangPhoto from "../../assets/students/athangPhoto.jpeg";
import rajPhoto from "../../assets/students/rajPhoto.jpg";
import sujalPhoto from "../../assets/students/sujalPhoto.jpg";
import "./CoursePlacedStudents.css";
import { track } from "@vercel/analytics";

// ── All placed students — grouped by track ────────────────────
const ALL_PLACED = [

  // ── Accounting ──────────────────────────────────────────────
  {
    track: "Accounting", photo: vikrantPhoto,
  },
  {
    track: "Accounting", photo: aniketPhoto                         ,
  },
  {
    track: "Accounting", photo: lalitaPhoto,
  },
  {
    track: "Accounting", photo: savitaPhoto,
  },
    {
      track: "Accounting",photo:prajyotiPhoto,
    },
      {
        track:"Accounting",photo:gangotriPhoto,
      },
      {
        track:"Accounting",photo: milanPhoto,
      },

  // ── Programming ─────────────────────────────────────────────
 
   {
    track: "Programming", photo: eshaPhoto,
    projectLink: "https://jovial-bonbon-0668dc.netlify.app/",
  },
   {
    track: "Programming", photo: rajPhoto,
    projectLink: "https://github.com/chaitanya123",
  },
  {
    track: "Programming", photo: chaitanyaPhoto,
    projectLink: "https://chaitanya-projectfolio.netlify.app",
  },
   {
    track: "Programming", photo: sujalPhoto,
    projectLink: "https://glittering-figolla-cefbe1.netlify.app/",
   },
  {
    track: "Programming", photo: athangPhoto,
     projectLink: "https://spontaneous-taiyaki-f088ee.netlify.app/",
  },
    {
    track: "Programming", photo: karanPhoto,
    projectLink: "https://jovial-bonbon-0668dc.netlify.app/",
  },
  {
    track: "Programming", photo: shraddhaPhoto,
    projectLink: "https://glittering-figolla-cefbe1.netlify.app/",
    
  },

  // ── IT Hardware ─────────────────────────────────────────────
  {
    track: "IT Hardware", photo: virajPhoto,
  },
  {
    track: "IT Hardware", photo: yuvarajPhoto,
  },
  {
    track: "IT Hardware", photo: sanketPhoto,
  },
     {
    track:"IT Hardware",photo: tejasPhoto,
     },
      {
        track:"IT Hardware", photo: swagatPhoto,                        // TODO: import & add photo
       },
         {
           photo:   maheshPhoto,
         },



  // ── Designing ───────────────────────────────────────────────
  {
    track: "Designing", photo: atharvPhoto,
  },
    {
      track:"Designing",photo: prachitiPhoto,
    },
      {
        track:"Designing",photo:  raniPhoto,
      },
      {
       track:"Designing",photo:   harishPhoto,
      },
        {
        track:"Designing",photo:   ramchandraPhoto,
        },
        {
        track:"Designing",photo:shubhamPhoto,
        },

  // ── Work From Home ───────────────────────────────────────────
//   {
//     id: 13, name: "Gangotri Bhoskar",
//     course: "Work From Home Program",
//     role: "Data Entry Operator", company: "",
//     track: "Work From Home", photo: null,
//   },
//   {
//     id: 14, name: "Rani Parab",
//     course: "Work From Home Program",
//     role: "Remote Assistant", company: "",
//     track: "Work From Home", photo: null,
//   },

  // ── IT & Computer / Online ───────────────────────────────────
  {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784179137/AyushP_t31v9y.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=101",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181600/DipaS_uddchh.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=104",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181600/GiteshN_vqmnog.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=106",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181600/ChaitadnyaZ_tu4mij.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=103",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181600/GaurangS_lydyfc.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=105",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181610/MahekS_digjnq.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=110",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181601/ChaitanyaN_jlyj1m.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=102",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181611/MaitrayiS_m9wbwe.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=111",
  },
   {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181604/HimanshuV_nq8gjj.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=107",
  },
    {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181613/SaishriP_w8o6ei.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=117",
  },
      {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181609/NeelB_tbckkb.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=114",
  },
     {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181612/PriyaD_myzrco.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=116",
  },
    {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181617/ShlokS_ztu8yq.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=118",
  },
    {
    track: "IT and Computer", photo: "https://res.cloudinary.com/dgtzaqsze/image/upload/v1784181619/ShreyasG_sjlhrl.jpg",
    projectLink: "https://ms-cit-portfolio-hub.vercel.app/student.html?id=119",
  },

];

// ── Track aliases — map diploma.track → our student track keys ─
const TRACK_MAP = {
  "Accounting":       "Accounting",
  "Programming":      "Programming",
  "IT Hardware":      "IT Hardware",
  "Designing":        "Designing",
  "Work From Home":   "Work From Home",
  "IT and Computer":  "IT and Computer",
  "Professional Courses": "IT & Computer",
};


// ── Avatar initials color palette ────────────────────────────
const AVATAR_COLORS = [
  "#2563EB", "#7C3AED", "#059669", "#D97706",
  "#DC2626", "#0891B2", "#BE185D", "#16A34A",
];

export default function CoursePlacedStudents({ track }) {
  // Filter students by track
  const mappedTrack = TRACK_MAP[track] || track;
  const students = ALL_PLACED.filter(s => s.track === mappedTrack);

  // Need at least 1 student to show section
  if (students.length === 0) return null;

const isMscit = mappedTrack === "IT and Computer";

const sectionTitle = isMscit
  ? "Congratulations On Completing MS-CIT Course"
  : "Congratulations On Successful Placement";

const sectionSub = isMscit
  ? "Students who successfully completed the MS-CIT program"
  : "Students who completed this program and got placed";


  // Duplicate for seamless infinite loop (need at least 6 cards)
  const loopStudents = students.length < 4
    ? [...students, ...students, ...students, ...students]
    : [...students, ...students];

  const getInitials = (name) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="cps">
      {/* Header */}
      <div className="cps__header">
        <div className="cps__badge">🎓 Success Stories</div>
        <h2 className="cps__title">{sectionTitle}</h2>
        <p className="cps__sub">{sectionSub}</p>
      </div>

      {/* Scroll track */}
      <div className="cps__overflow">
        <div className="cps__track">
          {loopStudents.map((student, idx) => (
            <div key={`${student.id}-${idx}`} className="cps__card">

              {/* Photo or Avatar */}
              <div className="cps__card-photo">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="cps__card-img"
                  />
                ) : (
                  <div
                    className="cps__card-avatar"
                    style={{
                      background: AVATAR_COLORS[student.id % AVATAR_COLORS.length]
                    }}
                  >
                    {getInitials(student.name)}
                  </div>
                )}
                {! isMscit && (
                  <span className="cps__card-placed">✓ PLACED</span>
                )}
              </div>

              {/* Info */}
              <div className="cps__card-body">
                {/* <h3 className="cps__card-name">{student.name}</h3> */}
                {/* <span className="cps__card-course">{student.course}</span> */}
                <div className="cps__card-divider" />
                {/* <div className="cps__card-role">{student.role}</div> */}
                {/* View Projects button — sirf tab dikhe jab link ho */}
{student.projectLink && (
  <a
    href={student.projectLink}
    target="_blank"
    rel="noopener noreferrer"
    className="cps__card-project-btn"
    onClick={e => e.stopPropagation()}
  >
    🔗 View My Projects
  </a>
)}
                {student.company && (
                  <p className="cps__card-company">🏢 {student.company}</p>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}