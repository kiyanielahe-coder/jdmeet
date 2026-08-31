const path = require("node:path");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const databasePath = path.join(__dirname, "database", "database.db");
const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function ensureColumn(table, column, definition) {
  const columns = await all(`PRAGMA table_info(${table})`);
  if (!columns.some((item) => item.name === column)) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    return true;
  }
  return false;
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(value || "");
}

async function migrateLegacyPasswords() {
  const users = await all("SELECT id, password FROM users");
  const legacyUsers = users.filter((user) => !isBcryptHash(user.password));

  if (legacyUsers.length === 0) return;

  const migrated = await Promise.all(
    legacyUsers.map(async (user) => ({
      id: user.id,
      passwordHash: await bcrypt.hash(user.password, 12),
    }))
  );

  await run("BEGIN IMMEDIATE TRANSACTION");
  try {
    for (const user of migrated) {
      await run("UPDATE users SET password = ? WHERE id = ?", [
        user.passwordHash,
        user.id,
      ]);
    }
    await run("COMMIT");
    console.log(`Migrated ${migrated.length} legacy password(s) to bcrypt.`);
  } catch (error) {
    await run("ROLLBACK");
    throw error;
  }
}

async function initializeDatabase() {
  await run("PRAGMA foreign_keys = ON");

  await run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT,
      teacher TEXT,
      date TEXT,
      time TEXT,
      type TEXT,
      password TEXT,
      allowGuest INTEGER DEFAULT 0,
      guestCode TEXT,
      memberAccess TEXT DEFAULT 'participant',
      autoRecord INTEGER DEFAULT 0,
      status TEXT DEFAULT 'فعال'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      nationalCode TEXT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      mobile TEXT,
      status TEXT DEFAULT 'فعال',
      role TEXT DEFAULT 'user'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS event_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      role TEXT DEFAULT 'participant',
      FOREIGN KEY(roomId) REFERENCES rooms(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  await ensureColumn("users", "mobile", "TEXT");
  await ensureColumn("users", "nationalCode", "TEXT");
  await ensureColumn("users", "role", "TEXT DEFAULT 'user'");
  await ensureColumn("rooms", "guestCode", "TEXT");
  await ensureColumn(
    "rooms",
    "memberAccess",
    "TEXT DEFAULT 'participant'"
  );
  await ensureColumn("rooms", "autoRecord", "INTEGER DEFAULT 0");

  const legacyRegistryExists = (
    await all(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'legacy_user_roles'"
    )
  ).length > 0;

  await run(`
    CREATE TABLE IF NOT EXISTS legacy_user_roles (
      userId INTEGER PRIMARY KEY,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  if (!legacyRegistryExists) {
    await run("INSERT OR IGNORE INTO legacy_user_roles (userId) SELECT id FROM users");
  }

  // Legacy authorization is configuration-driven; no account is guessed as admin.
  await run(`
    UPDATE users SET role = 'user'
    WHERE id IN (SELECT userId FROM legacy_user_roles)
  `);

  const legacyAdminUsername = String(
    process.env.LEGACY_ADMIN_USERNAME || ""
  ).trim();
  if (legacyAdminUsername) {
    const result = await run(
      `UPDATE users SET role = 'admin'
       WHERE username = ?
         AND id IN (SELECT userId FROM legacy_user_roles)`,
      [legacyAdminUsername]
    );
    if (result.changes !== 1) {
      throw new Error(
        "LEGACY_ADMIN_USERNAME must match exactly one existing legacy user."
      );
    }
  } else {
    console.warn(
      "No legacy admin configured. Set LEGACY_ADMIN_USERNAME to promote one legacy account."
    );
  }
  await run("UPDATE rooms SET status = 'فعال' WHERE status = 'active'");
  await migrateLegacyPasswords();

  console.log("SQLite Connected");
}

const ready = initializeDatabase();

module.exports = { db, ready, all };
