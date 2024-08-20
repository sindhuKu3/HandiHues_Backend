const Order = require("../models/order");
const Product = require("../models/product");
//FETCH ORDERS OF PARTICULAR USER
async function fetchOrderByUser(req, res) {
  const { id } = req.user;

  try {
    const order = await Order.find({ user: id });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
}
//POST REQUEST TO CREATE ORDER
async function createOrder(req, res) {
  const order = new Order(req.body);
  for (let item of order.items) {
    let product = await Product.findOne({ _id: item.product.id });
    product.$inc("countInStock", -1 * item.quantity);

    await product.save();
  }
  try {
    const doc = await order.save();

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}
//ONCE THE ORDER IS SUCCESSFUL RESET THE ORDER
async function deleteFromOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
}

//PATCH REQUEST TO UPDATE THE ORDER
async function updateOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
}

//FETCH ALL ORDERS OF USER APPLYING PAGINATION THIS WILL BE ACCESSIBLE TO ADMIN ONLY
async function fetchAllOrders(req, res) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }
  let query = Order.find(condition);
  let totalOrdersQuery = Order.find(condition);

  const totalDocs = await totalOrdersQuery.count().exec();
  // console.log({ totalDocs });

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

module.exports = {
  createOrder,
  fetchOrderByUser,
  deleteFromOrder,
  updateOrder,
  fetchAllOrders,
};
