"use strict";
const locationModel = require("../Models/locationModel");
const userModel = require("../Models/userModel");

function allLocationsByCompany(req) {
    const company = req.session.user.company;
    return locationModel.getLocationsByCompany(company);
} 

function getLocationByLocationID(req) {
    const location = req.session.user.locationID;
    return locationModel.getLocationByLocationID(location);
}

function allWarehousesByCompany(req) {
    const company = req.session.user.company;
    return locationModel.getWarehousesByCompany(company);
}

function createFirstLocation(req, res) {
    const {locationName, locationAddr} = req.body;
    console.log(req.body);
    const username = req.session.user.username;
    const company = req.session.user.company;
    const newLocation = locationModel.addLocation(locationName, locationAddr, company);
    userModel.setUsersLocation(req.session.user.userID, locationName);
    const user = userModel.getUserByUsername(username);
    console.log(user);
    req.session.user.locationID = user.locationID;
    req.session.user.location = locationName;
    console.log(req.session.user);

    if (!newLocation) {
        res.sendStatus(409); //conflict
    }

    req.session.isLoggedIn = true;
    console.log("Login Successful. Redirecting to Dashboard.")
    if( 0 <= user.role < 5) {
        req.session.user.role = user.role;
    }

    return res.redirect("/dashboard");
}

function createNewLocation(req, res) {
    const {name, address} = req.body;
    const company = req.session.user.company
    const newLocation = locationModel.addLocation(name, address, company);

    if(!newLocation){
        return res.sendStatus(409);//Conflict
    }
    
    return res.redirect("/dashboard/locations");
}

async function createNewWarehouse(req, res) {
    const {name, address} = req.body;
    const company = req.session.user.company
    const newWarehouse = await locationModel.addWarehouse(name, address, company);

    if(!newWarehouse){
        return res.sendStatus(409);//Conflict
    }
    
    return res.redirect("/dashboard/warehouse");
}

module.exports = {
    getLocationByLocationID,
    allLocationsByCompany,
    allWarehousesByCompany,
    createNewLocation,
    createNewWarehouse, 
    createFirstLocation,
}