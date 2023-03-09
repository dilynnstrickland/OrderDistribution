"use strict";

const express = require("express");
const dashboardRouter = express.Router();

// Dashboard Main Panel

dashboardRouter.get("/", (req, res) => {
    res.render('dashboard.ejs', {session: req.session});
  });

dashboardRouter.get("/main", (req, res) => {
    res.render("dashboard.ejs", {session: req.session});
  });

dashboardRouter.get("/accounts", (req, res) => {
    res.render("account.ejs", {session: req.session});
  });

dashboardRouter.get("/location", (req, res) => {
    res.render("locations.ejs", {session: req.session});
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