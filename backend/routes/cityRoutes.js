import express from "express";
import cities from "../data/cities.json" with { type: "json" };

const router = express.Router();

router.get("/", (req,res)=>{
    res.json(cities);
});

export default router;