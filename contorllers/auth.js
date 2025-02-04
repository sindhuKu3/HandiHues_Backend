const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  
   try {
     const { fullName, email, password } = req.body;
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(400).send("Email already in use.");
     }
     const user = await User.create({
       fullName,
       email,
       password,
     
     });
   
     res.status(201).send({ message: "User created successfully", user });
   } catch (error) {
     res
       .status(500)
       .send({ error: "Error creating user", details: error.message });
   }
}
async function loginUser(req, res){
  const { email, password } = req.body;
  // console.log(`req.body : ${JSON.stringify(req.body)}`);

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // res.cookie("token", token);
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: true, // Ensures the cookie is sent only over HTTPS
      sameSite: "None", // Required for cross-origin cookies in Chrome
    });
    return res.status(200).json({
      message: "User login successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Error logging in",
    });
  }
};

//IF USER EXIST SIMPLY RETURNING THE USER OBJECT
async function checkAuth(req, res) {
  console.log("checkAuth called", req.user); 
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401); // User not authenticated
  }
}

module.exports = { createUser, loginUser, checkAuth };
