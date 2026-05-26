// ============================================================
//  AwardSlideshow.jsx — Awards & Photos Slideshow
//  4 placeholder slots — tu images baad mein daalega
//
//  Image add karna ho toh:
//    1. src/assets/slideshow/ folder mein image daalo
//    2. Import karo: import photo1 from "../../assets/slideshow/photo1.jpg"
//    3. SLIDES array mein image: photo1 set karo
// ============================================================

import { useState, useEffect, useCallback } from "react";
import photo1 from "../../assets/slideshow/photo1.jpeg"; // TODO: Add real images in assets folder and update imports
import photo2 from "../../assets/slideshow/photo2.png";
import photo3 from "../../assets/slideshow/photo3.jpg";
import photo4 from "../../assets/slideshow/photo4.jpg";
import photo5 from "../../assets/slideshow/photo5.jpeg";
import photo6 from "../../assets/slideshow/photo6.jpeg";
import photo7 from "../../assets/slideshow/photo7.jpeg";
import photo8 from "../../assets/slideshow/photo8.jpeg";

import "./AwardSlideshow.css";

// ── Slides Data — 4 slots ─────────────────────────────────────
// TODO: Images ready hone pe:
//   import photo1 from "../../assets/slideshow/photo1.jpg";
//   Phir: { id:1, image: photo1, alt: "Award Ceremony 2023" }
const SLIDES = [
  { id: 1, image: photo1, alt: "Award Photo 1", label: "Award Ceremony" },
  { id: 2, image: photo2, alt: "Award Photo 2", label: "Achievement" },
  { id: 3, image: photo3, alt: "Award Photo 3", label: "Recognition" },
  { id: 4, image: photo4, alt: "Award Photo 4", label: "Celebration" },
  { id: 5, image: photo5, alt: "Award Photo 5", label: "Milestone" },
  { id: 6, image: photo8, alt: "Award Photo 6", label: "Success" },
  { id: 7, image: photo7, alt: "Award Photo 7", label: "Excellence" },
  { id: 8, image: photo6, alt: "Award Photo 8", label: "Pride" },
];

export default function AwardSlideshow({background = false}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrent(c => (c === 0 ? SLIDES.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent(c => (c === SLIDES.length - 1 ? 0 : c + 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  // Autoplay with pause on hover
  useEffect(() => {
  if (isPaused) return;

  const interval = setInterval(() => {
    next();
  }, 3500);

  return () => clearInterval(interval);
}, [next, isPaused]);

  return (
    <section>
      {/* Header */}
       {/* Header */}
{!background && (
  <div className="about-slideshow__header">
    <div className="section-badge" style={{ marginBottom: 12 }}>
      📸 Our Moments
    </div>

    <h2 className="section-title">
      Awards & Achievements
    </h2>

    <p className="section-sub">
      Celebrating our journey of excellence in education
    </p>
  </div>
)}

      {/* Slideshow — full width */}
      <div className="slideshow"
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
  onTouchStart={() => setIsPaused(true)}
  onTouchEnd={() => setIsPaused(false)}>

        {/* Track */}
        <div
          className="slideshow__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div key={slide.id} className="slideshow__slide">
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="slideshow__img"
                  draggable="false"
                />
              ) : (
                <div className="slideshow__placeholder">
                  <span className="slideshow__placeholder-icon">🏆</span>
                  <span className="slideshow__placeholder-text">{slide.label}</span>
                  <span className="slideshow__placeholder-num">Photo {i + 1} of {SLIDES.length}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button className="slideshow__arrow slideshow__arrow--left" onClick={prev} aria-label="Previous">
          ‹
        </button>

        {/* Right Arrow */}
        <button className="slideshow__arrow slideshow__arrow--right" onClick={next} aria-label="Next">
          ›
        </button>

        {/* Dots */}
        <div className="slideshow__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`slideshow__dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
