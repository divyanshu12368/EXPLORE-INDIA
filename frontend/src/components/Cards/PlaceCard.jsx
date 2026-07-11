import { Link } from "react-router-dom";

const PlaceCard = ({ place }) => {
  return (
    <Link
      to={`/place/${place._id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="overflow-hidden h-52 relative">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold border border-teal-100 shadow-sm">
          {place.state}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="font-black text-stone-900 text-base mb-1.5 group-hover:text-orange-500 transition-colors duration-200"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {place.name}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {place.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">

          {/* Left: city + views */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.city}
            </span>

            {/* Views */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 bg-stone-50 border border-stone-100 px-2.5 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {place.views ?? 0}
            </span>
          </div>

          {/* Right: view details */}
          <span className="text-xs font-semibold text-orange-500 group-hover:translate-x-0.5 transition-transform duration-200">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;