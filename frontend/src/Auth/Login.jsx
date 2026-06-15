import React, { useState } from "react";
import { Input } from "../components/";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import api from "../utils/axiosInstance";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setErrors({ auth: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex items-center justify-center px-4">
 
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
            Welcome Back
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Sign in to continue your journey
          </p>
        </div>
 
        {/* Auth error */}
        {errors.auth && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm text-center">
            {errors.auth}
          </div>
        )}
 
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
 
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
 
          {/* Forgot password */}
          <div className="text-right">
            <span className="text-sm text-orange-500 hover:text-orange-600 cursor-pointer font-medium transition-colors duration-200">
              Forgot Password?
            </span>
          </div>
 
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full shadow-md shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
 
          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-300 font-medium">or</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>
 
          {/* Sign up link */}
          <p className="text-sm text-center text-stone-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-700 hover:text-teal-800 font-semibold transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}