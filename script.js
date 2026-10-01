// WeatherNow
// The app works in DEMO MODE by default.
// To use live weather data, add your OpenWeather API key below.

const API_KEY = ""; // Example: "your_api_key_here"

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

const demoWeather = {
  "new delhi": {
    city: "New Delhi",
    temperature: 28,
    condition: "Clear Sky",
    humidity: 45,
    wind: 12,
    feelsLike: 29,
    icon: "☀️"
  },
  "mumbai": {
    city: "Mumbai",
    temperature: 30,
    condition: "Partly Cloudy",
    humidity: 72,
    wind: 15,
    feelsLike: 33,
    icon: "⛅"
  },
  "bangalore": {
    city: "Bangalore",
    temperature: 24,
    condition: "Cloudy",
    humidity: 64,
    wind: 10,
    feelsLike: 25,
    icon: "☁️"
  }
};

function displayWeather(data) {
  document.getElementById("city").textContent = data.city;
  document.getElementById("temperature").textContent = Math.round(data.temperature);
  document.getElementById("condition").textContent = data.condition;
  document.getElementById("humidity").textContent = `${data.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind} km/h`;
  document.getElementById("feelsLike").textContent = `${Math.round(data.feelsLike)}°C`;
  document.getElementById("weatherIcon").textContent = data.icon;
  message.textContent = "";
}

function getDemoWeather(city) {
  const key = city.trim().toLowerCase();
  return demoWeather[key] || {
    city: city.trim(),
    temperature: 26,
    condition: "Partly Cloudy",
    humidity: 58,
    wind: 11,
    feelsLike: 27,
    icon: "⛅"
  };
}

async function getLiveWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("City not found");
  }

  const data = await response.json();

  return {
    city: data.name,
    temperature: data.main.temp,
    condition: data.weather[0].description,
    humidity: data.main.humidity,
    wind: data.wind.speed * 3.6,
    feelsLike: data.main.feels_like,
    icon: getWeatherEmoji(data.weather[0].main)
  };
}

function getWeatherEmoji(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Haze: "🌫️"
  };

  return icons[condition] || "🌤️";
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    return;
  }

  message.textContent = "Loading...";

  try {
    const data = API_KEY
      ? await getLiveWeather(city)
      : getDemoWeather(city);

    displayWeather(data);
  } catch (error) {
    message.textContent = "Could not find that city. Please try again.";
  }
});
