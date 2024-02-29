const menuItem=require("../models/menuItemSchema");
const Admin=require("../models/adminSchema");
const Notification = require('../models/notificationSchema');
const Restaurant = require('../models/restaurantSchema');
const Reviews=require('../models/reviewsSchema');

exports.addItem=async(req,res) => {
    try{
        const adminTryingToAdd=await Admin.findById(req.params["adminId"]);
        if(!adminTryingToAdd || !adminTryingToAdd.permissions.includes("create")) {
            return res.status(401).json({message:"You are not authorized to add items."});
        }
        const Item= await menuItem.findById(req.body["itemName"]);
        if(!Item) {
            return res.status(401).json({message:"Item already exists"});
        }
        const newItem= await menuItem.create({
            itemName:req.body["itemName"],
            price:req.body["price"],
            description:req.body["description"],
            ingredients:req.body["ingredients"],
        });
        return res.status(201).json({data:newItem,message:"Item added successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.deleteItem=async(req,res) => {
    try{
        const adminTryingToDelete=await Admin.findById(req.params["adminId"]);
        if(!adminTryingToDelete || !adminTryingToDelete.permissions.includes("delete")) {
            return res.status(404).json({message:"You are not authorized to delete items."});
        }
        const item=await menuItem.findById(req.params["menuItemId"]);
        if(!item) {
            return res.status(404).json({message:"Item not found"});
        }
        await item.deleteOne();
        return res.status(200).json({message:"Item deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.sendNotification = async (req, res) => {
    try {
        const admin=await Admin.findById(req.params["adminID"]);
        if(!admin || !admin.permissions.includes("send")) {
            return res.status(404).json({message:"You are not authorized to delete items."});
        }

        const notification = new Notification({
            username,
            content,
            status: 'unread' 
        });

        await notification.save();
        return res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (err) {
        console.log(err);
    }
};

exports.updateItem = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params["adminId"]);
        if (!admin || !admin.permissions.includes("update")) {
            return res.status(401).json({ message: "You are not authorized to modify items." });
        }

        let item = await MenuItem.findById(req.params["menuItemId"]);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.itemName = req.body.itemName || item.itemName;
        item.price = req.body.price || item.price;
        item.description = req.body.description || item.description;
        item.ingredients = req.body.ingredients || item.ingredients;

        item = await item.save();

        return res.status(200).json({ data: item, message: "Item updated successfully" });
    } catch (err) {
        console.log(err);
    }
};

exports.updateRestaurantInfo = async (req, res) => {
    try {
        const admin=await Admin.findById(req.params["adminID"]);
        if(!admin || !admin.permissions.includes("update")) {
            return res.status(401).json({message:"You are not authorized to update restaurant info."});
        }
        let restaurant=await Restaurant.findOne();
        restaurant.name=req.body.name || restaurant.name;
        restaurant.address=req.body.address || restaurant.address;
        restaurant.phoneNumber=req.body.phoneNumber || restaurant.phoneNumber;
        restaurant.email=req.body.email || restaurant.email;
        restaurant.aboutUs= req.body.aboutUs || restaurant.aboutUs;
        restaurant.openingHours=req.body.openingHours || restaurant.openingHours;
        restaurant.specialties=req.body.specialties || restaurant.specialties;
        restaurant.cuisineType=req.body.cuisineType || restaurant.cuisineType;
        
        restaurant = await restaurant.save();

        return res.status(200).json({ message: 'Restaurant information updated successfully', restaurant });
    } catch (err) {
        console.log(err);
    }
};

exports.respondToReview = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params["adminId"]);
        if (!admin || !admin.permissions.includes("respond")) {
            return res.status(401).json({ message: "You are not authorized to respond to reviews." });
        }

        const review = await Reviews.findById(req.params["reviewsId"]);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.response = response;
        await review.save();

        return res.status(200).json({ message: 'Review responded successfully', review });
    } catch (err) {
        console.log(err);
    }
};

