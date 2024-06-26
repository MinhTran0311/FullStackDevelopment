import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const appid = import.meta.env.VITE_WEATHER_API_KEY;

const getWeatherByCapital = (latlng) => {
  const request = axios.get(
    `${baseUrl}?lat=${latlng[0]}&lon=${latlng[1]}&appid=${appid}&units=metric`
  );
  return request.then((response) => response.data);
};

export default { getWeatherByCapital };
