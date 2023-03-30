import axios from "axios";
import { default as React, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      /*my api key*/
      const apiKey = "6aea72a84396cad5b46bf1919b0b5c3a";
      /*first api request goes to the OpenWeatherMap geocoding api to get the latitude and longitude of a user input city*/
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
      const geocodingResponse = await axios.get(geocodingUrl);
      const { lat, lon } = geocodingResponse.data[0];

      /*this api request goes to the OpenWeatherMap weather api. gets the main data that we will be using in imperial units*/
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      const weatherResponse = await axios.get(weatherUrl);
      setWeatherData(weatherResponse.data);
    } catch (error) {
      setError("Error fetching weather data.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWeatherData(null);
    setError(null);
    fetchWeatherData();
  };

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="info">
      <p className="headerIntro">Need to plan your day? Just ask the:</p>
      <h1>Weather Man</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your City"
          value={city}
          onChange={handleChange}
        />
        <button type="submit">Get weather</button>
      </form>
      {weatherData ? (
        <div className="weatherData">
          <p className="weather">
            Location: {weatherData.name}, {weatherData.sys.country}
          </p>
          <p className="weather">
            Temperature: {Math.floor(weatherData.main.temp)}°F
          </p>
          <p className="weather">
            Weather: {weatherData.weather[0].description}
          </p>
          <img
            id="weatherIcon"
            src={
              "../public/images/weatherIcons/" +
              weatherData.weather[0].icon +
              ".png"
            }
            alt="icon for current weather conditions via TheUjulala on Pixabay"
          ></img>
        </div>
      ) : (
        <p className="weather">
          {error ? error : "Enter a city to get started."}
        </p>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
