const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JDMeet Backend Running...");
});

const PORT = 5000;
app.get("/api/rooms", (req, res) => {
  db.all("SELECT * FROM rooms ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});
app.post("/api/rooms", (req, res) => {
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

  const sql = `
   INSERT INTO rooms
(
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
status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
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
],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        id: this.lastID,
        message: "کلاس با موفقیت ایجاد شد.",
      });
    }
  );
});
app.delete("/api/rooms/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM rooms WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "کلاس با موفقیت حذف شد.",
    });
  });
});
app.put("/api/rooms/:id", (req, res) => {
  const { id } = req.params;

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

  const sql = `
    UPDATE rooms
    SET
      name = ?,
      title = ?,
      teacher = ?,
      date = ?,
      time = ?,
      type = ?,
      password = ?,
      allowGuest = ?,
guestCode = ?,
memberAccess = ?,
autoRecord = ?,
status = ?
    WHERE id = ?
  `;

  db.run(
    sql,
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
  id,
],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "رویداد با موفقیت ویرایش شد.",
      });
    }
  );
});
app.get("/api/users", (req, res) => {
  const search = (req.query.search || "").trim();

  let sql = `
    SELECT id, fullName, nationalCode, username, status
    FROM users
  `;

  let params = [];

  if (search) {
    sql += `
      WHERE fullName LIKE ?
         OR nationalCode LIKE ?
    `;

    const searchValue = `%${search}%`;
    params = [searchValue, searchValue];
  }

  sql += " ORDER BY id DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});
app.post("/api/users", (req, res) => {
  console.log(req.body);
  const {
  fullName,
  nationalCode,
  username,
  password,
  status,
} = req.body;

  const sql = `
    INSERT INTO users
(fullName, nationalCode, username, password, status)
VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
  fullName,
  nationalCode,
  username,
  password,
  status,
],
    function (err) {
      if (err) {
  console.error(err);

  if (err.message.includes("users.username")) {
    return res.status(400).json({
      success: false,
      message: "این نام کاربری قبلاً ثبت شده است.",
    });
  }

  if (err.message.includes("users.nationalCode")) {
    return res.status(400).json({
      success: false,
      message: "این کد ملی قبلاً ثبت شده است.",
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
      res.json({
        success: true,
        id: this.lastID,
        message: "کاربر با موفقیت ایجاد شد.",
      });
    }
  );
});
app.get("/api/rooms/:id/members", (req, res) => {
  const { id } = req.params;

  db.all(
    `
    SELECT
      event_members.id,
      event_members.role,
      users.id AS userId,
      users.fullName,
      users.nationalCode
    FROM event_members
    JOIN users
      ON users.id = event_members.userId
    WHERE roomId = ?
    `,
    [id],
    (err, rows) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
        data: rows,
      });
    }
  );
});
app.get("/api/rooms/:id/members", (req, res) => {
  const { id } = req.params;

  db.all(
    `
    SELECT
      event_members.id,
      event_members.role,
      users.id AS userId,
      users.fullName,
      users.nationalCode
    FROM event_members
    JOIN users
      ON users.id = event_members.userId
    WHERE roomId = ?
    `,
    [id],
    (err, rows) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
        data: rows,
      });
    }
  );
});
app.post("/api/rooms/:id/members", (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.body;

  db.run(
    `
    INSERT INTO event_members
    (roomId,userId,role)
    VALUES(?,?,?)
    `,
    [id, userId, role],
    function (err) {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
      });
    }
  );
});
app.delete("/api/event-members/:id", (req, res) => {
  db.run(
    "DELETE FROM event_members WHERE id=?",
    [req.params.id],
    function (err) {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
      });
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "کاربر با موفقیت حذف شد.",
    });
  });
});
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const {
  fullName,
  nationalCode,
  username,
  password,
  status,
} = req.body;

  const sql = `
    UPDATE users
SET
  fullName = ?,
  nationalCode = ?,
  username = ?,
  password = ?,
  status = ?
WHERE id = ?
  `;

  db.run(
    sql,
    [
  fullName,
  nationalCode,
  username,
  password,
  status,
  id,
],
    function (err) {
      if (err) {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}

      res.json({
        success: true,
        message: "کاربر با موفقیت ویرایش شد.",
      });
    }
  );
});
app.put("/api/users/:id/password", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "رمز عبور باید حداقل 6 کاراکتر باشد.",
    });
  }

  db.run(
    "UPDATE users SET password = ? WHERE id = ?",
    [password, id],
    function (err) {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "رمز عبور با موفقیت تغییر کرد.",
      });
    }
  );
});
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "نام کاربری یا رمز عبور اشتباه است.",
        });
      }

      res.json({
        success: true,
        role: user.role,
        user,
      });
    }
  );
});

app.get("/api/dashboard", (req, res) => {
  db.get("SELECT COUNT(*) AS totalUsers FROM users", [], (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
app.get("/api/dashboard/rooms", (req, res) => {
  db.all(
    "SELECT title, teacher, time FROM rooms ORDER BY id DESC LIMIT 5",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        data: rows,
      });
    }
  );
});
    db.get("SELECT COUNT(*) AS totalRooms FROM rooms", [], (err, rooms) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      db.get(
        "SELECT COUNT(*) AS activeRooms FROM rooms",
        [],
        (err, active) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            data: {
              totalUsers: users.totalUsers,
              totalRooms: rooms.totalRooms,
              activeRooms: active.activeRooms,
            },
          });
        }
      );
    });
  });
});
app.delete("/api/rooms/members/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM room_members WHERE id=?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
      });
    }
  );
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});