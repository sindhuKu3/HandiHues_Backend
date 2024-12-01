const { Router } = require("express");
const passport = require('passport')
const { createUser,loginUser, checkAuth} = require("../contorllers/auth");
const router = Router();

router.post("/signup", createUser);
router.post("/login",loginUser);
// passport.authenticate("local"),
  router.get("/check",  checkAuth);
//   passport.authenticate("jwt"),
   (module.exports = router);
