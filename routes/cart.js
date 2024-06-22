const { Router } = require("express");
 const Cart = require("../models/cart");
const { fetchCartByUser,addToCart,deleteFromCart,updateCart } = require("../contorllers/cart");
 const router = Router();

router.post("/", addToCart);
router.get("/", fetchCartByUser);
router.delete("/:id",deleteFromCart);
router.patch("/:id",updateCart)

 module.exports = router;
