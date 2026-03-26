const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

const initializeDB = async () => {
  const db = await open({
    filename: "./jobs.db",
    driver: sqlite3.Database,
  })

  console.log("Database connected")

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT
    );
  `)

  await db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    job_id INTEGER,
    applied_at TEXT
  );
`)

  console.log("Tables created")

  return db  // ✅ IMPORTANT
}

module.exports = { initializeDB }