const Payment = require('../models/paymentSchema');
const OrderPlacement = require('../models/orderPlacementSchema');
const Customer = require('../models/customerSchema');

exports.processPayment = async (req, res) => {
    try {
        const { customerId, orderPlacementId } = req.params;
        
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const order = await OrderPlacement.findById(orderPlacementId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.orderStatus !== 'confirmed') {
            return res.status(400).json({ message: 'Order must be confirmed before processing payment' });
        }

        const payment = await Payment.create({
            username:req.body.username,
            orderNumber:req.body.orderNumber,
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};