const mongoose= require("mongoose");
require("dotenv").config();

exports.connectDB= async () => {
    try{
        await mongoose.connect(process.env.MongoDB_URI);
        console.log("MongoDB Connected!");
    }catch(error) {
        console.error(error);
        process.exit(1);
    }
};
