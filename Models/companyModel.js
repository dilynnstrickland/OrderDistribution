"use strict";

const db = require("./db");

function addCompany(name, address) {
    const sql = `INSERT into Company(name, address) VALUES (@name, @address)`;
    try {
        const stmt = db.prepare(sql);
        stmt.run({
            "name": name,
            "address": address
        });
        return true;
    } catch (err) {
        console.error(err);
    }
}

function getCompanies() {
    const sql = 'SELECT name FROM Company';
    try {
        const stmt = db.prepare(sql);
        const companies = stmt.get();
        return companies;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    addCompany,
    getCompanies,
};