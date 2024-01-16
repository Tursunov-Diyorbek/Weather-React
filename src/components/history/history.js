import styles from "./index.module.sass";
import { useContext } from "react";
import { ContextData } from "../../context/context";

export default function History() {
  const { historyData } = useContext(ContextData);

  return (
    <div className={styles.history}>
      {historyData
        .filter((item) => item.temp !== null)
        .map((item, index) => {
          return (
            <div className={styles.history__cards} key={index}>
              <div className={styles.history__header}>
                <img src={item.img} alt="photo" />
                <div>
                  <p>{item.temp} °C</p>
                  <p>{item.name}</p>
                </div>
              </div>
              <p className={styles.history__date}>{item.date}</p>
              <hr style={{ margin: "5px 0" }} />
              <p style={{ textAlign: "center", marginBottom: 5 }}>
                {item.main}
              </p>
              <div className={styles.history__section}>
                <p>Humidity: {item.humidity} %</p>
                <p>Speed: {item.speed} km/h</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
