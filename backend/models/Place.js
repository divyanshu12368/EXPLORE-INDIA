import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        email: { type: String, required: true },
        location: {
            lat: { type: Number },
            lng: { type: Number },
            address: { type: String },
        },
        directionGuidance: { type: String, default: "" },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

export default Place;