import { useState, useMemo } from "react";
import cities from "../data/cities.json";

const StateCityDropdown = ({ onCitySelect }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
   // ✅ Get unique states
  const states = useMemo(() => {
    return [...new Set(cities.map((item) => item.state))].sort();
  }, []);

  // ✅ Filter cities based on selected state
  const filteredCities = useMemo(() => {
    return cities.filter(
      (item) => item.state === selectedState
    );
  }, [selectedState]);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {/* STATE DROPDOWN */}
      <select
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* CITY DROPDOWN */}
      <select
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          onCitySelect?.(e.target.value);
        }}
        disabled={!selectedState}
      >
        <option value="">Select City</option>
        {filteredCities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StateCityDropdown;