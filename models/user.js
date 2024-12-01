const mongoose = require("mongoose");
const {createHmac , randomBytes} = require("crypto") ;
const { createTokenForUser } = require("../services/authentication");
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
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});
//matching of password given by user with password which we already have in our db for that user
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const salt = user.salt;
    const hashedpassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedpassword !== userProvidedHash) {
      throw new Error("incorrect password");
    }
    const token = createTokenForUser(user);
    console.log(token);
    return token;
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
