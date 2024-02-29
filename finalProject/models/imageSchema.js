const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    itemName: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    file_path: {
        type: String,
        required: true,
        trim: true
    },
    file_type: {
        type: String,
        required: true,
        trim: true
    },
},{ timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
