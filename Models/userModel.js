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

async function addEmployee(username, password, email, firstName, lastName, location, company) {
    try{
        const userID = crypto.randomUUID();
        const hash = await argon2.hash(password);
        const locationObj = locationModel.getLocationByLocationID(location);
        let role = 1;
        if(locationObj.isWarehouse) {
            role = 0;
        }
        const sqlUsersTable = `INSERT INTO Users(userID, username, passwordHash, email, firstName, lastName, company, role, location) VALUES (@userID, @username, @passwordHash, @email, @firstName, @lastName, @company, @role, @location)`;
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
            "location":location
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
    const sql = `SELECT * FROM Users WHERE company=@company AND role=@role`;
    try {
        const stmt = db.prepare(sql);
        const employees = stmt.all({"company":company, "role":1 || 2});
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
    addEmployee,
    addOwner,
    getUserByUsername,
    updateRole,
    updateCompany,
    getRoleByUsername,
    getEmployeesByCompany
};
