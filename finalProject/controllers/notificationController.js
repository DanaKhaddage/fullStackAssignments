const Notification = require('../models/notificationSchema');
const Customer = require('../models/customerSchema');

exports.sendNotification = async (req, res) => {
    try {
        const { username, content } = req.body;

        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        const notification = new Notification({
            username,
            content,
            status: 'unread'
        });

        await notification.save();
        
        return res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch notifications for the user
        const notifications = await Notification.find({ customerId });

        return res.status(200).json({ notifications });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};