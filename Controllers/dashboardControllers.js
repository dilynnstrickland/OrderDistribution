"use strict";

const express = require("express");
const dashboardRouter = express.Router();

const companyModel = require('../Models/companyModel');

// Dashboard Main Panel

dashboardRouter.get("/", (req, res) => {
    if(req.session.isLoggedIn) {
      const role = req.session.user.role;
      const company = companyModel.getCompanyByCompanyID(req.session.user.company);
      res.render("dashboard", {session: req.session, role:role, companyDict:company});
    } else {
      res.sendStatus(401);
    }
  });

dashboardRouter.get("/main", (req, res) => {
  if(req.session.isLoggedIn) {
    const role = req.session.user.role;
    const company = companyModel.getCompanyByCompanyID(req.session.user.company);
    res.render("dashboard", {session: req.session, role:role, companyDict:company});
  } else {
    res.sendStatus(401);
  }
  });

dashboardRouter.get("/accounts", (req, res) => {
  if(req.session.isLoggedIn) {
    res.render("account", {session: req.session});
  } else {
    res.sendStatus(401);
  }
  });

dashboardRouter.get("/location", (req, res) => {
    res.render("locations", {session: req.session});
  });

dashboardRouter.get("/warehouse", (req, res) => {
    res.render("warehouse.ejs", {session: req.session});
  });

dashboardRouter.get("/order", (req, res) => {
    res.render("order.ejs", {session: req.session});
  });

dashboardRouter.get("/inventory", (req, res) => {
    res.render("inventory.ejs", {session: req.session});
  });

module.exports = dashboardRouter;


// app.get("/order", (req, res) => {
//   if(req.session.isLoggedIn) {
//     res.render("order");
//   } else {
//     res.sendStatus(401);
//   }
// })