import { useState, useEffect } from "react";
import PlacesSlider from "./PlacesSlider";
import api from "../../utils/axiosInstance";

export default function TopLikedSlider() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await api.get("/api/places/top-liked");
        setPlaces(res.data.places || []);
      } catch (err) {
        console.error("Failed to fetch top liked places:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (!loading && places.length === 0) return null;

  if (loading) {
    return (
      <section className="bg-orange-50/30 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 bg-stone-100 rounded-full w-48 mb-3 animate-pulse" />
          <div className="h-10 bg-stone-100 rounded-full w-72 mb-10 animate-pulse" />
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

  return (
    <div className="bg-orange-50/30">
      <PlacesSlider
        places={places}
        title="Most Liked Places"
        subtitle="Community Favourites"
        viewAllLink="/explore?sort=liked"
      />
    </div>
  );
}