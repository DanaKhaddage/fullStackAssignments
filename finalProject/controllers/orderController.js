const Order = require("../models/orderSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Chef= require("../models/chefSchema");

exports.createNewOrder = async (req, res) => {
    try {
        // Find the cart based on the provided cartID
        const cart = await Cart.findOne({ _id: req.body.cartID });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the user who owns the cart
        const cartOwner = await User.findOne({ _id: req.body.cartOwner });
        if (!cartOwner) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new order object
        const newOrder = new Order({
            orderOwner: cartOwner._id,
            driver: req.body.driver,
            menuItems: cart.products,
            status: "pending",
        });

        // Save the new order
        await newOrder.save();

        // Clear the products array in the cart and save the cart
        cart.products = [];
        await cart.save();

        // Send success response
        return res.status(201).json({ message: "Order created successfully" });
    } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeOrder = async (req, res) => {
    try {
        // Find the user attempting to remove the order
        const userTryingToRemove = await User.findById(req.params.userID);
        if (!userTryingToRemove) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the order based on the provided orderPlacementID
        const order = await Order.findById(req.params.orderPlacementID);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Remove the order
        await order.remove();

        // Send success response
        return res.status(200).json({ message: "Order removed successfully" });
    } catch (err) {
        console.error("Error removing order:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.trackOrderStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if(!user){
            return res.status(404).json({message:"User trying to track the order is not found"});
        }

        const order = await Order.findById(req.params.orderPlacementID);
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
        // Check if the request is made by an admin with permission to update orders
        const admin = await Admin.findById(req.params.adminID);  
        if (!admin || !admin.permissions.includes("update")) {
            // If not an admin with update permission, check if it's a chef
            const chef = await Chef.findById(req.params.chefID);
            if (!chef) {
                // If neither an admin with update permission nor a chef is found, return unauthorized
                return res.status(401).json({ message: "You are not authorized to update Order Status." });
            }
        }

        // Extract the new status from the request body
        const { newStatus } = req.body;

        // Find the order based on the provided order ID
        const order = await Order.findById(req.params.orderPlacementID);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the order status and save the changes
        order.orderStatus = newStatus;
        await order.save();

        // Return a success response with the updated order
        return res.status(200).json({ message: "Order status updated successfully", order });
    } catch(err) {
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.viewOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderPlacementID);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ order });
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};