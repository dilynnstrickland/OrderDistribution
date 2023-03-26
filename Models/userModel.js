"use strict";

const db = require("./db");
const crypto = require('crypto');
const argon2 = require('argon2');

async function addUser(username, password, email, firstName, lastName) {
    try{
        const userID = crypto.randomUUID();
        const hash = await argon2.hash(password);
        const sqlUsersTable = `INSERT INTO Users(userID, username, passwordHash, email, firstName, lastName) VALUES (@userID, @username, @passwordHash, @email, @firstName, @lastName)`;
        const stmtUsersTable = db.prepare(sqlUsersTable);
        stmtUsersTable.run({
            "userID":userID,
            "username":username,
            "passwordHash":hash,
            "email":email,
            "firstName":firstName,
            "lastName":lastName

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
    addUser,
    getUserByUsername,
    updateRole,
    updateCompany,
};
