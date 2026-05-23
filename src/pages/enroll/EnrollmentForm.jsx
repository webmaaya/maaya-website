// ============================================================
//  EnrollmentForm.jsx — MAAYA Enterprises
//  Images → Cloudinary (free CDN)
//  Data   → Firebase Firestore (URLs only)
//  Email  → EmailJS notification to webmaaya@gmail.com
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import emailjs from "@emailjs/browser";
import qrcode from "../../assets/qr/qrcode.jpeg";
import "./EnrollmentForm.css";

// ── Cloudinary Config ─────────────────────────────────────────
const CLOUDINARY_CLOUD  = "dgtzaqsze";
const CLOUDINARY_PRESET = "maaya_uploads";
const CLOUDINARY_URL    = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

// ── EmailJS Config ────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_k35ifgl";
const EMAILJS_TEMPLATE_ID = "template_09dfe6n";
const EMAILJS_PUBLIC_KEY  = "kDsxO0icILJAiKwDx";

// ── Qualification options ─────────────────────────────────────
const QUALIFICATIONS = [
  "1st - 4th Std", "5th Std", "6th Std", "7th Std",
  "8th Std", "9th Std", "10th Std", "11th Std",
  "12th Std", "Diploma", "FY to TY", "Graduate",
  "Post Graduate", "Other",
];

// ── Current Profile options ───────────────────────────────────
const PROFILES = [
  "School Student", "Collegian", "Teacher", "Employee",
  "Housewife", "Industrial Worker", "Unemployed", "Retired",
  "Farmer", "Building Construction Worker or their Children's",
  "Govt. / Semi Govt. Employee", "Self-Employed",
  "Senior Citizen", "Trader",
  "Applicant of Competitive Exams (MPSC / UPSC)", "Other",
];

// ── Upload single image to Cloudinary → returns URL ──────────
const uploadToCloudinary = async (file, folder = "enrollments") => {
  const data = new FormData();
  data.append("file",         file);
  data.append("upload_preset", CLOUDINARY_PRESET);
  data.append("folder",        folder);

  const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
  const json = await res.json();

  if (!res.ok) throw new Error(json.error?.message || "Cloudinary upload failed");
  return json.secure_url; // ✅ Real image URL
};

const MAX_MB = 5 * 1024 * 1024; // 5MB per file

const EMPTY_FORM = {
  fullName: "", motherName: "", schoolCollege: "",
  whatsapp: "", email: "",
  qualification: "", currentProfile: [],
  aadhaarType: "big",
};

// ─────────────────────────────────────────────────────────────
export default function EnrollmentForm() {
  const { courseId } = useParams();

  const [course,     setCourse]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState(EMPTY_FORM);

  // File objects (for upload)
  const [files, setFiles] = useState({
    passport: null, signature: null,
    aadhaarFront: null, aadhaarBack: null,
    paymentShot: null,
  });

  // Preview URLs (local blob for display before upload)
  const [previews, setPreviews] = useState({
    passport: null, signature: null,
    aadhaarFront: null, aadhaarBack: null,
    paymentShot: null,
  });

  // Upload progress per file
  const [uploading, setUploading] = useState({});

  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitProgress, setSubmitProgress] = useState("");

  // ── Fetch course ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let snap = await getDoc(doc(db, "onlineCourses", courseId));
        if (!snap.exists()) snap = await getDoc(doc(db, "diplomaCourses", courseId));
        if (snap.exists()) setCourse({ id: snap.id, ...snap.data() });
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [courseId]);

  // ── Field helpers ────────────────────────────────────────
  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const toggleProfile = (p) => {
    setForm(prev => ({
      ...prev,
      currentProfile: prev.currentProfile.includes(p)
        ? prev.currentProfile.filter(x => x !== p)
        : [...prev.currentProfile, p],
    }));
    setErrors(prev => ({ ...prev, currentProfile: "" }));
  };

  // ── File handler (local preview only) ───────────────────
  const handleFile = (field, file) => {
    if (!file) return;
    if (file.size > MAX_MB) {
      setErrors(p => ({ ...p, [field]: "File too large — max 5MB" }));
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setFiles(p    => ({ ...p, [field]: file }));
    setPreviews(p => ({ ...p, [field]: localUrl }));
    setErrors(p   => ({ ...p, [field]: "" }));
  };

  // ── Validation ───────────────────────────────────────────
  const v1 = () => {
    const e = {};
    if (!form.fullName.trim())      e.fullName      = "Full name required";
    if (!form.motherName.trim())    e.motherName    = "Mother's name required";
    if (!form.schoolCollege.trim()) e.schoolCollege = "School / College name required";
    if (!/^[6-9]\d{9}$/.test(form.whatsapp))
      e.whatsapp = "Valid 10-digit WhatsApp number required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.qualification)
      e.qualification = "Please select your qualification";
    if (!form.currentProfile.length)
      e.currentProfile = "Please select at least one profile";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const v2 = () => {
    const e = {};
    if (!files.passport)     e.passport     = "Passport photo required";
    if (!files.signature)    e.signature    = "Signature photo required";
    if (!files.aadhaarFront) e.aadhaarFront = "Aadhaar front photo required";
    if (form.aadhaarType === "small" && !files.aadhaarBack)
      e.aadhaarBack = "Aadhaar back photo required for small Aadhaar";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const v3 = () => {
    const e = {};
    if (!files.paymentShot) e.paymentShot = "Payment screenshot required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 1 && v1()) { setStep(2); window.scrollTo({ top:0, behavior:"smooth" }); }
    if (step === 2 && v2()) { setStep(3); window.scrollTo({ top:0, behavior:"smooth" }); }
  };

  // ── SUBMIT: Cloudinary → Firebase → EmailJS ──────────────
  const handleSubmit = async () => {
    if (!v3()) return;
    setSubmitting(true);

    try {
      // ── 1. Upload all images to Cloudinary ──
      setSubmitProgress("📤 Uploading documents...");
      const folder = `enrollments/${courseId}`;

      const [
        passportUrl,
        signatureUrl,
        aadhaarFrontUrl,
        aadhaarBackUrl,
        paymentShotUrl,
      ] = await Promise.all([
        uploadToCloudinary(files.passport,    folder),
        uploadToCloudinary(files.signature,   folder),
        uploadToCloudinary(files.aadhaarFront, folder),
        files.aadhaarBack
          ? uploadToCloudinary(files.aadhaarBack, folder)
          : Promise.resolve(null),
        uploadToCloudinary(files.paymentShot, folder),
      ]);

      // ── 2. Save to Firebase (URLs only — small & fast) ──
      setSubmitProgress("💾 Saving enrollment...");

      const enrollmentData = {
        // Student info
        fullName:       form.fullName.trim(),
        motherName:     form.motherName.trim(),
        schoolCollege:  form.schoolCollege.trim(),
        whatsapp:       form.whatsapp,
        email:          form.email.trim(),
        qualification:  form.qualification,
        currentProfile: form.currentProfile,
        aadhaarType:    form.aadhaarType,

        // Course info
        courseId,
        courseName:     course?.title    || "",
        coursePrice:    course?.price    || "",
        courseDuration: course?.duration || "",
        courseType:     "online",

        // ✅ Cloudinary image URLs (real clickable links)
        passportPhotoUrl:    passportUrl,
        signaturePhotoUrl:   signatureUrl,
        aadhaarFrontUrl:     aadhaarFrontUrl,
        aadhaarBackUrl:      aadhaarBackUrl || null,
        paymentScreenshotUrl: paymentShotUrl,

        // Status
        status:      "pending",
        submittedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "enrollments"), enrollmentData);

      // ── 3. Send Email to counsellor with image URLs ──
      setSubmitProgress("📧 Sending notification...");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:   "webmaaya@gmail.com",
          to_name:    "MAAYA Counsellor",
          from_name:  form.fullName.trim(),

          // Student details
          student_name:    form.fullName.trim(),
          mother_name:     form.motherName.trim(),
          school_college:  form.schoolCollege.trim(),
          whatsapp:        form.whatsapp,
          student_email:   form.email.trim(),
          qualification:   form.qualification,
          current_profile: form.currentProfile.join(", "),
          aadhaar_type:    form.aadhaarType === "big"
            ? "Full Sized Aadhaar Card (front only)"
            : "Small Sized Aadhaar Card (front + back)",

          // Course details
          course_name:     course?.title    || "—",
          course_price:    `₹${course?.price || "—"}`,
          course_duration: course?.duration || "—",

          // ✅ Clickable image URLs in email
          passport_url:     passportUrl,
          signature_url:    signatureUrl,
          aadhaar_front_url: aadhaarFrontUrl,
          aadhaar_back_url:  aadhaarBackUrl || "Not uploaded (Big Aadhaar)",
          payment_url:      paymentShotUrl,

          // Firebase reference
          enrollment_id: docRef.id,

          // Full message
          message: `🎓 NEW ONLINE ENROLLMENT RECEIVED

Student: ${form.fullName.trim()}
Mother: ${form.motherName.trim()}
School/College: ${form.schoolCollege.trim()}
WhatsApp: ${form.whatsapp}
Email: ${form.email.trim()}
Qualification: ${form.qualification}
Profile: ${form.currentProfile.join(", ")}

Course: ${course?.title}
Price: ₹${course?.price}
Duration: ${course?.duration}

📎 DOCUMENTS (click to view):
• Passport Photo: ${passportUrl}
• Signature: ${signatureUrl}
• Aadhaar Front: ${aadhaarFrontUrl}
• Aadhaar Back: ${aadhaarBackUrl || "Not required (Big Aadhaar)"}
• Payment Screenshot: ${paymentShotUrl}

Firebase Enrollment ID: ${docRef.id}

Please verify payment and send login credentials to student within 24-48 hours.`,
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);

    } catch (e) {
      console.error("Submit error:", e);
      setErrors({ submit: "Something went wrong. Please try again or call 9420277373. Error: " + e.message });
    }

    setSubmitting(false);
    setSubmitProgress("");
  };

  // ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="enroll__loading">
      <span>⏳</span><p>Loading course details...</p>
    </div>
  );

  if (!course) return (
    <div className="enroll__loading">
      <span>❌</span><p>Course not found.</p>
      <Link to="/courses" className="enroll__back-link">← Back to Courses</Link>
    </div>
  );

  // ── Success Screen ────────────────────────────────────────
  if (submitted) return (
    <div className="enroll__success">
      <div className="enroll__success-card">
        <div className="enroll__success-icon">🎉</div>
        <h2>Enrollment Submitted!</h2>
        <p>Thank you, <strong>{form.fullName}</strong>!</p>
        <p>Your enrollment for <strong>{course.title}</strong> has been received successfully.</p>

        <div className="enroll__success-steps">
          <div className="enroll__success-step">
            <span>1</span>
            <p>Our counsellor will verify your payment & documents</p>
          </div>
          <div className="enroll__success-step">
            <span>2</span>
            <p>Your <strong>Username & Password</strong> will be sent to your WhatsApp & Email within <strong>24–48 hours</strong></p>
          </div>
          <div className="enroll__success-step">
            <span>3</span>
            <p>Login and start your online course! 🚀</p>
          </div>
        </div>

        <div className="enroll__success-contact">
          <p>📞 Questions? WhatsApp us:</p>
          <a href="https://wa.me/919420277373" className="enroll__whatsapp-btn">
            💬 +91 9420277373
          </a>
        </div>

        <Link to="/courses" className="enroll__success-btn">← Back to Courses</Link>
      </div>
    </div>
  );

  // ── Main Form ─────────────────────────────────────────────
  return (
    <div className="enroll">

      {/* Header */}
      <div className="enroll__header">
        <Link to={`/diploma/${courseId}`} className="enroll__back">← Back</Link>
        <div className="enroll__header-title">
          📋 Enrollment Form
          <span className="enroll__course-tag">{course.title}</span>
          <span className="enroll__online-badge">🌐 Online</span>
        </div>
      </div>

      {/* Steps */}
      <div className="enroll__steps">
        {["Personal Details", "Documents", "Payment"].map((label, i) => (
          <div key={i} className={`enroll__step ${step===i+1?"active":""} ${step>i+1?"done":""}`}>
            <div className="enroll__step-circle">{step>i+1?"✓":i+1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="enroll__body">

        {/* ═══════ STEP 1 — Personal Details ═══════ */}
        {step === 1 && (
          <div className="enroll__card">
            <h3 className="enroll__card-title">👤 Personal Details</h3>

            <Field label="Full Name *" error={errors.fullName}>
              <input className={`enroll__input ${errors.fullName?"error":""}`}
                placeholder="Enter your full name"
                value={form.fullName} onChange={e=>setF("fullName",e.target.value)} />
            </Field>

            <Field label="Mother's Name *" error={errors.motherName}>
              <input className={`enroll__input ${errors.motherName?"error":""}`}
                placeholder="Enter your mother's full name"
                value={form.motherName} onChange={e=>setF("motherName",e.target.value)} />
            </Field>

            <Field label="School / College Name *" error={errors.schoolCollege}>
              <input className={`enroll__input ${errors.schoolCollege?"error":""}`}
                placeholder="Enter your school or college name"
                value={form.schoolCollege} onChange={e=>setF("schoolCollege",e.target.value)} />
            </Field>

            <div className="enroll__two-col">
              <Field label="WhatsApp Number *" error={errors.whatsapp}>
                <input className={`enroll__input ${errors.whatsapp?"error":""}`}
                  placeholder="10-digit number" maxLength={10}
                  value={form.whatsapp}
                  onChange={e=>setF("whatsapp",e.target.value.replace(/\D/,""))} />
              </Field>
              <Field label="Email ID *" error={errors.email}>
                <input className={`enroll__input ${errors.email?"error":""}`}
                  placeholder="your@email.com" type="email"
                  value={form.email} onChange={e=>setF("email",e.target.value)} />
              </Field>
            </div>

            <Field label="Educational Qualification *" error={errors.qualification}>
              <div className="enroll__qual-grid">
                {QUALIFICATIONS.map(q=>(
                  <button key={q} type="button"
                    className={`enroll__qual-btn ${form.qualification===q?"active":""}`}
                    onClick={()=>setF("qualification",q)}>{q}</button>
                ))}
              </div>
            </Field>

            <Field
              label={<>Current Profile * <span style={{fontWeight:400,textTransform:"none",fontSize:11}}>(select all that apply)</span></>}
              error={errors.currentProfile}
            >
              <div className="enroll__profile-grid">
                {PROFILES.map(p=>(
                  <button key={p} type="button"
                    className={`enroll__profile-btn ${form.currentProfile.includes(p)?"active":""}`}
                    onClick={()=>toggleProfile(p)}>
                    {form.currentProfile.includes(p)?"✓ ":""}{p}
                  </button>
                ))}
              </div>
            </Field>

            <button className="enroll__next-btn" onClick={next}>
              Next: Upload Documents →
            </button>
          </div>
        )}

        {/* ═══════ STEP 2 — Documents ═══════ */}
        {step === 2 && (
          <div className="enroll__card">
            <h3 className="enroll__card-title">📎 Upload Documents</h3>
            <p className="enroll__card-subtitle">All photos must be clear & readable. Max 5MB each.</p>

            <UploadBox label="Passport Size Photo *" field="passport" icon="🤳"
              hint="Clear face photo with white/light background"
              preview={previews.passport} error={errors.passport} onChange={handleFile} />

            <UploadBox label="Signature Photo *" field="signature" icon="✍️"
              hint="Your signature on white paper, clearly photographed"
              preview={previews.signature} error={errors.signature} onChange={handleFile} />

            <Field label="Aadhaar Card Type *">
              <div className="enroll__aadhaar-type">
                {[
                  { v:"big",   l:"Full Sized Aadhaar Card — address on front side" },
                  { v:"small", l:"Small Sized Aadhaar Card — address on back side (upload both sides)" },
                ].map(({v,l})=>(
                  <button key={v} type="button"
                    className={`enroll__aadhaar-type-btn ${form.aadhaarType===v?"active":""}`}
                    onClick={()=>setF("aadhaarType",v)}>{l}</button>
                ))}
              </div>
            </Field>

            <UploadBox
              label={form.aadhaarType==="big"
                ? "Full Sized Aadhaar Card (Front — all details visible) *"
                : "Small Sized Aadhaar Card — Front Side *"}
              field="aadhaarFront" icon="🪪"
              hint={form.aadhaarType==="big"
                ? "Full Sized Aadhaar: name, photo, DOB & address all on front"
                : "Small Sized Aadhaar: name, photo, DOB side"}
              preview={previews.aadhaarFront} error={errors.aadhaarFront} onChange={handleFile} />

            {form.aadhaarType==="small" && (
              <UploadBox label="Aadhaar Card — Back Side (address) *"
                field="aadhaarBack" icon="🪪"
                hint="Small Aadhaar: back side where address is printed"
                preview={previews.aadhaarBack} error={errors.aadhaarBack} onChange={handleFile} />
            )}

            <div className="enroll__step-btns">
              <button className="enroll__back-btn" onClick={()=>setStep(1)}>← Back</button>
              <button className="enroll__next-btn" onClick={next}>Next: Payment →</button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3 — Payment ═══════ */}
        {step === 3 && (
          <div className="enroll__card">
            <h3 className="enroll__card-title">💳 Payment</h3>

            {/* Fee summary */}
            <div className="enroll__fee-summary">
              <div className="enroll__fee-row">
                <span>Course</span><strong>{course.title}</strong>
              </div>
              <div className="enroll__fee-row">
                <span>Duration</span><strong>{course.duration||"—"}</strong>
              </div>
              {course.originalPrice && (
                <div className="enroll__fee-row">
                  <span>Original Price</span>
                  <strong style={{textDecoration:"line-through",color:"#94A3B8"}}>₹{course.originalPrice}</strong>
                </div>
              )}
              <div className="enroll__fee-row total">
                <span>Total Fees</span>
                <strong className="enroll__fee-amount">₹{course.price||"—"}</strong>
              </div>
            </div>

            {/* UPI Box */}
            <div className="enroll__upi-box">
              <div className="enroll__upi-title">📱 Pay via Google Pay / PhonePe / Paytm / Any UPI</div>

              <div className="enroll__upi-id">
                <span>UPI ID:</span>
                <strong>9420277373@okbizaxis</strong>
                <button className="enroll__copy-btn"
                  onClick={()=>{
                    navigator.clipboard.writeText("9420277373@okbizaxis");
                    alert("✅ UPI ID copied!");
                  }}>Copy</button>
              </div>

              {/* QR Code */}
              <div className="enroll__qr-box">
                <div className="enroll__qr-label">📷 Scan QR Code to Pay</div>
                <div className="enroll__qr-placeholder">
                  <img
                    src={qrcode}
                    alt="UPI QR Code"
                    className="enroll__qr-img"
                    onError={e=>{
                      e.target.style.display="none";
                      e.target.nextSibling.style.display="flex";
                    }}
                  />
                  <div className="enroll__qr-fallback">
                    <div style={{fontSize:40}}>📱</div>
                    <div style={{fontWeight:700,color:"#1D4ED8",fontSize:15}}>9420277373@okbizaxis</div>
                    <div style={{fontSize:12,color:"#64748B",marginTop:4}}>Open any UPI app and pay to this ID</div>
                  </div>
                </div>
                <div className="enroll__qr-note">
                  Pay <strong>₹{course.price}</strong> and take a screenshot of confirmation
                </div>
              </div>

              <div className="enroll__upi-steps">
                {[
                  "Open Google Pay / PhonePe / Paytm",
                  `Scan QR code or enter UPI ID: 9420277373@okbizaxis`,
                  `Pay ₹${course.price} — take screenshot of success screen`,
                  "Upload the screenshot below and click Submit",
                ].map((s,i)=>(
                  <div key={i} className="enroll__upi-step">
                    <span>{i+1}</span><p>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment screenshot */}
            <UploadBox
              label="Upload Payment Screenshot *"
              field="paymentShot" icon="📸"
              hint="Screenshot showing successful payment from your UPI app"
              preview={previews.paymentShot} error={errors.paymentShot} onChange={handleFile} />

            {errors.submit && (
              <div className="enroll__error-box">⚠️ {errors.submit}</div>
            )}

            {/* Progress indicator */}
            {submitting && submitProgress && (
              <div className="enroll__progress-box">
                <div className="enroll__progress-spinner">⏳</div>
                <p>{submitProgress}</p>
              </div>
            )}

            <div className="enroll__step-btns">
              <button className="enroll__back-btn" onClick={()=>setStep(2)} disabled={submitting}>
                ← Back
              </button>
              <button className="enroll__submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? submitProgress || "⏳ Submitting..." : "🚀 Submit Enrollment"}
              </button>
            </div>

            <p className="enroll__disclaimer">
              ⚠️ Our counsellor will verify your payment & documents and send your
              <strong> Username & Password</strong> to your WhatsApp & Email within <strong>24–48 hours</strong>.
            </p>
          </div>
        )}

        {/* ── Sidebar ── */}
        <div className="enroll__sidebar">
          <div className={`enroll__course-card ${course.gradient||"grad-blue"}`}>
            <div className="enroll__course-icon">{course.icon||"📚"}</div>
            <div className="enroll__course-name">{course.title}</div>
            <div className="enroll__online-badge-card">🌐 Online Course</div>
          </div>

          <div className="enroll__sidebar-info">
            {[
              {label:"Duration", val:course.duration},
              {label:"Level",    val:course.level},
              {label:"Category", val:course.track},
            ].filter(r=>r.val).map(r=>(
              <div key={r.label} className="enroll__sidebar-row">
                <span>{r.label}</span><strong>{r.val}</strong>
              </div>
            ))}
            <div className="enroll__sidebar-row">
              <span>Fees</span>
              <strong style={{color:"#16A34A",fontSize:18}}>₹{course.price}</strong>
            </div>
            {course.originalPrice && (
              <div className="enroll__sidebar-row">
                <span>Original</span>
                <strong style={{textDecoration:"line-through",color:"#94A3B8"}}>₹{course.originalPrice}</strong>
              </div>
            )}
          </div>

          {(course.features||[]).length>0 && (
            <div className="enroll__sidebar-features">
              {course.features.map(f=>(
                <div key={f} className="enroll__sidebar-feature">✅ {f}</div>
              ))}
            </div>
          )}

          <div className="enroll__sidebar-progress">
            <div className="enroll__sidebar-progress-title">Your Progress</div>
            {["Fill Details","Upload Docs","Pay & Submit"].map((s,i)=>(
              <div key={i} className={`enroll__sidebar-step ${step>i?"done":""} ${step===i+1?"current":""}`}>
                <span>{step>i?"✓":i+1}</span>{s}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="enroll__group">
      <label className="enroll__label">{label}</label>
      {children}
      {error && <span className="enroll__error">{error}</span>}
    </div>
  );
}

// ── Upload Box ────────────────────────────────────────────────
function UploadBox({ label, field, icon, hint, preview, error, onChange }) {
  const ref = useRef();
  return (
    <div className="enroll__group">
      <label className="enroll__label">{label}</label>
      <div
        className={`enroll__file-box ${error?"error":""} ${preview?"has-file":""}`}
        onClick={()=>ref.current.click()}
      >
        {preview ? (
          <img src={preview} alt={label} className="enroll__file-preview" />
        ) : (
          <div className="enroll__file-placeholder">
            <span className="enroll__file-icon">{icon}</span>
            <span className="enroll__file-text">Click to upload</span>
            <span className="enroll__file-hint">{hint}</span>
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" style={{display:"none"}}
          onChange={e=>onChange(field,e.target.files[0])} />
      </div>
      {preview && (
        <button className="enroll__file-change" onClick={()=>ref.current.click()}>
          Change Photo
        </button>
      )}
      {error && <span className="enroll__error">{error}</span>}
    </div>
  );
}
