const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
