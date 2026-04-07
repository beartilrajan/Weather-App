const city = document.getElementById("city");
const search = document.getElementById("search");
const statusText = document.getElementById("status");
const resultCard = document.getElementById("result");
const locationText = document.getElementById("location");
const conditionText = document.getElementById("condition");
const weatherIcon = document.getElementById("weather-icon");
const temperatureText = document.getElementById("temperature");
const feelsLikeText = document.getElementById("feels-like");
const summaryText = document.getElementById("summary");
const humidityText = document.getElementById("humidity");
const windText = document.getElementById("wind");
const apparentText = document.getElementById("apparent");

search.addEventListener("click", handleSearch);
addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const cityName = city.value.trim();

  if (!cityName) {
    setStatus("Type a city name first.", true);
    return;
  }
  getWeather(cityName);
  city.value = "";
}


async function getWeather(cityName) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  try {
    setStatus(`Looking up ${cityName}...`);
    resultCard.classList.add("empty");

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Failed to fetch location data");
    }

    const geoData = await geoResponse.json();
    const location = geoData.results?.[0];

    if (!location) {
      throw new Error("City not found");
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const weatherInfo = getWeatherInfo(current.weather_code);
    const displayLocation = [location.name, location.admin1, location.country]
      .filter(Boolean)
      .join(", ");

    locationText.textContent = displayLocation;
    conditionText.textContent = weatherInfo.label;
    weatherIcon.textContent = weatherInfo.icon;
    temperatureText.textContent = Math.round(current.temperature_2m);
    feelsLikeText.textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;
    summaryText.textContent = `${weatherInfo.summary} Humidity is ${current.relative_humidity_2m}% and wind is ${Math.round(current.wind_speed_10m)} km/h.`;
    humidityText.textContent = `${current.relative_humidity_2m}%`;
    windText.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    apparentText.textContent = `${Math.round(current.apparent_temperature)}°C`;
    resultCard.classList.remove("empty");

    setStatus(`Showing live weather for ${displayLocation}.`);
  } catch (error) {
    locationText.textContent = "No results";
    conditionText.textContent = "--";
    weatherIcon.textContent = "⛅";
    temperatureText.textContent = "--";
    feelsLikeText.textContent = "Feels like --°C";
    summaryText.textContent = "No weather data available yet.";
    humidityText.textContent = "--%";
    windText.textContent = "-- km/h";
    apparentText.textContent = "--°C";
    resultCard.classList.add("empty");
    setStatus(error.message || "Something went wrong.", true);
    console.error("Error fetching weather data:", error);
  }
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function getWeatherInfo(code) {
  const mapping = {
    0: { label: "Clear sky", icon: "☀️", summary: "The sky is clear and bright." },
    1: { label: "Mostly clear", icon: "🌤️", summary: "Mostly clear with a few clouds." },
    2: { label: "Partly cloudy", icon: "⛅", summary: "A mix of sun and clouds." },
    3: { label: "Overcast", icon: "☁️", summary: "Cloud cover is keeping things gray." },
    45: { label: "Fog", icon: "🌫️", summary: "Visibility is reduced by fog." },
    48: { label: "Depositing rime fog", icon: "🌫️", summary: "Fog is causing a frosty buildup." },
    51: { label: "Light drizzle", icon: "🌦️", summary: "Light drizzle is falling." },
    53: { label: "Drizzle", icon: "🌦️", summary: "There is steady drizzle." },
    55: { label: "Dense drizzle", icon: "🌧️", summary: "Drizzle is heavier than usual." },
    61: { label: "Light rain", icon: "🌧️", summary: "Light rain is moving through." },
    63: { label: "Rain", icon: "🌧️", summary: "Rain is falling right now." },
    65: { label: "Heavy rain", icon: "⛈️", summary: "Heavy rain is making it wet outside." },
    71: { label: "Light snow", icon: "🌨️", summary: "Light snow is falling." },
    73: { label: "Snow", icon: "🌨️", summary: "Snow is coming down." },
    75: { label: "Heavy snow", icon: "❄️", summary: "Snowfall is intense." },
    80: { label: "Rain showers", icon: "🌦️", summary: "Short rain showers are passing through." },
    81: { label: "Rain showers", icon: "🌦️", summary: "Intermittent rain showers are expected." },
    82: { label: "Heavy showers", icon: "⛈️", summary: "Rain showers are strong and frequent." },
    95: { label: "Thunderstorm", icon: "⛈️", summary: "Thunderstorms are active." },
    96: { label: "Thunderstorm with hail", icon: "⛈️", summary: "Thunderstorms may include hail." },
    99: { label: "Thunderstorm with hail", icon: "⛈️", summary: "Severe thunderstorms with hail are possible." },
  };

  return mapping[code] || { label: "Unknown", icon: "🌡️", summary: "Weather conditions are unavailable." };
}