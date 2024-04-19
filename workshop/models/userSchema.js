const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    fullName:{
        type:String,
        required:[true,"Full name is required"],
        minLength:5,
        maxLength:50,
        trim:true
    },
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        maxLength:20,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        maxLength:150,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:8,
        maxLength:20,
        trim:true
    },
    friends:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    following:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    followers:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    blockedUsers:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},
{timestamp:true}
);

module.exports=mongoose.model("User",userSchema);