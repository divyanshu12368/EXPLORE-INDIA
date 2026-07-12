import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cityRoutes from "./routes/cityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import placeExtrasRoutes from "./routes/placeExtrasRoutes.js";
import cors from "cors";

dotenv.config();
connectDB()

const app = express();
         

// write here
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Server is working")
})

app.use("/api/cities", cityRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/places", placeRoutes);

app.use("/api/extras", placeExtrasRoutes);





const PORT = 5000;

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})