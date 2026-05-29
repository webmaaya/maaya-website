import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/MAAYA.png";
import { NAV_LINKS } from "../../constants/data";
import AnnouncementBar from "../sections/AnnouncementBar";
import "./NavBar.css";

export default function NavBar() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasAnnouncement, setHasAnnouncement] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const firstName = currentUser?.displayName?.split(" ")[0] || "User";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  return (
      <>
    <AnnouncementBar   onOpenPopup={() => {
    const event = new CustomEvent("openContactPopup");
    window.dispatchEvent(event);
  }}  onAnnouncementChange={setHasAnnouncement}/>

    <header
  className="navbar"
  style={{
    top: hasAnnouncement ? "38px" : "0px"
  }}
>
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          {logo && <img src={logo} alt="MAAYA Logo" />}
        </Link>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="navbar__links">
            {NAV_LINKS.map(link => (
              <li key={link.name}>
                <Link to={link.path} className={isActive(link.path) ? "active" : ""}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Right Side */}
        <div className="navbar__cta">
          {currentUser ? (

            // ── User dropdown wrapper ──
            <div ref={dropdownRef} style={{ position: "relative" }}>

              {/* Welcome button */}
              <div
                className="navbar__user"
                onClick={() => setUserMenuOpen(p => !p)}
              >
                <div className="navbar__user-avatar">
                  {currentUser.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="navbar__user-name">
                  Welcome, <strong>{firstName}</strong>
                </span>
                <span className="navbar__user-arrow">
                  {userMenuOpen ? "▲" : "▼"}
                </span>
              </div>

              {/* Dropdown — completely outside navbar__user */}
              {userMenuOpen && (
                <div style={{
                  position:     "absolute",
                  top:          "calc(100% + 8px)",
                  right:        0,
                  background:   "#ffffff",
                  border:       "1.5px solid #E2E8F0",
                  borderRadius: "14px",
                  padding:      "8px",
                  minWidth:     "220px",
                  boxShadow:    "0 8px 32px rgba(15,23,42,0.25)",
                  zIndex:       999999,
                }}>

                  {/* User name */}
                  <div style={{
                    fontSize:   14,
                    fontWeight: 700,
                    color:      "#0f172a",
                    padding:    "6px 10px 2px",
                  }}>
                    {currentUser.displayName}
                  </div>

                  {/* Email */}
                  <div style={{
                    fontSize:     12,
                    color:        "#94A3B8",
                    padding:      "0 10px 8px",
                    borderBottom: "1px solid #F1F5F9",
                    marginBottom: 6,
                  }}>
                    {currentUser.email}
                  </div>

                  {/* Admin Panel link */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display:        "block",
                        padding:        "9px 10px",
                        borderRadius:   8,
                        fontSize:       13.5,
                        fontWeight:     600,
                        color:          "#2563EB",
                        textDecoration: "none",
                        background:     "transparent",
                        cursor:         "pointer",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display:     "block",
                      width:       "100%",
                      padding:     "9px 10px",
                      borderRadius: 8,
                      fontSize:    13.5,
                      fontWeight:  600,
                      color:       "#EF4444",
                      background:  "transparent",
                      border:      "none",
                      cursor:      "pointer",
                      textAlign:   "left",
                      fontFamily:  "inherit",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

          ) : (
            <Link to="/register" className="btn-nav-primary">
              Register Free
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
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
              <Link to="/register" className="btn-nav-primary reg-button" onClick={() => setMenuOpen(false)}>
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
    </>
  );
}
