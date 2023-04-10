"use strict";
const itemModel = require("../Models/itemModel");

async function createNewItem(req, res) {

    const {itemID, quantity} = req.body;
    const locationID = req.session.user.location;
    const newItem = await itemModel.addInv(itemID, quantity, locationID);

    if(!newItem){
        return res.sendStatus(409);//Conflict
    }
    return res.redirect("/inventory");
}

function viewInv(req, res) {
    const {locationID} = req.body;
    const items = itemModel.getAllItemByLocationID(locationID);

}
module.exports = {
    createNewItem
}