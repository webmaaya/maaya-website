// ============================================================
//  DiplomaCard.jsx — Diploma Course Card
// ============================================================

import { useNavigate } from "react-router-dom";
import "./DiplomaCard.css";
import mscitLogo from "../../assets/logo/mscit logo.png";

const THUMB_LOGOS = {
  mscit: mscitLogo,
};

const formatPrice = (value = "") => {
  const text = String(value).trim();
  const digits = text.replace(/\D/g, "");
  if (!digits) return text;

  const lastThree = digits.slice(-3);
  const otherDigits = digits.slice(0, -3);
  return otherDigits
    ? `${otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
};

export default function DiplomaCard({ diploma }) {
  const navigate = useNavigate();
  const price = diploma.price;
  const originalPrice =
    diploma.originalPrice ||
    diploma.oldPrice ||
    diploma.mrp ||
    diploma.original_price;

  const calculateDiscount = () => {
    if (!originalPrice || !price) return null;
    const orig = parseInt(String(originalPrice).replace(/\D/g, ""));
    const curr = parseInt(String(price).replace(/\D/g, ""));
    if (orig <= 0 || curr > orig) return null;
    return Math.round(((orig - curr) / orig) * 100);
  };

  const discount = calculateDiscount();

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

        {price && (
          <div className="diploma-card__price">
            {originalPrice && (
              <span className="diploma-card__price-old">
                ₹{formatPrice(originalPrice)}
              </span>
            )}
            <span className="diploma-card__price-now">₹{formatPrice(price)}</span>
            {discount && (
              <span className="diploma-card__price-discount">
                {/* {discount}% OFF */}
              </span>
            )}
          </div>
        )}

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
