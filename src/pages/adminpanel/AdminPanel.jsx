// ============================================================
//  AdminPanel.jsx — MAAYA Enterprises Admin Panel
//  Route: /admin
//  Features:
//    ✅ Add new course with all details
//    ✅ Duration-based pricing (30h / 60h / 90h / 120h)
//    ✅ Syllabus builder — modules + chapters (accordion)
//    ✅ Edit existing course
//    ✅ Delete course
//    ✅ All data saved to Firebase Firestore
//    ✅ Website auto-updates when course added/edited
// ============================================================

import { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query
} from "firebase/firestore";
import { db } from "../../firebase";
import "./AdminPanel.css";

// ── Categories (same as website) ─────────────────────────────
const CATEGORIES = [
  "IT & Computer", "Business", "Skill Development",
  "Language", "Design", "Finance",
];

// ── Gradient options for course card thumbnail ────────────────
const GRADIENTS = [
  { label: "Blue",   value: "grad-blue" },
  { label: "Purple", value: "grad-purple" },
  { label: "Green",  value: "grad-green" },
  { label: "Orange", value: "grad-orange" },
  { label: "Teal",   value: "grad-teal" },
  { label: "Pink",   value: "grad-pink" },
];

// ── Badge options ─────────────────────────────────────────────
const BADGES = ["", "Most Popular", "Trending", "New", "Hot"];

// ── Empty form state ──────────────────────────────────────────
const EMPTY_FORM = {
  title:        "",
  subtitle:     "",
  category:     "IT & Computer",
  level:        "Beginner",
  icon:         "📚",
  gradient:     "grad-blue",
  badge:        "",
  isPremium:    false,
  description:  "",
  overview:     "",
  tags:         "",           // comma-separated
  highlights:   "",           // comma-separated
  eligibility:  "",           // comma-separated
  features:     "",           // comma-separated
  // Duration pricing — each duration can have its own price
  durations: {
    "30":  { enabled: false, price: "", originalPrice: "" },
    "60":  { enabled: false, price: "", originalPrice: "" },
    "90":  { enabled: false, price: "", originalPrice: "" },
    "120": { enabled: false, price: "", originalPrice: "" },
  },
  // Syllabus — array of { moduleTitle, chapters: [string] }
  syllabus: [
    { moduleTitle: "", chapters: [""] }
  ],
};

// ── Helper — parse comma string to array ──────────────────────
const parseComma = (str) =>
  str.split(",").map(s => s.trim()).filter(Boolean);

export default function AdminPanel() {
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [courses,    setCourses]    = useState([]);
  const [editId,     setEditId]     = useState(null); // Firestore doc id when editing
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [toast,      setToast]      = useState(null); // { msg, type }

  // ── Fetch courses from Firestore ──────────────────────────
  const fetchCourses = async () => {
    setFetching(true);
    try {
      const q    = query(collection(db, "courses"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      // First time — no index yet, fetch without order
      try {
        const snap = await getDocs(collection(db, "courses"));
        setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(err) {
        showToast("Error fetching courses", "error");
      }
    }
    setFetching(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Form field change ─────────────────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // ── Duration pricing change ───────────────────────────────
  const handleDuration = (hours, field, value) => {
    setForm(prev => ({
      ...prev,
      durations: {
        ...prev.durations,
        [hours]: { ...prev.durations[hours], [field]: value }
      }
    }));
  };

  // ── Syllabus module title change ──────────────────────────
  const handleModuleTitle = (idx, value) => {
    const updated = [...form.syllabus];
    updated[idx].moduleTitle = value;
    setForm(prev => ({ ...prev, syllabus: updated }));
  };

  // ── Syllabus chapter change ───────────────────────────────
  const handleChapter = (mIdx, cIdx, value) => {
    const updated = [...form.syllabus];
    updated[mIdx].chapters[cIdx] = value;
    setForm(prev => ({ ...prev, syllabus: updated }));
  };

  // ── Add chapter to module ─────────────────────────────────
  const addChapter = (mIdx) => {
    const updated = [...form.syllabus];
    updated[mIdx].chapters.push("");
    setForm(prev => ({ ...prev, syllabus: updated }));
  };

  // ── Remove chapter ────────────────────────────────────────
  const removeChapter = (mIdx, cIdx) => {
    const updated = [...form.syllabus];
    updated[mIdx].chapters.splice(cIdx, 1);
    setForm(prev => ({ ...prev, syllabus: updated }));
  };

  // ── Add new module ────────────────────────────────────────
  const addModule = () => {
    setForm(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { moduleTitle: "", chapters: [""] }]
    }));
  };

  // ── Remove module ─────────────────────────────────────────
  const removeModule = (idx) => {
    const updated = form.syllabus.filter((_, i) => i !== idx);
    setForm(prev => ({ ...prev, syllabus: updated.length ? updated : [{ moduleTitle: "", chapters: [""] }] }));
  };

  // ── Build Firestore document from form ────────────────────
  const buildDoc = () => ({
    title:       form.title.trim(),
    subtitle:    form.subtitle.trim(),
    category:    form.category,
    level:       form.level,
    icon:        form.icon.trim() || "📚",
    gradient:    form.gradient,
    badge:       form.badge,
    isPremium:   form.isPremium,
    description: form.description.trim(),
    overview:    form.overview.trim(),
    tags:        parseComma(form.tags),
    highlights:  parseComma(form.highlights),
    eligibility: parseComma(form.eligibility),
    features:    parseComma(form.features),
    durations:   form.durations,
    syllabus:    form.syllabus.map(m => ({
      moduleTitle: m.moduleTitle.trim(),
      chapters:    m.chapters.map(c => c.trim()).filter(Boolean),
    })).filter(m => m.moduleTitle),
    students:    0,
    rating:      4.5,
    reviews:     0,
    createdAt:   serverTimestamp(),
  });

  // ── Submit — Add or Update ────────────────────────────────
  const handleSubmit = async () => {
    if (!form.title.trim()) return showToast("Course title required!", "error");
    const enabledDurations = Object.values(form.durations).filter(d => d.enabled);
    if (enabledDurations.length === 0) return showToast("At least 1 duration required!", "error");

    setLoading(true);
    try {
      const data = buildDoc();
      if (editId) {
        // Update existing
        await updateDoc(doc(db, "courses", editId), { ...data, createdAt: undefined });
        showToast("✅ Course updated successfully!");
      } else {
        // Add new
        await addDoc(collection(db, "courses"), data);
        showToast("✅ Course added to website!");
      }
      resetForm();
      fetchCourses();
    } catch (e) {
      showToast("Error saving course: " + e.message, "error");
    }
    setLoading(false);
  };

  // ── Load course into form for editing ─────────────────────
  const handleEdit = (course) => {
    setEditId(course.id);
    setForm({
      title:       course.title || "",
      subtitle:    course.subtitle || "",
      category:    course.category || "IT & Computer",
      level:       course.level || "Beginner",
      icon:        course.icon || "📚",
      gradient:    course.gradient || "grad-blue",
      badge:       course.badge || "",
      isPremium:   course.isPremium || false,
      description: course.description || "",
      overview:    course.overview || "",
      tags:        (course.tags || []).join(", "),
      highlights:  (course.highlights || []).join(", "),
      eligibility: (course.eligibility || []).join(", "),
      features:    (course.features || []).join(", "),
      durations:   course.durations || EMPTY_FORM.durations,
      syllabus:    course.syllabus?.length
        ? course.syllabus
        : [{ moduleTitle: "", chapters: [""] }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete course ─────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "courses", id));
      showToast("🗑️ Course deleted");
      fetchCourses();
    } catch (e) {
      showToast("Error deleting: " + e.message, "error");
    }
  };

  // ── Reset form ────────────────────────────────────────────
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="admin">

      {/* ── Top Bar ── */}
      <div className="admin__topbar">
        <div className="admin__topbar-title">
          🎓 MAAYA Admin Panel
          <span className="admin__topbar-badge">Courses Manager</span>
        </div>
        <span style={{ fontSize: 13, color: "#64748B" }}>
          {courses.length} courses in database
        </span>
      </div>

      <div className="admin__body">

        {/* ══════════════════════════════════════════
            LEFT — Add / Edit Course Form
        ══════════════════════════════════════════ */}
        <div className="admin__form-panel">
          <div className="admin__form-title">
            {editId ? "✏️ Edit Course" : "➕ Add New Course"}
          </div>

          {/* Title */}
          <div className="admin__group">
            <label className="admin__label">Course Title *</label>
            <input className="admin__input" placeholder="e.g. MS-CIT" value={form.title} onChange={e => handleChange("title", e.target.value)} />
          </div>

          {/* Subtitle */}
          <div className="admin__group">
            <label className="admin__label">Subtitle</label>
            <input className="admin__input" placeholder="Short description line" value={form.subtitle} onChange={e => handleChange("subtitle", e.target.value)} />
          </div>

          {/* Category + Level */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="admin__group">
              <label className="admin__label">Category</label>
              <select className="admin__select" value={form.category} onChange={e => handleChange("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin__group">
              <label className="admin__label">Level</label>
              <select className="admin__select" value={form.level} onChange={e => handleChange("level", e.target.value)}>
                {["Beginner","Intermediate","Advanced","All Levels"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Icon + Gradient + Badge */}
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 10 }}>
            <div className="admin__group">
              <label className="admin__label">Icon</label>
              <input className="admin__input" placeholder="💻" value={form.icon} onChange={e => handleChange("icon", e.target.value)} style={{ textAlign: "center", fontSize: 20 }} />
            </div>
            <div className="admin__group">
              <label className="admin__label">Card Color</label>
              <select className="admin__select" value={form.gradient} onChange={e => handleChange("gradient", e.target.value)}>
                {GRADIENTS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="admin__group">
              <label className="admin__label">Badge</label>
              <select className="admin__select" value={form.badge} onChange={e => handleChange("badge", e.target.value)}>
                {BADGES.map(b => <option key={b} value={b}>{b || "None"}</option>)}
              </select>
            </div>
          </div>

          {/* Premium toggle */}
          <div className="admin__group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="premium" checked={form.isPremium} onChange={e => handleChange("isPremium", e.target.checked)} style={{ width: 16, height: 16 }} />
            <label htmlFor="premium" className="admin__label" style={{ margin: 0 }}>Mark as Premium</label>
          </div>

          {/* Description */}
          <div className="admin__group">
            <label className="admin__label">Short Description (card text)</label>
            <textarea className="admin__textarea" rows={2} placeholder="1-2 line description shown on course card" value={form.description} onChange={e => handleChange("description", e.target.value)} />
          </div>

          {/* Overview */}
          <div className="admin__group">
            <label className="admin__label">Full Overview (course detail page)</label>
            <textarea className="admin__textarea" rows={3} placeholder="Detailed course overview shown on detail page" value={form.overview} onChange={e => handleChange("overview", e.target.value)} />
          </div>

          {/* Tags, Highlights, Eligibility, Features */}
          {[
            { label: "Tags (comma separated)", field: "tags", placeholder: "e.g. Python, AI, Machine Learning" },
            { label: "Highlights (comma separated)", field: "highlights", placeholder: "e.g. Govt certified, Expert teachers" },
            { label: "Eligibility (comma separated)", field: "eligibility", placeholder: "e.g. 10th pass, Basic computer knowledge" },
            { label: "Course Features (comma separated)", field: "features", placeholder: "e.g. 40 hours classes, Certificate" },
          ].map(({ label, field, placeholder }) => (
            <div className="admin__group" key={field}>
              <label className="admin__label">{label}</label>
              <input className="admin__input" placeholder={placeholder} value={form[field]} onChange={e => handleChange(field, e.target.value)} />
            </div>
          ))}

          {/* ── Duration Pricing ── */}
          <div className="admin__group">
            <label className="admin__label">⏱️ Duration & Pricing</label>
            <p style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>
              Enable durations available for this course & set price
            </p>
            <div className="admin__duration-grid">
              {["30", "60", "90", "120"].map(h => (
                <div key={h} className="admin__duration-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <input
                      type="checkbox"
                      id={`dur-${h}`}
                      checked={form.durations[h].enabled}
                      onChange={e => handleDuration(h, "enabled", e.target.checked)}
                    />
                    <label htmlFor={`dur-${h}`} className="admin__duration-label" style={{ margin: 0 }}>
                      {h} Hours
                    </label>
                  </div>
                  {form.durations[h].enabled && (
                    <>
                      <input
                        className="admin__input"
                        placeholder="Price ₹"
                        value={form.durations[h].price}
                        onChange={e => handleDuration(h, "price", e.target.value)}
                        style={{ marginBottom: 6 }}
                      />
                      <input
                        className="admin__input"
                        placeholder="Original ₹ (strikethrough)"
                        value={form.durations[h].originalPrice}
                        onChange={e => handleDuration(h, "originalPrice", e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Syllabus Builder ── */}
          <div className="admin__group">
            <label className="admin__label">📖 Syllabus (Modules & Chapters)</label>
            {form.syllabus.map((module, mIdx) => (
              <div key={mIdx} className="admin__syllabus-module">
                {/* Module title row */}
                <div className="admin__syllabus-module-header">
                  <input
                    className="admin__syllabus-module-title"
                    placeholder={`Module ${mIdx + 1} title`}
                    value={module.moduleTitle}
                    onChange={e => handleModuleTitle(mIdx, e.target.value)}
                  />
                  <button className="btn-icon danger" onClick={() => removeModule(mIdx)}>✕</button>
                </div>
                {/* Chapters */}
                {module.chapters.map((ch, cIdx) => (
                  <div key={cIdx} className="admin__syllabus-chapter">
                    <span style={{ color: "#475569", fontSize: 12 }}>•</span>
                    <input
                      placeholder={`Chapter ${cIdx + 1}`}
                      value={ch}
                      onChange={e => handleChapter(mIdx, cIdx, e.target.value)}
                    />
                    <button className="btn-icon danger" onClick={() => removeChapter(mIdx, cIdx)}>✕</button>
                  </div>
                ))}
                <button className="btn-add-small" onClick={() => addChapter(mIdx)}>
                  + Add Chapter
                </button>
              </div>
            ))}
            <button className="btn-add-small" onClick={addModule} style={{ marginTop: 4 }}>
              + Add Module
            </button>
          </div>

          {/* Submit */}
          <button className="btn-admin-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editId ? "💾 Update Course" : "🚀 Add Course to Website"}
          </button>
          {editId && (
            <button className="btn-admin-secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Course List
        ══════════════════════════════════════════ */}
        <div className="admin__list-panel">
          <div className="admin__list-header">
            <span className="admin__list-title">📋 All Courses</span>
            <span className="admin__list-count">{courses.length} total</span>
          </div>

          {fetching ? (
            <div className="admin__status">
              <span className="admin__status-icon">⏳</span>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="admin__status">
              <span className="admin__status-icon">📭</span>
              <p>No courses yet. Add your first course!</p>
            </div>
          ) : (
            courses.map(course => {
              // Get enabled durations for display
              const enabledDurs = Object.entries(course.durations || {})
                .filter(([, v]) => v.enabled)
                .map(([h, v]) => `${h}h=₹${v.price}`)
                .join("  |  ");

              return (
                <div key={course.id} className="admin__course-row">
                  <div className="admin__course-row-left">
                    <div className="admin__course-row-name">
                      {course.icon} {course.title}
                    </div>
                    <div className="admin__course-row-meta">
                      <span>{course.category}</span>
                      <span>·</span>
                      <span>{course.level}</span>
                      {enabledDurs && <><span>·</span><span style={{ color: "#60A5FA" }}>{enabledDurs}</span></>}
                    </div>
                  </div>
                  <div className="admin__course-row-actions">
                    <button className="btn-icon" onClick={() => handleEdit(course)} title="Edit">✏️</button>
                    <button className="btn-icon danger" onClick={() => handleDelete(course.id, course.title)} title="Delete">🗑️</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`admin__toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
