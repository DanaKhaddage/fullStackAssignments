const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    itemName: {
        type: String,
        required: [true, "Item name is required."],
        unique: true,
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
        required: [true, "Ingredients are required"],
        trim: true,
        maxLength: 100,
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    customizationOptions: [{
        optionName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        additionalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);
