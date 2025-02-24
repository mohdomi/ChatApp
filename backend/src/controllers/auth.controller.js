const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {generateToken} = require("../lib/utils.js");
const cloudinary  = require("cloudinary");


const signup =async (req,res)=>{
    const {email , fullName , password} = req.body;

        try{
        if(!email || !fullName || !password){
            return res.status(400).json({
                message : "All Fields must be filled"
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                message : "Password must be atleast 8 characters"
            })
        }
        const user = await User.findOne({
            email
        });
        
        if(user){
            return res.status(400).json({
                message  :"user already exists."
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        
        const newUser = new User({
            fullName : fullName , 
            email : email , 
            password : hashedPassword
        })

        console.log(newUser._id);
        
        
        if(newUser){
            
            generateToken(newUser._id , res);
            console.log("hii there");
            await newUser.save();
            
            return res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic
            })
            
        }else{
            return res.status(400).json({
                message : "Invalid User Data"
            })
        }

    }catch(error){
        res.status(401).json({
            message : "Internal Error"
        })
    }
        

    

}

const login = async (req,res)=>{

    const {email , password} = req.body;

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message : "Invalid Credentials."
            })
        }

       const isPasswordCorrect =  await bcrypt.compare(password , user.password);

       if(!isPasswordCorrect){
            return res.status(404).json({
                message : "Invalid Credentials."
            })
       }

       generateToken(user._id , res);

       res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic     
       })

    }catch(error){

        console.log("Error in login credentials.");
        res.status(500).json({
            message : "Internet Server Error"
        });
    }
}


const logout = (req,res)=>{

    try{

        res.cookie("jwt" , "" , {
            maxAge:0
        });

        res.status(200).json({
            message : "logout successfully"
        })


    }catch(error){

        console.log("Error in logout.");
        res.status(500).json({
            message : "Internet Server Error"
        });

    }


}


const  updateProfile = async (req,res) =>{

    try{

        const {profilePic} = req.body;

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message : "Profile Pic is not provided"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findOneAndUpdate({
            _id : userId
        } , {
            profilePic : uploadResponse.secure_url
        } , {
            new: true
        })

        res.status(200).json({
            updatedUser
        })


    }catch(err){

        console.log(err);
        res.status(400).json({
            message : "Internal Error in updateProfile"
        })
    }
}


const checkAuth = (req,res)=>{
    try{
        return res.status(200).json(req.user)
    }catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(400).json({
            message : "Internal Server Error"
        })
    }

}





module.exports = {
    signup , login , logout , updateProfile , checkAuth
}