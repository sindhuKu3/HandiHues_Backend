const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    highlights: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 3,
      min: [3, "wrong min rating"],
      max: [5, "wrong max rating"],
    },
    numReviews: {
      type: Number,

      min: [0, "wrong min reviews"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "wrong min price"],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPrice: { type: Number },
  },
  { timestamps: true }
);

const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
