import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";

import { IssueReporter, CreatePostForm } from "../../components/profile/";
import {
  RegisteredPlantsList,
  CreateEventForm,
  CreateStoryTagForm,
  StoriesRequestsList,
  AdminEventsList,
} from "../../components/profile/admin";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

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

interface MenuItem {
  tabName: string;
  title: string;
}

function UserProfile() {
  const [tab, setTab] = useState<string>("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [ruRole, setRuRole] = useState<string>("");

  const menuItems: Array<MenuItem> = [
    {
      tabName: "profile",
      title: "Профиль",
    },
    {
      tabName: "addStory",
      title: "Добавить историю",
    },
    {
      tabName: "issues",
      title: "Проблемы",
    },
    ...(userInfo?.role === "admin"
      ? [
          {
            tabName: "plants",
            title: "Добавленные растения",
          },
          {
            tabName: "addEvent",
            title: "Добавить событие",
          },
          {
            tabName: "eventsList",
            title: "События",
          },
          {
            tabName: "addStoryTag",
            title: "Добавить теги",
          },
          {
            tabName: "storiesRequests",
            title: "Заявки историй",
          },
        ]
      : []),
  ].filter(Boolean) as Array<MenuItem>;

  const elementMapping: Record<string, React.ReactNode> = {
    profile: <></>,
    addStory: <CreatePostForm />,
    issues: <IssueReporter />,
    plants: <RegisteredPlantsList />,
    addEvent: <CreateEventForm />,
    addStoryTag: <CreateStoryTagForm />,
    storiesRequests: <StoriesRequestsList />,
    eventsList: <AdminEventsList />,
  };

  useEffect(() => {
    const handleRoleChanging = () => {
      if (userInfo?.role === "admin") {
        setRuRole("Администратор");
      } else if (userInfo?.role === "user") {
        setRuRole("Участник");
      } else if (userInfo?.role === "parter") {
        setRuRole("Сообщник");
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
          headers: {
            Authorization: token || "",
            "Content-type": "application/json",
          },
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
            <div className={styles.avatar}>
              {userInfo?.name[0]}
              {userInfo?.surname[0]}
            </div>
            <p className={styles.userName}>
              {userInfo?.name} {userInfo?.surname}
            </p>
            <p className={styles.userRole}>{ruRole}</p>
            <div className={styles.userStats}>
              <span className={styles.userStatBadge}>Статистика</span>
            </div>
          </div>

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span>☰</span>
            Меню
          </button>

          <div
            className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}
          >
            {menuItems.map((item, idx) => {
              if (item !== null) {
                return (
                  <button
                    key={idx}
                    className={`${styles.sidebarLink} ${tab === item?.tabName ? styles.activeLink : ""}`}
                    onClick={() => {
                      setTab(item?.tabName || "profile");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{item?.title}</span>
                    <span className={styles.mobileMenuIndicator}>›</span>
                  </button>
                );
              } else {
                return null;
              }
            })}
          </div>

          <div className={styles.desktopLinks}>
            {menuItems.map((item, idx) => {
              return (
                <button
                  key={idx}
                  className={`${styles.sidebarLink} ${tab === item?.tabName ? styles.activeLink : ""}`}
                  onClick={() => setTab(item?.tabName || "")}
                >
                  <span>{item?.title}</span>
                </button>
              );
            })}

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <span>Выйти</span>
            </button>
          </div>
        </aside>

        <main className={styles.main}>{elementMapping[tab]}</main>
      </div>
    </div>
  );
}

export default UserProfile;
