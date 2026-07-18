import { useState, useEffect, useRef } from "react";
import api from "../../../utils/axiosInstance";

function CitySearch({ onSelectCity, externalReset }) {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/api/cities");
        setCities(res.data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, []);

  // Reset when parent signals (e.g. dropdown was used instead, or filter cleared)
  useEffect(() => {
    setSearch("");
    setShowSuggestions(false);
  }, [externalReset]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = cities
    .filter((city) => city.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(value.trim() !== "");
    if (value.trim() === "") {
      onSelectCity("");
    }
  };

  const handleSelect = (city) => {
    setSearch(city.name);
    setShowSuggestions(false);
    onSelectCity(city.name);
  };

  const handleClear = () => {
    setSearch("");
    setShowSuggestions(false);
    onSelectCity("");
  };

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-72">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>

        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={handleChange}
          onFocus={() => search && setShowSuggestions(true)}
          onKeyDown={(e) => e.key === "Escape" && setShowSuggestions(false)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
        />

        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredCities.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-stone-100 shadow-lg overflow-hidden list-none p-0 m-0">
          {filteredCities.map((city) => (
            <li key={city.id}>
              <button
                onClick={() => handleSelect(city)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150 text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{city.name}</span>
                <span className="text-stone-400 text-xs ml-auto">{city.state}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No matches */}
      {showSuggestions && search && filteredCities.length === 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-stone-100 shadow-lg px-4 py-3 text-sm text-stone-400">
          No cities found
        </div>
      )}
    </div>
  );
}

export default CitySearch;