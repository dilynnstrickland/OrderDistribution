"use strict";
const locationModel = require("../Models/locationModel");

function allLocationsByCompany(req) {
    const company = req.session.user.company;
    return locationModel.getLocationsByCompany(company);
} 

function allWarehousesByCompany(req) {
    const company = req.session.user.company;
    return locationModel.getWarehousesByCompany(company);
} 

async function createNewLocation(req, res) {
    const {name, address} = req.body;
    const company = req.session.user.company
    const newLocation = await locationModel.addLocation(name, address, company);

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
    allLocationsByCompany,
    allWarehousesByCompany,
    createNewLocation,
    createNewWarehouse
}