const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { db } = require("./db/db");
const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 8000 ;
const { checkForAuthenticationCookie } = require("./middleware/authentication");
app.use(checkForAuthenticationCookie("token"));
const path = require("path");
const cors = require("cors");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const passport = require("passport");
const User = require("./models/user");
const { env } = require("process");
app.use(express.static(path.resolve(__dirname, "build")));


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Add OPTIONS here
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.set("trust proxy", 1);
app.get("/", (req, res) => {
  res.json({ status: "success" });
});
app.use("/products", productRoute);
app.use("/users",  userRoute);
app.use("/auth", authRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);
app.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);
const server = () => {
  db();
  app.listen(PORT, () => {
    console.log(`server started at PORT ${PORT}`);
  });
};

server();
