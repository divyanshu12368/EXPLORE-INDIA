import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Spiritual", "Nature", "Heritage"];

export default function Hero() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("Spiritual");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explore?city=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <section className="relative bg-[#FFFBF5] px-6 py-20">
      <div className="relative z-10 max-w-3xl mx-auto text-center">

        {/* Badge */}
        <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold tracking-widest uppercase border border-teal-200">
          Discover India
        </span>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl font-black text-stone-900 leading-tight mb-5"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Discover the{" "}
          <span className="relative inline-block">
            <span className="text-orange-500">Soul</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 8 Q50 0 100 6 Q150 12 200 4"
                stroke="#f97316"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          of India
        </h1>

        {/* Subtext */}
        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Select a state and city to discover the best tourist destinations across
          India, contributed by fellow travelers and local guides.
        </p>

        {/* Unified search bar + category pills */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 bg-orange-50/70 border border-orange-100 rounded-full px-3 py-2.5 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2.5 flex-1 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by city..."
              className="bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none w-full"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-orange-200" />

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-white text-teal-700 border-teal-600"
                    : "bg-white/60 text-stone-500 border-stone-200 hover:border-stone-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}