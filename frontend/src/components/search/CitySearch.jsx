import { useState } from "react";

function CitySearch({ cities, onSelectCity }) {
  const [search, setSearch] = useState("");

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {search && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onClick={() => {
                onSelectCity(city);
                setSearch("");
              }}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderBottom: "1px solid #eee",
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
