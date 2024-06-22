const { Router } = require("express");
const passport = require('passport')
const { createUser,loginUser, checkAuth} = require("../contorllers/auth");
const router = Router();

router.post("/signup", createUser);
router.post("/login",passport.authenticate('local'),loginUser);
router.get("/check",passport.authenticate('jwt'),checkAuth)
module.exports = router;
