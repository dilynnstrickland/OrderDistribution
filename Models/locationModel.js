"use strict";

const db = require("./db");
const crypto = require('crypto');
const argon2 = require('argon2');

function getLocationsByCompany(company) {
    
    const sql = `SELECT * FROM Location WHERE company = @company`;
    try {
        const stmt = db.prepare(sql);
        const locations = stmt.all({company});
        return locations;  
    } catch(err) {
        console.error(err);
    }
}

async function addLocation(name, address, company) {
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

module.exports = {
    getLocationsByCompany,
    addLocation
};