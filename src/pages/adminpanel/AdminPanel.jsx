// ============================================================
//  AdminPanel.jsx — MAAYA Enterprises (FIXED)
//  Collections:
//    Offline/Diploma → "diplomaCourses"  ✅
//    Online          → "onlineCourses"   ✅
//  Structure matches DiplomaDetail.jsx exactly
// ============================================================

import { useState, useEffect, useRef } from "react";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp, setDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import "./AdminPanel.css";



const TRACKS = ["Accounting","Programming","Designing","IT Hardware","Work From Home","IT and Computer","Professional Courses","Online Courses","Development","Multimedia","Other"];
const GRADIENTS = [
  { label:"Blue",   value:"grad-blue"   },
  { label:"Purple", value:"grad-purple" },
  { label:"Green",  value:"grad-green"  },
  { label:"Orange", value:"grad-orange" },
  { label:"Teal",   value:"grad-teal"   },
  { label:"Pink",   value:"grad-pink"   },
];
const BADGES = ["","Most Popular","Trending","New","Hot","Job Ready","Creative"];

const sanitizePriceInput = (value = "") =>
  value.replace(/[^\d,]/g, "");

const formatIndianPrice = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";

  const lastThree = digits.slice(-3);
  const otherDigits = digits.slice(0, -3);

  return otherDigits
    ? `${otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
};

const EMPTY_FORM = {
  title:"", track:"Accounting", icon:"📚", gradient:"grad-blue", badge:"",certificateImage:"",thumbLogo:"",
  isOnline:false, isFree:false, overview:"", duration:"", price:"", originalPrice:"",
  includes:[{ icon:"📘", name:"", duration:"" }],
  whatYouLearn:[""], whoShouldJoin:[""], features:[""],
  syllabus:[{ moduleTitle:"", chapters:[""] }],
  description:"", tags:"", forWhom:"",
};

export default function AdminPanel() {
const [announcements, setAnnouncements] = useState([]);
const [annForm, setAnnForm] = useState({ text:"", startDate:"", endDate:"", active:true });
const [annLoading, setAnnLoading] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [diplomas, setDiplomas] = useState([]);
  const [online,   setOnline]   = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [editId,   setEditId]   = useState(null);
  const [editCol,  setEditCol]  = useState("diplomaCourses");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast,    setToast]    = useState(null);
  const [listTab,  setListTab]  = useState("diploma");
  const toastTimer = useRef(null);

  const fetchAll = async () => {
    setFetching(true);
    try {
      const [d, o, f, ann] = await Promise.all([
        getDocs(collection(db, "diplomaCourses")),
        getDocs(collection(db, "onlineCourses")),
        getDocs(collection(db, "freeCourses")),
        getDocs(collection(db, "announcements")),
      ]);
      setDiplomas(d.docs.map(x => ({ id:x.id, ...x.data() })));
      setOnline(o.docs.map(x => ({ id:x.id, ...x.data() })));
      setFreeCourses(f.docs.map(x => ({ id:x.id, ...x.data() })));
      setAnnouncements(ann.docs.map(x => ({ id:x.id, ...x.data() })));
    } catch(e) { showToast("Fetch error","error"); }
    setFetching(false);
  //   const ann = await getDocs(collection(db, "announcements"));
  //  setAnnouncements(ann.docs.map(x => ({ id:x.id, ...x.data() })));
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type="success", action=null, timeoutMs=5000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type, action });
    toastTimer.current = setTimeout(() => setToast(null), timeoutMs);
  };

  const confirmAction = (message) => window.confirm(message);

  const withUndo = (msg, undo) =>
    showToast(msg, "success", { label:"Undo", run:undo }, 10000);

  const set = (f, v) => setForm(p => ({ ...p, [f]:v }));
  const setPrice = (field, value) => set(field, sanitizePriceInput(value));
  const formatPriceField = (field) =>
    setForm(p => ({ ...p, [field]: formatIndianPrice(p[field]) }));

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
      thumbLogo: form.thumbLogo,
      gradient:form.gradient, badge:form.badge, isOnline:form.isOnline, isFree:form.isFree,
      overview:form.overview.trim(), duration:form.duration.trim(),
      price:form.isFree ? "0" : formatIndianPrice(form.price),
      originalPrice:formatIndianPrice(form.originalPrice),
      features:form.features.map(f=>f.trim()).filter(Boolean),
      whoShouldJoin:form.whoShouldJoin.map(w=>w.trim()).filter(Boolean),
      whatYouLearn:form.whatYouLearn.map(w=>w.trim()).filter(Boolean),
      syllabus:form.syllabus
        .map(m=>({ moduleTitle:m.moduleTitle.trim(), chapters:m.chapters.map(c=>c.trim()).filter(Boolean) }))
        .filter(m=>m.moduleTitle),
      createdAt:serverTimestamp(),
    };
    if (form.isFree) {
      base.forWhom = form.forWhom.trim();
      base.description = form.description.trim();
    } else if (!form.isOnline) {
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
    if (form.isFree) {
      if (!form.originalPrice.trim()) return showToast("Original Price required for free courses!","error");
    } else {
      if (!form.price.trim())    return showToast("Price required!","error");
    }

    const actionName = editId ? "update" : "add";
    if (!confirmAction(`Are you sure you want to ${actionName} "${form.title.trim()}"?`))
      return;

    setLoading(true);
    try {
      const data = buildDoc();
      const col  = editId ? editCol : (form.isFree ? "freeCourses" : form.isOnline ? "onlineCourses" : "diplomaCourses");
      if (editId) {
        const previousCourse = [...diplomas, ...online, ...freeCourses].find(c => c.id === editId);
        const { id: _prevId, ...previousData } = previousCourse || {};
        const { createdAt, ...upd } = data;
        await updateDoc(doc(db, col, editId), upd);
        withUndo("Course updated.", async () => {
          if (!previousCourse) return showToast("Previous course data not found.","error");
          await updateDoc(doc(db, col, editId), previousData);
          showToast("Update undone.");
          fetchAll();
        });
      } else {
        const ref = await addDoc(collection(db, col), data);
        withUndo(`${form.isFree ? "Free" : form.isOnline ? "Online" : "Diploma"} course added.`, async () => {
          await deleteDoc(doc(db, col, ref.id));
          showToast("Added course removed.");
          fetchAll();
        });
      }
      resetForm(); fetchAll();
    } catch(e) { showToast("Error: "+e.message,"error"); }
    setLoading(false);
  };

  const handleEdit = (c, col) => {
    if (!confirmAction(`Are you sure you want to edit "${c.title}"?`))
      return;

    setEditId(c.id); setEditCol(col);
    setForm({
      title:c.title||"", track:c.track||"Accounting", icon:c.icon||"📚",
      gradient:c.gradient||"grad-blue", badge:c.badge||"",certificateImage:c.certificateImage || "",
      thumbLogo:c.thumbLogo || "",
      isOnline:c.isOnline||false, isFree:c.isFree||false, overview:c.overview||"",
      duration:c.duration||"", price:formatIndianPrice(c.price||""), originalPrice:formatIndianPrice(c.originalPrice||""),
      features:c.features?.length ? c.features : [""],
      whoShouldJoin:c.whoShouldJoin?.length ? c.whoShouldJoin : [""],
      whatYouLearn:c.whatYouLearn?.length ? c.whatYouLearn : [""],
      syllabus:c.syllabus?.length ? c.syllabus : [{moduleTitle:"",chapters:[""]}],
      includes:c.includes?.length ? c.includes : [{icon:"📘",name:"",duration:""}],
      description:c.description||"", tags:(c.tags||[]).join(", "), forWhom:c.forWhom||"",
    });
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleDelete = async (course, col) => {
    if (!confirmAction(`Are you sure you want to delete "${course.title}"?`)) return;
    const { id, ...restoreData } = course;
    try {
      await deleteDoc(doc(db, col, id));
      withUndo("Course deleted.", async () => {
        await setDoc(doc(db, col, id), restoreData);
        showToast("Deleted course restored.");
        fetchAll();
      });
      fetchAll();
    } catch(e) { showToast("Error: "+e.message,"error"); }
  };

  const handleAddAnnouncement = async () => {
    if (!annForm.text.trim())
      return showToast("Text required!","error");

    if (!annForm.endDate)
      return showToast("End date required!","error");

    if (!confirmAction("Are you sure you want to add this announcement?"))
      return;

    setAnnLoading(true);

    try {
      const ref = await addDoc(collection(db, "announcements"), {
        ...annForm,
        createdAt: serverTimestamp(),
      });

      withUndo("Announcement added.", async () => {
        await deleteDoc(doc(db, "announcements", ref.id));
        showToast("Added announcement removed.");
        fetchAll();
      });

      setAnnForm({
        text:"",
        startDate:"",
        endDate:"",
        active:true
      });

      fetchAll();
    } catch(e) {
      showToast("Error: "+e.message,"error");
    }

    setAnnLoading(false);
  };

  const handleDeleteAnnouncement = async (announcement) => {
    if (!confirmAction("Are you sure you want to delete this announcement?"))
      return;

    const { id, ...restoreData } = announcement;

    try {
      await deleteDoc(doc(db, "announcements", id));
      withUndo("Announcement deleted.", async () => {
        await setDoc(doc(db, "announcements", id), restoreData);
        showToast("Deleted announcement restored.");
        fetchAll();
      });
      fetchAll();
    } catch(e) {
      showToast("Error: "+e.message,"error");
    }
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
          {diplomas.length} diploma · {online.length} online · {freeCourses.length} free
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
            <button className={`admin__type-btn ${!form.isOnline && !form.isFree?"active-offline":""}`}
              onClick={() => { set("isOnline",false); set("isFree",false); }}>🏫 Diploma</button>
            <button className={`admin__type-btn ${form.isOnline && !form.isFree?"active-online":""}`}
              onClick={() => { set("isOnline",true); set("isFree",false); }}>🌐 Online Course</button>
            <button className={`admin__type-btn ${form.isFree?"active-free":""}`}
              onClick={() => { set("isFree",true); set("isOnline",false); set("price","0"); }}>🆓 Free Course</button>
          </div>

          {form.isFree
            ? <div className="admin__free-note">🎁 Will appear in <strong>Free Courses</strong> section on website</div>
            : form.isOnline
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
          {/* Thumbnail Logo */}
<div className="admin__group">
  <label className="admin__label">
    Thumbnail Logo URL
  </label>

  <input
    className="admin__input"
    placeholder="Paste image URL"
    value={form.thumbLogo}
    onChange={(e)=>set("thumbLogo",e.target.value)}
  />
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
                <label className="admin__label">{form.isFree ? "Original Price ₹" : "Price ₹"} *</label>
                <input
                  className="admin__input"
                  placeholder={form.isFree ? "e.g. 4000 (for 100% OFF display)" : "e.g. 10,000"}
                  value={form.isFree ? form.originalPrice : form.price}
                  onChange={e=> form.isFree ? setPrice("originalPrice",e.target.value) : setPrice("price",e.target.value)}
                  onBlur={()=> form.isFree ? formatPriceField("originalPrice") : formatPriceField("price")}
                />
              </div>
            </div>
            {!form.isFree && (
              <div className="admin__group" style={{ marginTop:10, marginBottom:0 }}>
                <label className="admin__label">Original Price ₹ (optional — strikethrough)</label>
                <input
                  className="admin__input"
                  placeholder="e.g. 15,000"
                  value={form.originalPrice}
                  onChange={e=>setPrice("originalPrice",e.target.value)}
                  onBlur={()=>formatPriceField("originalPrice")}
                />
              </div>
            )}
            {form.isFree && (
              <div className="admin__group" style={{ marginTop:10, marginBottom:0 }}>
                <label className="admin__label" style={{color:"#34D399"}}>✅ Free Course (₹0.00 will be displayed with {form.originalPrice ? "100% OFF" : "price"})</label>
              </div>
            )}
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

          {/* For Whom - Free courses only */}
          {form.isFree && (
            <div className="admin__group">
              <label className="admin__label">For Whom (e.g. Students and Professionals)</label>
              <input className="admin__input" placeholder="e.g. Students and Professionals"
                value={form.forWhom} onChange={e=>set("forWhom",e.target.value)} />
            </div>
          )}

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
              : form.isFree ? "🆓 Add Free Course" : form.isOnline ? "🌐 Add Online Course" : "🎓 Add Diploma Course"}
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
            <button className={`admin__list-tab ${listTab==="free"?"active":""}`}
              onClick={()=>setListTab("free")}>🆓 Free ({freeCourses.length})</button>
              <button className={`admin__list-tab ${listTab==="announce"?"active":""}`}
  onClick={()=>setListTab("announce")}>📢 Announcements</button>
          </div>
        
        {fetching ? (
  <div className="admin__status">
    <span className="admin__status-icon">⏳</span>
    <p>Loading...</p>
  </div>

) : listTab==="diploma" ? (

  diplomas.length===0
    ? <div className="admin__status">
        <span className="admin__status-icon">📭</span>
        <p>No diploma courses yet</p>
      </div>

    : diplomas.map(c=>(
        <div key={c.id} className="admin__course-row">
          <div className="admin__course-row-left">
            <div className="admin__course-row-name">
              {c.icon} {c.title}
              {c.badge && <span className="admin__badge-tag">{c.badge}</span>}
            </div>

            <div className="admin__course-row-meta">
              <span>{c.track}</span>

              {c.duration && <>
                <span>·</span>
                <span>⏱ {c.duration}</span>
              </>}

              {c.price && <>
                <span>·</span>
                {c.originalPrice && (
                  <span style={{color:"#94A3B8", textDecoration:"line-through"}}>
                    ₹{formatIndianPrice(c.originalPrice)}
                  </span>
                )}
                <span style={{color:"#34D399"}}>₹{formatIndianPrice(c.price)}</span>
              </>}
            </div>
          </div>

          <div className="admin__course-row-actions">
            <button
              className="btn-icon"
              onClick={()=>handleEdit(c,"diplomaCourses")}
            >
              ✏️
            </button>

            <button
              className="btn-icon danger"
              onClick={()=>handleDelete(c,"diplomaCourses")}
            >
              🗑️
            </button>
          </div>
        </div>
      ))

) : listTab==="online" ? (

  online.length===0
    ? <div className="admin__status">
        <span className="admin__status-icon">📭</span>
        <p>No online courses yet</p>
      </div>

    : online.map(c=>(
        <div key={c.id} className="admin__course-row">

          <div className="admin__course-row-left">
            <div className="admin__course-row-name">
              {c.icon} {c.title}
              <span className="admin__online-tag">🌐 Online</span>
            </div>

            <div className="admin__course-row-meta">
              <span>{c.track}</span>

              {c.duration && <>
                <span>·</span>
                <span>⏱ {c.duration}</span>
              </>}

              {c.price && <>
                <span>·</span>
                {c.originalPrice && (
                  <span style={{color:"#94A3B8", textDecoration:"line-through"}}>
                    ₹{formatIndianPrice(c.originalPrice)}
                  </span>
                )}
                <span style={{color:"#34D399"}}>₹{formatIndianPrice(c.price)}</span>
              </>}
            </div>
          </div>

          <div className="admin__course-row-actions">
            <button
              className="btn-icon"
              onClick={()=>handleEdit(c,"onlineCourses")}
            >
              ✏️
            </button>

            <button
              className="btn-icon danger"
              onClick={()=>handleDelete(c,"onlineCourses")}
            >
              🗑️
            </button>
          </div>
        </div>
      ))

) : listTab==="free" ? (

  freeCourses.length===0
    ? <div className="admin__status">
        <span className="admin__status-icon">📭</span>
        <p>No free courses yet</p>
      </div>

    : freeCourses.map(c=>(
        <div key={c.id} className="admin__course-row">

          <div className="admin__course-row-left">
            <div className="admin__course-row-name">
              {c.icon} {c.title}
              <span style={{background:"#34D399", color:"#0f172a", padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:700, marginLeft:8}}>🆓 FREE</span>
            </div>

            <div className="admin__course-row-meta">
              <span>{c.track}</span>

              {c.duration && <>
                <span>·</span>
                <span>⏱ {c.duration}</span>
              </>}

              {c.originalPrice && (
                <span style={{color:"#34D399"}}>
                  ₹0.00 <span style={{color:"#94A3B8", textDecoration:"line-through"}}>₹{formatIndianPrice(c.originalPrice)}</span> | 100% OFF
                </span>
              )}
            </div>
          </div>

          <div className="admin__course-row-actions">
            <button
              className="btn-icon"
              onClick={()=>handleEdit(c,"freeCourses")}
            >
              ✏️
            </button>

            <button
              className="btn-icon danger"
              onClick={()=>handleDelete(c,"freeCourses")}
            >
              🗑️
            </button>
          </div>
        </div>
      ))

) : listTab==="announce" ? (

  <div>

    {/* Add new announcement form */}
    <div style={{
      background:"#1e293b",
      borderRadius:10,
      padding:16,
      marginBottom:20
    }}>

      <div style={{
        fontSize:13,
        fontWeight:700,
        color:"#60A5FA",
        marginBottom:12
      }}>
        📢 Add New Announcement
      </div>

      <div className="admin__group">
        <label className="admin__label">
          Announcement Text *
        </label>

        <input
          className="admin__input"
          placeholder="e.g. 🎉 New batch starting June 2026!"
          value={annForm.text}
          onChange={e =>
            setAnnForm(p => ({
              ...p,
              text:e.target.value
            }))
          }
        />
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:10
      }}>

        <div className="admin__group" style={{ margin:0 }}>
          <label className="admin__label">Start Date</label>

          <input
            className="admin__input"
            type="date"
            value={annForm.startDate}
            onChange={e =>
              setAnnForm(p => ({
                ...p,
                startDate:e.target.value
              }))
            }
          />
        </div>

        <div className="admin__group" style={{ margin:0 }}>
          <label className="admin__label">End Date</label>

          <input
            className="admin__input"
            type="date"
            value={annForm.endDate}
            onChange={e =>
              setAnnForm(p => ({
                ...p,
                endDate:e.target.value
              }))
            }
          />
        </div>
      </div>

      <div style={{
        display:"flex",
        alignItems:"center",
        gap:8,
        margin:"12px 0"
      }}>
        <input
          type="checkbox"
          id="annActive"
          checked={annForm.active}
          onChange={e =>
            setAnnForm(p => ({
              ...p,
              active:e.target.checked
            }))
          }
          style={{ width:16, height:16 }}
        />

        <label
          htmlFor="annActive"
          style={{
            fontSize:13,
            color:"#94A3B8",
            fontWeight:600
          }}
        >
          Active (show on website)
        </label>
      </div>

      <button
        className="btn-admin-primary"
        disabled={annLoading}
        onClick={handleAddAnnouncement}
      >
        {annLoading ? "Saving..." : "📢 Add Announcement"}
      </button>
    </div>

    {/* List */}
    {announcements.length === 0 ? (

      <div className="admin__status">
        <span className="admin__status-icon">📭</span>
        <p>No announcements yet</p>
      </div>

    ) : announcements.map(a => (

      <div key={a.id} className="admin__course-row">

        <div className="admin__course-row-left">

          <div
            className="admin__course-row-name"
            style={{ fontSize:13 }}
          >
            {a.text}
          </div>

          <div className="admin__course-row-meta">

            <span>
              {a.startDate || "—"} → {a.endDate}
            </span>

            <span>·</span>

            <span style={{
              color: a.active ? "#34D399" : "#EF4444"
            }}>
              {a.active ? "✅ Active" : "❌ Inactive"}
            </span>
          </div>
        </div>

        <div className="admin__course-row-actions">

          <button
            className="btn-icon danger"
            onClick={() => handleDeleteAnnouncement(a)}
          >
            🗑️
          </button>

        </div>
      </div>
    ))}
  </div>

) : null}

          
        </div>
      </div>

      {toast && (
        <div className={`admin__toast ${toast.type}`}>
          <span>{toast.msg}</span>
          {toast.action && (
            <button
              className="admin__toast-action"
              onClick={async () => {
                const action = toast.action;
                setToast(null);
                try {
                  await action.run();
                } catch(e) {
                  showToast("Undo failed: "+e.message, "error");
                }
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
