import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure one like per user per place
likeSchema.index({ placeId: 1, email: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);