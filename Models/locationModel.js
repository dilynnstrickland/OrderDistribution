"use strict";

const db = require("./db");

function getLocations() {
    const sql = `SELECT name FROM Locations`;
    try {
        const stmt = db.prepare(sql);
        const names = stmt.all({});
        return names;  
    } catch(err) {
        console.error(err);
    }
}
module.exports = {
    getLocations
};