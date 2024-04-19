const Post=require("../models/postSchema");
const User=require("../models/userSchema");

exports.like_dislike=async(req,res)=>{
    try{
        const post=await Post.findOne({_id:req.params.postID});
        const {userID}= req.body;

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        if(!post.likes.includes(userID)){
            await post.updateOne({$push:{likes:userID}});
            return res.status(200).json({message:"Liked post"});
        }else{
            await post.updateOne({$pull:{likes:userID}});
            return res.status(200).json({message:"Disliked post"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.fetchTimeLinePosts=async(req,res)=>{
    try{
        const currentUser = await User.findById({_id:req.body.currentUserID});
        if(!currentUser){
            return res.status(404).json({message:"User not found. Please login to get access."});
        }

        const currentUserPosts=await Post.find({postOwner:currentUser._id});
        const friendsPosts=await Promise.all(
            currentUser.friends.map((friendID)=>{
                return Post.find({postOwner:friendID});
            })
        );

        const timeLinePosts=currentUserPosts.concat(...friendsPosts);

        return timeLinePosts.length <=0 ?
            res.status(404).json({message:"No posts found/available"}) :
            res.status(200).json({data:timeLinePosts});
    
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}