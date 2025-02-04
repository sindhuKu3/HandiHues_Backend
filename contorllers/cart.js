const Cart = require("../models/cart");

//GET REQUEST TO FETCH ALL THE ITEM IN THE CART OF LOGIN USER
async function fetchCartByUser(req, res) {
 
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate("product");

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
}

//POST REQUEST TO ADD NEW ITEM IN THE CART
async function addToCart(req, res) {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

//DELETING REQUEST TO DELETE THE CART OF USER
async function deleteFromCart(req, res) {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

//PATCH REQUEST TO CHANGE THE QUATITY
async function updateCart(req, res) {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = { addToCart, deleteFromCart, fetchCartByUser, updateCart };
