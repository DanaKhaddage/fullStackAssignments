const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const commentSchema=new Schema({
    commentOwner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    parentPost:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    content:{
        type:String,
        trim:true,
        maxLength:250
    },
    moderationStatus:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
},
    {timestamps:true},
);

module.exports=mongoose.model("Comment",commentSchema);