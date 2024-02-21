const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    item_id: {
        type: String,
        unique: true,
        required: [true, "Item ID is required."],
        trim: true,
    },
    itemName: {
        type: String,
        required: [true, "Item name is required."],
        trim: true,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        min: 0,
    },
    description: {
        type: String,
        required: [true, "Description is required."],
        trim: true,
        maxLength: 255,
    },
    available: {
        type: Boolean,
        default: true,
    },
    ingredients: [{
        type: String,
        trim: true,
        maxLength: 100,
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);
