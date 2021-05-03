const jwt = require("jsonwebtoken");
function userAuthMiddleware(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    let token = null;

    token = bearerToken.split(" ")[1];

    const payload = jwt.verify(token, "secretKey1234");
       req.session={
           user:payload
       }
       next();
  } 

  catch (error) {
    res.status(401);
  return res.json({message:"no valid token found"})
  }
}
function adminAuthMiddleware(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    let token = null;

    token = bearerToken.split(" ")[1];

    const payload = jwt.verify(token, "secretKey1234");
       req.session={
           user:payload
       };
       if(payload.isAdmin){
            next();
       }
       else{
         return res.json("you are not authorised");
       }

    
  } 

  catch (error) {
    res.status(401);
  return res.json({message:"no valid token found"})
  }
}

module.exports={userAuthMiddleware,adminAuthMiddleware}
