const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const express = require("express");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const { db } = require("./db/db");
const app = express();
const PORT = process.env.PORT;

const path = require("path");
const cors = require("cors");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const passport = require("passport");
const User = require("./models/user");
//middlewares
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;
server.use(express.static(path.resolve(__dirname, "build")));
app.use(cookieParser());
app.use(
  session({
    secret:process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 360000, //one week(1000*60*60*24*7)
      sameSite: "none",
      secure: true,
    },
  })
);
app.use(passport.authenticate("session"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    origin: ["https://handi-hues-frontend.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
}); 
 app.set("trust proxy", 1);
app.get("/", (req, res) => {
  res.json({ status: "success" });
});
app.use("/products", isAuth(), productRoute);
app.use("/users", isAuth(), userRoute);
app.use("/auth", authRoute);
app.use("/carts", isAuth(), cartRoute);
app.use("/orders", isAuth(), orderRoute);

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      console.log({ email, password });
      if (!user) {
        return done(null, false, { message: "invalid credential" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",

        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credential" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { token });
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

//jwt
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      // jwt_payload.id;
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//serializable
passport.serializeUser(function (user, cb) {
  console.log("serialize:", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//deserializable
passport.deserializeUser(function (user, cb) {
  console.log("Deserialize:", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log(`server started at PORT ${PORT}`);
  });
};

server();
