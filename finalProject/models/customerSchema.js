const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const customerSchema= new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required."],
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required."],
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    username: {
        type: String,
        unique: true,
        required: [true, "UserName is required."],
        trim: true,
        minLength: 5,
        maxLength: 20,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."],
        trim: true,
        maxLength: 150,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: [true, "Phone Number is required."],
        trim: true,
        maxLength: 20,
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
    address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
        maxLength: 255,
    },
    accountStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }, 
    profilePicture: {
        type: String,
        default: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
    },
    savedAddresses: [
        {
            type: String,
            trim: true,
            maxLength: 255
        }
    ],
    orderHistory: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        date: {
            type: Date,
            default: Date.now
        },
    }],
    notifications: [{
        type: String,
    }],
    cart: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        quantity: {
            type: Number,
            default: 1
        },
    }],  
  },
  {timestamps: true}
);

const bcrypt=require("bcrypt");
customerSchema.pre("save", async function(next) {
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

customerSchema.methods.checkPassword=async function(candidatePassword,customerPassword){
    return await bcrypt.compare(candidatePassword,customerPassword);
}

module.exports=mongoose.model("Customer",customerSchema)