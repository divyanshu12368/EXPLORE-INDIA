// src/components/Header/Navbar.jsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";



// const navLinks = [
//   { label: "Home", to: "/" },
//   { label: "Explore", to: "/explore" },
//   { label: dashLabel(), to: dashLogin() },
//   // { label: "Places", to: "/places" },
// ];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    // {
    //   label: user ? "Dashboard" : "Login",
    //   to: user ? "/dashboard" : "/login",
    // },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFBF5] border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-1">
          <span
            className="text-2xl font-black tracking-tight text-orange-500"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Explore
          </span>
          <span
            className="text-2xl font-black tracking-tight text-teal-700"
            style={{ fontFamily: "Georgia, serif" }}
          >
            India
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold tracking-wide transition-all duration-200 pb-0.5 border-b-2 ${
                location.pathname === link.to
                  ? "text-orange-500 border-orange-500"
                  : "text-stone-600 border-transparent hover:text-orange-500 hover:border-orange-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-stone-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-stone-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-stone-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FFFBF5] border-t border-orange-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold tracking-wide ${
                location.pathname === link.to
                  ? "text-orange-500"
                  : "text-stone-600 hover:text-orange-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}