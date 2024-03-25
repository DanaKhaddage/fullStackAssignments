const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bcrypt=require("bcrypt");

const userSchema= new Schema({
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
        default: ""
    },
    role: {
        type:String,
        default:"user",
        enum: ["admin","user","deliveryDriver","chef"]
    },
    permissions: [
        {
            type: String,
            enum: ['create', 'send', 'update', 'delete', 'respond'], 
        }
    ],
    orders: [ 
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    notifications: [{
        type: String,
    }],
  },
  {timestamps: true}
);

customerSchema.pre("save", async function(next) { //next is a special middleware
    try {
        if(!this.isModified("password")) {
            return next();
        }
        this.password=await bcrypt.hash(this.password,12);
        this.passwordConfirm=undefined;

        return res.status(201).json({
            message:"User created successfully",
            data:{
                newUser,
            },
        });
    } catch(err) {
        console.log(err);
    }
}),

customerSchema.methods.checkPassword=async function(candidatePassword,customerPassword){
    return await bcrypt.compare(candidatePassword,customerPassword);
}

customerSchema.methods.passwordChangedAfterTokenIssued=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passwordChangedTime=parseInt(
            this.passwordChangedAt.getTime()/1000,
            10
        );
        return passwordChangedTime >JWTTimestamp; 
    }
    return false;
};

module.exports=mongoose.model("User",userSchema)