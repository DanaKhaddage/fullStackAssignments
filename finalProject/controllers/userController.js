const User = require("../models/userSchema");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const {promisify}=require("util"); //promisify is a function provided by Node.js that converts callback-based APIs into promise-based APIs.

//encapsulates the logic for generating a JWT token with the provided user ID, 
//using a secret key and an expiration time defined in environment variables.
const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken=(user, statusCode,res)=>{
    const token=signToken(user._id); //the sign token generates a JSON Web Token (JWT) based on this user ID.
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user,
        },
    });
}
exports.signup= async(req,res) => {
    try{
        if(!validator.isEmail(req.body.email)) {
            return res.status(400).json({message:"Invalid email address"});
        }
        if(!validator.isMobilePhone(req.body.phoneNumber)) {
            return res.status(400).json({message:"Invalid phone number"});
        }

        const UserExistence = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        
        if(UserExistence) {
            return res.status(409).json({message:"User already exists"});                                                                  
        }
        if(req.body.password!==req.body.passwordConfirm) {
            return res.status(400).json({message:"Please enter matching password and password confirm"});
        }
        const newUser=await User.create({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            username:req.body.username,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            address:req.body.address,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            role:req.body.role,
            passwordChangedAt:Date.now(),
        });

        createSendToken(newUser,201,res);
        //return res.status(201).json({message:"Signup successfully"});
    } catch(err) {
        res.status(500).json({message:err.message});
        console.log(err);
    }
};

exports.login=async(req,res) => {
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user || !await user.checkPassword(password, user.password)) {
            return res.status(401).json({message:"Invalid Credentials"});
        }
        
        createSendToken(user,200,res);
        //return res.status(200).json({message:"Logged in successfully"});
    }catch(err) {
        res.status(500).json({message:err.message});
        console.log(err);
    }
};

exports.protect=async(req,res,next)=>{
    try{
        //first we check if the token exists
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ // bearer is a type of token
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({message:"You are not logged in"});
        }
        
        //token verification
        let decoded;
        try{
            //token:JWT token to be verified
            //process.env.JWT_SECRET: This is the secret key used to sign the JWT. 
            //It's retrieved from an environment variable JWT_SECRET.
            decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        }catch(error){
            if(error.name==="JsonWebTokenError"){
                return res.status(401).json({message:"Invalid token"});
            } else if(error.name==="TokenExpiredError"){ 
                return res.status(401).json({message:"Your session token has expired! Login again"});          
            }
        }
        //check if the user still exists
        const currentUser =await User.findById(decoded.id);
        if(!currentUser){
            return res.status(401).json({message:"The token owner does not exist"});
        }
        //check if the user changed their password after taking the token
        //iat: issued at. It represents the time at which the token was issued. 
        if(currentUser.passwordChangedAfterTokenIssued(decoded.iat)){
            return res.status(401).json({message:"Your password has changed! Login again"});
        }
        //we add the user to all the requests
        req.user=currentUser;
        next();
    }catch(err) {
        res.status(500).json({message:err.message});
        console.log(err);
    }
};



