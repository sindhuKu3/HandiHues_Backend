const mongoose = require("mongoose");
const db = async () => {
  try {
    mongoose.set("strictQuery", false);
//CONNECTION STRING
    await mongoose.connect(
          process.env.MONGO_URL,
      {}
    );
    console.log("mongodb connected");
  } catch (error) {
    console.log("Db connected error");
    console.log(error);
  }
};
module.exports = { db };
