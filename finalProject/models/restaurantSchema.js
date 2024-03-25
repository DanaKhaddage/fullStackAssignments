const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Restaurant name is required."],
        trim: true,
        maxLength: 100,
    },
    address: {
        type: String,
        required: [true, "Restaurant address is required."],
        trim: true,
        maxLength: 255,
    },
    phoneNumber: {
        type: String,
        required: [true, "Restaurant phone number is required."],
        trim: true,
        maxLength: 20,
    },
    email: {
        type: String,
        trim: true,
        maxLength: 150,
        lowercase: true,
    },
    aboutUs: {
        mission: {
            type: String,
            required: true,
        },
        history: {
            type: String,
            required: true,
        },
        values: {
            type: [String],
            required: true,
        },
    },
    openingHours: {
        type: String,
    },
    menuItems: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
    specialties: [{
        type: String,
        trim: true,
        maxLength: 50,
    }],
    cuisineType: [{
        type: String,
        trim: true,
        maxLength: 50,
    }],
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
