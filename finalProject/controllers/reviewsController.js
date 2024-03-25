const Review=require("../models/reviewsSchema");
const User=require("../models/userSchema");

exports.addReview=async(req,res)=>{
    try{
        const user=await User.findOne({_id:req.user._id});
        if(!user){
            return res.status(401).json({message:"User trying to add review is not found"});
        }

        const newReview=Review.create({
            user:user._id,
            rating:req.body.rating,
            feedback:req.body.feedback,
        });

        await newReview.save();
        return res.status(201).json({data:newReview,message:"Review added successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        return res.status(200).json({ reviews });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
