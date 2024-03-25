const Notification = require('../models/notificationSchema');
const Admin = require('../models/adminSchema');
const User = require('../models/userSchema');

exports.sendNotification = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminID);
        if (!admin || !admin.permissions.includes("send")) {
            return res.status(401).json({ message: "You are not authorized to send notifications." });
        }

        const notification = new Notification({
            user,
            content,
            sentBy: admin._id // Associate the notification with the admin
        });

        await notification.save();
        return res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Query notifications related to the user
        const notifications = await Notification.find({ user: user._id });

        return res.status(200).json({ notifications });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};
