import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import api from "../../utils/axiosInstance";

export default function PlaceAdderForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    state: "",
    city: "",
    description: "",
    directionGuidance: "",
  });

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/api/cities");
        const data = res.data;
        setCities(data);

        // Extract unique states, sorted alphabetically
        const uniqueStates = [...new Set(data.map((c) => c.state))].sort();
        setStates(uniqueStates);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, []);

  // When state changes, filter cities and reset city
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setForm((prev) => ({ ...prev, state: selectedState, city: "" }));
    const filtered = cities.filter((c) => c.state === selectedState);
    setFilteredCities(filtered);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    setImageUploading(true);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      return res.data.secure_url;
    } catch (err) {
      throw new Error("Image upload failed. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setApiError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const address = res.data.display_name || `${latitude}, ${longitude}`;
          setLocation({ lat: latitude, lng: longitude, address });
        } catch {
          setLocation({ lat: latitude, lng: longitude, address: `${latitude}, ${longitude}` });
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setApiError("Unable to retrieve your location. Please allow location access.");
        setLocationLoading(false);
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Place name is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!image) newErrors.image = "Please upload an image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    if (!validate()) return;

    try {
      setLoading(true);

      const imageUrl = await uploadToCloudinary();

      await api.post("/api/places/add", {
        name: form.name,
        state: form.state,
        city: form.city,
        description: form.description,
        directionGuidance: form.directionGuidance,
        image: imageUrl,
        email: user?.email,
        location: location || null,
      });

      setForm({ name: "", state: "", city: "", description: "", directionGuidance: "" });
      setImage(null);
      setImagePreview(null);
      setLocation(null);
      setFilteredCities([]);
      setErrors({});
      setSuccessMsg("Place added successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  // Shared dropdown class
  const dropdownClass = "w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition appearance-none";

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-orange-100 shadow-lg shadow-orange-50 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-black text-stone-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Add a New Place
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Share a hidden gem with fellow travelers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Place Name */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
              Place Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Bekal Fort"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* State + City dropdowns */}
          <div className="grid grid-cols-2 gap-4">

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                State <span className="text-red-400">*</span>
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleStateChange}
                className={dropdownClass}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                City <span className="text-red-400">*</span>
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!form.state}
                className={`${dropdownClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {form.state ? "Select city" : "Select state first"}
                </option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell travelers what makes this place special..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
              Place Image <span className="text-red-400">*</span>
            </label>
            <div
              className="w-full border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/40 px-4 py-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-orange-50 transition"
              onClick={() => document.getElementById("imageInput").click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <p className="text-sm text-stone-400">Click to upload an image</p>
                </>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
              Location{" "}
              <span className="text-stone-300 font-normal normal-case">(optional)</span>
            </label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-teal-200 text-teal-700 text-sm font-semibold bg-teal-50 hover:bg-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {locationLoading ? "Detecting location..." : "📍 Use My Current Location"}
              </button>
              <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-400 text-sm font-semibold bg-stone-50 cursor-not-allowed opacity-60">
                🗺️ Pick on Google Maps (coming soon)
              </div>
            </div>
            {location?.address && (
              <div className="mt-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium flex items-start gap-2">
                <span>📍</span>
                <span>{location.address}</span>
              </div>
            )}
          </div>

          {/* Direction Guidance */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
              Direction Guidance{" "}
              <span className="text-stone-300 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              name="directionGuidance"
              value={form.directionGuidance}
              onChange={handleChange}
              placeholder="e.g. Take NH66 from Kasaragod, turn left after the railway bridge..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition resize-none"
            />
          </div>

          {/* API error / success */}
          {apiError && (
            <p className="text-red-500 text-sm text-center font-medium">{apiError}</p>
          )}
          {successMsg && (
            <p className="text-teal-600 text-sm text-center font-medium">{successMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {imageUploading ? "Uploading Image..." : loading ? "Adding Place..." : "Add Place →"}
          </button>

        </form>
      </div>
    </div>
  );
}