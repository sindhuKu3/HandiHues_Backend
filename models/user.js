const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: Buffer,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    addresses: {
      type: [mongoose.Schema.Types.Mixed],
    },
    orders: {
      type: [mongoose.Schema.Types.Mixed],
    },
    salt: Buffer,
  },
  { timestamps: true }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
