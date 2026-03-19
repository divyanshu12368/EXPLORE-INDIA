import { Link } from "react-router-dom";
 
export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
 
        {/* Brand */}
        <span className="text-lg font-black" style={{ fontFamily: "Georgia, serif" }}>
          <span className="text-orange-400">Explore</span>
          <span className="text-teal-400">India</span>
        </span>
 
        {/* Copyright */}
        <p className="text-sm text-stone-500">
          © 2026 Explore India. Made with ❤️ for travelers.
        </p>
 
        {/* Quick Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-orange-400 transition-colors duration-200">Home</Link>
          <Link to="/explore" className="hover:text-orange-400 transition-colors duration-200">Explore</Link>
          <Link to="/places" className="hover:text-orange-400 transition-colors duration-200">Places</Link>
        </div>
      </div>
    </footer>
  );
}