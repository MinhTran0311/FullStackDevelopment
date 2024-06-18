import React from "react";
import WeatherInfo from "./WeatherInfo";
import Languages from "./Languagues";

const DetailCountry = ({ country, weather }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <Languages languages={country.languages}/>
      <img src={country.flags.png} />
      <WeatherInfo capital={country.capital} weatherData={weather}/>
    </>
  );
};

export default DetailCountry;
