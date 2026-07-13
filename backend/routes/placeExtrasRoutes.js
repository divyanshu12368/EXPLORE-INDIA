import express from "express";
import PlaceImage from "../models/PlaceImage.js";
import Promotion from "../models/Promotion.js";
import Comment from "../models/Comment.js";
import Place from "../models/Place.js";
import Like from "../models/Like.js";

const router = express.Router();

// ── IMAGES ──────────────────────────────────────────

// POST /api/extras/images/:placeId
router.post("/images/:placeId", async (req, res) => {
  try {
    const { imageUrl, email } = req.body;
    if (!imageUrl || !email)
      return res.status(400).json({ message: "Image URL and email are required" });
    const newImage = await PlaceImage.create({ placeId: req.params.placeId, imageUrl, email });
    res.status(201).json({ message: "Image added", image: newImage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// GET /api/extras/images/:placeId
router.get("/images/:placeId", async (req, res) => {
  try {
    const images = await PlaceImage.find({ placeId: req.params.placeId }).sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/extras/images/:imageId
router.delete("/images/:imageId", async (req, res) => {
  try {
    const { email } = req.body;
    const image = await PlaceImage.findById(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });
    if (image.email !== email)
      return res.status(403).json({ message: "You can only delete your own images" });
    await image.deleteOne();
    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── PROMOTION ────────────────────────────────────────

// POST /api/extras/promotion/:placeId
router.post("/promotion/:placeId", async (req, res) => {
  try {
    const { images, description, email } = req.body;
    if (!images || images.length === 0 || !description || !email)
      return res.status(400).json({ message: "Images, description and email are required" });
    if (images.length > 5)
      return res.status(400).json({ message: "Maximum 5 images allowed" });
    const place = await Place.findById(req.params.placeId);
    if (!place) return res.status(404).json({ message: "Place not found" });
    if (place.email !== email)
      return res.status(403).json({ message: "Only the place owner can add a promotion" });
    const promotion = await Promotion.findOneAndUpdate(
      { placeId: req.params.placeId },
      { images, description, email },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Promotion saved", promotion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/extras/promotion/:placeId
router.get("/promotion/:placeId", async (req, res) => {
  try {
    const promotion = await Promotion.findOne({ placeId: req.params.placeId });
    res.status(200).json({ promotion: promotion || null });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── COMMENTS ─────────────────────────────────────────

// POST /api/extras/comments/:placeId
router.post("/comments/:placeId", async (req, res) => {
  try {
    const { email, name, text } = req.body;
    if (!email || !name || !text)
      return res.status(400).json({ message: "Email, name and comment text are required" });
    const comment = await Comment.create({ placeId: req.params.placeId, email, name, text });
    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/extras/comments/:placeId
router.get("/comments/:placeId", async (req, res) => {
  try {
    const comments = await Comment.find({ placeId: req.params.placeId }).sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/extras/comments/:commentId
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const { email } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.email !== email)
      return res.status(403).json({ message: "You can only delete your own comments" });
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ── LIKES ─────────────────────────────────────────────

// POST /api/extras/likes/:placeId — toggle like
router.post("/likes/:placeId", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Like.findOne({ placeId: req.params.placeId, email });

    if (existing) {
      await existing.deleteOne();
      const count = await Like.countDocuments({ placeId: req.params.placeId });
      return res.status(200).json({ liked: false, count });
    } else {
      await Like.create({ placeId: req.params.placeId, email });
      const count = await Like.countDocuments({ placeId: req.params.placeId });
      return res.status(200).json({ liked: true, count });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/extras/likes/:placeId
router.get("/likes/:placeId", async (req, res) => {
  try {
    const { email } = req.query;
    const count = await Like.countDocuments({ placeId: req.params.placeId });
    const liked = email
      ? !!(await Like.findOne({ placeId: req.params.placeId, email }))
      : false;
    res.status(200).json({ count, liked });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;