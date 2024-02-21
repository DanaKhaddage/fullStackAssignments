const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    payment_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'OrderPlacement',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    paymentAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    currency: {
        type: String,
        required: true,
        enum: ['$', 'L.L'],
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);