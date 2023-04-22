"use strict";

const db = require("./db");
const crypto = require('crypto');
const argon2 = require('argon2');

function getLocationsByCompany(company) {
    
    const sql = `SELECT * FROM Location WHERE company = @company and isWarehouse=@isWarehouse`;
    try {
        const stmt = db.prepare(sql);
        const locations = stmt.all({"company":company, "isWarehouse":0});
        if(locations.length == 0) {
            return false;
        }
        return locations;
    } catch(err) {
        console.error(err);
    }
}

function getWarehousesByCompany(company) {
    
    const sql = `SELECT * FROM Location WHERE company = @company and isWarehouse=@isWarehouse`;
    try {
        const stmt = db.prepare(sql);
        const locations = stmt.all({"company":company, "isWarehouse":1});
        if(locations.length == 0) {
            return false;
        }
        return locations;
    } catch(err) {
        console.error(err);
    }
}

function getLocationByLocationID(locationID) {
    const sql = `SELECT * FROM Location WHERE locationID = @locationID`;
    try {
        const stmt = db.prepare(sql);
        const location = stmt.get({"locationID": locationID});
        return location;  
    } catch(err) {
        console.error(err);
    }
}

async function getLocationIDByName(locationName) {
    const sql = `SELECT locationID FROM Location WHERE name=@locationName`;
    try {
        const stmt = db.prepare(sql);
        const locationID = stmt.get({"locationName": locationName});
        return location;
    } catch (err) {
        console.err(err);
        return false;
    }
}

function addLocation(name, address, company) {
    try{
        const locationID = crypto.randomUUID();
        const sqlLocationTable = `INSERT INTO Location(locationID, name, address, company) VALUES (@locationID, @name, @address, @company)`;
        const stmtLocationTable = db.prepare(sqlLocationTable);
        stmtLocationTable.run({
            "locationID":locationID,
            "name":name,
            "address":address,
            "company":company
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

async function addWarehouse(name, address, company) {
    try{
        const locationID = crypto.randomUUID();
        const sqlLocationTable = `INSERT INTO Location(locationID, name, address, company, isWarehouse) VALUES (@locationID, @name, @address, @company, @isWarehouse)`;
        const stmtLocationTable = db.prepare(sqlLocationTable);
        stmtLocationTable.run({
            "locationID":locationID,
            "name":name,
            "address":address,
            "company":company,
            "isWarehouse":1
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    getLocationsByCompany,
    getWarehousesByCompany,
    getLocationByLocationID,
    addLocation,
    addWarehouse,
    getLocationIDByName,
};