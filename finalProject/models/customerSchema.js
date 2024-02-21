const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const customerSchema= new Schema({
    customerId: {
        type: String,
        unique: true,
        required: [true, "Customer ID is required."],
        trim: true,
    },
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
    orderHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],  
  },
  {timestamps: true}
);

module.exports=mongoose.model("Customer",customerSchema)