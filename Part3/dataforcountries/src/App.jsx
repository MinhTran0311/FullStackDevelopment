import { useState, useEffect } from "react";
import Query from "./components/Query";
import countriesService from "./services/countries";
import weatherService from "./services/weather";
import CountryInfo from "./components/CountryInfo";
import DetailCountry from "./components/DetailCountry";
function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [detailCountry, setDetailCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [weather, setWeather] = useState(null);

  const getCountries = () => {
    countriesService
      .getAllCountries()
      .then((res) => {
        setCountries(res);
        setFilteredCountries(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(getCountries, []);

  const searchHandler = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const numberOfMatchCountries = countries.filter((c) =>
      c.name.common.toLowerCase().includes(value)
    ).length;

    if (!value || value === "") {
      setFilteredCountries(countries);
      setDetailCountry(null);
    } else if (numberOfMatchCountries === 1) {
      showDetailCountry(
        countries.find((c) => c.name.common.toLowerCase().includes(value))
      );
    } else if (value !== "" && numberOfMatchCountries > 1) {
      setFilteredCountries(
        countries.filter((c) => c.name.common.toLowerCase().includes(value))
      );
      setDetailCountry(null);
    }
  };

  const showDetailCountry = (c) => {
    setDetailCountry(c);
    fetchWeather(c.capitalInfo.latlng);
  };

  const fetchWeather = (latlng) => {
    weatherService
      .getWeatherByCapital(latlng)
      .then((data) => setWeather(data))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Query searchTerm={searchTerm} searchHandler={searchHandler} />
      {detailCountry !== null ? (
        <DetailCountry country={detailCountry} weather={weather} />
      ) : (
        <CountryInfo
          showDetailCountryHandler={showDetailCountry}
          countries={filteredCountries}
        />
      )}
    </>
  );
}

export default App;
