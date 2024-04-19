const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const postSchema=new Schema({
    postOwner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        maxLength:100,
        trim:true
    },
    media:[
        {
            type:String,
            default:""
        },
    ],
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
},
{timestamps:true}
);

module.exports=mongoose.model("Post",postSchema);