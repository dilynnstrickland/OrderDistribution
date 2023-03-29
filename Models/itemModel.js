"use strict";

const db = require("./db");
const locationModel = require('./locationModel');
const crypto = require('crypto');
const argon2 = require('argon2');

async function addItem(itemName, itemBrand, quantity, locationID) {
    try{
        const itemID = crypto.randomUUID();
        const sqlItemTable = `INSERT INTO Item(itemID, itemName, itemBrand, quantity) VALUES (@itemID, @itemName, @itemBrand, @quantity)`;
        const stmtItemTable = db.prepare(sqlItemTable);
        stmtItemTable.run({
            "itemID": itemID,
            "itemName": itemName,
            "itemBrand": itemBrand,
            "quantity": quantity
        });

        const invID = crypto.randomUUID();
        const sqlInvTable = `INSERT INTO Inventory(invID, item, location, itemQuantity) VALUES (@invID, @item, @location, @itemQuantity)`;
        const stmtInvTable = db.prepare(sqlInvTable);
        stmtInvTable.run({
            "invID": invID,
            "item": itemID,
            "location": locationID,
            "itemQuantity": quantity
        });
        const item = getItemByItemID(itemID);
        const items = getItemByLocationID(locationID);
        console.log(item);
        console.log(items)
        return item;
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

// CREATE TABLE IF NOT EXISTS Item (
//     itemID TEXT PRIMARY KEY,
//     itemName TEXT UNIQUE NOT NULL,
//     itemBrand TEXT NOT NULL,
//     catagory TEXT, -- Catagory of Item
//     quantity INTEGER DEFAULT 0
// );

// invID TEXT PRIMARY KEY,  -- Name of Location
//   	item TEXT,
//     location TEXT,
//     itemQuantity INTEGER DEFAULT 0,  -- How many of the item is there
//     FOREIGN KEY (location) REFERENCES Inventory(locationID),
//     FOREIGN KEY (item) REFERENCES Item(itemID)
module.exports = {
    addItem,
    getItemByItemID,
    getItemByLocationID,
    getAllItemByLocationID,
    getItemByLocationIDANDItemID
};
