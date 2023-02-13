"use strict";

const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");

async function createUser(email, username, firstname, lastname, password) {
    let created; 
    const uuid = crypto.randomUUID();
    const PasswordHash = await argon2.hash(password);

    const sql = `
        INSERT INTO Users
        values (@userID, @username, @passowrdHash, @email, @firstname, @lastname)
    `;

    const stmt = db.prepare(sql);

    try {
        stmt.run({
            userID: uuid,
            username: username,
            passwordHash: PasswordHash,
            email: email,
            firstname: firstname,
            lastname: lastname,
        });
        created = true;
    } catch(err) { // catch if user exists
        console.error(err);
        created = false;
    }

    return created;
}

exports.createUser = createuser;