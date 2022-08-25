const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user").then(()=>{
    console.log("database connection successfully");
}).catch(()=>{
    console.log("database connection failed");
})