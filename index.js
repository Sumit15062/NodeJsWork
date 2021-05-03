const express=require("express");

//require('dotenv').config({ path: 'ENV_FILENAME' })
const morgan=require("morgan");



//User Router
const usersRouter=require("./router/user-router");


//Error Handling
const errorHandler = require("./middlewares/error-handler");

//Database
require("./database/database")()

//Express Object
const application=express();

//Third Party Middlewares
application.use(express.json());
application.use(morgan('dev'))


application.listen(3000,()=>{
    console.log("listening to port 3000")
})

application.get("/",(req,res)=>{
    res.json({"message":"Home API is working"})
})

const APIrouter=express.Router();

application.use("/api",APIrouter);


APIrouter.get("/",(req,res)=>{
    res.send({"message":"API is working"})
})





APIrouter.use("/users",usersRouter);


application.use(errorHandler);
