import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import api from "../../../utils/axiosInstance";

const PlaceCard = ({ place }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(place.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const res = await api.get(
          `/api/extras/likes/${place._id}${user ? `?email=${user.email}` : ""}`
        );
        setLiked(res.data.liked);
        setLikeCount(res.data.count);
      } catch {
        // fail silently
      }
    };
    fetchLike();
  }, [place._id, user?.email]);

  const handleLike = async (e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      setLikeLoading(true);
      const res = await api.post(`/api/extras/likes/${place._id}`, {
        email: user.email,
      });
      setLiked(res.data.liked);
      setLikeCount(res.data.count);
    } catch {
      // Revert on failure
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  return (
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

        {/* Footer row */}
        <div className="flex items-center justify-between">

          {/* Left: city + views */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.city}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 bg-stone-50 border border-stone-100 px-2.5 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {place.views ?? 0}
            </span>
          </div>

          {/* Right: like button */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200 disabled:opacity-60"
            style={{
              background: liked ? "#fff1f2" : "#f9fafb",
              borderColor: liked ? "#fecdd3" : "#e5e7eb",
              color: liked ? "#e11d48" : "#9ca3af",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill={liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;