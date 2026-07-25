import styles from "./AboutSection.module.css";

import splash from "/splash.jpg";
import {
  bird_icon,
  museum_icon,
  plant_icon,
  water_icon,
} from "../../../../icons";

function AboutSection() {
  const facts = [
    {
      icon: bird_icon,
      title: "Птицы",
      desc: "Часто можно увидеть соловьёв и других птиц",
    },
    {
      icon: plant_icon,
      title: "Богатая флора",
      desc: "Разнообразные виды деревьев, кустарников и цветов, окружающих пруд",
    },
    {
      icon: museum_icon,
      title: "Культурное место",
      desc: "уникальный народный парк Владимира, созданный руками самих жителей из заброшенного пустыря",
    },
    {
      icon: water_icon,
      title: "Чистая вода",
      desc: "В рамках текущего благоустройства на пруду бурят артезианскую скважину глубиной 180 метров",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.imageCol}>
          <div className={styles.imgFrame}>
            <img src={splash} alt="Соловьиный пруд — вид с берега" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeValue}>11,4</span>
            <span className={styles.badgeLabel}>тысячи кубических метров</span>
          </div>
        </div>

        <div className={styles.textCol}>
          <span className={styles.sectionTag}>О пруде</span>
          <h2 className={styles.title}>
            Природное наследие в центре исторического Владимира
          </h2>
          <p className={styles.body}>
            Соловьиный пруд — не просто водоём. Это живой памятник природы и
            культуры, формировавшийся столетиями. Здесь пели соловьи, которые
            дали пруду имя. Здесь горожане отдыхали от летного зноя ещё до
            появления городских парков в современном их понимании.
          </p>
          <p className={styles.body}>
            Сегодня мы возрождаем это место как точку притяжения для всех: семей
            с детьми, любителей природы, художников и просто тех, кто ищет
            тишины в шумном городе. Наравне с Золотыми воротами и Успенским
            собором.
          </p>
          <div className={styles.facts}>
            {facts.map(({ icon, title, desc }) => (
              <div key={title} className={styles.fact}>
                <img className={styles.factIcon} src={icon}></img>
                <span className={styles.factTitle}>{title}</span>
                <span className={styles.factDesc}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
