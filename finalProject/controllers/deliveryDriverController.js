const DeliveryDriver = require('../models/deliveryDriverSchema');
const Order = require('../models/orderSchema');

exports.acceptOrder = async (req, res) => {
    try {
        const { deliveryDriverID,orderID } = req.params;

        const driver = await DeliveryDriver.findById(deliveryDriverID);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.orderStatus = 'outForDelivery';
        order.driver = deliveryDriverID;
        await order.save();

        return res.status(200).json({ message: 'Order accepted successfully', order });
    } catch (err) {
        console.log(err);
    }
};

exports.declineOrder = async (req, res) => {
    try {
        const { deliveryDriverID,orderID } = req.params;

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const driver = await DeliveryDriver.findById(deliveryDriverID);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        order.orderStatus = 'cancelled';
        order.driver = driverId;
        await order.save();

        return res.status(200).json({ message: 'Order declined successfully', order });
    } catch (err) {
        console.log(err);
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { deliveryDriverID } = req.params;
        const { status } = req.body;

        const driver = await DeliveryDriver.findById(deliveryDriverID);
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

