// src/components/Dropdown/StateCityDropdown.jsx

import { useState, useMemo, useEffect} from "react";
const BASE_URL = import.meta.env.VITE_API_URL;
//import cities from "../../data/cities.json";

const StateCityDropdown = ({ onCitySelect, onStateSelect, onReset }) => {
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(()=>{
  const fetchCities = async () => {
    const res = await fetch(`${BASE_URL}/api/cities`);
    const data = await res.json();
    setCities(data)
  };
  fetchCities();
},[])

  const states = useMemo(() => {
    return [...new Set(cities.map((item) => item.state))].sort();
  }, [cities]);

  const filteredCities = useMemo(() => {
    return cities.filter((item) => item.state === selectedState);
  }, [cities, selectedState]);

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    setSelectedCity("");
    onStateSelect?.(val);
    onCitySelect?.("");
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setSelectedCity(val);
    onCitySelect?.(val);
  };

  // expose reset to parent via useEffect trick — instead we watch onReset as a signal
  // Parent calls handleReset which sets city/state to "" — we sync via controlled reset
  // So we need to allow parent to reset our internal state too.
  // We handle this by making the component re-render when onReset is triggered from parent.
  // Simple approach: lift reset into this component and expose via prop callback.

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">

      {/* State Dropdown */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-bold tracking-wide text-stone-500 uppercase">
          State
        </label>
        <div className="relative">
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full appearance-none bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 font-medium cursor-pointer focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 pr-10"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* City Dropdown */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-bold tracking-wide text-stone-500 uppercase">
          City
        </label>
        <div className="relative">
          <select
            value={selectedCity}
            disabled={!selectedState}
            onChange={handleCityChange}
            className={`w-full appearance-none border rounded-xl px-4 py-3 text-sm font-medium pr-10 transition-all duration-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
              !selectedState
                ? "bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-white border-stone-200 text-stone-700 cursor-pointer"
            }`}
          >
            <option value="">Select City</option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateCityDropdown;