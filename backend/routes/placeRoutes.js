import express from "express";
import Place from "../models/Place.js";

const router = express.Router();

// POST /api/places/add
router.post("/add", async (req, res) => {
  try {
    const { name, state, city, image, description, email, location, directionGuidance } = req.body;

    if (!name || !state || !city || !image || !description || !email) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newPlace = new Place({
      name, state, city, image, description, email, location, directionGuidance,
    });

    await newPlace.save();
    res.status(201).json({ message: "Place added successfully", place: newPlace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/places/all
router.get("/all", async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.status(200).json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/places/by-city?city=...
router.get("/by-city", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    const places = await Place.find({ city }).sort({ createdAt: -1 });
    res.status(200).json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/places/my-places?email=...
router.get("/my-places", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const places = await Place.find({ email }).sort({ createdAt: -1 });
    res.status(200).json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/places/:id/view
router.patch("/:id/view", async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json({ views: place.views });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/places/:id
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json({ place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;