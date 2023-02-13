"use strict";

const Database = require('better-sqlite3');
const db = new Database(`./database/${process.env.DB}`);

// Signal handlers - closes database
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

module.exports = db;