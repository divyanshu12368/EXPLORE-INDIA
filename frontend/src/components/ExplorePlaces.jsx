// src/components/ExplorePlace.jsx

import { useState } from "react";
import { StateCityDropdown } from "./index";
import { SelectedCards } from "./index";

const ExplorePlaces = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleReset = () => {
    setCity("");
    setState("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Page Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2">
          Explore
        </p>
        <h1
          className="text-4xl md:text-5xl font-black text-stone-900 mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Find Tourist Places
        </h1>
        <p className="text-stone-500 text-base max-w-xl mx-auto">
          Select a state and city to discover the best tourist destinations across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm px-6 py-5 mb-10 flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <StateCityDropdown onCitySelect={setCity} onStateSelect={setState} onReset={handleReset} />
        </div>
        {(city || state) && (
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-stone-400 hover:text-orange-500 transition-colors duration-200 whitespace-nowrap pb-1"
          >
            ✕ Clear filter
          </button>
        )}
      </div>

      {/* Active filter badge */}
      {city && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-stone-500">Showing results for</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold border border-orange-200">
            📍 {city}{state ? `, ${state}` : ""}
          </span>
        </div>
      )}

      {/* Cards */}
      <SelectedCards selectedCity={city} />
    </div>
  );
};

export default ExplorePlaces;