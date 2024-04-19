const Post=require("../models/postSchema");
const User=require("../models/userSchema");
const Comment=require("../models/commentSchema");
const { response } = require("express");

exports.createComment=async(req,res)=>{
    try{
        const {postID,userID,content}=req.body;

        const newComment=await Comment.create({
            commentOwner: userID,
            parentPost:postID,
            content,
            moderationStatus:"pending",
        });

        res.status(201).json({message:"Comment submitted successfully, waiting for moderation"});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAcceptedCommentsPerPost = async(req,res)=>{
    try{
        const {postID}=req.params;
        const comments=await Comment.find({
            $and:[
                {parentPost:postID},
                {moderationStatus:"accepted"}
            ],
        });

        if(comments.length==0){
            return res.status(404).json({message:"No comments accepted"});
        }

        res.status(200).json({data:comments});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}