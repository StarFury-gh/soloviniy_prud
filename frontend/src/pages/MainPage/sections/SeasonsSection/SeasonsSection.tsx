import { useState } from "react";
import styles from "./SeasonsSection.module.css";

import spring from "/spring.jpg";
import summer from "/summer.jpg";
import autumn from "/autumn.jpg";
import winter from "/winter.jpg";

const seasons = [
  {
    id: "spring",
    label: "🌸 Весна",
    title: "Пробуждение природы",
    desc: "Апрель и май — время, когда пруд просыпается. Прилетают перелётные птицы, расцветает черёмуха и сирень вдоль берегов, а соловьи начинают свои ночные концерты.",
    activities: [
      "Наблюдение за птицами",
      "Субботники по очистке берегов",
      "Фотоохота на цветение",
      "Велопрогулки по тропам",
    ],
    img: spring,
  },
  {
    id: "summer",
    label: "☀️ Лето",
    title: "Зелёный рай у воды",
    desc: "Лето на Соловьином — это пикники под вековыми дубами, утренняя рыбалка в тишине и вечерние прогулки с видом на закат, отражающийся в спокойной воде.",
    activities: [
      "Рыбалка на удочку",
      "Пикники и отдых",
      "Летние кинопоказы",
      "Экоуроки для детей",
    ],
    img: summer,
  },
  {
    id: "autumn",
    label: "🍂 Осень",
    title: "Золотое отражение",
    desc: "Осенью пруд превращается в зеркало золотого леса. Клёны и ясени окрашивают воду в медь и бронзу. Лучшее время для художников и фотографов.",
    activities: [
      "Осенние фотосессии",
      "Пленэры для художников",
      "Сбор листьев с детьми",
      "Грибные прогулки",
    ],
    img: autumn,
  },
  {
    id: "winter",
    label: "❄️ Зима",
    title: "Тихая белая сказка",
    desc: "Замёрзший пруд становится катком под открытым небом. Заснеженные деревья, тишина и ледяное зеркало — особое настроение, которое дарит только Соловьиный зимой.",
    activities: [
      "Коньки на пруду",
      "Зимние прогулки",
      "Новогодний субботник",
      "Кормление уток",
    ],
    img: winter,
  },
];

function SeasonsSection() {
  const [active, setActive] = useState(seasons[0].id);
  const season = seasons.find((s) => s.id === active)!;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>Всесезонный отдых</div>
          <h2 className={styles.title}>Пруд, который живёт круглый год</h2>
          <p className={styles.subtitle}>
            Каждое время года открывает Соловьиный пруд с новой стороны. Здесь
            всегда есть чем заняться и что открыть заново.
          </p>
        </div>

        <div className={styles.tabs}>
          {seasons.map((s) => (
            <button
              key={s.id}
              className={`${styles.tab} ${active === s.id ? styles.activeTab : ""}`}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardImg}>
            <img src={season.img} alt={season.title} />
          </div>
          <div className={styles.cardBody}>
            <span className={styles.seasonBadge}>{season.label}</span>
            <h3 className={styles.cardTitle}>{season.title}</h3>
            <p className={styles.cardDesc}>{season.desc}</p>
            <ul className={styles.activities}>
              {season.activities.map((a) => (
                <li key={a} className={styles.activity}>
                  <span className={styles.activityDot} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeasonsSection;
