"use strict";

const db = require("./db");
const locationModel = require('../Models/locationModel');
const crypto = require('crypto');
const argon2 = require('argon2');

async function addOwner(username, password, email, firstName, lastName, newCompany) {
    try{
        const userID = crypto.randomUUID();
        const hash = await argon2.hash(password);
        const sqlUsersTable = `INSERT INTO Users(userID, username, passwordHash, email, firstName, lastName, company, role) VALUES (@userID, @username, @passwordHash, @email, @firstName, @lastName, @company, @role)`;
        const stmtUsersTable = db.prepare(sqlUsersTable);
        stmtUsersTable.run({
            "userID":userID,
            "username":username,
            "passwordHash":hash,
            "email":email,
            "firstName":firstName,
            "lastName":lastName,
            "company":newCompany,
            "role":3
        });
        const user = getUserByUsername(username);
        return user;
    } catch(err) {
        console.error(err);
        return false;
    }
}

async function addEmployee(username, password, email, firstName, lastName, locationID, company) {
    try{
        const userID = crypto.randomUUID();
        const hash = await argon2.hash(password);
        const locationObj = locationModel.getLocationByLocationID(locationID);
        let role = 1;
        if(locationObj.isWarehouse) {
            role = 2;
        }
        const sqlUsersTable = `INSERT INTO Users(userID, username, passwordHash, email, firstName, lastName, company, role, locationID) VALUES (@userID, @username, @passwordHash, @email, @firstName, @lastName, @company, @role, @locationID)`;
        const stmtUsersTable = db.prepare(sqlUsersTable);
        stmtUsersTable.run({
            "userID":userID,
            "username":username,
            "passwordHash":hash,
            "email":email,
            "firstName":firstName,
            "lastName":lastName,
            "company":company,
            "role":role,
            "locationID":locationID
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

function getUserByUsername(username) {
    const sql = `SELECT * FROM Users WHERE username=@username`;
    try {
        const stmt = db.prepare(sql);
        const user = stmt.get({"username":username});
        return user;  
    } catch(err) {
        console.error(err);
    }   
}

function getEmployeesByCompany(company) {
    const sql = `SELECT * FROM Users WHERE company=@company AND role in (1, 2)`;
    try {
        const stmt = db.prepare(sql);
        const employees = stmt.all({"company":company});
        return employees;  
    } catch(err) {
        console.error(err);
    }   
}

function getRoleByUsername(username) {
    const sql = `SELECT role FROM Users WHERE username=@username`;
    try {
        const stmt = db.prepare(sql);
        const role = stmt.get({"username":username});
        return role;  
    } catch(err) {
        console.error(err);
    }   
}

function setUsersLocation(userID, locationName) {
    let sql = `SELECT locationID FROM Location WHERE name=@locationName`
    try{
        let stmt = db.prepare(sql);
        const locationID = stmt.get({"locationName":locationName});
        sql  = `UPDATE Users SET locationID=@locationID WHERE userID=@userID`;
        stmt = db.prepare(sql);
        stmt.run({"locationID": locationID.locationID, "userID": userID});
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function updateRole(userId, role) {
    const sql = `UPDATE Users SET role=@role WHERE userId=@userId`;
    try {
        const stmt = db.prepare(sql);
        stmt.run({
            "userId": userId,
            "role": role
        });
    } catch(err) {
        console.error(err);
    }
}

function updateCompany(userId, company) {
    const sql = `UPDATE Users SET company=@company WHERE userId=@userId`;
    try {
        const stmt = db.prepare(sql);
        stmt.run({
            "userId": userId,
            "company": company
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    addOwner,
    addEmployee,
    getUserByUsername,
    updateRole,
    updateCompany,
    getRoleByUsername,
    getEmployeesByCompany,
    setUsersLocation,
};
