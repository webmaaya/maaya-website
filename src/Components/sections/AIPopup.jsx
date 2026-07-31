import "./AIPopup.css";

export default function AIPopup({ onClose }) {
  return (
    <div className="aipop__overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aipop__modal">

        {/* Close button */}
        <button className="aipop__close" onClick={onClose}>✕</button>

        {/* Badge */}
        <div className="aipop__badge">MasterClass for You</div>

        {/* Headline */}
        <h2 className="aipop__title">
          <span className="aipop__marathi">आपण करूया महाराष्ट्र</span>
          <span className="aipop__ai"> AI <span className="aipop__ready">READY</span></span>
        </h2>

        {/* Description */}
        <p className="aipop__desc">
          Get a <strong>FREE 60-minute AI Masterclass</strong>, made just for you.
          Join the campaign <strong>आपण करूया महाराष्ट्र AI READY</strong>
        </p>

        {/* CTA Button */}
        
         <a href="https://www.mscit.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="aipop__btn"
          onClick={onClose}
        >
          Free Register Now &nbsp;&nbsp; →
        </a>

        {/* Center code note */}
        <div className="aipop__note">
          📌 <strong>Important:</strong> When filling the registration form, please use
          Center Code: <strong className="aipop__code">39210201</strong> to register
          through <strong className="aipop__code"> MAAYA.</strong>
        </div>

        {/* Expiry note */}
        <p className="aipop__expiry">
          ⏳ Limited time offer — valid till 15 August 2026
        </p>

      </div>
    </div>
  );
}