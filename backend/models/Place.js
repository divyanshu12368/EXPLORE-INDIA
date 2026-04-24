import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    email: String,
    name: String,
    state: String,
    city: String,
    image: String,
    description: String,
});

export default mongoose.model("Place", placeSchema);