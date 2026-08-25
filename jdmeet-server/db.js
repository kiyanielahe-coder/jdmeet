const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./database/database.db",
  (err) => {
    if (err) {
      console.error(
        "Database Error:",
        err.message
      );
    } else {
      console.log("SQLite Connected");
    }
  }
);

db.serialize(() => {
  // =========================
  // Rooms
  // =========================
  db.run(`
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

  // =========================
  // Users
  // =========================
  // برای دیتابیس جدید:
  // nationalCode دیگر بخشی از ساختار اصلی نیست.
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      mobile TEXT,
      status TEXT DEFAULT 'فعال'
    )
  `);

  // =========================
  // Event Members
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS event_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      role TEXT DEFAULT 'participant',

      FOREIGN KEY(roomId)
        REFERENCES rooms(id),

      FOREIGN KEY(userId)
        REFERENCES users(id)
    )
  `);

  // =========================
  // Existing databases
  // =========================

  // mobile را به دیتابیس‌های قبلی اضافه می‌کنیم.
  db.run(
    "ALTER TABLE users ADD COLUMN mobile TEXT",
    () => {}
  );

  // ستون‌های جدید rooms برای دیتابیس‌های قبلی
  db.run(
    "ALTER TABLE rooms ADD COLUMN guestCode TEXT",
    () => {}
  );

  db.run(
    "ALTER TABLE rooms ADD COLUMN memberAccess TEXT DEFAULT 'participant'",
    () => {}
  );

  db.run(
    "ALTER TABLE rooms ADD COLUMN autoRecord INTEGER DEFAULT 0",
    () => {}
  );

  // تبدیل وضعیت قدیمی
  db.run(
    "UPDATE rooms SET status='فعال' WHERE status='active'"
  );
});

module.exports = db;