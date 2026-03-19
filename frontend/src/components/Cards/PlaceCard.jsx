// src/components/Cards/PlaceCard.jsx

import { Link } from "react-router-dom";

const PlaceCard = ({ place }) => {
  return (
    <Link
      to={`/place/${place.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="overflow-hidden h-48">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-stone-900 text-base mb-1 group-hover:text-orange-500 transition-colors duration-200">
          {place.name}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-3">
          {place.description}
        </p>

        {/* Location badge */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
          📍 {place.city}, {place.state}
        </span>
      </div>
    </Link>
  );
};

export default PlaceCard;