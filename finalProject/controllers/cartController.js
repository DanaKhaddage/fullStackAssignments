const Cart = require('../models/cartSchema');
const MenuItem = require('../models/menuItemSchema');
const Customer = require('../models/customerSchema');

exports.addItemToCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { menuItemId, customerId } = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer trying to add item to cart is not found" });
        }

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const existingItem = customer.cart.find(item => item.menuItemId.toString() === menuItemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            customer.cart.push({ menuItemId, quantity });
        }

        let totalPrice = 0;
        for (const item of customer.cart) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            totalPrice += menuItem.price * item.quantity;
        }

        customer.totalPrice = totalPrice;
        await customer.save();

        return res.status(200).json({ message: "Item added to cart successfully", cart: customer.cart, totalPrice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { customerId, menuItemId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const itemIndex = customer.cart.findIndex(item => item.menuItemId.toString() === menuItemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const removedItem = customer.cart.splice(itemIndex, 1)[0]; 
        customer.totalPrice -= removedItem.price * removedItem.quantity;

        await customer.save();

        return res.status(200).json({ message: 'Item removed from cart successfully', cart: customer.cart, totalPrice: customer.totalPrice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addCustomizedItemToCart = async (req, res) => {
    try {
        const { quantity, customizationOptions } = req.body;
        const { menuItemId, customerId } = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer trying to add item to cart is not found" });
        }

        const menuItem = await MenuItem.findById(menuItemId);
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

        const existingItem = customer.cart.find(item => item.menuItemId.toString() === menuItemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            customer.cart.push({ menuItemId, quantity });
        }

        let totalPrice = 0;
        for (const item of customer.cart) {
            const itemFromDb = await MenuItem.findById(item.menuItemId);
            totalPrice += itemFromDb.price * item.quantity;
        }

        customer.totalPrice = totalPrice;
        await customer.save();

        return res.status(200).json({ message: "Item added to cart successfully", cart: customer.cart, totalPrice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



