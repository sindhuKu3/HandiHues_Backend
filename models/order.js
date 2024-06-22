const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "true",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  selectedAddresses: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
