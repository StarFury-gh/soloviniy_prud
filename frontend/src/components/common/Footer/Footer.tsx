import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const onNavigate = (page: string) => {
    console.log("handle page change:", page);
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
              <button onClick={() => onNavigate("home")}>История пруда</button>
            </li>
            <li>
              <button onClick={() => onNavigate("home")}>Природа</button>
            </li>
            <li>
              <button onClick={() => onNavigate("home")}>Как добраться</button>
            </li>
            <li>
              <button onClick={() => onNavigate("home")}>Фотогалерея</button>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Развитие</h4>
          <ul>
            <li>
              <button onClick={() => onNavigate("development")}>Проекты</button>
            </li>
            <li>
              <button onClick={() => onNavigate("development")}>
                Голосование
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("development")}>
                Дорожная карта
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("development")}>Бюджет</button>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Сообщникам</h4>
          <ul>
            <li>
              <button onClick={() => onNavigate("login")}>
                Личный кабинет
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("login")}>Мерпориятия</button>
            </li>
            <li>
              <button onClick={() => onNavigate("profile")}>
                Сообщить о проблеме
              </button>
            </li>
            <li>
              <a href="#">Правила сообщества</a>
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
