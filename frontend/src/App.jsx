import { Routes, Route } from "react-router-dom";

import {Layout} from "./components/";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import PlaceDetails from "./Pages/PlaceDetails";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";




function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Route>
      
    </Routes>
  );
}

export default App;