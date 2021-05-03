const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isAdmin:{type:Boolean,default:false},
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: { createdAt: "createdTime", updatedAt: "updatedTime" } }
);


userSchema.statics.isExists= async function isExists(email){
   
  console.log("to check if user is existing or not")
  const user=await this.findOne({email:email})
    return user?true:false
  

}

const User = mongoose.model("User", userSchema);

module.exports = User;
