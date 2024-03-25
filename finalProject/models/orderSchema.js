const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'deliveryDriver',
        required: true,
    },
    orderOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menuItems: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'paid', 'outForDelivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
