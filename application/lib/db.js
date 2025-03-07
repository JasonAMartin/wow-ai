import sqlite3 from 'sqlite3';
import path from 'path';

// Construct the path to the database file.
// process.cwd() points to the project root.
const dbPath = path.join(process.cwd(), 'data', 'warcraftData.db');

// Open (or create) the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening SQLite database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});


export default db;
