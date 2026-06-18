import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";

import IssueReporter from "../../components/IssueReporter";
import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

type ProfileTab = "profile" | "admin_panel" | "issues";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

interface UserInfoServerResponse {
  info: UserInfo;
}

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

function UserProfile() {
  const [tab, setTab] = useState<ProfileTab>();

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [ruRole, setRuRole] = useState<string>("");

  useEffect(() => {
    const handleRoleChanging = () => {
      if (userInfo?.role === "admin") {
        setRuRole("Администратор");
      } else if (userInfo?.role === "user") {
        setRuRole("Участник");
      }
    };
    handleRoleChanging();
  }, [userInfo]);

  useEffect(() => {
    const getUserInfo = async () => {
      const url = `${API_URL}/users/get_info`;
      const token = localStorage.getItem(LS_ACCESS_TOKEN);
      try {
        const response = await fetch(url, {
          headers: { Authorization: token || "" },
        });
        if (response.ok) {
          const { info }: UserInfoServerResponse = await response.json();
          console.log(info);
          setUserInfo(info);
        }
      } catch {
        console.error("Getting user info error");
      }
    };
    getUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={styles.page}>
      <div className={styles.cabinet}>
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{userInfo?.name[0]}</div>
            <p className={styles.userName}>
              {userInfo?.name} {userInfo?.surname}
            </p>
            <p className={styles.userRole}>{ruRole}</p>
            <div className={styles.userStats}>
              <span className={styles.userStatBadge}>{totalHours} ч.</span>
              <span className={styles.userStatBadge}>
                {hoursLog.length} субботников
              </span>
            </div>
          </div>

          <button
            className={`${styles.sidebarLink} ${tab === "profile" ? styles.activeLink : ""}`}
            onClick={() => setTab("profile")}
          >
            Профиль
          </button>
          <button
            className={`${styles.sidebarLink} ${tab === "issues" ? styles.activeLink : ""}`}
            onClick={() => setTab("issues")}
          >
            Фиксация проблем
          </button>
          {userInfo?.role === "admin" && (
            <button
              className={`${styles.sidebarLink} ${tab === "admin_panel" ? styles.activeLink : ""}`}
              onClick={() => setTab("admin_panel")}
            >
              Панель администратора
            </button>
          )}

          <button className={styles.logoutBtn} onClick={handleLogout}>
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

export default UserProfile;
