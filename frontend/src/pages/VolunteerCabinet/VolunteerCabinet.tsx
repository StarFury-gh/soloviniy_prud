import { useState } from "react";
import styles from "./VolunteerCabinet.module.css";

import { Input, Button } from "../../components/common";
import IssueReporter from "../../components/IssueReporter";

type CabinetTab = "profile" | "hours" | "issues";

const hoursLog = [
  {
    day: "5",
    month: "мая",
    name: "Покраска лавочек",
    type: "Субботник",
    hours: 5,
  },
  {
    day: "15",
    month: "апр",
    name: "Посадка деревьев",
    type: "Экологическая акция",
    hours: 4,
  },
  {
    day: "6",
    month: "апр",
    name: "Генеральная уборка берега",
    type: "Субботник",
    hours: 6,
  },
  {
    day: "22",
    month: "мар",
    name: "Уборка берега после зимы",
    type: "Субботник",
    hours: 3,
  },
  {
    day: "10",
    month: "мар",
    name: "Покраска ограждений",
    type: "Ремонт",
    hours: 4,
  },
  {
    day: "25",
    month: "фев",
    name: "Расчистка тропинок",
    type: "Зимний субботник",
    hours: 3,
  },
  {
    day: "18",
    month: "янв",
    name: "Кормление птиц и уборка льда",
    type: "Зимний субботник",
    hours: 2,
  },
  {
    day: "4",
    month: "янв",
    name: "Новогодний субботник",
    type: "Субботник",
    hours: 4,
  },
];

const totalHours = hoursLog.reduce((sum, e) => sum + e.hours, 0);

const achievements = [
  { icon: "🌱", label: "Первый субботник" },
  { icon: "🌳", label: "5 деревьев посажено" },
  { icon: "⏰", label: "47 часов помощи" },
  { icon: "🦢", label: "Страж лебедей" },
  { icon: "🧹", label: "8 субботников" },
];

function VolunteerCabinet() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<CabinetTab>("profile");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setLoginError("Заполните все поля");
      return;
    }
    setLoginError("");
    setLoggedIn(true);
  };

  const sidebarLinks: { id: CabinetTab; icon: string; label: string }[] = [
    { id: "profile", icon: "👤", label: "Мой профиль" },
    { id: "hours", icon: "⏰", label: "Журнал часов" },
    { id: "issues", icon: "📍", label: "Фиксация проблем" },
  ];

  if (!loggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.authWrap}>
          <div className={styles.authCard}>
            <div className={styles.authLogo}>
              <span className={styles.authIcon}>🌿</span>
              <h2 className={styles.authTitle}>Вход для волонтёров</h2>
              <p className={styles.authSubtitle}>
                Войдите в личный кабинет, чтобы записывать часы и сообщать о
                проблемах
              </p>
            </div>
            <div className={styles.authForm}>
              <Input
                type="email"
                label="Электронная почта"
                placeholder="volunteer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Пароль"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={loginError}
                required
              />
              <Button variant="primary" fullWidth onClick={handleLogin}>
                Войти
              </Button>
              <div className={styles.authDivider}>или</div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setEmail("demo@solovyinyprud.ru");
                  setPassword("demo2024");
                  setLoggedIn(true);
                }}
              >
                🦢 Демо-вход (без регистрации)
              </Button>
              <p className={styles.authNote}>
                Ещё нет аккаунта? Напишите нам на{" "}
                <strong>solovyinyprud_admin@mail.ru</strong> — мы создадим
                профиль.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.cabinet}>
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>М</div>
            <p className={styles.userName}>Мария Петрова</p>
            <p className={styles.userRole}>Волонтёр с марта 2023</p>
            <div className={styles.userStats}>
              <span className={styles.userStatBadge}>{totalHours} ч.</span>
              <span className={styles.userStatBadge}>
                {hoursLog.length} субботников
              </span>
            </div>
          </div>

          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              className={`${styles.sidebarLink} ${tab === link.id ? styles.activeLink : ""}`}
              onClick={() => setTab(link.id)}
            >
              <span className={styles.sidebarLinkIcon}>{link.icon}</span>
              {link.label}
            </button>
          ))}

          <button
            className={styles.logoutBtn}
            onClick={() => setLoggedIn(false)}
          >
            <span className={styles.sidebarLinkIcon}>↩</span>
            Выйти
          </button>
        </aside>

        <main className={styles.main}>
          {tab === "profile" && (
            <>
              <h2 className={styles.mainTitle}>Мой профиль</h2>
              <p className={styles.mainDesc}>
                Ваши достижения и вклад в жизнь Соловьиного пруда
              </p>
              <div className={styles.profileGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>⏰</span>
                  <span className={styles.statValue}>{totalHours}</span>
                  <span className={styles.statLabel}>
                    часов добровольного труда
                  </span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🌿</span>
                  <span className={styles.statValue}>{hoursLog.length}</span>
                  <span className={styles.statLabel}>субботников и акций</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>📍</span>
                  <span className={styles.statValue}>3</span>
                  <span className={styles.statLabel}>
                    обращения рассмотрено
                  </span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🌳</span>
                  <span className={styles.statValue}>5</span>
                  <span className={styles.statLabel}>
                    деревьев посажено лично
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "1rem",
                  }}
                >
                  Достижения
                </h3>
                <div className={styles.achievementsRow}>
                  {achievements.map((a) => (
                    <div key={a.label} className={styles.achievement}>
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "hours" && (
            <>
              <h2 className={styles.mainTitle}>Журнал часов</h2>
              <p className={styles.mainDesc}>
                История вашего участия в мероприятиях
              </p>
              <div className={styles.hoursLog}>
                {hoursLog.map((entry, i) => (
                  <div key={i} className={styles.hourEntry}>
                    <div className={styles.hourEntryDate}>
                      <span className={styles.hourEntryDay}>{entry.day}</span>
                      <span className={styles.hourEntryMonth}>
                        {entry.month}
                      </span>
                    </div>
                    <div>
                      <div className={styles.hourEntryName}>{entry.name}</div>
                      <div className={styles.hourEntryType}>{entry.type}</div>
                    </div>
                    <div>
                      <div className={styles.hourEntryHours}>{entry.hours}</div>
                      <span className={styles.hourEntryHoursLabel}>часов</span>
                    </div>
                  </div>
                ))}
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Итого за всё время</span>
                  <span className={styles.totalValue}>{totalHours} ч.</span>
                </div>
              </div>
            </>
          )}

          {tab === "issues" && (
            <>
              <h2 className={styles.mainTitle}>Фиксация проблем</h2>
              <p className={styles.mainDesc}>
                Сообщайте о сломанных лавочках, свалках, больных деревьях и
                других проблемах
              </p>
              <IssueReporter />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default VolunteerCabinet;
