// ============================================================
//  AdminPanel.jsx — MAAYA Enterprises (FIXED)
//  Collections:
//    Offline/Diploma → "diplomaCourses"  ✅
//    Online          → "onlineCourses"   ✅
//  Structure matches DiplomaDetail.jsx exactly
// ============================================================

import { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import "./AdminPanel.css";

const TRACKS = ["Accounting","Programming","Designing","IT Hardware","Work From Home","Other"];
const GRADIENTS = [
  { label:"Blue",   value:"grad-blue"   },
  { label:"Purple", value:"grad-purple" },
  { label:"Green",  value:"grad-green"  },
  { label:"Orange", value:"grad-orange" },
  { label:"Teal",   value:"grad-teal"   },
  { label:"Pink",   value:"grad-pink"   },
];
const BADGES = ["","Most Popular","Trending","New","Hot","Job Ready","Creative"];

const EMPTY_FORM = {
  title:"", track:"Accounting", icon:"📚", gradient:"grad-blue", badge:"",certificateImage:"",
  isOnline:false, overview:"", duration:"", price:"", originalPrice:"",
  includes:[{ icon:"📘", name:"", duration:"" }],
  whatYouLearn:[""], whoShouldJoin:[""], features:[""],
  syllabus:[{ moduleTitle:"", chapters:[""] }],
  description:"", tags:"",
};

export default function AdminPanel() {
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [diplomas, setDiplomas] = useState([]);
  const [online,   setOnline]   = useState([]);
  const [editId,   setEditId]   = useState(null);
  const [editCol,  setEditCol]  = useState("diplomaCourses");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast,    setToast]    = useState(null);
  const [listTab,  setListTab]  = useState("diploma");

  const fetchAll = async () => {
    setFetching(true);
    try {
      const [d, o] = await Promise.all([
        getDocs(collection(db, "diplomaCourses")),
        getDocs(collection(db, "onlineCourses")),
      ]);
      setDiplomas(d.docs.map(x => ({ id:x.id, ...x.data() })));
      setOnline(o.docs.map(x => ({ id:x.id, ...x.data() })));
    } catch(e) { showToast("Fetch error","error"); }
    setFetching(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (f, v) => setForm(p => ({ ...p, [f]:v }));

  // Array field helpers
  const setArr = (f, idx, v) => {
    const a = [...form[f]]; a[idx]=v;
    setForm(p => ({ ...p, [f]:a }));
  };
  const addArr    = (f, empty) => setForm(p => ({ ...p, [f]:[...p[f], empty] }));
  const removeArr = (f, idx)   => setForm(p => ({
    ...p, [f]: p[f].length>1 ? p[f].filter((_,i)=>i!==idx) : p[f]
  }));

  // Includes
  const setInc = (idx,k,v) => {
    const a=[...form.includes]; a[idx]={...a[idx],[k]:v};
    setForm(p=>({...p,includes:a}));
  };
  const addInc    = () => setForm(p=>({...p,includes:[...p.includes,{icon:"📘",name:"",duration:""}]}));
  const removeInc = (idx) => setForm(p=>({
    ...p, includes: p.includes.length>1 ? p.includes.filter((_,i)=>i!==idx) : p.includes
  }));

  // Syllabus
  const setMod = (mi,v) => { const s=[...form.syllabus]; s[mi].moduleTitle=v; setForm(p=>({...p,syllabus:s})); };
  const setCh  = (mi,ci,v) => { const s=[...form.syllabus]; s[mi].chapters[ci]=v; setForm(p=>({...p,syllabus:s})); };
  const addCh  = (mi) => { const s=[...form.syllabus]; s[mi].chapters.push(""); setForm(p=>({...p,syllabus:s})); };
  const remCh  = (mi,ci) => { const s=[...form.syllabus]; s[mi].chapters.splice(ci,1); setForm(p=>({...p,syllabus:s})); };
  const addMod = () => setForm(p=>({...p,syllabus:[...p.syllabus,{moduleTitle:"",chapters:[""]}]}));
  const remMod = (idx) => setForm(p=>({
    ...p, syllabus: p.syllabus.length>1 ? p.syllabus.filter((_,i)=>i!==idx) : [{moduleTitle:"",chapters:[""]}]
  }));

  const buildDoc = () => {
    const base = {
      title:form.title.trim(), track:form.track, icon:form.icon.trim()||"📚",certificateImage: form.certificateImage,
      gradient:form.gradient, badge:form.badge, isOnline:form.isOnline,
      overview:form.overview.trim(), duration:form.duration.trim(),
      price:form.price.trim(), originalPrice:form.originalPrice.trim(),
      features:form.features.map(f=>f.trim()).filter(Boolean),
      whoShouldJoin:form.whoShouldJoin.map(w=>w.trim()).filter(Boolean),
      whatYouLearn:form.whatYouLearn.map(w=>w.trim()).filter(Boolean),
      syllabus:form.syllabus
        .map(m=>({ moduleTitle:m.moduleTitle.trim(), chapters:m.chapters.map(c=>c.trim()).filter(Boolean) }))
        .filter(m=>m.moduleTitle),
      createdAt:serverTimestamp(),
    };
    if (!form.isOnline) {
      base.includes = form.includes
        .map(i=>({ icon:i.icon.trim(), name:i.name.trim(), duration:i.duration.trim() }))
        .filter(i=>i.name);
    } else {
      base.description = form.description.trim();
      base.tags = form.tags.split(",").map(t=>t.trim()).filter(Boolean);
    }
    return base;
  };

  const handleSubmit = async () => {
    if (!form.title.trim())    return showToast("Title required!","error");
    if (!form.duration.trim()) return showToast("Duration required!","error");
    if (!form.price.trim())    return showToast("Price required!","error");
    setLoading(true);
    try {
      const data = buildDoc();
      const col  = editId ? editCol : (form.isOnline ? "onlineCourses" : "diplomaCourses");
      if (editId) {
        const { createdAt, ...upd } = data;
        await updateDoc(doc(db, col, editId), upd);
        showToast("✅ Course updated!");
      } else {
        await addDoc(collection(db, col), data);
        showToast(`✅ ${form.isOnline ? "Online" : "Diploma"} course added to website!`);
      }
      resetForm(); fetchAll();
    } catch(e) { showToast("Error: "+e.message,"error"); }
    setLoading(false);
  };

  const handleEdit = (c, col) => {
    setEditId(c.id); setEditCol(col);
    setForm({
      title:c.title||"", track:c.track||"Accounting", icon:c.icon||"📚",
      gradient:c.gradient||"grad-blue", badge:c.badge||"",certificateImage:c.certificateImage || "",
      isOnline:c.isOnline||false, overview:c.overview||"",
      duration:c.duration||"", price:c.price||"", originalPrice:c.originalPrice||"",
      features:c.features?.length ? c.features : [""],
      whoShouldJoin:c.whoShouldJoin?.length ? c.whoShouldJoin : [""],
      whatYouLearn:c.whatYouLearn?.length ? c.whatYouLearn : [""],
      syllabus:c.syllabus?.length ? c.syllabus : [{moduleTitle:"",chapters:[""]}],
      includes:c.includes?.length ? c.includes : [{icon:"📘",name:"",duration:""}],
      description:c.description||"", tags:(c.tags||[]).join(", "),
    });
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleDelete = async (id, name, col) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, col, id));
      showToast("🗑️ Deleted"); fetchAll();
    } catch(e) { showToast("Error: "+e.message,"error"); }
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setEditCol("diplomaCourses"); };

  return (
    <div className="admin">

      {/* Top Bar */}
      <div className="admin__topbar">
        <div className="admin__topbar-title">
          🎓 MAAYA Admin Panel
          <span className="admin__topbar-badge">Courses Manager</span>
        </div>
        <span style={{ fontSize:13, color:"#64748B" }}>
          {diplomas.length} diploma · {online.length} online
        </span>
      </div>

      <div className="admin__body">

        {/* LEFT — Form */}
        <div className="admin__form-panel">
          <div className="admin__form-title">
            {editId ? "✏️ Edit Course" : "➕ Add New Course"}
          </div>

          {/* Type Toggle */}
          <div className="admin__type-toggle">
            <button className={`admin__type-btn ${!form.isOnline?"active-offline":""}`}
              onClick={() => set("isOnline",false)}>🏫 Diploma / Offline</button>
            <button className={`admin__type-btn ${form.isOnline?"active-online":""}`}
              onClick={() => set("isOnline",true)}>🌐 Online Course</button>
          </div>

          {form.isOnline
            ? <div className="admin__online-note">💡 Will appear in <strong>Online Courses</strong> section on website</div>
            : <div className="admin__offline-note">🎓 Will appear in <strong>Diploma Programs</strong> section on website</div>
          }

          {/* Title */}
          <div className="admin__group">
            <label className="admin__label">Course Title *</label>
            <input className="admin__input" placeholder="e.g. Diploma in Accounting"
              value={form.title} onChange={e=>set("title",e.target.value)} />
          </div>

          {/* Track + Icon */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 64px", gap:10 }}>
            <div className="admin__group">
              <label className="admin__label">Track / Category</label>
              <select className="admin__select" value={form.track} onChange={e=>set("track",e.target.value)}>
                {TRACKS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="admin__group">
              <label className="admin__label">Icon</label>
              <input className="admin__input" placeholder="📚" value={form.icon}
                onChange={e=>set("icon",e.target.value)}
                style={{ textAlign:"center", fontSize:20 }} />
            </div>
          </div>

          {/* Gradient + Badge */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="admin__group">
              <label className="admin__label">Card Color</label>
              <select className="admin__select" value={form.gradient} onChange={e=>set("gradient",e.target.value)}>
                {GRADIENTS.map(g=><option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="admin__group">
              <label className="admin__label">Badge</label>
              <select className="admin__select" value={form.badge} onChange={e=>set("badge",e.target.value)}>
                {BADGES.map(b=><option key={b} value={b}>{b||"None"}</option>)}
              </select>
            </div>
          </div>

          {/* Duration + Price */}
          <div className="admin__price-box">
            <div className="admin__price-box-title">💰 Duration & Pricing</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div className="admin__group" style={{ margin:0 }}>
                <label className="admin__label">Duration *</label>
                <input className="admin__input" placeholder="e.g. 10 Months"
                  value={form.duration} onChange={e=>set("duration",e.target.value)} />
              </div>
              <div className="admin__group" style={{ margin:0 }}>
                <label className="admin__label">Price ₹ *</label>
                <input className="admin__input" placeholder="e.g. 4500"
                  value={form.price} onChange={e=>set("price",e.target.value)} />
              </div>
            </div>
            <div className="admin__group" style={{ marginTop:10, marginBottom:0 }}>
              <label className="admin__label">Original Price ₹ (optional — strikethrough)</label>
              <input className="admin__input" placeholder="e.g. 6000"
                value={form.originalPrice} onChange={e=>set("originalPrice",e.target.value)} />
            </div>
          </div>
            {/* Certificate Image */}
<div className="admin__group">
  <label className="admin__label">
    Certificate Image Key
  </label>

  <input
    className="admin__input"
    placeholder="e.g. accounting"
    value={form.certificateImage}
    onChange={(e)=>set("certificateImage",e.target.value)}
  />
</div>


          {/* Overview */}
          <div className="admin__group">
            <label className="admin__label">Overview *</label>
            <textarea className="admin__textarea" rows={3}
              placeholder="Course overview shown on detail page"
              value={form.overview} onChange={e=>set("overview",e.target.value)} />
          </div>

          {/* Online extras */}
          {form.isOnline && (<>
            <div className="admin__group">
              <label className="admin__label">Short Description (card text)</label>
              <textarea className="admin__textarea" rows={2}
                placeholder="1-2 lines shown on course card"
                value={form.description} onChange={e=>set("description",e.target.value)} />
            </div>
            <div className="admin__group">
              <label className="admin__label">Tags (comma separated)</label>
              <input className="admin__input" placeholder="e.g. Python, AI, Beginner"
                value={form.tags} onChange={e=>set("tags",e.target.value)} />
            </div>
          </>)}

          {/* Includes — Diploma only */}
          {!form.isOnline && (
            <div className="admin__group">
              <label className="admin__label">📦 Included Sub-Courses (pills on card)</label>
              {form.includes.map((inc,idx)=>(
                <div key={idx} className="admin__include-row">
                  <input placeholder="Icon" value={inc.icon}
                    onChange={e=>setInc(idx,"icon",e.target.value)}
                    style={{ width:48, textAlign:"center", fontSize:18 }} />
                  <input placeholder="Sub-course name" value={inc.name}
                    onChange={e=>setInc(idx,"name",e.target.value)} style={{ flex:1 }} />
                  <input placeholder="Duration" value={inc.duration}
                    onChange={e=>setInc(idx,"duration",e.target.value)} style={{ width:90 }} />
                  <button className="btn-icon danger" onClick={()=>removeInc(idx)}>✕</button>
                </div>
              ))}
              <button className="btn-add-small" onClick={addInc}>+ Add Sub-Course</button>
            </div>
          )}

          {/* What You'll Learn */}
          <div className="admin__group">
            <label className="admin__label">📖 What You'll Learn</label>
            {form.whatYouLearn.map((item,idx)=>(
              <div key={idx} className="admin__arr-row">
                <input placeholder={`Point ${idx+1}`} value={item}
                  onChange={e=>setArr("whatYouLearn",idx,e.target.value)} />
                <button className="btn-icon danger" onClick={()=>removeArr("whatYouLearn",idx)}>✕</button>
              </div>
            ))}
            <button className="btn-add-small" onClick={()=>addArr("whatYouLearn","")}>+ Add Point</button>
          </div>

          {/* Who Should Join */}
          <div className="admin__group">
            <label className="admin__label">👥 Who Should Join</label>
            {form.whoShouldJoin.map((item,idx)=>(
              <div key={idx} className="admin__arr-row">
                <input placeholder="e.g. 10th pass students" value={item}
                  onChange={e=>setArr("whoShouldJoin",idx,e.target.value)} />
                <button className="btn-icon danger" onClick={()=>removeArr("whoShouldJoin",idx)}>✕</button>
              </div>
            ))}
            <button className="btn-add-small" onClick={()=>addArr("whoShouldJoin","")}>+ Add</button>
          </div>

          {/* Features */}
          <div className="admin__group">
            <label className="admin__label">✅ Course Features</label>
            {form.features.map((item,idx)=>(
              <div key={idx} className="admin__arr-row">
                <input placeholder="e.g. MKCL Certified" value={item}
                  onChange={e=>setArr("features",idx,e.target.value)} />
                <button className="btn-icon danger" onClick={()=>removeArr("features",idx)}>✕</button>
              </div>
            ))}
            <button className="btn-add-small" onClick={()=>addArr("features","")}>+ Add Feature</button>
          </div>

          {/* Syllabus */}
          <div className="admin__group">
            <label className="admin__label">📚 Syllabus</label>
            {form.syllabus.map((mod,mi)=>(
              <div key={mi} className="admin__syllabus-module">
                <div className="admin__syllabus-module-header">
                  <input className="admin__syllabus-module-title"
                    placeholder={`Module ${mi+1} title`} value={mod.moduleTitle}
                    onChange={e=>setMod(mi,e.target.value)} />
                  <button className="btn-icon danger" onClick={()=>remMod(mi)}>✕</button>
                </div>
                {mod.chapters.map((ch,ci)=>(
                  <div key={ci} className="admin__syllabus-chapter">
                    <span style={{ color:"#475569", fontSize:12 }}>•</span>
                    <input placeholder={`Chapter ${ci+1}`} value={ch}
                      onChange={e=>setCh(mi,ci,e.target.value)} />
                    <button className="btn-icon danger" onClick={()=>remCh(mi,ci)}>✕</button>
                  </div>
                ))}
                <button className="btn-add-small" onClick={()=>addCh(mi)}>+ Add Chapter</button>
              </div>
            ))}
            <button className="btn-add-small" onClick={addMod} style={{ marginTop:4 }}>+ Add Module</button>
          </div>

          <button className="btn-admin-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editId ? "💾 Update Course"
              : form.isOnline ? "🌐 Add Online Course" : "🎓 Add Diploma Course"}
          </button>
          {editId && (
            <button className="btn-admin-secondary" onClick={resetForm}>Cancel</button>
          )}
        </div>

        {/* RIGHT — List */}
        <div className="admin__list-panel">
          <div className="admin__list-tabs">
            <button className={`admin__list-tab ${listTab==="diploma"?"active":""}`}
              onClick={()=>setListTab("diploma")}>🎓 Diploma ({diplomas.length})</button>
            <button className={`admin__list-tab ${listTab==="online"?"active":""}`}
              onClick={()=>setListTab("online")}>🌐 Online ({online.length})</button>
          </div>

          {fetching ? (
            <div className="admin__status"><span className="admin__status-icon">⏳</span><p>Loading...</p></div>
          ) : listTab==="diploma" ? (
            diplomas.length===0
              ? <div className="admin__status"><span className="admin__status-icon">📭</span><p>No diploma courses yet</p></div>
              : diplomas.map(c=>(
                <div key={c.id} className="admin__course-row">
                  <div className="admin__course-row-left">
                    <div className="admin__course-row-name">
                      {c.icon} {c.title}
                      {c.badge && <span className="admin__badge-tag">{c.badge}</span>}
                    </div>
                    <div className="admin__course-row-meta">
                      <span>{c.track}</span>
                      {c.duration && <><span>·</span><span>⏱ {c.duration}</span></>}
                      {c.price    && <><span>·</span><span style={{color:"#34D399"}}>₹{c.price}</span></>}
                    </div>
                  </div>
                  <div className="admin__course-row-actions">
                    <button className="btn-icon" onClick={()=>handleEdit(c,"diplomaCourses")}>✏️</button>
                    <button className="btn-icon danger" onClick={()=>handleDelete(c.id,c.title,"diplomaCourses")}>🗑️</button>
                  </div>
                </div>
              ))
          ) : (
            online.length===0
              ? <div className="admin__status"><span className="admin__status-icon">📭</span><p>No online courses yet</p></div>
              : online.map(c=>(
                <div key={c.id} className="admin__course-row">
                  <div className="admin__course-row-left">
                    <div className="admin__course-row-name">
                      {c.icon} {c.title}
                      <span className="admin__online-tag">🌐 Online</span>
                    </div>
                    <div className="admin__course-row-meta">
                      <span>{c.track}</span>
                      {c.duration && <><span>·</span><span>⏱ {c.duration}</span></>}
                      {c.price    && <><span>·</span><span style={{color:"#34D399"}}>₹{c.price}</span></>}
                    </div>
                  </div>
                  <div className="admin__course-row-actions">
                    <button className="btn-icon" onClick={()=>handleEdit(c,"onlineCourses")}>✏️</button>
                    <button className="btn-icon danger" onClick={()=>handleDelete(c.id,c.title,"onlineCourses")}>🗑️</button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {toast && <div className={`admin__toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
