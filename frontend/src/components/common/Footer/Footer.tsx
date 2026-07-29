import { useNavigate } from "react-router-dom";

import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.brandName}>Соловьиный пруд</p>
          <p className={styles.brandDesc}>
            Живое сердце Владимира. Место силы, природы и городского сообщества.
            Вместе сохраняем наследие для будущих поколений.
          </p>
          <div className={styles.socialRow}>
            <a className={styles.socialBtn} href="#" aria-label="ВКонтакте">
              VK
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>О месте</h4>
          <ul>
            <li>
              <button onClick={() => navigateTo("/")}>История пруда</button>
            </li>
            <li>
              <button onClick={() => navigateTo("/")}>Природа</button>
            </li>
            <li>
              <button onClick={() => navigateTo("/")}>Как добраться</button>
            </li>
            <li>
              <button onClick={() => navigateTo("galery")}>Фотогалерея</button>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Сообщникам</h4>
          <ul>
            <li>
              <button onClick={() => navigateTo("login")}>
                Личный кабинет
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo("events")}>Мероприятия</button>
            </li>
            <li>
              <button onClick={() => navigateTo("register")}>
                Регистрация
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>
          {currentYear} Соловьиный пруд — Владимир. Открытый проект сообщества.
        </span>
        <span className={styles.coords}>ул. Горького, д. 79А</span>
      </div>
    </footer>
  );
}

export default Footer;
