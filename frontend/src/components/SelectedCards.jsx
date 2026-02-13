import places from "../data/places";
import PlaceCard from "../components/PlaceCard";

const SelectedCards = ({ selectedCity }) => {

  const filteredPlaces = places.filter(
    (place) =>
      place.city === selectedCity
  );

  return (
    <div>
      <h2>Showing tourist places in {selectedCity}</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};

export default SelectedCards;
