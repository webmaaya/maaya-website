// ============================================================
//  Hero.jsx — MAAYA Enterprises
//  Left : Headline + CTAs + Stats
//  Right: Auto-sliding ads from Firebase "heroAds" collection
//         • 40 sec per ad (change AD_DURATION below)
//         • Pauses on hover / click / touch / keyboard focus
//         • Dots with progress bar, arrows, swipe on mobile
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./Hero.css";

const AD_DURATION = 40;      // seconds each ad stays visible
const TOUCH_RESUME_MS = 6000; // resume auto-slide this long after a touch

const getYouTubeId = (url = "") => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};


export default function Hero() {
  const [ads, setAds] = useState([]);

  // ── Fetch ALL active ads ─────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "heroAds"));
       const today = new Date().toLocaleDateString("en-CA");

        const active = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter(
            (a) =>
              a.active &&
              (!a.startDate || a.startDate <= today) &&
              (!a.endDate || a.endDate >= today)
          )
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setAds(active);
      } catch (e) {
        console.error("Hero ad fetch error:", e);
      }
    })();
  }, []);

  return (
    <section className="hero">
      <div className="hero__inner">
        {/* ── LEFT — Main content ── */}
        <div className="hero__left">
          <h1 className="hero__title">
            Build Your Future With
            <br />
            <span>MAAYA</span>
          </h1>

          <p className="hero__sub">
            Professional IT & Skill Development courses designed for students,
            job seekers and working professionals across Maharashtra.
          </p>

          <div className="hero__btns">
            <Link to="/courses" className="hero__btn-primary">
              Explore Courses
            </Link>
            <a
              href="https://ms-cit-portfolio-hub.vercel.app/"
              target="_blank"
              rel="noreferrer noopener"
              className="hero__btn-outline"
            >
              🧠 Explore Our Creative Students Works →
            </a>
          </div>

          {/* Stats Bar */}
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">52,430+</span>
              <span className="hero__stat-label">Students Enrolled</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">120+</span>
              <span className="hero__stat-label">Courses Available</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">500+</span>
              <span className="hero__stat-label">Placement Partners</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Ad Slider ── */}
        {ads.length > 0 && (
          <div className="hero__right">
            <AdSlider ads={ads} />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Ad Slider ─────────────────────────────────────────────────
function AdSlider({ ads }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swiped = useRef(false);
  const resumeTimer = useRef(null);

  const count = ads.length;
  const multiple = count > 1;

  // keep index valid if ads list changes
  useEffect(() => {
    if (current >= count) setCurrent(0);
  }, [count, current]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const goTo = useCallback(
    (i) => setCurrent(((i % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // ── Pause handlers ──
  const pause = () => {
    clearTimeout(resumeTimer.current);
    setPaused(true);
  };
  const resume = () => {
    clearTimeout(resumeTimer.current);
    setPaused(false);
  };

  // ── Touch / swipe ──
  const onTouchStart = (e) => {
    pause();
    swiped.current = false;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current !== null && multiple) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        swiped.current = true;
        dx < 0 ? next() : prev();
      }
    }
    touchStartX.current = null;
    resumeTimer.current = setTimeout(() => setPaused(false), TOUCH_RESUME_MS);
  };

  // stop the link from opening after a swipe
  const onClickCapture = (e) => {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      swiped.current = false;
      return;
    }
    pause(); // click = stop sliding
  };

  return (
    <div
      className="ad-slider"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClickCapture={onClickCapture}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured offers"
    >
      <div className="ad-slider__viewport">
        <div
          className="ad-slider__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {ads.map((ad, i) => (
            <div
              className="ad-slider__slide"
              key={ad.id}
              aria-hidden={i !== current}
              role="group"
              aria-label={`${i + 1} of ${count}`}
            >
              <HeroAd ad={ad} active={i === current} />
            </div>
          ))}
        </div>

        {multiple && (
          <>
            <button
              type="button"
              className="ad-slider__arrow ad-slider__arrow--prev"
              onClick={prev}
              aria-label="Previous ad"
            >
              ‹
            </button>
            <button
              type="button"
              className="ad-slider__arrow ad-slider__arrow--next"
              onClick={next}
              aria-label="Next ad"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Tracking dots (active dot fills over AD_DURATION, then slides) */}
      {multiple && (
        <div className="ad-slider__dots" role="tablist">
          {ads.map((ad, i) => (
            <button
              type="button"
              key={ad.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to ad ${i + 1}`}
              className={`ad-slider__dot ${i === current ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            >
              {i === current && (
                <span
                  key={`fill-${current}`}
                  className={`ad-slider__dot-fill ${paused ? "is-paused" : ""}`}
                  style={{ animationDuration: `${AD_DURATION}s` }}
                  onAnimationEnd={next}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single Hero Ad ────────────────────────────────────────────
function HeroAd({ ad, active }) {
  const isExternal = ad.link?.startsWith("http");
  const tabIndex = active ? 0 : -1;
  const ytId = getYouTubeId(ad.videoUrl); 

  const content = (
    <div className="hero-ad">
      {ad.badge && <span className="hero-ad__badge">{ad.badge}</span>}

      {ytId ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 12,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {active && (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0`}
              title={ad.title || "Video"}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          )}
        </div>
      ) : ad.imageUrl ? (
        <div className="hero-ad__img-wrap">
          <img
            src={ad.imageUrl}
            alt={ad.title || "Advertisement"}
            className="hero-ad__img"
            draggable="false"
          />
        </div>
      ) : (
        <div className="hero-ad__visual">
          <span className="hero-ad__icon">{ad.icon || "🎓"}</span>
        </div>
      )}

      <div className="hero-ad__body">
        {ad.title && <h3 className="hero-ad__title">{ad.title}</h3>}
        {ad.description && <p className="hero-ad__desc">{ad.description}</p>}

        {ad.note && <div className="hero-ad__note">📌 {ad.note}</div>}

        {ad.btnText && <div className="hero-ad__btn">{ad.btnText} →</div>}
      </div>

      {ad.endDate && (
        <div className="hero-ad__expiry">⏳ Valid till {ad.endDate}</div>
      )}
    </div>
  );

  if (!ad.link) return <div className="hero-ad-wrap">{content}</div>;

  if (isExternal)
    return (
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-ad-wrap"
        tabIndex={tabIndex}
        draggable="false"
      >
        {content}
      </a>
    );

  return (
    <Link to={ad.link} className="hero-ad-wrap" tabIndex={tabIndex} draggable="false">
      {content}
    </Link>
  );
}