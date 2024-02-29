const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    actions: [{
        type: String,
        trim: true
    }],
    itemIdQuantity: [{
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
    }]
});

module.exports = mongoose.model("Cart", cartSchema);
