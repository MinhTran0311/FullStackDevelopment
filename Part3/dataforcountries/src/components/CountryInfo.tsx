import React from "react";

const CountryInfo = ({ countries, showDetailCountryHandler }) => {
  if (!countries) return null;
  else if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return countries.map((c) => (
      <p key={c.name.common}>
        {c.name.common}{" "}
        <button onClick={() => showDetailCountryHandler(c)}>show</button>
      </p>
    ));
  }
};

export default CountryInfo;
