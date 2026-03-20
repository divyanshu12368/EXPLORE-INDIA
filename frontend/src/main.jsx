import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";  // ✅ correct path
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>        {/* ✅ wraps entire app */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);