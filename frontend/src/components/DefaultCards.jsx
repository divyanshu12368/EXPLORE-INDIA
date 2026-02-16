import places from "../data/defaultPlaces";
import PlaceCard from "../components/PlaceCard";

const DefaultCards = () => {

  return (
    <div>
      {/* <h2>Showing all tourist places</h2> */}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};

export default DefaultCards;