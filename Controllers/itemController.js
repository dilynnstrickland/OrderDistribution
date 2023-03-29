"use strict";
const itemModel = require("../Models/itemModel");

async function createNewItem(req, res) {
    const {itemName, itemBrand, quantity} = req.body;
    const locationID = req.session.user.location;
    const newItem = await itemModel.addItem(itemName, itemBrand, quantity, locationID);

    if(!newItem){
        return res.sendStatus(409);//Conflict
    }
    return res.redirect("/inventory");
}

module.exports = {
    createNewItem
}