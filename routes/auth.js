const { Router } = require("express");
const passport = require('passport')
const { createUser,loginUser, checkAuth} = require("../contorllers/auth");
const router = Router();

router.post("/signup", createUser);
router.post("/login",loginUser);
  router.get("/check",  checkAuth);

   module.exports = router ;
