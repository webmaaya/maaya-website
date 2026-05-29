// ============================================================
//  DiplomaCard.jsx — Diploma Course Card
//  No price shown — only title, track, included courses, duration
// ============================================================

import { useNavigate } from "react-router-dom";
import "./DiplomaCard.css";
import mscitLogo from "../../assets/logo/mscit logo.png";

const THUMB_LOGOS = {
  mscit: mscitLogo,
};

export default function DiplomaCard({ diploma }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/diploma/${diploma.id}`);
  };

  return (
    <div className="diploma-card" onClick={handleClick}>
<div className={`diploma-card__thumb ${diploma.gradient || "grad-blue"}`}>

  {diploma.thumbLogo && THUMB_LOGOS[diploma.thumbLogo] ? (
    <img
      src={THUMB_LOGOS[diploma.thumbLogo]}
      alt={diploma.title}
      className="diploma-card__thumb-logo"
    />
  ) : (
    <span>{diploma.icon}</span>
  )}

  {diploma.badge && (
    <span className="diploma-card__badge">
      {diploma.badge}
    </span>
  )}

</div>

      {/* Body */}
      <div className="diploma-card__body">

        <div className="diploma-card__track">{diploma.track}</div>
        <h3 className="diploma-card__title">{diploma.title}</h3>

        {/* Included sub-courses as pills */}
        <div className="diploma-card__includes">
          {(diploma.includes || []).slice(0, 4).map((item) => (
            <span key={item.name} className="diploma-card__include-pill">
              {item.icon} {item.name}
            </span>
          ))}
          {(diploma.includes || []).length > 4 && (
            <span className="diploma-card__include-pill">
              +{diploma.includes.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="diploma-card__footer">
          <div className="diploma-card__duration">
            📅 {diploma.duration}
          </div>
          <button
            className="btn-view-detail"
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
