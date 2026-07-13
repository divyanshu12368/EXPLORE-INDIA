import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PlaceCard from "../Cards/PlaceCard";

export default function PlacesSlider({ places = [], title, subtitle, viewAllLink = "/explore" }) {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);
  const VISIBLE = 3;

  useEffect(() => {
    if (places.length === 0) return;
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [places]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => goNext(), 3500);
  };

  const stopAutoSlide = () => clearInterval(intervalRef.current);

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

  useEffect(() => {
    if (places.length === 0) return;
    if (current >= places.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [current, places.length]);

  if (places.length === 0) return null;

  const extendedPlaces =
    Array.isArray(places) && places.length > 0
      ? [...places, ...places.slice(0, VISIBLE)]
      : [];

  const cardWidthPercent = 100 / VISIBLE;

  return (
    <section className="bg-[#FFFBF5] px-6 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            {subtitle && (
              <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2">
                {subtitle}
              </p>
            )}
            <h2
              className="text-3xl md:text-4xl font-black text-stone-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {title}
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

        {/* Slider */}
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
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {places.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-stone-200 hover:bg-stone-300"
              }`}
            />
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            to={viewAllLink}
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