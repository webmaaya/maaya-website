// ============================================================
//  About.jsx — MAAYA Enterprises About Page
//  Added: Affiliated With section at bottom
// ============================================================
import IAFlogo from "../../assets/logo/IAF logo.jpg";
import EUASlogo from "../../assets/logo/EUAS logo.png";
import UAFlogo from "../../assets/logo/UAF logo.jpeg";
import UTGEClogo from "../../assets/logo/Utgec logo.png";
import SkillIndialogo from "../../assets/logo/Skill india logo.png";
import NSDClogo from "../../assets/logo/Nsdc logo.png";
import Ycmoulogo from "../../assets/logo/Ycmou logo.jpg";
import Kliclogo from "../../assets/logo/Klic logo.png";
import Mkcllogo from "../../assets/logo/Mkcl logo.png";
import TrickFastlogo from "../../assets/logo/Trick Fast logo.png";
import AwardSlideshow from "../../Components/sections/AwardSlideshow";
import "./About.css";

const STATS = [
  { icon: "🎓", num: "50,000+", label: "Students Trained" },
  { icon: "📚", num: "20+",     label: "Courses Offered" },
  { icon: "🏆", num: "15+",     label: "Years Experience" },
  { icon: "🤝", num: "500+",    label: "Placement Partners" },
];

const MVV = [
  { icon: "🎯", title: "Our Mission", text: "To provide affordable, government-certified IT and skill development education to every student in Maharashtra — empowering them to build successful careers." },
  { icon: "🔭", title: "Our Vision",  text: "To become Maharashtra's most trusted skill development institution by 2030 — reaching every village and town with quality education." },
  { icon: "💎", title: "Our Values",  text: "Quality education, affordable fees, student-first approach, practical learning, career-focused outcomes and community empowerment." },
];

const TEAM = [
  { initials: "HC", name: "Harshad Chavan", role: "Founder & Owner", bio: "Visionary leader with a passion for empowering students through quality education and skill-based training for real-world success.", color: "#1D4ED8" },
  { initials: "HC", name: "Harshada Chavan",      role: "Academic Head",      bio:"Dedicated educator with a focus on student success and innovative teaching methods.", color: "#059669" },
  { initials: "SS", name: "Shreya Shirsat",      role: "Assistant Manager", bio: "Committed educator who simplifies complex concepts and supports students with practical, easy-to-understand teaching methods.", color: "#7C3AED" },
  { initials: "DN", name: "Durva Narvekar",      role: "Programming Professor", bio: "Passionate programming mentor helping students build strong coding skills through hands-on practice and real-world projects.", color: "#D97706" },
];

const ACHIEVEMENTS = [
  { icon: "🥇", text: "Best Computer Training Institute — Nashik 2023" },
  { icon: "🏅", text: "MKCL Excellence Award 2022" },
  { icon: "⭐", text: "98% Student Satisfaction Rate" },
  { icon: "🎖️", text: "ISO Certified Institute" },
  { icon: "📜", text: "Govt. of Maharashtra Approved" },
];

// ── Affiliations ──────────────────────────────────────────────
// TODO: Jab images ready hon toh:
//   1. src/assets/affiliations/ folder mein images daalo
//   2. import karo: import mkclLogo from "../assets/affiliations/mkcl.png"
//   3. image: mkclLogo set karo
const AFFILIATIONS = [
  { id: 1,  name: "MKCL",                                          icon: "🏛️", image: Mkcllogo },
  { id: 2,  name: "KLiC Courses",                                  icon: "📚", image: Kliclogo },
  { id: 3,  name: "Yashwantrao Chavan Maharashtra Open University", icon: "🎓", image: Ycmoulogo },
  { id: 4,  name: "NSDC — National Skill Development Corporation",  icon: "🇮🇳", image: NSDClogo },
  { id: 5,  name: "Skill India",                                    icon: "⭐", image: SkillIndialogo },
  { id: 6,  name: "EUAS — Euro Universal Accreditation Systems",    icon: "🌍", image: EUASlogo },
  { id: 7,  name: "UTGEC",                                          icon: "🏅", image: UTGEClogo },
  { id: 8,  name: "UAF — United Accreditation Foundation",         icon: "📋", image: UAFlogo },
  { id: 9,  name: "IAF — International Accreditation Forum",       icon: "🌐", image: IAFlogo },
  { id: 10, name: "TrickFast Digital Smart Learning",               icon: "💡", image: TrickFastlogo },
];

export default function About() {
  return (
    <main>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__badge">🏛️ About Us</div>
        <h1 className="about-hero__title">
          Empowering Maharashtra's Youth<br />Since <span>2010</span>
        </h1>
        <p className="about-hero__sub">
          MAAYA Enterprises is Maharashtra's leading IT education & skill development institute — shaping careers of 50,000+ students.
        </p>
      </section>

      {/* Our Story */}
      <section className="about-story">
        <div className="about-story__inner">
          <div className="about-story__content">
            <div className="section-badge">📖 Our Story</div>
            <h2>From a Small Centre to Maharashtra's Most Trusted Institute</h2>
            <p>MAAYA Enterprises was founded in 2010 with a simple mission — to bring quality computer education to every student in Maharashtra, regardless of their background or financial situation.</p>
            <p>What started as a small training centre in Sawantwadi has today grown into a full-scale educational institution offering 20+ courses in IT, skill development, business and language — all at affordable fees.</p>
            <p>/* TODO: Add more story content */</p>
          </div>
          <div className="about-story__visual">
            {STATS.map(s => (
              <div key={s.label} className="about-stat-card">
                <span className="about-stat-card__icon">{s.icon}</span>
                <span className="about-stat-card__num">{s.num}</span>
                <span className="about-stat-card__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="about-mvv">
        <div className="about-mvv__inner">
          <div className="section-header">
            <div className="section-badge">🌟 What Drives Us</div>
            <h2 className="section-title">Mission, Vision & Values</h2>
          </div>
          <div className="about-mvv__grid">
            {MVV.map(item => (
              <div key={item.title} className="mvv-card">
                <span className="mvv-card__icon">{item.icon}</span>
                <h3 className="mvv-card__title">{item.title}</h3>
                <p className="mvv-card__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team__inner">
          <div className="section-header">
            <div className="section-badge">👥 Our Team</div>
            <h2 className="section-title">Meet the People Behind MAAYA</h2>
          </div>
          <div className="about-team__grid">
            {TEAM.map(member => (
              <div key={member.role} className="team-card">
                <div className="team-card__avatar" style={{ background: member.color }}>
                  {member.initials}
                </div>
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
                <p className="team-card__bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="about-achievements">
        <div className="about-achievements__inner">
          <h2 className="about-achievements__title">Our Awards & Achievements</h2>
          <div className="about-achievements__grid">
            {ACHIEVEMENTS.map(a => (
              <div key={a.text} className="achievement-card">
                <span className="achievement-card__icon">{a.icon}</span>
                <p className="achievement-card__text">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Affiliated With ── */}
      <section className="about-affiliated">
        <div className="about-affiliated__inner">
          <div className="section-badge" style={{ marginBottom: 12 }}>🤝 Our Affiliations</div>
          <h2 className="about-affiliated__title">Affiliated With</h2>
          <p className="about-affiliated__sub">
            Recognized and certified by leading national & international bodies
          </p>
          <div className="about-affiliated__grid">
            {AFFILIATIONS.map(org => (
              <div key={org.id} className="affiliated-logo-card">
                {org.image ? (
                  <img src={org.image} alt={org.name} />
                ) : (
                  <div className="affiliated-logo-card__placeholder">
                    {org.icon}
                  </div>
                )}
                <span className="affiliated-logo-card__name">{org.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AwardSlideshow />

    </main>
  );
}
