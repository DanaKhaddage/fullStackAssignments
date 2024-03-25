const MenuItem = require('../models/menuItemSchema');
const User = require('../models/userSchema');
const Review = require('../models/reviewsSchema');

const checkAdmin=async(req)=>{
    try{
        const user=await User.findOne({_id:req.user._id});
        if(!user || user.role!=="admin" ) {
            return false;
        }else{
            return true;
        }

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.createMenuItem=async(req,res)=>{
    try{
        const user=await checkAdmin(req);
        if(user==false) {
            return res.status(401).json({message:"You are not authorized to perform this action"});
        }

        const newMenuItem=new MenuItem.create({
            itemName:req.body.itemName,
            price:req.body.price,
            description:req.body.description,
            ingredients:req.body.ingredients,
            itemQuantity:req.body.itemQuantity,
            customizationOptions:req.body.customizationOptions,
            createdBy:req.user._id, //since its an object id that refers to the user
        });

        await newMenuItem.save();
        return res.status(201).json({message:"Product created successfully",menuItem:newMenuItem});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.updateMenuItem=async(req,res)=>{
    try{
        const user=await checkAdmin(req);
        if(user==false) {
            return res.status(401).json({message:"You are not authorized to perform this action"});
        }
        const menuItem=await MenuItem.findByIdAndUpdate(
            req.params.menuItemID,
            req.body,
            {new:true}
        );
        if(!menuItem) {
            return res.status(404).json({message:"Product not found"});
        }

        return res.status(200).json({message:"Product updated successfully"});
    }catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.deleteMenuItem=async(req,res)=>{
    try{
        const user=await checkAdmin(req);
        if(user==false) {
            return res.status(401).json({message:"You are not authorized to perform this action"});
        }
        const menuItem=await MenuItem.findByIdAndDelete(req.params.menuItemID);
        if(!menuItem) {
            return res.status(404).json({message:"Product not found"});
        }

        return res.status(200).json({message:"Product deleted successfully"});
    }catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAllMenuItems=async(req,res)=>{
    try{
        const user=await checkAdmin(req);
        if(user==false) {
            return res.status(401).json({message:"You are not authorized to perform this action"});
        }
        const menuItems=await MenuItem.find();
        if(menuItems.length<=0){
            return res.status(404).json({message:"Menu Items not found"});
        }

        return res.status(200).json({message:"Menu Items fetched successfully",products});

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.viewMenuItemDetails = async (req, res) => {
    try {
        const user= await User.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const menuItem = await MenuItem.findById(req.params.menuItemID);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        return res.status(200).json({ menuItem });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};


exports.leaveReviewForMenuItem = async (req, res) => {
    try {
        const { user, rating, feedback } = req.body;

        const menuItem = await MenuItem.findById(req.params.menuItemID);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const review = new Review({
            user,
            rating,
            feedback
        });

        menuItem.reviews.push(review);

        let averageRating = 0;
        if (menuItem.reviews.length > 0) {
            const totalRatings = menuItem.reviews.reduce((acc, cur) => acc + cur.rating, 0);
            averageRating = totalRatings / menuItem.reviews.length;
        }
        menuItem.averageRating = averageRating;

        await menuItem.save();

        return res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};