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
const locationController = require('./Controllers/locationControllers')
const userValidator = require('./Validators/userValidators');

//Router to dashboard Controller
const dashboardRouter = require('./Controllers/dashboardControllers')
app.use('/dashboard', dashboardRouter);

// Allow someone to go to host.domain/ instead of host.domain/index
app.get("/", (req, res) => {
  res.render("index", {session: req.session});
});

// Send to index
app.get("/index", (req, res) => {
  res.render("index", {session: req.session});
});

// Also send to index. We're covering our bases here.
app.get("/home", (req, res) => {
  res.render("index", {session: req.session}, {session: req.session});
});
app.use( express.static( "public" ) );

// Also send to index. We're covering our bases here.
app.get("/home", (req, res) => {
  res.render("index", {session: req.session});
});
app.use( express.static( "public" ) );

// Login
// Login
app.get("/login", (req, res) => {
  res.render("login", {session: req.session});
});

// Register
app.get("/register", (req, res) => {
  const locations = locationController.allLocations();
  console.log(locations);
  res.render("register", {locations:locations});
});

// Allow someone to go to host.domain/ instead of host.domain/index
app.get("/404", (req, res) => {
  res.render("notfound", {session: req.session});
});

// Login & Register call functions in the userControllers.js file. // This really confused Cameron.
app.post("/api/login", userValidator.loginValidator, userController.login);
app.post("/api/register", userValidator.registerValidator, userController.createNewUser);


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