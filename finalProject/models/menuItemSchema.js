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
    itemImage:{
        type:String,
        default:""
    },
    description: {
        type: String,
        required: [true, "Description is required."],
        trim: true,
        maxLength: 255,
    },
    itemQuantity: {
        type: Number,
        required: [true, "Item quantity is required."],
        default: 0,
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
        action: {
            type: String,
            enum: ['add', 'remove'], 
            required: true,
        },
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    }
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);
