const Customer = require("../models/customerSchema");
const validator=require("validator");

exports.signup= async(req,res) => {
    try{
        if(!validator.isEmail(req.body["email"])) {
            return res.status(400).json({message:"Invalid email address"});
        }
        const checkCustomerExistence=await Customer.findOne({$or:[{email:req.body["email"]},{username:req.body["username"]}],});
        if(checkCustomerExistence) {
            return res.status(409).json({message:"User already exists"});                                                                  
        }
        if(req.body["password"]!==req.body["passwordConfirm"]) {
            return res.status(400).json({message:"Please enter matching password and password confirm"});
        }
        const newCustomer=await Customer.create({
            firstName:req.body["firstName"],
            lastName:req.body["lastName"],
            username:req.body["username"],
            email:req.body["email"],
            address:req.body["address"],
            password:req.body["password"],
            passwordConfirm:req.body["passwordConfirm"],
            passwordChangedAt:Date.now(),
        });
        return res.status(201).json({message:"Signup successfully"});
    } catch(err) {
        console.log(err);
    }
};

exports.login=async(req,res) => {
    try{
        const{email,password}=req.body;
        const Customer=await Customer.findOne({email});
        if(!Customer || !await Customer.CheckPassword(password, Customer.password)) {
            return res.status(401).json({message:"Invalid Credentials"});
        }
        return res.status(200).json({message:"Logged in successfully"});
    }catch(err) {
        console.log(err);
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const customer = await Customer.findById(req.params["customerID"]);
        if (!customer) {
            return res.status(404).json({ message:"Customer trying to add item to cart is not found"});
        }
        
        const existingItem = customer.cart.find(item => item.itemId.toString() === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            customer.cart.push({ itemId, quantity });
        }

        await customer.save();
        return res.status(200).json({ message: "Item added to cart successfully", cart: customer.cart });
    } catch (err) {
        console.log(err);
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const customer = await Customer.findById(req.params["customerID"]);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        
        const existingItemIndex = customer.cart.findIndex(item => item.itemId.toString() === itemId);
        if (existingItemIndex !== -1) {
            customer.cart.splice(existingItemIndex, 1);
        } 

        await customer.save();
        return res.status(200).json({ message: "Item removed from cart successfully", cart: customer.cart });
    } catch (err) {
        console.log(err);
    }
};

exports.checkout = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        customer.cart = [];
        await customer.save();
        return res.status(200).json({ message: "Checkout successful" });
    } catch (err) {
        console.log(err);
    }
};



