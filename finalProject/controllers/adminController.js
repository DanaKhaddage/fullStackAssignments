const Admin = require("../models/adminSchema");
const Restaurant = require('../models/restaurantSchema');
const Review = require('../models/reviewsSchema');

exports.updateRestaurantInfo = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminID);
        if (!admin || !admin.permissions.includes("update")) {
            return res.status(401).json({ message: "You are not authorized to update restaurant info." });
        }

        const restaurantInfo = await Restaurant.findByIdAndUpdate(
            req.params.restaurantID,
            req.body,
            { new: true }
        );
        if (!restaurantInfo) {
            return res.status(404).json({ message: "Restaurant Info not found" });
        }

        return res.status(200).json({ message: 'Restaurant information updated successfully', restaurant: restaurantInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

exports.respondToReview = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminID);
        if (!admin || !admin.permissions.includes("respond")) {
            return res.status(401).json({ message: "You are not authorized to respond to reviews." });
        }

        const { response } = req.body; // Extract response from request body

        const review = await Review.findByIdAndUpdate(
            req.params.reviewID,
            { response },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({ message: 'Review responded successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
