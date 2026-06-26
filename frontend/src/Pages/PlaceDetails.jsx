import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axiosInstance";

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/places/${id}`);
        setPlace(res.data.place);
      } catch (err) {
        setError("Place not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading place details...</p>
      </div>
    );
  }

  // Not found / error
  if (error || !place) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4">🗺️</div>
        <h2
          className="text-3xl font-black text-stone-800 mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Place not found
        </h2>
        <p className="text-stone-400 text-sm mb-6">
          We couldn't find the place you're looking for.
        </p>
        <Link
          to="/explore"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200"
        >
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-[420px] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          to="/my-places"
          className="absolute top-5 left-5 inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30 transition-all duration-200"
        >
          ← Back
        </Link>

        {/* Place name */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <h1
            className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {place.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left — Description */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">
              📖 About this place
            </p>
            <p className="text-stone-600 text-base leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Direction Guidance — only if present */}
          {place.directionGuidance && (
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">
              <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">
                🧭 Direction Guidance
              </p>
              <p className="text-stone-600 text-base leading-relaxed">
                {place.directionGuidance}
              </p>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Location card */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-4">
              📍 Location
            </p>
            <div className="flex flex-col gap-3">
              {place.city && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-400 font-medium">City</span>
                  <span className="text-sm font-bold text-stone-700">{place.city}</span>
                </div>
              )}
              {place.state && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-400 font-medium">State</span>
                  <span className="text-sm font-bold text-stone-700">{place.state}</span>
                </div>
              )}
              {place.location?.address && (
                <div className="flex flex-col gap-1 pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-400 font-medium">Detected Address</span>
                  <span className="text-xs text-stone-600">{place.location.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Added by */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-3">
              👤 Added by
            </p>
            <p className="text-sm font-semibold text-stone-700">{place.email}</p>
          </div>

          {/* CTA */}
          <Link
            to="/explore"
            className="w-full text-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5"
          >
            ← Explore More Places
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;