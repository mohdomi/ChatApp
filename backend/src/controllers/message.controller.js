const User = require("../models/user.model.js");
const Message = require("../models/message.model.js");
const cloudinary = require("../lib/cloudinary.js");
const { getRecieverSocketId  , io } = require("../lib/socket.js");

const getUsersForSidebar = async (req,res)=>{

    try{

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id : {$ne : loggedInUserId}
        }).select("-password");

        res.status(200).json(filteredUsers);
    }catch(err){

        console.err("Error in getUsersForSideBar ", err.message);
        res.status(500).json({
            message : "Internal Server Error."
        })
    }
}

const getMessagesBetweenTwoUsers =async (req,res)=>{
    try{
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or : [{
                senderId:myId , recieverId:userToChatId
            } , {
                senderId:userToChatId , recieverId : myId
            }]
        })


        res.status(200).json(messages);

    }catch(err){
        console.log("Error in getMessageBetweenTwoUsers and Error : " , err.message)
        res.status(500).json({
            message : "Internal Error"
        })

    }

}


const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: recieverId } = req.params;
      const senderId = req.user._id;


      console.log("REQUEST PARAMS :---  " , req.params);
      console.log("REQUEST PARAMS using recieverId :---  " , recieverId);

  
      let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
  
      const receiverSocketId = getRecieverSocketId(recieverId);
      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {

        console.log("Am i missing something");

      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };


module.exports = {
    getUsersForSidebar , 
    getMessagesBetweenTwoUsers , 
    sendMessage
}