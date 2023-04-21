"use strict";
const itemModel = require("../Models/itemModel");

async function createNewItem(req, res) {
    const {itemID, quantity} = req.body;
    const locationID = req.session.user.location;
    const newItem = await itemModel.addInv(itemID, quantity, locationID);

    if(!newItem){
        return res.sendStatus(409);//Conflict
    }
    return res.redirect("/dashboard/inventory");
}

async function createItem(req, res) {
    const {itemName, itemBrand, catagory, quantity} = req.body;
    const locationID = req.session.user.locationID;
    console.log("locationID=" +locationID);
    const newItem = await itemModel.createItem(itemName, itemBrand, catagory, quantity, locationID);

    if(!newItem){
        return res.sendStatus(409);//Conflict
    }
    return res.redirect("/dashboard/inventory");
}

function viewInv(req, res) {
    const {locationID} = req.body;
    const items = itemModel.getAllItemByLocationID(locationID);

}

module.exports = {
    createNewItem,
    createItem,
    viewInv
}