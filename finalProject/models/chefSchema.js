const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chefSchema = new Schema({
    name: {
        type: String,
        required: [true, "Chef name is required."],
        trim: true,
        maxLength: 100,
    },
    specialization: {
        type: String,
        required: [true, "Chef specialization is required."],
        trim: true,
        maxLength: 100,
    },
    experienceYears: {
        type: Number,
        required: [true, "Chef experience is required."],
        min: 0,
    },
    background: {
        type: String,
        trim: true,
    },
    skills: [{
        type: String,
        trim: true,
        maxLength: 100,
    }],
    phoneNumber: {
        type: String,
        trim: true,
        maxLength: 20,
    },
    email: {
        type: String,
        trim: true,
        maxLength: 150,
        lowercase: true,
    },
    menuItems: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
    daysAvailable: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    }],
}, { timestamps: true });

module.exports = mongoose.model("Chef", chefSchema);
