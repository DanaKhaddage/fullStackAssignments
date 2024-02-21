const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    entityType: {
        type: String,
        enum: ['product', 'restaurant', 'chef', 'order', 'platform'],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
