const express=require('express');
const app=express();
const DB=require('./database').connectDB;

DB();

app.use(express.json());
app.listen((3000),() => {
    console.log("server running on port 3000");
})