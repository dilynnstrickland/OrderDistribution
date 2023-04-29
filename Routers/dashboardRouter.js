"use strict";

const express = require("express");
const dashboardRouter = express.Router();

const userController = require('../Controllers/userControllers');
const locationController = require('../Controllers/locationControllers');
const itemController = require('../Controllers/itemController');

const userModel = require('../Models/userModel');
const companyModel = require('../Models/companyModel');
const itemModel = require('../Models/itemModel');
const locationModel = require('../Models/locationModel');

const userValidator = require('../Validators/userValidators');
const session = require("express-session");

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
    const employees = userModel.getEmployeesByCompany(req.session.user.company);
    res.render("account", {session: req.session, Employees:employees});
  } else {
    res.sendStatus(401);
  }
  });

dashboardRouter.get("/locations", (req, res) => {
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const locations = locationController.allLocationsByCompany(req);
      res.render("locations", {session:req.session, Locations:locations}); 
    }
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.get("/warehouse", (req, res) => {
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const warehouses = locationController.allWarehousesByCompany(req);
      res.render("warehouse", {session:req.session, Warehouses:warehouses}); 
    }
  } else {
    res.sendStatus(401);
  }
});


// Location Routers

dashboardRouter.get("/registerLocation", (req, res) => {
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const locations = locationController.allLocationsByCompany(req);
      res.render("registerLocation", {session:req.session, Locations:locations}); 
    }
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.get("/registerWarehouse", (req, res) => {
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const warehouses = locationController.allWarehousesByCompany(req);
      res.render("registerWarehouse", {session:req.session, Warehouses:warehouses}); 
    }
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.post("/api/registerLocation", locationController.createNewLocation);
dashboardRouter.post("/api/registerWarehouse", locationController.createNewWarehouse);

dashboardRouter.get("/order", (req, res) => {
  if(req.session.isLoggedIn) {
    let locations;
    const warehouses = locationController.allWarehousesByCompany(req);
    if (req.session.user.role == 3){
      locations = locationController.allLocationsByCompany(req);
    }
    else {
      locations = [locationController.getLocationByLocationID(req)];
    }
    res.render("order", {session:req.session, Warehouses:warehouses, Locations:locations});
  } else {
    res.sendStatus(401);
  }
})

// Included so if people selected the url and then
// press enter, then since it doesn't have warehouse
// or location ids after, it will return to order page
// to re-enter them.
dashboardRouter.get("/orderRequest", (req,res) => {
  res.redirect("order");
})

dashboardRouter.post("/orderRequest", (req, res) => {
  let items;
  if (req.session.isLoggedIn) {
    if (req.body.location && req.body.warehouse){
      let {location, warehouse} = req.body;
      items = itemModel.getAllItemByLocationID(warehouse);
      location = locationModel.getLocationByLocationID(location);
      warehouse = locationModel.getLocationByLocationID(warehouse);
      res.render("orderRequest", {session:req.session, location:location, warehouse:warehouse, items:items});
    }
  } else {
    return res.sendStatus(401);
  }
})
dashboardRouter.post("/api/orderRequest", (req, res) => {
  const location = JSON.parse(req.body.location);
  const warehouse = JSON.parse(req.body.warehouse);
  let items = Object.assign({}, req.body);
  const filteredObj = Object.fromEntries(Object.entries(items).filter(([key, value]) => value !== '0' && key !== 'location' && key !== 'warehouse'));
  console.log(location);
  console.log(warehouse);
  console.log(filteredObj);
  
})

dashboardRouter.get("/inventory", (req, res) => {
  if(req.session.isLoggedIn) {
    const items = itemModel.getAllItemByLocationID(req.session.user.locationID);
    console.log(items);
    const curLocation = req.session.user.location;
    const clientLocation = "";
    console.log(curLocation);
    const location = locationModel.getLocationByLocationID(curLocation);
    console.log(location);
    res.render("inventory", {session:req.session, items:items, curLocation:curLocation, clientLocation:clientLocation, location:location});
  } else {
    res.sendStatus(401);
  }
})

dashboardRouter.get("/inventory/:locationID", (req, res) => {
  console.log("Test")
  if(req.session.isLoggedIn) {
    const items = itemModel.getAllItemByLocationID(req.params.locationID);
    console.log(items);
    const curLocation = req.session.user.location;
    console.log(curLocation);
    const clientLocation = req.params.locaitonID;
    console.log(clientLocation);
    const location = locationModel.getLocationByLocationID(curLocation);
    console.log(location);

    res.render("inventory", { session:req.session, items:items, curLocation:curLocation, clientLocation:clientLocation, location:location});
  } else {
    res.sendStatus(401);
  }
})

// Account Management Routers
dashboardRouter.get("/registerEmployee", (req, res) => {
  console.log("Getting Employee Register");
  if(req.session.isLoggedIn) {
    if(req.session.user.role == 3 || req.session.user.role == 4) {
      const locations = locationController.allLocationsByCompany(req);
      const warehouses = locationController.allWarehousesByCompany(req);
      if(locations && warehouses) {
        res.render("registerEmployee", {session: req.session, Locations:locations, Warehouses:warehouses}); 
      } else {
        res.redirect("/dashboard");
      }
    }
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.get("/order/:clientLocation", (req, res) => {
  if(req.session.isLoggedIn) {
    const allItems = itemModel.getAllItemByLocationID(clientLocation);
    res.render("orderReq", {allItems:allItems, clientLocation:clientLocation});
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.get("/addInv", (req, res) => {
  if(req.session.isLoggedIn) {
    const allItems = itemModel.getAllItemByLocationID(req.session.user.location);
    res.render("addInv", {session:req.session, allItems:allItems, clientLocation:req.session.user.location});
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.get("/createItem", (req, res) => {
  if(req.session.isLoggedIn) {
    res.render("createItem", {session:req.session});
  } else {
    res.sendStatus(401);
  }
});

dashboardRouter.post("/api/createItem", itemController.createItem);

dashboardRouter.post("/api/registerEmployee", userValidator.registerEmployeeValidator, userController.createNewEmployee)

module.exports = dashboardRouter;


// app.get("/order", (req, res) => {
//   if(req.session.isLoggedIn) {
//     res.render("order");
//   } else {
//     res.sendStatus(401);
//   }
// })