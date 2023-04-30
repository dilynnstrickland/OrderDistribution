"use strict";

const db = require("./db");
const crypto = require('crypto');
const itemModel = require('./itemModel');
const { waitForDebugger } = require("inspector");

function createOrder(items, loactionID, warehouseID){
    try {
        const orderID = crypto.randomUUID();
        console.log(items);
        //item = item name, items[prop] = quantity.
        //console.log(`${item}: ${items[item]}`);
        const date = new Date(); // creates a new Date object with the current date and time
        const dateOrdered = date.toISOString().slice(0, 10); // formats the date in the required SQL format (YYYY-MM-DD)
        for (const item in items) {
            let quantity = items[item];
            let itemName = getItemNameByItemID(item).itemName;
            console.log(itemName);
            let sqlOrderTable = `INSERT INTO OrderLists(orderID, locationID, dateOrdered, item, itemName, quantity) VALUES (@orderID, @locationID, @dateOrdered, @item, @itemName, @quantity)`;
            let stmtOrderTable = db.prepare(sqlOrderTable);
            stmtOrderTable.run({
                "orderID": orderID,
                "locationID": loactionID,
                "dateOrdered": dateOrdered,
                "item": item,
                "itemName": itemName,
                "quantity": quantity
            });
            removeItemFromWarehouse(item, quantity, warehouseID);
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function removeItemFromWarehouse(item, quantity, warehouseID) {
    try{
        const sqlItemQuan = `SELECT itemQuantity FROM Inventory WHERE item=@itemID and locationID=@warehouseID`;
        let stmt = db.prepare(sqlItemQuan);
        const wareQuantity = stmt.get({"itemID":item, "warehouseID":warehouseID}).itemQuantity;
        if (quantity < wareQuantity || quantity == wareQuantity){
            console.log(quantity);
            console.log(wareQuantity);
            const newQuan = wareQuantity-quantity;
            console.log(newQuan);
            let sqlQuanUpdate = `UPDATE Item SET quantity=@newQuan where itemID=@item`;
            stmt = db.prepare(sqlQuanUpdate);
            stmt.run({"newQuan":newQuan, "item":item});
            sqlQuanUpdate = `UPDATE Inventory SET itemQuantity=@newQuan where locationID=@warehouseID and item=@item`;
            stmt = db.prepare(sqlQuanUpdate);
            stmt.run({"newQuan":newQuan, "warehouseID":warehouseID, "item":item});
        }

        return true;
    }catch (err){
        console.error(err);
        return false;
    }
}

function allOrdersByLocationID(locationID){
    const sql = `SELECT * FROM OrderLists where locationID=@locationID`;
    console.log(locationID);
    try {
        const stmt = db.prepare(sql);
        const orders = stmt.all({"locationID":locationID})
        return orders;
    } catch (err) {
        console.log(err);
    }
}
function getItemNameByItemID(itemID) {
    try{
        const sqlItem = `SELECT itemName FROM Item WHERE itemID=@itemID`;
        const stmt = db.prepare(sqlItem);
        const item = stmt.get({itemID});
        return item;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function addItemToLocationFromOrder(item, locationID, quantity, orderID){
    try {
        let sql = `SELECT item,locationID,itemQuantity FROM Inventory WHERE item=@item and locationID=@locationID`;
        let stmt = db.prepare(sql);
        let itemInfo = stmt.get({"item":item, "locationID":locationID});
        console.log(itemInfo);
        if (typeof itemInfo !== "undefined" && itemInfo.hasOwnProperty("item") && itemInfo.hasOwnProperty("locationID")) {
            sql = `UPDATE Inventory SET itemQuantity=itemQuantity+@quantity where item=@item and locationID=@locationID`;
            stmt = db.prepare(sql);
            stmt.run({"quantity":quantity, "item":item, "locationID":locationID});
            console.log("already had vibe check");
        } else {
            const invID = crypto.randomUUID();
            const sqlInvTable = `INSERT INTO Inventory(invID, item, locationID, itemQuantity) VALUES (@invID, @item, @locationID, @itemQuantity)`;
            const stmtInvTable = db.prepare(sqlInvTable);
            stmtInvTable.run({
                "invID": invID,
                "item": item,
                "locationID": locationID,
                "itemQuantity": quantity
            });
            console.log("pass vibe check");
        }
        const sqlRemove = `DELETE FROM orderLists where item=@item and orderID=@orderID and locationID=@locationID`;
        const stmtRemove = db.prepare(sqlRemove);
        stmtRemove.run({
            "item":item,
            "orderID":orderID,
            "locationID":locationID
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
module.exports = {
    createOrder,
    removeItemFromWarehouse,
    allOrdersByLocationID,
    getItemNameByItemID,
    addItemToLocationFromOrder,
};