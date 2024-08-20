const User = require("../models/user");
//FETCH USER BY GIVEN ID
async function fetchUserById(req, res) {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    // console.log("fetchUserById", user);
    res
      .status(201)
      .json({
        id: user.id,
        addresses: user.addresses,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    // res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}

//UPDATE USER BY GIVEN ID
async function updateUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}
module.exports = { fetchUserById, updateUserById };
