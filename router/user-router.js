const express=require("express");

const {getUsers,saveUser,loginUser,updateUser,updateUserById, findUserByName}=require("../controller/user-controller");
const { userAuthMiddleware,adminAuthMiddleware } = require("../middlewares/user-auth-middleware");


const userRouter=express.Router();

//getting all users by Admin
userRouter.get("/",adminAuthMiddleware,getUsers);

//getting all users by Admin using name
userRouter.get("/:name",adminAuthMiddleware,findUserByName);

//saving to database on registration
userRouter.post("/",saveUser);

//update profile by user itself
userRouter.put("/",userAuthMiddleware,updateUser);

//update user by admin
userRouter.put("/:userId",adminAuthMiddleware,updateUserById)

//login by user 
userRouter.post("/login",loginUser)




module.exports=userRouter;