import { useState } from "react";
import {StateCityDropdown} from "./index";
import {SelectedCards} from "./index";
import {defaultPlaces} from "./index";

const ExplorePlaces = () => {
  const [city, setCity] = useState("");

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #eee' }}>
        <h2>Find Tourist Places</h2>

        <StateCityDropdown onCitySelect={setCity} />
        </div>
      {city && <p>Showing tourist places in <b>{city}</b></p>}
      
       <SelectedCards selectedCity={city} />
    </div>
  );
};

export default ExplorePlaces;