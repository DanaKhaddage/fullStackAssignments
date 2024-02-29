const MenuItem = require('../models/menuItemSchema');
const Customer = require('../models/customerSchema');
const Review = require('../models/reviewsSchema');

exports.viewMenuItemDetails = async (req, res) => {
    try {
        const customer= await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const menuItem = await MenuItem.findById(req.params.menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        return res.status(200).json({ menuItem });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.customizeMenuItem = async (req, res) => {
    try {
        const customer= await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const { customizationOptions } = req.body;

        const menuItem = await MenuItem.findById(req.params.itemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (customizationOptions && customizationOptions.length > 0) {
            customizationOptions.forEach(option => {
                if (option.action === 'add') {
                    menuItem.ingredients.push(option.ingredient);
                } else if (option.action === 'remove') {
                    const index = menuItem.ingredients.indexOf(option.ingredient);
                    if (index !== -1) {
                        menuItem.ingredients.splice(index, 1);
                    }
                }
            });
        }
        const updatedMenuItem = await menuItem.save();

        return res.status(200).json({ message: 'Menu item customized successfully', menuItem: updatedMenuItem });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.leaveReviewForMenuItem = async (req, res) => {
    try {
        const { username, rating, feedback } = req.body;

        const menuItem = await MenuItem.findById(req.params.menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const review = new Review({
            username,
            entityId: menuItemId,
            entityType: 'product',
            rating,
            feedback
        });

        menuItem.reviews.push(review);

        const totalRatings = menuItem.reviews.reduce((acc, cur) => acc + cur.rating, 0);
        menuItem.averageRating = totalRatings / menuItem.reviews.length;

        await menuItem.save();

        return res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};