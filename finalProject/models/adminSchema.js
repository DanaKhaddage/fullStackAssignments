const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminName: {
        type: String,
        required: [true, "Admin name is required."],
        trim: true,
        maxLength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."],
        trim: true,
        maxLength: 150,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
        minLength: 6,
    },
    passwordConfirm: {
        type: String,
        trim: true,
        minLength: 6, 
    },
    passwordChangedAt: Date,
    profilePicture: String,
    contactInformation: {
        phone: String,
        address: String,
    },
    lastLoginTime: Date,
    permissions: [
        {
            type: String,
            enum: ['create', 'send', 'update', 'delete', 'respond'], 
        }
    ],
    adminRights: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
   },
   {timestamps: true}
);

const bcrypt=require("bcrypt");
adminSchema.pre("save", async function(next) {
    try {
        if(!this.isModified("password")) {
            return next();
        }
        this.password=await bcrypt.hash(this.password,12);
        this.passwordConfirm=undefined;
    } catch(err) {
        console.log(err);
    }
}),

adminSchema.methods.checkPassword=async function(candidatePassword,adminPassword){
    return await bcrypt.compare(candidatePassword,adminPassword);
}

module.exports = mongoose.model("Admin", adminSchema);

