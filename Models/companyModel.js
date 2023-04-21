"use strict";

const db = require("./db");
const crypto = require('crypto');

async function addCompany(companyName, companyAddr) {
    try{
        const companyID = crypto.randomUUID();
        const sqlCompanyTable = `INSERT INTO Company(companyID, name, address) VALUES (@companyID, @name, @address)`;
        const stmtCompanyTable = db.prepare(sqlCompanyTable);
        stmtCompanyTable.run({
            "companyID":companyID, 
            "name":companyName, 
            "address":companyAddr
        });
        return companyID;
    } catch(err) {
        console.error(err);
        return false;
    }
}

function getCompanyByCompanyID(companyId) {
    const sql = `SELECT * FROM Company WHERE companyID=@companyID`;
    try {
        const stmt = db.prepare(sql);
        const company = stmt.get({"companyID":companyId});
        return company;  
    } catch(err) {
        console.error(err);
    }   
}

async function getCompanyID(companyName) {
    const sql = `SELECT companyID FROM Company WHERE name="@companyName"`;
    try {
        const stmt = db.prepare(sql);
        const companyID = stmt.get({"name": companyName});
        return companyID;
    } catch (err) {
        console.error(err);
        return false;
    }
}


module.exports = {
    addCompany,
    getCompanyByCompanyID,
    getCompanyID,
};