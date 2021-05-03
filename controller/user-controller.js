const Joi = require("joi");
const User = require("../models/user");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");


// for finding all users by admin with pagesize and page no
async function getUsers(req, res) {

  //For pagesize
  const limit=Number.parseInt(req.query.pagesize);

   //Length of a particular page
  const page=Number.parseInt(req.query.page)||1

 
  //Sort by name,email and phone
  

  //Formula for skipping the documents for a particular page
  const skip=limit*(page-1);

  console.log({limit});

  const users = await User.find().limit(Number.parseInt(limit||User.countDocuments())).skip(skip)

  
  res.json({ users });

}

//Validation of UserData
function validateUserData(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(20).required(),
    repassword: Joi.string().min(3).max(20).required(),
    phone: Joi.string().min(10).max(12),
  });

  const result = schema.validate(user);

  return result;
}

//Registration of User 
async function saveUser(req, res, next) {
  const result = validateUserData(req.body);

  //to check for the validation
  if (result.error) {
    res.status(400);
    return next(new Error(result.error.details[0].message));
  }

  const userData = result.value;
  //to check password and repassword are same or not
  if (userData.password != userData.repassword) {
    res.status(400);
    return next(new Error("password not matched"));
  }

  //to check for email existance
  let isExists = await User.isExists(userData.email);
  if (isExists) {
    res.status(400);
    return next(new Error("User with the same email already registered"));
  } else {

    //Password Hashing 
    userData.password = passwordHash.generate(userData.password);
    const savedUser = await new User(userData).save();
    res.json({ savedUser });
  }
}

function validateLoginData(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(20).required(),
  });

  const result = schema.validate(user);

  return result;
}

//Login of User
async function loginUser(req, res, next) {
  const result = validateLoginData(req.body);

  //to check for the validation
  if (result.error) {
    res.status(400);
    return next(new Error(result.error.details[0].message));
  }

  const { email, password } = result.value;

  const user = await User.findOne({ email: email });

  if (user) {
    isPasswordMatched = passwordHash.verify(password, user.password);
    if (isPasswordMatched) {
      const payload = {
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
      };
      const token = jwt.sign(payload, "secretKey1234");
      res.status(200);
      res.json({ message: "success", token: token });
    }
  }
  res.status(400);
  const err = new Error("Email or password not invalid");
  return next(err);
}

//Updation by the user
async function updateUser(req, res, next) {
  const loggedInUser = req.session.user;

  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phone: Joi.string().min(10).max(12),
  });

  const result = schema.validate(req.body);
  console.log(result.value);

  if (result.error) {
    console.log("Log1");
    const err = new Error(result.error.details[0].message);
    return next(err);
  } else {
    console.log("log2");
    console.log(loggedInUser._id);
    let user = await User.findOneAndUpdate(
      { _id: loggedInUser._id },
      {
        $set: result.value,
      },
      { new: true }
    );
    res.json({ user });
  }
}

//Update user using Id by admin
async function updateUserById(req, res, next) {
  User.findByIdAndUpdate(
    req.params.userId,
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", user);
        res.json({ user });
      }
    }
  );
}

//Delete user using Id by admin
async function deleteUserById(req,res,next){
  User.findByIdAndDelete(  req.params.userId,(err, user)=>{
    if (err){
        console.log(err)
    }
    else{
       res.status(200)
       console.log("deleted the user"+user);
       res.json({user})
    }
  });
}

//Get User By Name only by admin
//Similarly we can find using Email and Phone 
async function findUserByName(req, res, next) {



  User.find(
    {name:req.params.name},
   
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The searched user is  : ", user);
        res.json({ user });
      }
    }
  );
}


module.exports = { getUsers, saveUser, loginUser, updateUser, updateUserById,deleteUserById,findUserByName};
