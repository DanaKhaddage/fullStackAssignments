const DeliveryDriver = require('../models/deliveryDriverSchema');
const Order = require('../models/orderPlacementSchema');

exports.acceptOrder = async (req, res) => {
    try {
        const { driverId,orderId } = req.params;

        const driver = await DeliveryDriver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'outForDelivery';
        order.driver = driverId;
        await order.save();

        return res.status(200).json({ message: 'Order accepted successfully', order });
    } catch (err) {
        console.log(err);
    }
};

exports.declineOrder = async (req, res) => {
    try {
        const { driverId } = req.params;
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'cancelled';
        order.driver = driverId;
        await order.save();

        return res.status(200).json({ message: 'Order declined successfully', order });
    } catch (err) {
        console.log(err);
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { driverId } = req.params;
        const { status } = req.body;

        const driver = await DeliveryDriver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        driver.status = status;
        await driver.save();

        return res.status(200).json({ message: 'Availability status updated successfully', driver });
    } catch (err) {
        console.log(err);
    }
};

exports.viewDeliveryHistory = async (req, res) => {
    try {
        const { driverId } = req.params;

        const deliveryHistory = await Order.find({ driver: driverId, status: 'delivered' });

        return res.status(200).json({ deliveryHistory });
    } catch (err) {
        console.log(err);
    }
};
