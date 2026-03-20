import { Routes, Route } from "react-router-dom";

import {Layout} from "./components/";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import PlaceDetails from "./Pages/PlaceDetails";
import Dashboard from "./Pages/Dashboard";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";




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
        <Route path="/dashboard" 
          element={
          <ProtectedRoute>
            <Dashboard />   {/* ✅ only opens if user is logged in */}
          </ProtectedRoute>
          } />

      </Route>
      
    </Routes>
  );
}

export default App;