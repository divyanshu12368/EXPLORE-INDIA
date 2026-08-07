// src/components/Header/Navbar.jsx

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // NOTE: only "/" and "/explore" exist as real routes today.
  // Experiences / Heritage / Guides are placeholders until those pages exist.
  const navLinks = [
    { label: "Destinations", to: "/explore" },
    { label: "Experiences", to: "#" },
    { label: "Heritage", to: "#" },
    { label: "Guides", to: "#" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explore?city=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFBF5] border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0">
          <span
            className="text-2xl font-bold italic text-orange-700"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Explore India
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-all duration-200 pb-0.5 border-b-2 ${
                location.pathname === link.to
                  ? "text-stone-900 font-semibold border-orange-500"
                  : "text-stone-700 border-transparent hover:text-orange-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-orange-50/70 border border-orange-100 rounded-full px-4 py-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0011.454 11.454z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search destinations..."
            className="bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none w-full"
          />
        </form>

        {/* Sign In / User */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-stone-700 hover:text-orange-600 transition-colors duration-200"
              >
                {user.name || "Dashboard"}
              </Link>
              <button
                onClick={logout}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 shrink-0"
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
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 bg-orange-50/70 border border-orange-100 rounded-full px-4 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0011.454 11.454z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search destinations..."
              className="bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none w-full"
            />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                location.pathname === link.to
                  ? "text-stone-900 font-semibold"
                  : "text-stone-700 hover:text-orange-600"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-stone-700 hover:text-orange-600"
              >
                {user.name || "Dashboard"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full w-fit transition-all duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full w-fit transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}