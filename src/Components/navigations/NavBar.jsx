// ============================================================
//  Navbar.jsx — MAAYA Enterprises
//  Sticky navbar with logo, nav links, CTA buttons & mobile menu
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/MAAYA.png";
import { NAV_LINKS } from "../../constants/data";
import "./NavBar.css";

export default function NavBar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location   = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  // First name only for display
  const firstName = currentUser?.displayName?.split(" ")[0] || "User";

  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          {logo && (
            <img src={logo} alt="MAAYA Logo" />
          )}
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav>
          <ul className="navbar__links">
            {NAV_LINKS.map(link => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={isActive(link.path) ? "active" : ""}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Desktop Right Side ── */}
        <div className="navbar__cta">
          {currentUser ? (
            /* ── Logged In — show Welcome + dropdown ── */
            <div className="navbar__user" onClick={() => setUserMenuOpen(p => !p)}>
              <div className="navbar__user-avatar">
                {currentUser.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="navbar__user-name">
                Welcome, <strong>{firstName}</strong>
              </span>
              <span className="navbar__user-arrow">{userMenuOpen ? "▲" : "▼"}</span>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="navbar__user-dropdown">
                  <div className="navbar__user-dropdown-name">
                    {currentUser.displayName}
                  </div>
                  <div className="navbar__user-dropdown-email">
                    {currentUser.email}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="navbar__user-dropdown-item admin"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <button
                    className="navbar__user-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged Out — show only Register Free ── */
            <Link to="/register" className="btn-nav-primary">
              Register Free
            </Link>
          )}
        </div>

        {/* ── Hamburger ── */}
        <button
          className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="navbar__mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={isActive(link.path) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {currentUser ? (
            <div className="navbar__mobile-user">
              <div className="navbar__mobile-user-info">
                <span className="navbar__user-avatar small">
                  {currentUser.displayName?.charAt(0).toUpperCase()}
                </span>
                <span>Welcome, <strong>{currentUser.displayName}</strong></span>
              </div>
              {isAdmin && (
                <Link to="/admin" className="navbar__mobile-admin" onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin Panel
                </Link>
              )}
              <button className="navbar__mobile-logout" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          ) : (
            <div className="navbar__mobile-cta">
              <Link to="/register" className="btn-nav-primary" onClick={() => setMenuOpen(false)}>
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
