"use strict";

const db = require("./db");
const crypto = require('crypto');
const argon2 = require('argon2');

async function addUser(username, password, role, location) {
    try{
        const userId = crypto.randomUUID();
        const hash = await argon2.hash(password);
        const sqlUsersTable = `INSERT INTO Users(userid, username, passwordhash, role, location) VALUES (@userid, @username, @passwordhash, @role, @location)`;
        const stmtUsersTable = db.prepare(sqlUsersTable);
        stmtUsersTable.run({
            "userid":userId,
            "username":username,
            "passwordhash":hash,
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

module.exports = {
    addUser,
    getUserByUsername,
};