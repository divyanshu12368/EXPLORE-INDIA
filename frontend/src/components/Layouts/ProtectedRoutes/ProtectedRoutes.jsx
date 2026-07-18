import { useAuth } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;  // ✅ redirect if not logged in
  }

  return children;  // ✅ render page if logged in
}

// In your router:
/* <Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} /> 
// ``` */

// ---

// ## The full picture
// ```
// AuthContext (global state)
//     │
//     ├── Login.jsx       → calls login(), sets user
//     ├── Navbar.jsx      → reads user, shows logout button
//     ├── Dashboard.jsx   → reads user, shows email/name
//     └── ProtectedRoute  → blocks access if user is null