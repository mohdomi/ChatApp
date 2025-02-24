const mongoose = require("mongoose");


const userSchema =  new mongoose.Schema({

    email : {
        type : String,
        required:  true , 
        unique:  true
    },
    fullName : {
        type : String , 
        required : true , 
        unique : false
    }, 
    password : {
        type : String , 
        required : true , 
        minlength : 8 
    },
    profilePic : {
        type : String,
        default : ""
    }
},
{
    timestamps : true
}
)


const User = mongoose.model("User" , userSchema);


module.exports = User;