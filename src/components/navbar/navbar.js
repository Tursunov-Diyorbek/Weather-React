import styles from "./index.module.sass";
import { CiSearch } from "react-icons/ci";
import { useContext } from "react";
import { ContextData } from "../../context/context";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { setCityName, valueCity, setValueCity } = useContext(ContextData);
  const navigate = useNavigate();

  const onFinish = (value) => {
    value.preventDefault();
    setCityName(valueCity);
  };

  return (
    <div className={styles.header}>
      <h1>Weather</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <form onSubmit={onFinish} className={styles.header__weatherSearch}>
          <input
            type="text"
            placeholder={"City name"}
            value={valueCity}
            onChange={(e) => setValueCity(e.target.value)}
          />
          <button type="submit">
            <CiSearch />
          </button>
        </form>
        <button
          className={styles.header__historyBtn}
          onClick={() => navigate("/weather-history")}
        >
          History
        </button>
      </div>
    </div>
  );
}
