const { Router } = require("express");
const User = require("../models/user");
const {
  fetchUserById,
  updateUserById,
} = require("../contorllers/user");
const router = Router();


router.get("/own", fetchUserById);
router.patch("/:id", updateUserById);
module.exports = router;
