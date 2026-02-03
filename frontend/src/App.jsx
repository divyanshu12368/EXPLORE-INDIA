import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import PlaceDetails from "./Pages/PlaceDetails";




function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/places" element={<PlaceDetails />} />

      </Route>
      
    </Routes>
  );
}

export default App;