// src/components/Cards/SelectedCards.jsx

import places from "../../data/places";
import defaultPlaces from "../../data/defaultPlaces";
import { PlaceCard } from "../index";

const SelectedCards = ({ selectedCity }) => {
  const placesToShow = selectedCity
    ? places.filter((place) => place.city === selectedCity)
    : defaultPlaces;

  // Empty state
  if (placesToShow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-bold text-stone-700 mb-2">No places found</h3>
        <p className="text-stone-400 text-sm max-w-xs">
          We don't have any tourist places listed for this city yet. Try selecting a different city.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {placesToShow.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};

export default SelectedCards;