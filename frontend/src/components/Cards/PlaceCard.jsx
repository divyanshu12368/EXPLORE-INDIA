import { useNavigate } from "react-router-dom";

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/place/${place.id}`)}
      style={{
        width: "250px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        cursor: "pointer"
      }}
    >
      <img
        src={place.image}
        alt={place.name}
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
      />

      <h3>{place.name}</h3>
      <p>{place.description}</p>
    </div>
  );
};

export default PlaceCard;
