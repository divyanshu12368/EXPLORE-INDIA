import React, { useState } from "react";
import {Input} from "../components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PlaceAdderForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    imageUrl: "",
  });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Place Data:", form);
      // 👉 call your API here
      alert("Place added successfully! click ok and back to your dashboard");
    };

    const handleDashboardRedirect = () => {
      navigate("/dashboard");
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
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add a New Place</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Place Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter place name"
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter place description"
          />
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter place location"
          />
          <Input
            label="Image URL"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Place
          </button>
          <button
            type="button"
            onClick={handleDashboardRedirect}
            className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}