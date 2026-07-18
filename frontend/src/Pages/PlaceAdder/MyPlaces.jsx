import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import api from "../../utils/axiosInstance";

export default function MyPlaces() {
  const { user } = useAuth();
  const [userPlaces, setUserPlaces] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchPlaces = async () => {
      try {
        setFetchLoading(true);
        const res = await api.get(`/api/places/my-places?email=${user.email}`);
        setUserPlaces(res.data.places);
      } catch (error) {
        setFetchError("Failed to load your places. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPlaces();
  }, [user?.email]);

  const isEmpty = userPlaces.length === 0;

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading your places...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <p className="text-red-400 text-sm">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden px-4 py-12">

      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-1">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
              My Added Places
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              {isEmpty
                ? "You haven't added any places yet."
                : `You have added ${userPlaces.length} place${userPlaces.length > 1 ? "s" : ""}.`}
            </p>
          </div>
          {!isEmpty && (
            <Link
              to="/place-adder"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              + Add New Place
            </Link>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-black text-stone-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              No places added yet
            </h2>
            <p className="text-stone-400 text-sm max-w-xs mb-8">
              Start contributing by adding tourist places for other travelers to discover.
            </p>
            <Link
              to="/place-adder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5"
            >
              + Add Your First Place
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 border-b border-orange-100">
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">#</th>
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">Place Name</th>
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">City</th>
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">State</th>
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">Description</th>
                      <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">Image</th>
                      <th className="text-center px-5 py-4 text-xs font-bold tracking-widest text-stone-500 uppercase whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPlaces.map((place, index) => (
                      <tr
                        key={place._id}
                        className={`border-b border-stone-50 transition-colors duration-150 hover:bg-orange-50/40 ${index % 2 === 0 ? "bg-white" : "bg-stone-50/40"}`}
                      >
                        <td className="px-5 py-4 text-stone-400 font-medium">{index + 1}</td>
                        <td className="px-5 py-4 font-bold text-stone-800 whitespace-nowrap">{place.name}</td>
                        <td className="px-5 py-4 text-stone-600 whitespace-nowrap">{place.city}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
                            {place.state}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-stone-500 max-w-50">
                          <span className="block truncate" title={place.description}>{place.description}</span>
                        </td>
                        <td className="px-5 py-4 max-w-40">
                          <img src={place.image} alt={place.name} className="w-10 h-10 rounded-lg object-cover border border-stone-100" />
                        </td>

                        {/* Actions — only View, links to PlaceDetails */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center">
                            <Link
                              to={`/place/${place._id}`}
                              title="View Place"
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-teal-200 text-teal-600 hover:bg-teal-50 transition-colors duration-200"
                            >
                              {/* Professional external link / view icon */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-center sm:justify-start">
              <Link
                to="/place-adder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                + Add New Place
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}