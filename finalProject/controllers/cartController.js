const Cart = require('../models/cartSchema');
const MenuItem = require('../models/menuItemSchema');
const User = require('../models/userSchema');

exports.addToCart = async (req, res) => {
    try {
        // Find the owner of the cart based on the user ID
        const cartOwner = await User.findOne({ _id: req.user._id });
        if (!cartOwner) {
            return res.status(404).json({ message: "A cart should have an owner" });
        }

        // Find the menu item based on the provided menuItem ID
        const menuItem = await MenuItem.findOne({ _id: req.body.menuItem });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu Item not found" });
        }
        
        let price=menuItem.price;
        let itemQuantity=menuItem.itemQuantity;
        // Determine the quantity of the menu item is available
        if ( itemQuantity> menuItem.itemQuantity) {
            return res.status(409).json({ message: "Requested menu item quantity is not available" });
        }

        // Calculate base price without customization options
        let Price = price * itemQuantity;
        // Modify the quantity from the data base
        menuItem.itemQuantity =  menuItem.itemQuantity-itemQuantity;
        
        await menuItem.save();

        // Calculate additional price for customization options
        let additionalCustomizationPrice = 0;
        if (req.body.customizationOptions && req.body.customizationOptions.length > 0) {
            req.body.customizationOptions.forEach(option => {
                // Check if the action is 'add' (additional cost)
                if (option.action === 'add') {
                    additionalCustomizationPrice += option.additionalPrice;
                }
            });
        }

        // Add additional price for customization options to the total price
        Price += additionalCustomizationPrice;

        // Find the user's cart
        let cart = await Cart.findOne({_id:cartOwner._id});

        if (!cart) {
            // If cart doesn't exist, create a new cart
            cart = await Cart.create({
                cartOwner: cartOwner._id,
                products: [req.body.products],
                totalPrice: Price,
            });
        } else {
            // If cart exists, check if the item is already in the cart
            let existingMenuItemIndex = cart.products.findIndex(product => product.menuItem.equals(menuItem._id));

            if (existingMenuItemIndex !== -1) {
                // If item already exists, update quantity
                cart.products[existingMenuItemIndex].itemQuantity += itemQuantity;
                Price += cart.products[existingMenuItemIndex].itemQuantity * menuItem.price;
            } else {
                // If item doesn't exist, add it to the cart
                cart.products.push(req.body.products);
            }
            // Update cart's total price
            cart.totalPrice += Price;
            await cart.save();
        }

        // Return the updated cart
        return res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
};

exports.deleteFromCart = async (req, res) => {
    try {
        // Find the owner of the cart based on the user ID
        const cartOwner = await User.findOne({ _id: req.user._id });
        if (!cartOwner) {
            return res.status(404).json({ message: "A cart should have an owner" });
        }

        // Find the menu item based on the provided menuItem ID
        const menuItem = await MenuItem.findOne({ _id: req.body.menuItem });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu Item not found" });
        }
        
        // Find the user's cart
        const cart = await Cart.findOne({ cartOwner: cartOwner._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if the menu item exists in the cart
        const existingProductIndex = cart.products.findIndex(product => product.menuItem.equals(menuItem._id));
        if (existingProductIndex === -1) {
            return res.status(404).json({ message: "Menu item not found in the cart" });
        }

        // Remove the menu item from the cart's products array
        const removedProduct = cart.products.splice(existingProductIndex, 1)[0];

        // Update the cart's total price
        cart.totalPrice -= menuItem.price * removedProduct.itemQuantity;

        // Save the updated cart
        await cart.save();

        // Increase the item quantity in the menu items collection
        menuItem.itemQuantity += removedProduct.itemQuantity;
        await menuItem.save();

        // Return the updated cart
        return res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
};