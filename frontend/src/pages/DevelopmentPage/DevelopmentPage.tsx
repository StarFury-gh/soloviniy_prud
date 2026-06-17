import { useState } from "react";
import styles from "./DevelopmentPage.module.css";

type DevTab = "projects" | "voting" | "roadmap" | "budget";

const projects = [
  {
    id: 1,
    icon: "🌿",
    name: "Экологическая тропа",
    desc: "1.2 км дорожек с информационными стендами",
    budget: "2 500 000 ₽",
    funded: 100,
    status: "done" as const,
    quarter: "Q1 2024",
  },
  {
    id: 2,
    icon: "🔭",
    name: "Смотровая площадка",
    desc: "Деревянный помост 8×12 м с видом на пруд",
    budget: "4 200 000 ₽",
    funded: 67,
    status: "active" as const,
    quarter: "Q2 2024",
  },
  {
    id: 3,
    icon: "🛝",
    name: "Детская площадка",
    desc: "Экостиль с использованием натурального дерева",
    budget: "1 800 000 ₽",
    funded: 34,
    status: "active" as const,
    quarter: "Q3 2024",
  },
  {
    id: 4,
    icon: "💡",
    name: "Освещение набережной",
    desc: "LED-фонари вдоль 800 м берега",
    budget: "3 100 000 ₽",
    funded: 0,
    status: "planned" as const,
    quarter: "Q4 2024",
  },
  {
    id: 5,
    icon: "⛲",
    name: "Реконструкция фонтана",
    desc: "Восстановление исторического фонтана 1890-х гг.",
    budget: "5 600 000 ₽",
    funded: 0,
    status: "planned" as const,
    quarter: "Q1 2025",
  },
];

const statusLabel: Record<string, string> = {
  done: "✅ Завершён",
  active: "🔨 В работе",
  planned: "📅 Запланирован",
};

const proposals = [
  {
    id: 1,
    title: "Велодорожка вокруг пруда",
    votes: 847,
    desc: "Кольцевой маршрут 3.4 км для велосипедистов и самокатчиков",
    budget: "7 800 000 ₽",
  },
  {
    id: 2,
    title: "Открытый амфитеатр",
    votes: 623,
    desc: "Площадка на 300 мест для концертов и кинопоказов",
    budget: "12 500 000 ₽",
  },
  {
    id: 3,
    title: "Пляжная зона",
    votes: 521,
    desc: "Облагороженный пляж с деревянными лежаками",
    budget: "4 200 000 ₽",
  },
  {
    id: 4,
    title: "Арт-объекты и скульптуры",
    votes: 312,
    desc: "Конкурс на создание 5 инсталляций о природе",
    budget: "2 100 000 ₽",
  },
];

const roadmap = [
  {
    year: "2024",
    items: [
      {
        q: "Q1",
        name: "Экологическая тропа",
        budget: "2.5 млн ₽",
        status: "itemDone" as const,
        statusText: "✅ Выполнено",
      },
      {
        q: "Q2",
        name: "Смотровая площадка",
        budget: "4.2 млн ₽",
        status: "itemActive" as const,
        statusText: "🔨 В процессе",
      },
      {
        q: "Q3",
        name: "Детская площадка",
        budget: "1.8 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
      {
        q: "Q4",
        name: "Освещение набережной",
        budget: "3.1 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        q: "Q1",
        name: "Реконструкция фонтана",
        budget: "5.6 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
      {
        q: "Q2",
        name: "Велодорожка",
        budget: "7.8 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
      {
        q: "Q3",
        name: "Амфитеатр (I этап)",
        budget: "6.2 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
      {
        q: "Q4",
        name: "Пляжная зона",
        budget: "4.2 млн ₽",
        status: "itemPlanned" as const,
        statusText: "📅 Запланировано",
      },
    ],
  },
];

const budgetLines = [
  { category: "Строительство и монтаж", amount: "8 400 000 ₽", pct: "49%" },
  {
    category: "Проектирование и экспертиза",
    amount: "1 700 000 ₽",
    pct: "10%",
  },
  { category: "Озеленение и экология", amount: "2 100 000 ₽", pct: "12%" },
  { category: "Коммуникации и свет", amount: "3 100 000 ₽", pct: "18%" },
  { category: "Субботники и волонтёрство", amount: "420 000 ₽", pct: "2%" },
  { category: "Резервный фонд", amount: "1 480 000 ₽", pct: "9%" },
];

function DevelopmentPage() {
  const [tab, setTab] = useState<DevTab>("projects");
  const [votedId, setVotedId] = useState<number | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>(
    Object.fromEntries(proposals.map((p) => [p.id, p.votes])),
  );

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(...Object.values(voteCounts));

  const handleVote = (id: number) => {
    if (votedId !== null) return;
    setVotedId(id);
    setVoteCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const tabs: { id: DevTab; label: string }[] = [
    { id: "projects", label: "Проекты" },
    { id: "voting", label: "Голосование" },
    { id: "roadmap", label: "Дорожная карта" },
    { id: "budget", label: "Публичный бюджет" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHero}>
        <div className={styles.pageHeroTag}>Открытый план развития</div>
        <h1 className={styles.pageHeroTitle}>Развитие Соловьиного пруда</h1>
        <p className={styles.pageHeroDesc}>
          Прозрачные сметы, публичное голосование за новые объекты и дорожная
          карта работ на 2024–2025 годы. Каждый житель может участвовать в
          принятии решений.
        </p>
      </div>

      <div className={styles.tabNav}>
        <div className={styles.tabNavInner}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.activeTab : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {tab === "projects" && (
          <>
            <h2 className={styles.sectionTitle}>Текущие проекты</h2>
            <p className={styles.sectionDesc}>
              Все проекты финансируются из городского бюджета, грантов и
              пожертвований жителей.
            </p>
            <div className={styles.projects}>
              {projects.map((p) => (
                <div key={p.id} className={styles.projectCard}>
                  <div className={styles.projectHead}>
                    <div className={styles.projectIcon}>{p.icon}</div>
                    <div className={styles.projectInfo}>
                      <p className={styles.projectName}>{p.name}</p>
                      <p className={styles.projectMeta}>
                        {p.desc} · {p.quarter}
                      </p>
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${p.status === "done" ? styles.done : ""}`}
                          style={{ width: `${p.funded}%` }}
                        />
                      </div>
                      <div className={styles.progressInfo}>
                        <span className={styles.progressPct}>
                          {p.funded}% освоено
                        </span>
                        <span className={styles.progressAmount}>
                          {p.budget}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.projectRight}>
                    <span
                      className={`${styles.statusBadge} ${styles[p.status]}`}
                    >
                      {statusLabel[p.status]}
                    </span>
                    <span className={styles.projectBudget}>{p.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "voting" && (
          <>
            <h2 className={styles.sectionTitle}>
              Голосование за новые объекты
            </h2>
            <p className={styles.sectionDesc}>
              {votedId
                ? `Ваш голос учтён! Всего проголосовало: ${totalVotes} человек.`
                : `Выберите проект, который хотите видеть следующим. Всего голосов: ${totalVotes}.`}
            </p>
            <div className={styles.votingGrid}>
              {proposals.map((prop) => {
                const count = voteCounts[prop.id];
                const pct = Math.round((count / maxVotes) * 100);
                return (
                  <div
                    key={prop.id}
                    className={`${styles.voteCard} ${votedId === prop.id ? styles.voted : ""}`}
                    onClick={() => handleVote(prop.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleVote(prop.id)}
                  >
                    <div className={styles.voteHeader}>
                      <span className={styles.voteTitle}>{prop.title}</span>
                      <span>
                        <span className={styles.voteCount}>
                          {count.toLocaleString("ru")}
                        </span>
                        <span className={styles.voteCountLabel}>голосов</span>
                      </span>
                    </div>
                    <div className={styles.voteBar}>
                      <div
                        className={styles.voteFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className={styles.voteDesc}>{prop.desc}</p>
                    <p className={styles.voteBudget}>Смета: {prop.budget}</p>
                  </div>
                );
              })}
            </div>
            {votedId === null && (
              <div className={styles.voteTotal}>
                Нажмите на карточку, чтобы проголосовать ·{" "}
                <strong>1 голос</strong> в руках
              </div>
            )}
          </>
        )}

        {tab === "roadmap" && (
          <>
            <h2 className={styles.sectionTitle}>Дорожная карта</h2>
            <p className={styles.sectionDesc}>
              Публичный план работ по кварталам. Обновляется ежемесячно.
            </p>
            <div className={styles.roadmap}>
              {roadmap.map((yr) => (
                <div key={yr.year} className={styles.roadmapYear}>
                  <div className={styles.roadmapYearLabel}>{yr.year}</div>
                  <div className={styles.roadmapItems}>
                    {yr.items.map((item) => (
                      <div
                        key={item.name}
                        className={`${styles.roadmapItem} ${styles[item.status]}`}
                      >
                        <div className={styles.roadmapItemStripe} />
                        <div className={styles.roadmapQ}>{item.q}</div>
                        <div className={styles.roadmapItemName}>
                          {item.name}
                        </div>
                        <div className={styles.roadmapItemBudget}>
                          {item.budget}
                        </div>
                        <div className={styles.roadmapItemStatus}>
                          {item.statusText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "budget" && (
          <>
            <h2 className={styles.sectionTitle}>Публичный бюджет 2024</h2>
            <p className={styles.sectionDesc}>
              Полная прозрачность расходов. Все статьи подтверждены документами.
            </p>
            <div className={styles.budgetGrid}>
              <div className={styles.budgetCard}>
                <div className={styles.budgetCardValue}>17.2 млн</div>
                <div className={styles.budgetCardLabel}>
                  Общий бюджет на 2024 год, ₽
                </div>
              </div>
              <div className={styles.budgetCard}>
                <div className={styles.budgetCardValue}>6.7 млн</div>
                <div className={styles.budgetCardLabel}>Уже освоено, ₽</div>
              </div>
              <div className={styles.budgetCard}>
                <div className={styles.budgetCardValue}>10.5 млн</div>
                <div className={styles.budgetCardLabel}>
                  Остаток к освоению, ₽
                </div>
              </div>
            </div>
            <table className={styles.budgetTable}>
              <thead>
                <tr>
                  <th>Статья расходов</th>
                  <th>Сумма</th>
                  <th>Доля</th>
                </tr>
              </thead>
              <tbody>
                {budgetLines.map((row) => (
                  <tr key={row.category}>
                    <td className={styles.category}>{row.category}</td>
                    <td className={styles.money}>{row.amount}</td>
                    <td>{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default DevelopmentPage;
