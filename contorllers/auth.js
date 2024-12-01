const User = require("../models/user");
// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// const { sanitizeUser } = require("../services/common");

//SIGNUP
async function createUser(req, res) {
  // try {
  //   const salt = crypto.randomBytes(16);
  //   crypto.pbkdf2(
  //     req.body.password,
  //     salt,
  //     310000,
  //     32,
  //     "sha256",

  //     async function (err, hashedPassword) {
  //       const user = new User({ ...req.body, password: hashedPassword, salt });
  //       const doc = await user.save();
  //       req.login(sanitizeUser(doc), (err) => {
  //         if (err) {
  //           res.status(400).json(err);
  //         } else {
  //           const token = jwt.sign(
  //             sanitizeUser(doc),
  //             process.env.JWT_SECRET_KEY
  //           );
  //           res
  //             .cookie("jwt", token, {
  //               expires: new Date(Date.now() + 3600000),
  //               httpOnly: true,
  //             })
  //             .status(201)
  //             .json(token);
  //         }
  //       });
  //     }
  //   );
  // } catch (error) {
  //   res.status(400).json(error);
  // }

   try {
     const { name, email, password } = req.body;
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(400).send("Email already in use.");
     }
     // Create user
    //  const verificationCode = Math.floor(
    //    100000 + Math.random() * 90000
    //  ).toString();
     const user = await User.create({
       name,
       email,
       password,
      //  verificationCode,
     });
    //  await sendVerificationCode(user.email, user.verificationCode);
     res.status(201).send({ message: "User created successfully", user });
   } catch (error) {
     res
       .status(500)
       .send({ error: "Error creating user", details: error.message });
   }
}

//LOGIN
async function loginUser(req, res) {
  // const user = req.user;
  // console.log("user token "+req.user.token)
  // res
  //   .cookie("jwt", req.user.token, {
  //     expires: new Date(Date.now() + 3600000),
  //     httpOnly: true,
  //   })
  //   .status(201)
  //   .json(req.user.token);

  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log(`token : ${token}`);
    return res.status(200).json({
      message: "User login successful",
      token, // Send the token to the client
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error logging in",
    });
  }
}
//IF USER EXIST SIMPLY RETURNING THE USER OBJECT
async function checkAuth(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
}

module.exports = { createUser, loginUser, checkAuth };
