const User=require("../models/userSchema");
const Request=require("../models/requestSchema");

const actions={
    accept:"accept",
    decline:"decline",
    cancel:"cancel",
};

const getRequestBasedOnStatus=async(req,status) =>{
    try{
        const checkRequest=await Request.find({
            $and:[
                {
                    $and:[
                        {senderID:req.body.senderID},
                        {recieverID:req.body.recieverID},
                    ],
                },
                {requestStatus:{ $eq:status}},
            ],
        });

        let isFound = checkRequest.length !==0;
        const result = {isFound: isFound,docsCount: checkRequest.length};

        return result;
    }catch(err){
        console.log(err);
    }
};

const limitRequests=async(req,status,maxReqNum)=>{
    try{
        const requestsToCheck = await getRequestBasedOnStatus(req,status);
        if(requestsToCheck.isFound === false){
            return true;
        } else {
            return requestsToCheck.docsCount>=maxReqNum;
        }
    }catch(err){
        console.log(err);
    }
};

exports.sendFriendRequest=async(req,res) =>{
    try{
        const {senderID,recieverID}=req.body;
        
        const [sender,reciever] =await Promise.all([
            User.findById({_id:senderID}),
            User.findById({_id:recieverID}),
        ]);

        if(!sender || !reciever){
            return res.status(404).json({message:"Both sender and reciever should exist to establish the friend request."});
        }

        const areFriends= 
            sender.friends.includes(recieverID)||
            reciever.friends.includes(senderID);

        if(areFriends){
            return res.status(409).json(
                {message:"You are already friends with ${reciever.fullName}"}
            );
        }

        const checkPendingReq=await getRequestBasedOnStatus(req,"pending");
        if(checkPendingReq.isFound){
            return res.status(409).json(
                {message:"You have already sent a friend request to ${reciever.fullName}"}
            );
        }

        const newFriendRequest = await Request.create({
            senderID:sender,
            recieverID:reciever,
            requestStatus:"pending",
        });

        return res.status(201).json({
            message:"Friend request successfully sent to ${reciever.fullName}",
            data:newFriendRequest,
        });

    }catch(err){
        console.log(err);
    }
};

exports.cancel_declineFriendRequest = async(req,res) =>{
    try{
        const actionToexecute=req.path.split("/")[3];
        const currentUser=req.body.currentUserID;

        const request=await getRequestBasedOnStatus(req,"pending");
        if(!request.isFound){
            return res.status(404).json(
                {message:"No pending request was found to ${actionToexecute}"}
            );
        }

        const isSender=request.senderID.toString()===currentUser.toString();
        const isReciever=request.recieverID.toString()===currentUser.toString();

        if(actionToexecute===actions.cancel && isSender) {
            request.requestStatus="canceled";
            await request.save();
            return res.status(200).json(
                {message:"Friend request successfully canceled"}
            );
        } else if(actionToexecute===actions.decline && isReciever) {
            request.requestStatus="declined";
            await request.save();
            return res.status(200).json(
                {message:"Friend request successfully declined"}
            );
        } 

        return res.status(401).json(
            {message:"You dont have permission to ${actionToexecute} the request"}
        );
    }catch(err){
        console.log(err);
    }
};

exports.acceptFriendRequest = async(req,res)=>{
    try{
        const actionToexecute=req.path.split("/")[3];
        const currentUser=req.body.currentUserID;
        const request=await getRequestBasedOnStatus(req,"pending");
        if(!request.isFound){
            return res.status(404).json(
                {message:"No pending request was found to ${actionToexecute}"}
            );
        }

        const isSender=request.senderID.toString()===currentUser.toString();
        const isReciever=request.recieverID.toString()===currentUser.toString();

        if(actionToexecute===actions.accept && isReciever) {
            request.requestStatus="accepted";
            await request.save();

            const [sender,reciever]=await Promise.all([
                User.findByIdAndUpdate(request.senderID,
                    {$push:{friends:request.recieverID},}),

                User.findByIdAndUpdate(request.recieverID,
                    {$push:{friends:request.senderID},}), 
            ]);

            if(!sender || !reciever) {
                return res.status(404).json(
                    {message:"One of the users you are trying to add is not found."}
                );
            }
            return res.status(200).json(
                {message:"Friend request successfully accepted. You are now friends."}
            );
        }

        return res.status(401).json(
            {message:"You dont have permission to ${actionToexecute} the request"}
        );
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};


