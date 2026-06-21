import React, { useState, useEffect } from "react";

const CountryFlag = ({ countryName, className }) => {
  const [flagUrl, setFlagUrl] = useState("");

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();
        setFlagUrl(data[0].flags.svg);
      } catch (error) {
        console.error("Error fetching the flag:", error);
      }
    };

    fetchFlag();
  }, [countryName]);

  return flagUrl ? <img src={flagUrl} alt={`${countryName} flag`} className={className} /> : <span>🏳️</span>;
};

export default CountryFlag;
