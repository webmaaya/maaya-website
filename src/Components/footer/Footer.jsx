// ============================================================
//  Footer.jsx — MAAYA Enterprises
// ============================================================

import { Link } from "react-router-dom";
import "./Footer.css";
import { CONTACT_INFO, SOCIAL_LINKS } from "../../constants/data";
import logo from "../../assets/logo/MAAYA.png"; // TODO: Add real logo image in assets folder and update path here

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">

          {/* ── Brand Column ── */}
          <div className="footer__brand">
            {/* TODO: Replace placeholder with: */}
            {<img src={logo} alt="MAAYA Logo" style={{ height: 50 }} />}

        
            {/* TODO: Update description */}
            <p>Maharashtra's leading IT education & skill development institute.
               Empowering youth with career-ready skills since 2010.</p>
            <div className="footer__socials">
              {/* TODO: Replace "#" with actual social URLs from SOCIAL_LINKS in data.js */}
              <a href={SOCIAL_LINKS.facebook}  className="footer__social-btn">f</a>
              <a href={SOCIAL_LINKS.instagram} className="footer__social-btn">in</a>
              <a href={SOCIAL_LINKS.youtube}   className="footer__social-btn">yt</a>
              <a href={SOCIAL_LINKS.twitter}   className="footer__social-btn">tw</a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">All Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              {/* TODO: Add more pages if needed */}
            </ul>
          </div>

          {/* ── Popular Courses ── */}
          <div>
            <h4 className="footer__heading">Popular Courses</h4>
            <ul className="footer__links">
              <li><Link to="/diploma/bx4YJsoSnYx71Ni8JRxE">Programming</Link></li>
              <li><Link to="/diploma/kFAh61GBr3xz74n7fudo">Accounting</Link></li>
              <li><Link to="/diploma/x6TnYFxQsCyWBprTnjRP">Designing</Link></li>
              <li><Link to="/diploma/PAuXt4O8IXUqG71Gy3yj">Networking</Link></li>
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__links">
              {/* TODO: Fill CONTACT_INFO in constants/data.js */}
              <li><a href="#">📍 {CONTACT_INFO.address}</a></li>
              <li><a href={`tel:${CONTACT_INFO.phone}`}>📞 {CONTACT_INFO.phone}</a></li>
              <li><a href={`mailto:${CONTACT_INFO.email}`}>✉️ {CONTACT_INFO.email}</a></li>
              <li><a href="#">🕐 Mon–Sat 8:30AM–6:30PM</a></li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer__bottom">
          {/* TODO: Update year and institute name */}
          <p>© 2026 MAAYA Enterprises. All rights reserved.</p>
          <p>Privacy Policy · Terms of Use · Refund Policy</p>
        </div>
      </div>
    </footer>
  );
}
