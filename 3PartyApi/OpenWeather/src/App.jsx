import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const apiKey = "x";

  const getWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert(data.message || "City not found");
      }
    } catch (err) {
      alert("Error fetching weather");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Weather App (3rd Party API)</h2>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      {" "}
      <button onClick={getWeather}>Get Weather</button>

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h3>City: {weather.name}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
