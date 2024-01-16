import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.sass";
import { ContextData } from "../../context/context";
import { CiSearch } from "react-icons/ci";
import dayjs from "dayjs";

const API_KEY = "8b20acc8341736c900f949c7de6499fa";

export default function Body() {
  const { cityName, setCityName, valueCity, setValueCity, setHistoryData } =
    useContext(ContextData);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const nowDate = new Date();

  useEffect(() => {
    setHistoryData((prev) => [
      {
        name: data.name,
        img: `/${fileNames[data.main]}.png`,
        temp: Math.round(data.temp),
        date: dayjs(nowDate).format("dddd DD MMMM YYYY / h : mm : ss a"),
        humidity: data.humidity,
        speed: data.speed,
        main: fileNames[data.main],
      },
      ...(prev || []),
    ]);

    const fetchData = async () => {
      try {
        if (!cityName.trim()) return;
        const cityInfo = await getGeo(cityName);

        if (cityInfo.length > 0) {
          const weatherInfo = await getWeather(
            cityInfo[0]["lat"],
            cityInfo[0]["lon"],
          );

          setData({
            name: weatherInfo.name,
            temp: weatherInfo.main.temp,
            humidity: weatherInfo.main.humidity,
            speed: weatherInfo.wind.speed,
            main: weatherInfo.weather[0]["main"],
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const submitHandler = async () => {
      if (!cityName.trim()) return;
      setLoading(true);

      const cityInfo = await getGeo(cityName);

      if (!cityInfo.length) {
        setLoading(false);
        return;
      }

      const weatherInfo = await getWeather(
        cityInfo[0]["lat"],
        cityInfo[0]["lon"],
      );

      setData({
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        speed: weatherInfo.wind.speed,
        main: weatherInfo.weather[0]["main"],
      });
      setValueCity("");
      setLoading(false);
    };

    fetchData();
    submitHandler();
  }, [cityName]);

  const getGeo = async (name) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`,
      );
      return res?.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const getWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      );
      return res?.data;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  const fileNames = {
    Clouds: "clouds",
    Clear: "clear",
    Rain: "rain",
    Mist: "mist",
    Drizzle: "drizzle",
    Snow: "snow",
  };

  const onFinish = (value) => {
    value.preventDefault();
    setCityName(valueCity);
  };

  return (
    <div className={styles.weather}>
      <form onSubmit={onFinish} className={styles.weather__weatherSearch}>
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

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          {data.name && (
            <div className={styles.WeatherInformation}>
              <div className={styles.WeatherInformation__img}>
                <div className={styles.WeatherInformation__first}>
                  <h2>{fileNames[data.main]} showes</h2>
                  <img
                    src={`/${fileNames[data.main]}.png`}
                    alt={`${data.main} icon`}
                  />
                </div>
                <div className={styles.WeatherInformation__second}>
                  <div>
                    <h2>{Math.round(data.temp)}°C</h2>
                    <h1>{data.name}</h1>
                    <p>{dayjs(nowDate).format("dddd DD MMMM YYYY")}</p>
                    <span>{dayjs(nowDate).format("h : mm : ss a")}</span>
                  </div>
                </div>
              </div>
              <div>
                <hr />
                <div className={styles.WeatherInformation__info}>
                  <div>
                    <img src="/svg/humidity.svg" alt="svg" />
                    <h3>{data.humidity} %</h3>
                    <p>Humidity</p>
                  </div>

                  <p className={styles.WeatherInformation__showes}>
                    {fileNames[data.main]} showes
                  </p>

                  <div>
                    <img src="/svg/wind-speed.svg" alt="img" />
                    <h3>{data.speed} km/h</h3>
                    <p>Speed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
