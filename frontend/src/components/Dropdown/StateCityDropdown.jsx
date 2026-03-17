import { useState, useMemo } from "react";
import cities from "../../data/cities.json";

const StateCityDropdown = ({ onCitySelect }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ✅ Get unique states
  const states = useMemo(() => {
    return [...new Set(cities.map((item) => item.state))].sort();
  }, []);

  // ✅ Filter cities based on selected state
  const filteredCities = useMemo(() => {
    return cities.filter((item) => item.state === selectedState);
  }, [selectedState]);

  // --- Professional Inline Styles ---
  const selectStyle = (isDisabled) => ({
    appearance: "none", // Default arrow hatane ke liye
    width: "220px",
    boxSizing: "border-box",
    padding: "10px 36px 10px 12px",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    color: isDisabled ? "#9ca3af" : "#1f2937",
    backgroundColor: isDisabled ? "#f9fafb" : "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    // Custom Arrow SVG
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "16px",
  });

  const containerStyle = {
    display: "flex",
    gap: "1rem",
    padding: "10px",
    maxWidth: "600px",
  };

  const wrapperStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#4b5563",
  };

  return (
    <div style={{ display: 'flex', }}>
    <div style={containerStyle}>
      {/* STATE DROPDOWN */}
      <div style={wrapperStyle}>
        <label style={labelStyle}>State</label>
        <select
          value={selectedState}
          style={selectStyle(false)}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* CITY DROPDOWN */}
      <div style={wrapperStyle}>
        <label style={labelStyle}>City</label>
        <select
          value={selectedCity}
          disabled={!selectedState}
          style={selectStyle(!selectedState)}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            onCitySelect?.(e.target.value);
          }}
          onFocus={(e) => !!selectedState && (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        >
          <option value="">Select City</option>
          {filteredCities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    </div>
  );
};

export default StateCityDropdown;