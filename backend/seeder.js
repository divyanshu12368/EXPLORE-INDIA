import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./models/Place.js"
import places from "./data/places.js"

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        await Place.deleteMany(); //old data clear
        await Place.insertMany(places);

        console.log("Data Imported ");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();