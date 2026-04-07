// src/Pages/Dashboard.jsx

import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Credentials from "../Auth/Credentials";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [credentialUser, setCredentialUser] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useState(() => {
    const userCredential = Credentials.find(
      (cred) => cred.email === user?.email
    );
    setCredentialUser(userCredential);
  }, [user?.email]);

  const actions = [
    {
      label: "Update Your Profile",
      icon: "✏️",
      onClick: () => {},
      style: "border border-teal-200 text-teal-700 hover:bg-teal-50",
    },
    {
      label: "Add Place",
      icon: "📍",
      to: "/place-adder",
      style: "border border-orange-200 text-orange-600 hover:bg-orange-50",
    },
    {
      label: "See Your Added Places",
      icon: "🗺️",
      onClick: () => {navigate("/my-places");},
      to: "/my-places",
      style: "border border-stone-200 text-stone-600 hover:bg-stone-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Welcome heading */}
        <div className="text-center mb-6">
          <Link to="/">
            <span
              className="text-2xl font-black text-orange-500"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Explore
            </span>
            <span
              className="text-2xl font-black text-teal-700"
              style={{ fontFamily: "Georgia, serif" }}
            >
              India
            </span>
          </Link>
          <p className="text-stone-400 text-sm mt-1">Your travel dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-lg shadow-orange-50 p-8">

          {/* Avatar + name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-100 shadow-md mb-4 bg-orange-50 flex items-center justify-center">
              <img
                src={credentialUser?.img}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<span class="text-3xl">👤</span>`;
                }}
              />
            </div>
            <h1
              className="text-2xl font-black text-stone-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {credentialUser?.name || "John Doe"}
            </h1>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200">
              🇮🇳 Explorer
            </span>
          </div>

          {/* Info rows */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Email</span>
              <span className="text-sm font-semibold text-stone-700">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Contact</span>
              <span className="text-sm font-semibold text-stone-700">
                {credentialUser?.contactNo || "Not provided"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mb-6">
            {actions.map((action) =>
              action.to ? (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-full font-semibold text-sm bg-white transition-all duration-200 hover:-translate-y-0.5 ${action.style}`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-full font-semibold text-sm bg-white transition-all duration-200 hover:-translate-y-0.5 ${action.style}`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              )
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 mb-6" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </div>
  );
}