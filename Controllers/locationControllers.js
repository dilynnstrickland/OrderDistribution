"use strict";
const locationModel = require("../Models/locationModel");

function allLocations() {
    return locationModel.getLocations();
} 

module.exports = {
    allLocations,
}