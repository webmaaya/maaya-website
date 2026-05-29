// ============================================================
//  OnlineCourseCard.jsx — Online Course Card
// ============================================================

import { Link } from "react-router-dom";
import mscitLogo from "../../assets/logo/mscit logo.png";
import "./OnlineCourseCard.css"; // ← CSS import added

export default function OnlineCourseCard({ course }) {

  const isMscit = course.title?.toLowerCase().includes("ms-cit");

  return (
    <div className="online-course-card">

      <div className={`online-course-card__thumb ${course.gradient || "grad-blue"}`}>

        {isMscit ? (
          <img
            src={mscitLogo}
            alt={course.title}
            className="online-course-card__image"
          />
        ) : (
          <span style={{ fontSize: 58 }}>
            {course.icon}
          </span>
        )}

        {course.badge && (
          <span className="online-course-card__badge">
            {course.badge}
          </span>
        )}

        <span className="online-course-card__online">
          🌐 Online
        </span>

      </div>

      <div className="online-course-card__body">

        <p className="online-course-card__track">
          {course.track}
        </p>

        <h3 className="online-course-card__title">
          {course.title}
        </h3>

        <p className="online-course-card__desc">
          {course.description}
        </p>

        {course.tags?.length > 0 && (
          <div className="online-course-card__tags">
            {course.tags.slice(0, 3).map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className="online-course-card__bottom">
          <div>
            <div>⏱ {course.duration}</div>
            <div>
              {course.originalPrice && (
                <span style={{ textDecoration:"line-through", marginRight:6, color:"#94A3B8", fontSize:13 }}>
                  ₹{course.originalPrice}
                </span>
              )}
              <strong>₹{course.price}</strong>
            </div>
          </div>

          <Link to={`/diploma/${course.id}`} className="btn-enroll">
            Enroll Now →
          </Link>
        </div>

      </div>
    </div>
  );
}