const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderPlacementSchema = new Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'deliveryDriver',
        required: true,
    },
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    menuItems: [{
        menuItem: {
            type: Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true,
        maxLength: 255
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'outForDelivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
}, { timestamps: true });

module.exports = mongoose.model("OrderPlacement", orderPlacementSchema);
