function errorHandler(error,req,res,next) {

    try{
        return res.send({error:error.message})

    }
    catch(error){
         next();
    }


   

    
}

module.exports=errorHandler;