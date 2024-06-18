const WeatherInfo = ({ weatherData, capital }) => {
  console.log(weatherData.weather.icon);
  if (!weatherData) return null;
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weatherData.main.temp} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}/>
      <p>wind {weatherData.wind.speed}m/s</p>
    </div>
  );
};
export default WeatherInfo;
