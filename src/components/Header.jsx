import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Header.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/Service" },
  { label: "Menu", path: "/Menu" },
  { label: "Contact", path: "/contact" },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <header className="site-header">
      <nav className="nav-bar" aria-label="Main navigation">
        <Link className="brand-link" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">J</span>
          <span className="brand-copy"><strong>Joshi's <em>Catering</em></strong><small>Pure vegetarian kitchen</small></span>
        </Link>

        <button className={`menu-toggle ${isOpen ? "open" : ""}`} type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label="Toggle navigation menu">
          <span /><span /><span />
        </button>

        <div className={`nav-panel ${isOpen ? "show" : ""}`}>
          <ul className="nav-links">
            {navItems.map((item) => <li key={item.path}><Link className={isActive(item.path) ? "active" : ""} to={item.path} onClick={closeMenu}>{item.label}</Link></li>)}
          </ul>
          <div className="nav-actions">
            <Link className="admin-link" to="/Login" onClick={closeMenu}><span className="admin-dot" /> Admin</Link>
            <Link className="header-order" to="/Order" onClick={closeMenu}>Order now <span>→</span></Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
