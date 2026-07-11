import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";

export default function TopPlacesSlider() {
  const [places, setPlaces] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);

  const VISIBLE = 3; // cards visible at once on desktop

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await api.get("/api/places/all");
        setPlaces(res.data.places || []);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (places.length === 0) return;
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [places]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goNext();
    }, 3500);
  };

  const stopAutoSlide = () => clearInterval(intervalRef.current);

  // Build an extended track: [last clone, ...all places, first clones...]
  // so we always have enough cards to slide into view smoothly
  const extendedPlaces =
  Array.isArray(places) && places.length > 0
    ? [...places, ...places.slice(0, VISIBLE)]
    : [];

  const goNext = () => {
    setTransition(true);
    setCurrent((prev) => prev + 1);
  };

  const goPrev = () => {
    setTransition(true);
    setCurrent((prev) => (prev - 1 + places.length) % places.length);
  };

  const goTo = (index) => {
    setTransition(true);
    setCurrent(index);
    startAutoSlide();
  };

  // When we slide past the real items into the cloned region, snap back invisibly
  useEffect(() => {
    if (places.length === 0) return;
    if (current >= places.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 500); // matches transition duration
      return () => clearTimeout(timeout);
    }
  }, [current, places.length]);

  if (loading) {
    return (
      <section className="bg-[#FFFBF5] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-orange-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-100 rounded-full w-3/4" />
                  <div className="h-3 bg-stone-100 rounded-full w-full" />
                  <div className="h-3 bg-stone-100 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (places.length === 0) return null;

  // Each card takes 100/VISIBLE % width; track shifts by `current` cards
  const cardWidthPercent = 100 / VISIBLE;

  return (
    <section className="bg-[#FFFBF5] px-6 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2">
              Recently Added
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-stone-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Top Places to Visit
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { goPrev(); startAutoSlide(); }}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { goNext(); startAutoSlide(); }}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider viewport */}
        <div
          className="overflow-hidden"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(-${current * cardWidthPercent}%)`,
              transition: transition ? "transform 500ms ease-in-out" : "none",
            }}
          >
            {extendedPlaces.map((place, i) => (
              <div
                key={`${place._id}-${i}`}
                className="px-3 box-border flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
              >
                <Link
                  to={`/place/${place._id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="overflow-hidden h-52 relative">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold border border-teal-100 shadow-sm">
                      {place.state}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="font-black text-stone-900 text-base mb-1.5 group-hover:text-orange-500 transition-colors duration-200"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {place.name}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {place.city}
                      </span>
                      <span className="text-xs font-semibold text-orange-500 group-hover:translate-x-0.5 transition-transform duration-200">
                        View details →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {places.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-orange-500"
                  : "w-2 h-2 bg-stone-200 hover:bg-stone-300"
              }`}
            />
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            View All Places
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}