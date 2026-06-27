import { Hero } from "../components/index";
import { Features } from "../components/index";
import TopPlacesSlider from "../components/TopPlacesSlider";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">

      <Hero />

      <TopPlacesSlider />

      <Features />

      {/* CTA Banner */}
      <section className="bg-teal-700 px-6 py-16 text-center">
        <h2
          className="text-3xl md:text-4xl font-black text-white mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Ready to start your journey?
        </h2>
        <p className="text-teal-200 text-base mb-8 max-w-xl mx-auto">
          Thousands of places across India await you. Find your next destination today.
        </p>
        <Link
          to="/explore"
          className="inline-block px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm tracking-wide rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          Start Exploring →
        </Link>
      </section>

    </div>
  );
}