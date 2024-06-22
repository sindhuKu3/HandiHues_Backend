const { Router } = require("express");
const Order = require("../models/order");
const { fetchOrderByUser, createOrder,deleteFromOrder, updateOrder, fetchAllOrders } = require("../contorllers/order");
const router = Router();

router.post("/", createOrder);
router.get("/own/", fetchOrderByUser);

 router.delete("/:id", deleteFromOrder);
router.patch("/:id", updateOrder);
 router.get('/',fetchAllOrders)
module.exports = router;
