const Product = require("../models/product");
//POST REQUEST TO ADD NEW PRODUCT
async function createProduct(req, res) {
  const product = new Product(req.body);

  try {
    const doc = await product.save();
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
}
//FETCH ALL PRODUCT WITH PAGINATION AND FILTERATION
async function fetchAllProducts(req, res) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
   let condition = {} ; 
    if(!req.query.admin){
      condition.deleted = {$ne:true}
    }
    let query = Product.find(condition) ; 
    let totalProductsQuery = Product.find(condition) ; 
    console.log(req.query.category) ; 
  // let query = Product.find({ deleted: { $ne: true } });
  // let totalProductsQuery = Product.find({ deleted: { $ne: true } });

  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
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

//UPDATE PRODUCT BY GIVEN ID
async function updateProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
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
