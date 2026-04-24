import express from "express"

const app = express();
         

// write here
app.get("/", (req,res)=>{
    res.send("Server is working")
})





const PORT = 5000;

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})