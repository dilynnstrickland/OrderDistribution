"use strict";

const db = require("./db");
const locationModel = require('./locationModel');
const crypto = require('crypto');
const argon2 = require('argon2');

async function addInv(itemID, quantity, locationID) {
    try{
        const invID = crypto.randomUUID();
        const sqlInvTable = `INSERT INTO Inventory(invID, item, location, itemQuantity) VALUES (@invID, @item, @location, @itemQuantity)`;
        const stmtInvTable = db.prepare(sqlInvTable);
        stmtInvTable.run({
            "invID": invID,
            "item": itemID,
            "location": locationID,
            "itemQuantity": quantity
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

function getItemByItemID(itemID) {
    try{
        const sqlItem = `SELECT * FROM Item WHERE itemID=@itemID`;
        const stmt = db.prepare(sqlItem);
        const item = stmt.get({itemID});
        return item;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function getItemByLocationID(locationID) {
    try{
        const sqlItem = `SELECT * FROM Inventory WHERE location=@locationID`;
        const stmt = db.prepare(sqlItem);
        const items = stmt.get({locationID});
        return items;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function getAllItem() {
    const sql = `SELECT * FROM Item`;
    try {
        const stmt = db.prepare(sql);
        const items = stmt.all({});
        return items;  
    } catch(err) {
        console.error(err);
    }   
}

function getItemByLocationIDANDItemID(itemID, locationID) {
    try{
        const sqlItem = `SELECT itemQuantity FROM Inventory WHERE item=@itemID and location=@locationID`;
        const stmt = db.prepare(sqlItem);
        const quantity = stmt.get({"itemID":itemID, "locationID":locationID});
        const item = getItemByItemID(itemID);
        item.quantity = quantity;
        return item;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function getAllItemByLocationID(locationID) {
    try{
        const sqlItem = `SELECT itemName, itemBrand, itemQuantity FROM Item, Inventory WHERE Item.itemID=Inventory.item and Inventory.location=@locationID`;
        const stmt = db.prepare(sqlItem);
        const items = stmt.all({"locationID":locationID});
        return items;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    addInv,
    getAllItem,
    getItemByItemID,
    getItemByLocationID,
    getAllItemByLocationID,
    getItemByLocationIDANDItemID
};
