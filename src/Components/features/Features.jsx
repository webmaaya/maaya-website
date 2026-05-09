// ============================================================
//  Features.jsx — MAAYA Enterprises
//  "Why Choose Us" section — 6 feature cards
// ============================================================

import "./Features.css";

// TODO: Update text/icons as needed
const FEATURES = [ 
  { icon: "🏛️", title: "Govt. Certified Courses",  desc: "All courses affiliated with MKCL & Maharashtra Govt. for recognized certificates." },
  { icon: "👩‍💻", title: "Expert Instructors",       desc: "Learn from industry professionals with 10+ years of real-world experience." },
  { icon: "🎯", title: "100% Job Assistance",      desc: "Resume building, mock interviews & placement support included free." },
  { icon: "📱", title: "Learn Anywhere",            desc: "Online + offline classes. Study at your own pace on mobile or desktop." },
  { icon: "💳", title: "Affordable Fees + EMI",    desc: "EMI options available. Scholarships for deserving students from rural areas." },
  { icon: "🏆", title: "Award Winning Institute",  desc: "Best Computer Training Institute — Sindhudurg District 2025 & 2026." },
  {  icon: "🖥️", title: "Advanced Digital Lab",     desc: "Fully equipped computer lab with latest systems, high-speed internet & hands-on practical training environment." },
  {  icon: "📜", title: "Internship Opportunities",  desc: "Get real-world project experience with internship support to boost your career and confidence." }
];

export default function Features() {
  return (
    <section className="features">
      <div className="features__inner">

        {/* Header */}
        <div className="section-header">
          <div className="section-badge">✨ Why Choose Us</div>
          <h2 className="section-title">Why MAAYA Enterprises?</h2>
          <p className="section-sub">We go beyond certificates — we build careers</p>
        </div>

        {/* Cards Grid */}
        <div className="features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
