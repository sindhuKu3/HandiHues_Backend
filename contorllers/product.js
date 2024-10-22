const Product = require("../models/product");
const cloudinary = require("../cloudinaryConfig"); 
const upload = require("../upload");
//POST REQUEST TO ADD NEW PRODUCT
async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      highlights,
      category,
      countInStock,
      discountPercentage,
      rating,
    } = req.body;

    // Create a new product instance
    const product = new Product({
      name,
      description,
      price,
      highlights,
      category,
      countInStock,
      discountPercentage,
      rating,
    });

    // Check if image is uploaded
    if (req.file) {
      product.image = req.file.path; // Storing Cloudinary URL of the image
    }

    // Calculate discount price
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    // Save the product to the database
    const savedProduct = await product.save();

    res.status(200).json({
      message: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating product",
      error,
    });
  }
}

//FETCH ALL PRODUCT WITH PAGINATION AND FILTERATION
async function fetchAllProducts(req, res) {
  // filter = {"category":["bags"]}
  // pagination = {_page:1,_limit=10}
  const isAdmin = req.query.admin === "true";

  let query = isAdmin
    ? Product.find()
    : Product.find({ deleted: { $ne: true } });
  let totalProductsQuery = isAdmin
    ? Product.find()
    : Product.find({ deleted: { $ne: true } });
  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
}

//FETCH PRODUCT BY GIVEN ID
async function fetchProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function updateProductById(req, res) {
  const { id } = req.params;

  try {
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields from request body
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.discountPercentage =
      req.body.discountPercentage || product.discountPercentage;
    product.rating = req.body.rating || product.rating;

    // Check if a new image is uploaded
    if (req.file) {
      product.image = req.file.path; // Use the new image URL from Cloudinary
    }

    // Calculate the discount price
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    // Save the updated product
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProductById,
};
