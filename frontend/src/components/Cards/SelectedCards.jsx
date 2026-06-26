import { useState, useEffect } from "react";
import { PlaceCard } from "../index";
import api from "../../utils/axiosInstance";

const SelectedCards = ({ selectedCity, selectedState }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        let res;
        if (selectedCity) {
          res = await api.get(`/api/places/by-city?city=${selectedCity}`);
        } else {
          res = await api.get("/api/places/all");
        }

        setPlaces(res.data.places);
      } catch (err) {
        setError("Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCity]);

  // Loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-stone-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  // Empty
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-stone-700 mb-1" style={{ fontFamily: "Georgia, serif" }}>
          No places found
        </h3>
        <p className="text-stone-400 text-sm max-w-xs">
          No tourist places listed for this city yet. Try selecting a different city.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default SelectedCards;