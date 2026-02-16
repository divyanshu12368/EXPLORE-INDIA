import places from "../data/places";
import defaultPlaces from "../data/defaultPlaces"; // make sure this exists
import PlaceCard from "../components/PlaceCard";

const SelectedCards = ({ selectedCity }) => {

  const placesToShow = selectedCity
    ? places.filter((place) => place.city === selectedCity)
    : defaultPlaces; // 👈 fallback when no city selected

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {placesToShow.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};

export default SelectedCards;