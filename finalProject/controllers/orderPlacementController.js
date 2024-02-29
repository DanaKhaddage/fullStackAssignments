const Order = require("../models/orderPlacementSchema");
const Customer = require("../models/customerSchema");
const Admin = require("../models/adminSchema");

exports.createOrder = async(req,res) => {
    try{
        const orderOwner=await Customer.findById(req.params.customerId);
        if(!orderOwner) {
            return res.status(401).json({message:"Please login to place an order"});
        }

        const newOrder=await Order.create({
            username:req.body["customerId"],
            menuItems:req.body["menuItems"],
            totalPrice:req.body["totalPrice"],
            deliveryAddress:req.body["deliveryAddress"], 
        });

        return res.status(201).json({data:newOrder,message:"Order placed successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.removeOrder = async(req, res) => {
    try{
        const customerTryingToRemove = await Customer.findById(req.params.customerId);
        if(!customerTryingToRemove) {
            return res.status(404).json({message:"Customer trying to cancel the order is not found"});
        }

        const order=await Order.findById(req.params["orderPlacementID"]);
        if(!order) {
            return res.status(404).json({message:"Order not found"});
        }

        await order.deleteOne();
        return res.status(200).json({message:"Order removed successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.trackOrderStatus = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if(!customer){
            return res.status(404).json({message:"Customer trying to track the order is not found"});
        }

        const order = await Order.findById(req.params.orderPlacementId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ status: order.orderStatus });
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const admin= await Admin.findById(req.params.adminId);  
        if(!admin ||!admin.permissions.includes("update")) {
            return res.status(401).json({message:"You are not authorized to update Order Status."});
        }
        const { newStatus } = req.body;

        const order = await Order.findById(req.params.orderPlacementId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = newStatus;
        await order.save();
        return res.status(200).json({ message: 'Order status updated successfully', order });
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.viewOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderPlacementId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ order });
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};