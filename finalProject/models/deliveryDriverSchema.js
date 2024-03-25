const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryDriverSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleInformation: {
        type: String,
        required: [true, "Vehicle information is required."],
        trim: true,
        maxLength: 255,
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
        enum: ['declined', 'available'],
        default: 'available'
    },
    documents: {
        license: String,
        insurance: String,
    }, 
}, { timestamps: true });

module.exports = mongoose.model("DeliveryDriver", deliveryDriverSchema);

