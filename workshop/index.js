const express=require("express");
const DB=require("./database");
const app=express();

DB();
app.use(express.json());
app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port", process.env.PORT)
});