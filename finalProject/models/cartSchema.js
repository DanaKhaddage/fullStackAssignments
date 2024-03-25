const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    cartOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalPrice: {
        type: Schema.Types.Decimal128,
        default: 0.00,
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref:'Product',
    }]
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", cartSchema);
