const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticate, authorizeRoles } = require("./auth");
const { db, ready } = require("./db");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const USER_ROLES = new Set(["admin", "manager", "user"]);
const EVENT_MEMBER_ROLES = new Set([
  "manager",
  "presenter",
  "participant",
]);

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
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

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    nationalCode: user.nationalCode || null,
    username: user.username,
    mobile: user.mobile || null,
    status: user.status,
    role: user.role || "user",
  };
}

function isInactive(status) {
  return status === "inactive" || status === "غیرفعال";
}

function normalizedRole(role, fallback = "user") {
  return USER_ROLES.has(role) ? role : fallback;
}

app.get("/", (req, res) => {
  res.send("JDMeet Backend Running...");
});

// Login is intentionally the only public /api endpoint.
app.post(
  "/api/login",
  asyncHandler(async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "نام کاربری و رمز عبور الزامی است.",
      });
    }

    const user = await get("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "نام کاربری یا رمز عبور اشتباه است.",
      });
    }

    if (isInactive(user.status)) {
      return res.status(403).json({
        success: false,
        message: "حساب کاربری غیرفعال است.",
      });
    }

    const safeUser = publicUser(user);
    const token = jwt.sign(
      {
        sub: String(user.id),
        username: user.username,
        role: safeUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return res.json({ success: true, token, user: safeUser });
  })
);

app.use("/api", authenticate);

app.get(
  "/api/rooms",
  asyncHandler(async (req, res) => {
    const rows = await all("SELECT * FROM rooms ORDER BY id DESC");
    res.json({ success: true, data: rows });
  })
);

app.get(
  "/api/rooms/:id",
  asyncHandler(async (req, res) => {
    const room = await get(
      `SELECT id, name, title, teacher, date, time, type, status
       FROM rooms WHERE id = ?`,
      [req.params.id]
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "رویداد پیدا نشد.",
      });
    }

    return res.json({ success: true, data: room });
  })
);

app.post(
  "/api/rooms",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const {
      name,
      title,
      teacher,
      date,
      time,
      type,
      password,
      allowGuest,
      guestCode,
      memberAccess,
      autoRecord,
      status,
    } = req.body;

    const result = await run(
      `INSERT INTO rooms
       (name, title, teacher, date, time, type, password, allowGuest,
        guestCode, memberAccess, autoRecord, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        title,
        teacher,
        date,
        time,
        type,
        password,
        allowGuest ? 1 : 0,
        guestCode,
        memberAccess,
        autoRecord ? 1 : 0,
        status,
      ]
    );

    res.json({
      success: true,
      id: result.lastID,
      message: "کلاس با موفقیت ایجاد شد.",
    });
  })
);

app.put(
  "/api/rooms/:id",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const currentRoom = await get("SELECT * FROM rooms WHERE id = ?", [
      req.params.id,
    ]);

    if (!currentRoom) {
      return res.status(404).json({
        success: false,
        message: "رویداد پیدا نشد.",
      });
    }

    const room = { ...currentRoom, ...req.body };

    await run(
      `UPDATE rooms SET name = ?, title = ?, teacher = ?, date = ?, time = ?,
       type = ?, password = ?, allowGuest = ?, guestCode = ?, memberAccess = ?,
       autoRecord = ?, status = ? WHERE id = ?`,
      [
        room.name,
        room.title,
        room.teacher,
        room.date,
        room.time,
        room.type,
        room.password,
        room.allowGuest ? 1 : 0,
        room.guestCode,
        room.memberAccess,
        room.autoRecord ? 1 : 0,
        room.status,
        req.params.id,
      ]
    );

    res.json({ success: true, message: "رویداد با موفقیت ویرایش شد." });
  })
);

app.delete(
  "/api/rooms/:id",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    await run("DELETE FROM rooms WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "کلاس با موفقیت حذف شد." });
  })
);

app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim();
    let sql = `SELECT id, fullName, nationalCode, username, mobile, status, role
               FROM users`;
    const params = [];

    if (search) {
      sql += " WHERE fullName LIKE ? OR username LIKE ? OR nationalCode LIKE ?";
      const value = `%${search}%`;
      params.push(value, value, value);
    }

    sql += " ORDER BY id DESC";
    const users = await all(sql, params);
    res.json({ success: true, data: users.map(publicUser) });
  })
);

app.post(
  "/api/users",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const firstName = String(req.body.firstName || "").trim();
    const lastName = String(req.body.lastName || "").trim();
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    const mobile = String(req.body.mobile || "").trim() || null;
    const nationalCode =
      String(req.body.nationalCode || "").trim() ||
      `legacy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const status = req.body.status || "فعال";
    const role = normalizedRole(req.body.role);

    if (!firstName || !lastName || !username) {
      return res.status(400).json({
        success: false,
        message: "نام، نام خانوادگی و نام کاربری الزامی هستند.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور باید حداقل 6 کاراکتر باشد.",
      });
    }
    if (await get("SELECT id FROM users WHERE username = ?", [username])) {
      return res.status(400).json({
        success: false,
        message: "این نام کاربری قبلاً ثبت شده است.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await run(
      `INSERT INTO users
       (fullName, nationalCode, username, password, mobile, status, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `${firstName} ${lastName}`.trim(),
        nationalCode,
        username,
        passwordHash,
        mobile,
        status,
        role,
      ]
    );

    res.json({
      success: true,
      id: result.lastID,
      message: "کاربر با موفقیت ایجاد شد.",
    });
  })
);

app.put(
  "/api/users/:id",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const currentUser = await get("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "کاربر پیدا نشد.",
      });
    }

    const fullName =
      String(req.body.fullName || "").trim() ||
      `${String(req.body.firstName || "").trim()} ${String(
        req.body.lastName || ""
      ).trim()}`.trim();
    const username = String(req.body.username || "").trim();
    const mobile = String(req.body.mobile || "").trim() || null;
    const nationalCode =
      String(req.body.nationalCode || "").trim() || currentUser.nationalCode;
    const status = req.body.status || "فعال";
    const role = normalizedRole(req.body.role, currentUser.role || "user");

    if (!fullName || !username) {
      return res.status(400).json({
        success: false,
        message: "نام و نام کاربری الزامی هستند.",
      });
    }

    const duplicate = await get(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, req.params.id]
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "این نام کاربری قبلاً توسط کاربر دیگری استفاده شده است.",
      });
    }

    const params = [
      fullName,
      nationalCode,
      username,
      mobile,
      status,
      role,
    ];
    let sql = `UPDATE users SET fullName = ?, nationalCode = ?, username = ?,
               mobile = ?, status = ?, role = ?`;

    if (req.body.password) {
      if (String(req.body.password).length < 6) {
        return res.status(400).json({
          success: false,
          message: "رمز عبور باید حداقل 6 کاراکتر باشد.",
        });
      }
      sql += ", password = ?";
      params.push(await bcrypt.hash(String(req.body.password), 12));
    }

    sql += " WHERE id = ?";
    params.push(req.params.id);
    await run(sql, params);
    res.json({ success: true, message: "کاربر با موفقیت ویرایش شد." });
  })
);

app.put(
  "/api/users/:id/password",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const password = String(req.body.password || "");
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور باید حداقل 6 کاراکتر باشد.",
      });
    }

    await run("UPDATE users SET password = ? WHERE id = ?", [
      await bcrypt.hash(password, 12),
      req.params.id,
    ]);
    res.json({ success: true, message: "رمز عبور با موفقیت تغییر کرد." });
  })
);

app.delete(
  "/api/users/:id",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    await run("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "کاربر با موفقیت حذف شد." });
  })
);

app.get(
  "/api/rooms/:id/members",
  asyncHandler(async (req, res) => {
    const rows = await all(
      `SELECT event_members.id, event_members.role, users.id AS userId,
              users.fullName, users.username, users.mobile
       FROM event_members JOIN users ON users.id = event_members.userId
       WHERE event_members.roomId = ? ORDER BY event_members.id ASC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  })
);

app.post(
  "/api/rooms/:id/members",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !EVENT_MEMBER_ROLES.has(role)) {
      return res.status(400).json({
        success: false,
        message: "کاربر و نقش معتبر الزامی هستند.",
      });
    }

    const [room, user] = await Promise.all([
      get("SELECT id FROM rooms WHERE id = ?", [req.params.id]),
      get("SELECT id FROM users WHERE id = ?", [userId]),
    ]);

    if (!room || !user) {
      return res.status(404).json({
        success: false,
        message: "رویداد یا کاربر پیدا نشد.",
      });
    }

    const existing = await get(
      "SELECT id FROM event_members WHERE roomId = ? AND userId = ?",
      [req.params.id, userId]
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "این کاربر قبلاً عضو این رویداد است.",
      });
    }

    try {
      const result = await run(
        "INSERT INTO event_members (roomId, userId, role) VALUES (?, ?, ?)",
        [req.params.id, userId, role]
      );
      return res.json({
        success: true,
        id: result.lastID,
        message: "عضو با موفقیت اضافه شد.",
      });
    } catch (error) {
      if (
        error.code === "SQLITE_CONSTRAINT" &&
        String(error.message).includes("event_members.roomId")
      ) {
        return res.status(409).json({
          success: false,
          message: "این کاربر قبلاً عضو این رویداد است.",
        });
      }
      throw error;
    }
  })
);

app.delete(
  "/api/rooms/:roomId/members/:memberId",
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const result = await run(
      "DELETE FROM event_members WHERE id = ? AND roomId = ?",
      [req.params.memberId, req.params.roomId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "عضو رویداد پیدا نشد.",
      });
    }

    return res.json({ success: true });
  })
);

app.get(
  "/api/dashboard",
  asyncHandler(async (req, res) => {
    const users = await get("SELECT COUNT(*) AS totalUsers FROM users");
    const rooms = await get("SELECT COUNT(*) AS totalRooms FROM rooms");
    const active = await get(
      `SELECT COUNT(*) AS activeRooms FROM rooms
       WHERE LOWER(TRIM(COALESCE(status, ''))) IN ('فعال', 'active')`
    );
    res.json({
      success: true,
      data: {
        totalUsers: users.totalUsers,
        totalRooms: rooms.totalRooms,
        activeRooms: active.activeRooms,
      },
    });
  })
);

app.get(
  "/api/dashboard/rooms",
  asyncHandler(async (req, res) => {
    const rows = await all(
      `SELECT id, title, teacher, date, time, status
       FROM rooms ORDER BY id DESC LIMIT 5`
    );
    res.json({ success: true, data: rows });
  })
);

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({
    success: false,
    message: "خطای داخلی سرور.",
  });
});

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  await ready;
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
}

module.exports = { app, start };
