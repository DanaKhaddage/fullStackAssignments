const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const requestSchema=new Schema({
    senderID:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverID:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    requestStatus:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected","canceled"]
    }
},
{timestamps:true}
);

module.exports=mongoose.model("Request",requestSchema);