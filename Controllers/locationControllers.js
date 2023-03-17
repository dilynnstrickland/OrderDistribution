"use strict";
const locationModel = require("../Models/locationModel");

function allLocationsByCompany(req) {
    const company = req.session.user.company;
    return locationModel.getLocationsByCompany(company);
} 

async function createNewLocation(req, res) {
    const {name, address} = req.body;
    const company = req.session.user.company
    const newLocation = await locationModel.addLocation(name, address, company);

    if(!newLocation){
        return res.sendStatus(409);//Conflict
    }
    
    return res.redirect("/manageLocation");
}

module.exports = {
    allLocationsByCompany,
    createNewLocation,
}