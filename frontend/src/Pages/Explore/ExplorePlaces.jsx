import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { StateCityDropdown } from "../../components/index";
import { SelectedCards } from "../../components/index";
import {CitySearch} from "../../components/index";

const ExplorePlaces = () => {
  const [searchParams] = useSearchParams();
  const initializedRef = useRef(false);

  const [city, setCity] = useState(() => {
    // Initialize city directly from URL on first render
    const cityParam = searchParams.get("city");
    return cityParam ? decodeURIComponent(cityParam) : "";
  });

  const [state, setState] = useState("");
  const [sortByLiked, setSortByLiked] = useState(() => {
    return searchParams.get("sort") === "liked";
  });

  const [resetSearch, setResetSearch] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);

  // Only respond to searchParams changes AFTER initial mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    const cityParam = searchParams.get("city");
    const sortParam = searchParams.get("sort");

    setCity(cityParam ? decodeURIComponent(cityParam) : "");
    setSortByLiked(sortParam === "liked");
    setResetSearch((prev) => !prev);
    setResetDropdown((prev) => !prev);
  }, [searchParams]);

  const handleReset = () => {
    setCity("");
    setState("");
    setSortByLiked(false);
    setResetSearch((prev) => !prev);
    setResetDropdown((prev) => !prev);
  };

  const handleDropdownCity = (val) => {
    setCity(val);
    setSortByLiked(false);
    setResetSearch((prev) => !prev);
  };

  const handleDropdownState = (val) => {
    setState(val);
    setSortByLiked(false);
  };

  const handleSearchCity = (val) => {
    setCity(val);
    setState("");
    setSortByLiked(false);
    setResetDropdown((prev) => !prev);
  };

  const isFiltered = city || state || sortByLiked;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase mb-4">
          Discover India
        </span>
        <h1
          className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Find Tourist Places
        </h1>
        <p className="text-stone-500 text-base max-w-lg mx-auto leading-relaxed">
          Select a state and city to discover the best tourist destinations across India, contributed by fellow travelers.
        </p>
      </div>

      {/* Filter cluster */}
      <div className="flex flex-col lg:flex-row lg:justify-end lg:items-start gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wide text-stone-400 uppercase">
            Search by City
          </span>
          <CitySearch onSelectCity={handleSearchCity} externalReset={resetSearch} />
        </div>

        {/* <div className="hidden lg:flex items-end pb-2.5">
          <span className="text-xs font-bold text-stone-300 px-1">OR</span>
        </div> */}

        {/* <div className="flex flex-col gap-1.5 w-full lg:w-auto">
          <span className="text-xs font-bold tracking-wide text-stone-400 uppercase">
            Browse by State
          </span>
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm px-6 py-4 lg:min-w-[420px]">
            <StateCityDropdown
              onCitySelect={handleDropdownCity}
              onStateSelect={handleDropdownState}
              onReset={resetDropdown}
            />
          </div>
        </div> */}
      </div>

      {/* Clear filter */}
      {isFiltered && (
        <div className="flex justify-end mb-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-stone-400 hover:text-red-400 hover:border-red-200 hover:bg-red-50 text-sm font-semibold transition-all duration-200 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filter
          </button>
        </div>
      )}

      {/* Active filter badge */}
      {isFiltered && (
        <div className="mb-8 flex items-center gap-2">
          <span className="text-sm text-stone-400 font-medium">Showing results for</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sortByLiked
              ? "Most Liked Places"
              : city
              ? `${city}${state ? `, ${state}` : ""}`
              : state}
          </span>
        </div>
      )}

      {/* Section label when no filter */}
      {!isFiltered && (
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">
            Recently Added Places
          </span>
          <div className="flex-1 h-px bg-stone-100" />
        </div>
      )}

      {/* Section label when sort=liked */}
      {sortByLiked && !city && (
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">
            Community Favourites
          </span>
          <div className="flex-1 h-px bg-stone-100" />
        </div>
      )}

      {/* Cards */}
      <SelectedCards
        selectedCity={city}
        selectedState={state}
        sortByLiked={sortByLiked}
      />
    </div>
  );
};

export default ExplorePlaces;