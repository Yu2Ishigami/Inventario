// SQLite integrado en Node (no requiere instalar ni compilar nada extra)
const { DatabaseSync } = require('node:sqlite');
const { DB_PATH } = require('../config');
const { createSchema, seedIfEmpty } = require('./schema');

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');

createSchema(db);
seedIfEmpty(db);

module.exports = db;
