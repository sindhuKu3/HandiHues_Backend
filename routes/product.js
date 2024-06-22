const { Router } = require("express");
const Product = require("../models/product");
const {
createProduct , fetchAllProducts,
fetchProductById,
updateProductById
} = require('../contorllers/product');
const router = Router();

router.post("/", createProduct);
router.get("/", fetchAllProducts);
router.get("/:id",fetchProductById)
router.patch("/:id", updateProductById);
module.exports = router;
