import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import favicon from "/favicon.svg";
import styles from "./Header.module.css";
import { Button } from "../";

const navItems: { label: string; page: string }[] = [
  { label: "Главная", page: "/" },
  { label: "Развитие", page: "development" },
  { label: "Волонтёры", page: "volunteer" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (page: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(page);
    setMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <div className={styles.logo} onClick={() => handleNav("/")}>
          {/* <div className={styles.logoIcon}>🦢</div> */}
          <img src={favicon} alt="" className={styles.logoIcon} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Соловьиный пруд</span>
            <span className={styles.logoSub}>ул. Горького, д. 79А</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ label, page }) => (
            <NavLink
              to={page}
              key={page}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? `${styles.active}` : ""}`
              }
              onClick={() => handleNav(page)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.navActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNav("volunteer")}
          >
            Войти как волонтёр
          </Button>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        {navItems.map(({ label, page }) => (
          <button key={page} onClick={() => handleNav(page)}>
            {label}
          </button>
        ))}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => handleNav("volunteer")}
          style={{ marginTop: "0.5rem" }}
        >
          Войти
        </Button>
      </div>
    </header>
  );
}

export default Header;
