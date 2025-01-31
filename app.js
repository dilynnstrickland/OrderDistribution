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

//For Static Views
app.use(express.static("public", {index: "index.html", extensions: ["html"]}));
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));

//For Dynamic Views
app.set("view engine", "ejs");

//Loading Controllers
const userController = require('./Controllers/userControllers');
const locationController = require('./Controllers/locationControllers');
const companyModel = require('./Models/companyModel');
const userModel = require("./Models/userModel");
const userValidator = require('./Validators/userValidators');
const itemController = require('./Controllers/itemController');
const itemModel = require('./Models/itemModel');
const locationModel = require('./Models/locationModel');

// Router to dashboard
const dashboardRouter = require('./Routers/dashboardRouter')
app.use('/dashboard', dashboardRouter);

app.use( express.static( "/public" ) );

// Allow someone to go to host.domain/ instead of host.domain/index
app.get("/", (req, res) => {
  res.render("index", {session:req.session});
});

// Send to index
app.get("/index", (req, res) => {
  res.render("index", {session:req.session});
});

// Also send to index. We're covering our bases here.
app.get("/home", (req, res) => {
  res.render("index", {session:req.session});
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/registerOwner", (req, res) => {
  res.render("registerOwner");
});

app.get("/registerFirstLocation", (req, res) => {
  res.render("registerFirstLocation");
});

app.get("/registerEmployee", (req, res) => {
  res.render("registerEmployee");
});


app.get("/manageEmployee", (req, res) => {
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const employees = userModel.getEmployeesByCompany(req.session.user.company);
      res.render("manageEmployee", {Employees:employees}); 
    }
  } else {
    res.sendStatus(401);
  }
});

//Views Allowed for All-Role Users
app.get("/dashboard", (req, res) => {
  if(req.session.isLoggedIn) {
    const role = req.session.user.role;
    const company = companyModel.getCompanyByCompanyID(req.session.user.company);
    res.render("dashboard", {role:role, companyDict:company});
  } else {
    res.sendStatus(401);
  }
});

app.get("/order", (req, res) => {
  if(req.session.isLoggedIn) {
    const warehouses = locationController.allWarehousesByCompany(req);
      res.render("order", {Warehouses:warehouses});
  } else {
    res.sendStatus(401);
  }
});



app.get("/account", (req, res) => {
  if(req.session.isLoggedIn) {
    res.render("account");
  } else {
    res.sendStatus(401);
  }
});



app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/team", (req, res) => {
  res.render("team");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Allow someone to go to host.domain/ instead of host.domain/index
app.get("/404", (req, res) => {
  res.render("notfound", {session: req.session});
});

app.get("/logout", userController.logOut);

// Login & Register call functions in the userControllers.js file. // This really confused Cameron.
app.post("/api/login", userValidator.loginValidator, userController.login);
app.post("/api/registerOwner", userValidator.registerOwnerValidator, userController.createNewOwner);
app.post("/api/registerFirstLocation", userValidator.registerFirstLocationValidator, locationController.createFirstLocation);
app.post("/api/addInv", itemController.createNewItem);


if(isProduction) {
  app.set('trust proxy',1);
  app.use(helmet());
  app.use(productionErrorHandler);
}
// Port Listening (Now With Color!)
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