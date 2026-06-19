// ============================================================
//  SearchBar.jsx — Navbar Course Search
//  - Animated typing/erasing placeholder (cycles through course names)
//  - Fetches Diploma + Online courses from Firebase
//  - Live filter as user types
//  - Click a result → navigates to /diploma/:id
//  - Fully mobile responsive (icon-only on small screens, expands on tap)
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import { db } from "../../firebase";
import "./SearchBar.css";

const TYPE_SPEED   = 70;   // ms per character while typing
const ERASE_SPEED  = 35;   // ms per character while erasing
const HOLD_TIME    = 1300; // ms to hold full word before erasing

export default function SearchBar() {
  const navigate = useNavigate();
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

  const [courses,  setCourses]  = useState([]);   // all courses (diploma + online)
  const [query,    setQuery]    = useState("");
  const [open,     setOpen]     = useState(false); // dropdown open
  const [mobileOpen, setMobileOpen] = useState(false); // mobile expanded state
  const [placeholder, setPlaceholder] = useState("Search courses…");

  // ── Fetch all courses once ─────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [dipSnap, onSnap] = await Promise.all([
          getDocs(collection(db, "diplomaCourses")),
          getDocs(collection(db, "onlineCourses")),
        ]);
        const dip = dipSnap.docs.map(d => ({ id: d.id, ...d.data(), _type: "diploma" }));
        const on  = onSnap.docs.map(d => ({ id: d.id, ...d.data(), _type: "online" }));
        setCourses([...dip, ...on]);
      } catch (e) {
        console.error("SearchBar fetch error:", e);
      }
    })();
  }, []);

  // ── Animated typing/erasing placeholder ────────────────────
  useEffect(() => {
    if (courses.length === 0 || query) return; // stop animating once user types

    let courseIndex = 0;
    let charIndex   = 0;
    let typing      = true;
    let timeoutId;

    const names = courses.map(c => c.title).filter(Boolean);
    if (names.length === 0) return;

    const tick = () => {
      const current = names[courseIndex % names.length];

      if (typing) {
        charIndex++;
        setPlaceholder(`Search "${current.slice(0, charIndex)}"`);
        if (charIndex >= current.length) {
          typing = false;
          timeoutId = setTimeout(tick, HOLD_TIME);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        setPlaceholder(`Search "${current.slice(0, charIndex)}"`);
        if (charIndex <= 0) {
          typing = true;
          courseIndex++;
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, ERASE_SPEED);
      }
    };

    timeoutId = setTimeout(tick, TYPE_SPEED);
    return () => clearTimeout(timeoutId);
  }, [courses, query]);

  // ── Close dropdown on outside click ────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Filtered results ────────────────────────────────────────
  const results = query.trim()
    ? courses.filter(c =>
        c.title?.toLowerCase().includes(query.trim().toLowerCase()) ||
        c.track?.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (course) => {
    setQuery("");
    setOpen(false);
    setMobileOpen(false);
    navigate(`/diploma/${course.id}`);
  };

  const handleMobileIconClick = () => {
    setMobileOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className={`navsearch ${mobileOpen ? "navsearch--mobile-open" : ""}`} ref={wrapRef}>

      {/* Mobile collapsed icon */}
      <button
        className="navsearch__icon-btn"
        onClick={handleMobileIconClick}
        aria-label="Search courses"
      >
    <FiSearch/>
      </button>

      {/* Search input wrapper */}
      <div className="navsearch__box">
        <span className="navsearch__icon">
            <FiSearch/>
        </span>
        <input
          ref={inputRef}
          type="text"
          className="navsearch__input"
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            className="navsearch__clear"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {/* Mobile close button */}
        <button
          className="navsearch__mobile-close"
          onClick={() => { setMobileOpen(false); setQuery(""); }}
          aria-label="Close search"
        >
          ✕
        </button>
      </div>

      {/* Dropdown results */}
      {open && query.trim() && (
        <div className="navsearch__dropdown">
          {results.length > 0 ? (
            results.map(c => (
              <div
                key={c.id}
                className="navsearch__result"
                onClick={() => handleSelect(c)}
              >
                <span className="navsearch__result-icon">{c.icon || "📚"}</span>
                <div className="navsearch__result-info">
                  <div className="navsearch__result-title">{c.title}</div>
                  <div className="navsearch__result-meta">
                    {c.track} {c._type === "online" && <span className="navsearch__result-tag">🌐 Online</span>}
                  </div>
                </div>
                <span className="navsearch__result-arrow">→</span>
              </div>
            ))
          ) : (
            <div className="navsearch__no-results">
              😕 No courses found for "<strong>{query}</strong>"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
