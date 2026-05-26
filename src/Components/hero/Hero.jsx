// ============================================================
//  Hero.jsx — MAAYA Enterprises
//  Homepage hero section with headline, CTA, stats bar
// ============================================================

import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      {/* Badge */}
      {/* <div className="hero__badge">
        🎓 Maharashtra's Trusted Learning Platform
      </div> */}

      {/* Headline — TODO: change text if needed */}
      <h1 className="hero__title">
        Build Your Future With<br />
        <span>MAAYA</span>
      </h1>

      {/* Sub-headline — TODO: update as needed */}
      <p className="hero__sub">
        Professional IT & Skill Development courses designed for students,
        job seekers and working professionals across Maharashtra.
      </p>

      {/* CTA Buttons */}
      <div className="hero__btns">
        <Link to="/courses" className="hero__btn-primary">
          Explore Courses
        </Link>
        {/* TODO: Replace "#" with a demo video link or modal */}
        <a href="https://klic.mkcl.org/counseling/" target="_blank" rel="noreferrer noopener" className="hero__btn-outline">
           🎯 Free Career Counselling →
        </a>
      
      
      </div>

      {/* Stats Bar */}
      <div className="hero__stats">
        <div className="hero__stat">
          {/* TODO: Update numbers from real data */}
          <span className="hero__stat-num">50,000+</span>
          <span className="hero__stat-label">Students Enrolled</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-num">120+</span>
          <span className="hero__stat-label">Courses Available</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-num">100%</span>
          <span className="hero__stat-label">Satisfaction Rate</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-num">500+</span>
          <span className="hero__stat-label">Placement Partners</span>
        </div>
      </div>
    </section>
  );
}
