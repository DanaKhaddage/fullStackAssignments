const User=require("../models/userSchema");

exports.followUnfollow=async(req,res)=>{
    const {targetUserID,currentUserID} = req.body;
    try{
        if(targetUserID.toString()===currentUserID.toString()){
            res.status(409).json({message:"You cannot follow/unfollow yourself!"});
        }

        const currentUser=await User.findOne();
        const targetUser=await User.find();

        const isFollowing=targetUser.followers.includes(currentUserID);
        if(!isFollowing){
            await Promise.all([
                currentUser.updateOne({$push:{following:targetUserID}}),
                targetUser.updateOne({$push:{followers:currentUserID}}),
            ]);

            return res.status(200).json(
                {message:"You are now following this user", 
                followersCount:targetUser.following.length+1,
                followingCount:currentUser.following.length+1}
            );
        } else {
            await Promise.all([
                currentUser.updateOne({$pull:{following:targetUserID}}),
                targetUser.updateOne({$pull:{followers:currentUserID}}),
            ]);

            res.status(200).json(
                {message:"User has been unfollowed",
                followersCount:targetUser.following.length-1,
                followingCount:currentUser.following.length-1});
        }
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}