import "./App.css";
import Navbar from "./components/navbar/navbar";
import Body from "./components/body/body";
import History from "./components/history/history";
import { ContextData } from "./context/context";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocalStorageState } from "ahooks";

function App() {
  const [historyData, setHistoryData] = useLocalStorageState(
    "Weathet-Historys",
    { defaultValue: [] },
  );
  const [cityName, setCityName] = useState("Uzbekistan");
  const [valueCity, setValueCity] = useState("");

  return (
    <ContextData.Provider
      value={{
        cityName,
        setCityName,
        valueCity,
        setValueCity,
        historyData,
        setHistoryData,
      }}
    >
      <Routes>
        <Route
          path={"/"}
          element={
            <>
              <Navbar />
              <Body />
            </>
          }
        />
        <Route path={"/weather-history"} element={<History />}></Route>
      </Routes>
    </ContextData.Provider>
  );
}

export default App;
