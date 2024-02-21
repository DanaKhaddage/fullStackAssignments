const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryDriverSchema = new Schema({
    driverId: {
        type: String,
        unique: true,
        required: [true, "Driver ID is required."],
        trim: true,
    },
    driverName: {
        type: String,
        required: [true, "Driver name is required."],
        trim: true,
        maxLength: 50,
    },
    vehicleInformation: {
        type: String,
        required: [true, "Vehicle information is required."],
        trim: true,
        maxLength: 255,
    },
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
    shiftSchedule: {
        startTime: Date,
        endTime: Date,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    status: {
        type: String,
        enum: ['on-duty', 'off-duty', 'en-route', 'available'],
        default: 'available'
    },
    documents: {
        license: String,
        insurance: String,
    },
    notes: String, 
}, { timestamps: true });


module.exports = mongoose.model("DeliveryDriver", deliveryDriverSchema);

