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
      type: String,
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
    salt:{
      type:String,
    },
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

//matching of password given by user with password which we already have in our db for that user
userSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it has been modified
  if (!user.isModified("password")) {
    return next();
  }

  const salt = randomBytes(16).toString("hex"); // Generate a new salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password) // Use the plain text password here
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword; // Store the hashed password as a string
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const salt = user.salt;
    const hashedPassword = user.password; // Retrieved password is already a string
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash) {
      throw new Error("Incorrect password");
    }

    // Generate token
    const token = createTokenForUser(user);
 
    return token;
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
