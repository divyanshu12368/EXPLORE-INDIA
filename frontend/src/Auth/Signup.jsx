import React, { useState } from "react";
import { Input } from "../components";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex items-center justify-center px-4 py-12">
 
      {/* Background decorative blobs */}
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
 
      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-orange-100 shadow-lg shadow-orange-50 p-8">
 
        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
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
          <h2
            className="text-2xl font-black text-stone-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Create Account
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Join us and start exploring India
          </p>
        </div>
 
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
 
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
 
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
 
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
 
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {/* API error message */}
          {apiError && (
            <p className="text-red-500 text-sm text-center font-medium">
              {apiError}
            </p>
          )}
 
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
 
          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-300 font-medium">or</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>
 
          {/* Login link */}
          <p className="text-sm text-center text-stone-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-700 hover:text-teal-800 font-semibold transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}