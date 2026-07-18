import { Link, useNavigate } from "react-router-dom";
import {CitySearch} from "../index";

export default function Hero() {
  const navigate = useNavigate();

  const handleCitySelect = (cityName) => {
    if (cityName) {
      navigate(`/explore?city=${encodeURIComponent(cityName)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FFFBF5] min-h-screen flex flex-col justify-center">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-teal-50" />

      {/* Decorative blurred circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center w-full">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-widest uppercase border border-orange-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Your India Travel Guide
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black text-stone-900 leading-tight mb-6"
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
        <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Every street has a story. Every city has a soul. Explore India with us
          as we uncover the traditions, people, and places that make this country
          truly incredible.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/explore"
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide rounded-full shadow-lg shadow-orange-200 transition-all duration-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Let's Explore →
          </Link>
          <Link
            to="/explore"
            className="px-8 py-3.5 bg-transparent border-2 border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white font-bold text-sm tracking-wide rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            View All Places
          </Link>
        </div>

        {/* City Search Bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">
            Or search a city directly
          </p>
          <div className="w-full max-w-sm">
            <CitySearch
              onSelectCity={handleCitySelect}
              externalReset={false}
            />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-stone-400">
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-stone-300 to-transparent animate-bounce" />
        </div>
      </div>

      {/* Smudge fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,251,245,0.6) 40%, rgba(255,247,237,0.92) 75%, #fff7ed 100%)",
        }}
      />
    </section>
  );
}