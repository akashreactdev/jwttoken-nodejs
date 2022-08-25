const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    password:{
        type:String
    }
})

const UserModel = new mongoose.model("users",userSchema);

module.exports = UserModel;