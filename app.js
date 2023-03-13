"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
const isProduction = process.env.NODE_ENV === "production";

/*Register Session Management*/
let redisClient = redis.createClient();
const sessionConfig = {
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET, 
    resave: false,
    saveUninitialized: false,
    name: "session", // now it is just a generic name
    isLoggedIn: false,
    cookie: {
      sameSite: isProduction, //allow cookie only in the website
      secure: isProduction, //allow cookie only on https transmission
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    }
};
app.use(session(sessionConfig));//session

app.use(express.static("public", {index: "index.html", extensions: ["html"]}));
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const userController = require('./Controllers/userControllers');
const locationController = require('./Controllers/locationControllers');
const companyModel = require('./Models/companyModel');
const userValidator = require('./Validators/userValidators');

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/registerOwner", (req, res) => {
  res.render("registerOwner");
});
app.get("/registerEmployee", (req, res) => {
  res.render("registerEmployee");
});
app.get("/dashboard", (req, res) => {
  const role = req.session.user.role;
  const company = companyModel.getCompanyByCompanyID(req.session.user.company);
  res.render("dashboard", {role:role, companyDict:company});
})
app.get("/inventory", (req, res) => {
  res.render("inventory");
})
app.get("/location", (req, res) => {
  res.render("location");
})
app.get("/warehouse", (req, res) => {
  res.render("warehouse");
})
app.get("/order", (req, res) => {
  res.render("order");
})
app.get("/account", (req, res) => {
  res.render("account");
})
app.get("/company", (req, res) => {
  res.render("company");
})

app.get("/logout", userController.logOut);

app.post("/api/login", userValidator.loginValidator, userController.login);
app.post("/api/registerOwner", userValidator.registerOwnerValidator, userController.createNewOwner);
app.post("/api/registerOwner", userValidator.registerOwnerValidator, userController.createNewOwner);

if(isProduction) {
  app.set('trust proxy',1);
  app.use(helmet());
  app.use(productionErrorHandler);
}


app.listen(process.env.PORT, () => {
  const BLUE = "\u001b[34;1m";
  const GREEN = "\u001b[32;1m";
  const RESET = "\u001b[0m";

  let mode = process.env.NODE_ENV || "development";
  // Then add some color
  const color = isProduction ? GREEN : BLUE;
  mode = `${color}${mode}${RESET}`;

  console.log(`Listening on port: ${process.env.PORT} in ${mode} mode`);
});     