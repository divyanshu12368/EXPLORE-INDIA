import { useState, useEffect } from "react";
import PlacesSlider from "./PlacesSlider";
import api from "../../../utils/axiosInstance";
import axios from "axios";

export default function NearbyPlacesSlider() {
  const [places, setPlaces] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setDenied(true);
      setLoading(false);
      return;
    }

    let lastCity = "";

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const address = geoRes.data.address;
          const detectedCity =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "";

          if (!detectedCity) {
            setLoading(false);
            return;
          }

          // Only re-fetch places if city actually changed
          if (detectedCity === lastCity) {
            setLoading(false);
            return;
          }

          lastCity = detectedCity;
          setCity(detectedCity);
          setDenied(false);

          const placesRes = await api.get(
            `/api/places/by-city?city=${encodeURIComponent(detectedCity)}`
          );
          setPlaces(placesRes.data.places || []);
        } catch {
          // Reverse geocode or API failed — don't crash
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        // Permission denied or unavailable
        setDenied(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000, // cache position for 1 minute to avoid hammering Nominatim
      }
    );

    // Cleanup — stop watching when component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (denied || (!loading && places.length === 0)) return null;

  if (loading) {
    return (
      <section className="bg-[#FFFBF5] px-6 py-20">
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
    <PlacesSlider
      places={places}
      title={`Places in ${city}`}
      subtitle="Near You"
      viewAllLink={`/explore?city=${encodeURIComponent(city)}`}
    />
  );
}