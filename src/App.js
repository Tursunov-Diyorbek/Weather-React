import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import styles from "./index.module.sass";

const API_KEY = "4d0acb5c587ea09e45d027229439b325";

function App() {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
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
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

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
    setCityName("");
    setLoading(false);
  };

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

  return (
    <div className={styles.weather}>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="City name"
        />
      </form>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          {data.name && (
            <div className={styles.WeatherInformation}>
              <img
                src={`/${fileNames[data.main]}.png`}
                alt={`${data.main} icon`}
              />
              <div>
                <div className={styles.WeatherInformation__header}>
                  <h2>{Math.round(data.temp)}°C</h2>
                  <h1>{data.name}</h1>
                </div>
                <hr />
                <div>
                  <p>Namlik: {data.humidity}%</p>
                  <p>Shamol tezligi: {data.speed} km/h</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
