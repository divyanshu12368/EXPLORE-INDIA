import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true, unique: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);