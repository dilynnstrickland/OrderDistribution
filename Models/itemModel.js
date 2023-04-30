"use strict";

const db = require("./db");
const locationModel = require('./locationModel');
const crypto = require('crypto');
const argon2 = require('argon2');

async function addInv(itemID, quantity, locationID) {
    try{
        const invID = crypto.randomUUID();
        const sqlInvTable = `INSERT INTO Inventory(invID, item, locationID, itemQuantity) VALUES (@invID, @item, @locationID, @itemQuantity)`;
        const stmtInvTable = db.prepare(sqlInvTable);
        stmtInvTable.run({
            "invID": invID,
            "item": itemID,
            "locationID": locationID,
            "itemQuantity": quantity
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

async function createItem(itemName, itemBrand, catagory, quantity, locationID) {
    try{
        const itemID = crypto.randomUUID();
        const sqlInvTable = `INSERT INTO Item(itemID, itemName, itemBrand, catagory, quantity) VALUES (@itemID, @itemName, @itemBrand, @catagory, @quantity)`;
        const stmtInvTable = db.prepare(sqlInvTable);
        stmtInvTable.run({
            "itemName": itemName,
            "itemID": itemID,
            "itemBrand": itemBrand,
            "catagory": catagory,
            "quantity": quantity
        });
        addInv(itemID, quantity, locationID);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// TODO: maybe delete
function getItemByName(itemName) {
    try {
        const select = `SELECT itemName FROM Item WHERE itemName=@itemName`;
        const stmt = db.prepare(select);
        const item = stmt.run({"itemName": itemName});
        console.log(item);
        if (item.changes == 0){
            return false;
        } else {
            return true;
        }

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
        const sqlItem = `SELECT * FROM Inventory WHERE locationID=@locationID`;
        const stmt = db.prepare(sqlItem);
        const items = stmt.get({"locationID": locationID});
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
        const sqlItem = `SELECT itemQuantity FROM Inventory WHERE item=@itemID and locationID=@locationID`;
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
        const sqlItem = `SELECT itemName, itemBrand, itemQuantity FROM Item, Inventory WHERE itemID=item and locationID=@locationID`;
        const stmt = db.prepare(sqlItem);
        const items = stmt.all({"locationID":locationID});
        return items;
    } catch (err) {
        console.error(err);
        return false;
    }
}
function getAllItemByLocationID2(locationID) {
    try{
        const sqlItem = `SELECT itemID, itemName, itemBrand, itemQuantity FROM Item, Inventory WHERE itemID=item and locationID=@locationID`;
        const stmt = db.prepare(sqlItem);
        const items = stmt.all({"locationID":locationID});
        return items;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function updateQuantity(itemName, quantity) {
    try {
        const select = `SELECT quantity FROM Item WHERE itemName=@itemName`;
        let stmt = db.prepare(select);
        let currQuantity = stmt.get({"itemName": itemName});
        const updatedQuantity = quantity + currQuantity;
        console.log(updatedQuantity);
        const update = `UPDATE Item SET quantity=@updatedQuantity WHERE itemName=@itemName`;
        stmt = db.prepare(update);
        stmt.run({"updatedQuantity": updatedQuantity, "itemName": itemName});
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    addInv,
    createItem,
    getAllItem,
    getItemByItemID,
    getItemByLocationID,
    getAllItemByLocationID,
    getAllItemByLocationID2,
    getItemByLocationIDANDItemID
};
