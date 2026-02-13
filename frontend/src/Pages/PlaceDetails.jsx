import { useParams } from "react-router-dom";
import places from "../data/places";

const PlaceDetails = () => {
  const { id } = useParams();

  const place = places.find((p) => p.id === parseInt(id));

  if (!place) return <h2>Place not found</h2>;

  return (
    <div>
      <h1>{place.name}</h1>
      <img src={place.image} alt={place.name} style={{ width: "400px" }} />
      <p>{place.description}</p>
    </div>
  );
};

export default PlaceDetails;