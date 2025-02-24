const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protectRoute = async (req,res,next)=>{

    try{
    const token = req.cookies.jwt;

    
    if(!token){
        return res.status(401).json({
            message : "Unauthorised - no Token Provided"
        })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    if(!decoded){
        
        return res.status(401).json({
            message : "Unauthorised - Invalid Token"
        })
    }

    const user = await User.findById({
        _id : decoded.userId
    }).select("-password");


    if(!user){
        return res.status(400).json({
            message : "No user found"
        })
    }  
    

    req.user = user;
    
    next();

    }catch(err){

        console.log(err.message);
        res.status(500).json({
            message :"Internal Error"
        })

    }

}



module.exports = protectRoute