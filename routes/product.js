const { Router } = require("express");
const Product = require("../models/product");
const upload = require("../upload");
const {
createProduct , fetchAllProducts,
fetchProductById,
updateProductById
} = require('../contorllers/product');
const router = Router();

router.post("/", upload.single("image"),createProduct);
router.get("/", fetchAllProducts);
router.get("/:id",fetchProductById)
router.patch("/:id", upload.single('image'),updateProductById);
module.exports = router;
