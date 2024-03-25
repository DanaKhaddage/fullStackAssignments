const Payment = require('../models/paymentSchema');
const Order = require('../models/orderSchema');
const User = require('../models/userSchema');

exports.processPayment = async (req, res) => {
    try {
        const { userID, orderID } = req.params;
        
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.orderStatus !== 'confirmed') {
            return res.status(400).json({ message: 'Order must be confirmed before processing payment' });
        }

        const payment = await Payment.create({
            user:req.body.user,
            order:req.body.order,
            paymentMethod:req.body.paymentMethod,
            paymentAmount:req.body.paymentAmount,
            currency:req.body.currency,
            paymentStatus: 'completed' 
        });

        await payment.save();

        order.orderStatus = 'paid';
        await order.save();

        return res.status(201).json({ message: 'Payment processed successfully', payment });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};