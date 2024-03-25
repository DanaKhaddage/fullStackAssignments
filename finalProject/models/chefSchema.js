const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chefSchema = new Schema({
    chef:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    menuItems: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
    daysAvailable: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
        },
        available: {
            type: Boolean,
            default: false, // By default, chef is not available on any day
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model("Chef", chefSchema);
