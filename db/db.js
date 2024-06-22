const mongoose = require("mongoose");
const db = async () => {
  try {
    mongoose.set("strictQuery", false);
//CONNECTION STRING
    await mongoose.connect(
      "mongodb+srv://sindhuku3:KXYTXW4wnc6go4WX@cluster0.xuowfxl.mongodb.net/",
      {}
    );
    console.log("mongodb connected");
  } catch (error) {
    console.log("Db connected error");
    console.log(error);
  }
};
module.exports = { db };
