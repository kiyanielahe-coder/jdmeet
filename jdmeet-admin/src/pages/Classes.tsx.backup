import { useEffect, useState } from "react";
import axios from "axios";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import LaunchIcon from "@mui/icons-material/Launch";

import CreateRoomModal from "../components/CreateRoomModal";
import "./Classes.css";

type Room = {
  id: number;
  name: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  students: number;
  type: string;
  status: string;
};

function Classes() {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null);

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [selectedRoom, setSelectedRoom] =
    useState<Room | null>(null);
    const [membersOpen, setMembersOpen] =
  useState(false);

const [members, setMembers] =
  useState<any[]>([]);

const [users, setUsers] =
  useState<any[]>([]);

const [activeRole, setActiveRole] =
  useState<
    "manager" |
    "assistant" |
    "participant"
  >("manager");


  const openMenu = (
    event: React.MouseEvent<HTMLElement>,
    room: Room
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const closeMenu = () => {
  setAnchorEl(null);
};
const [selectedUserId, setSelectedUserId] = useState("");


  async function loadRooms() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rooms"
      );

      setRooms(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
  loadRooms();
}, []);

async function refreshMembers() {

  if (!selectedRoom) return;

  const res =
    await axios.get(
      `http://localhost:5000/api/rooms/${selectedRoom.id}/members`
    );

  setMembers(res.data.data);

}
  const filteredRooms = rooms.filter((room) =>
    room.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
  <CreateRoomModal
    open={open}
    room={editingRoom}
    onClose={() => {
      setOpen(false);
      setEditingRoom(null);
    }}
    onCreate={async (room) => {
      try {
        if (editingRoom) {
          await axios.put(
            `http://localhost:5000/api/rooms/${editingRoom.id}`,
            {
              name: room.title.replace(/\s+/g, "-").toLowerCase(),
              title: room.title,
              teacher: room.teacher,
              date: room.date,
              time: room.time,
              type: room.type,
              password: room.password,
              allowGuest: room.allowGuest,
              guestCode: room.guestCode,
              memberAccess: room.memberAccess,
              autoRecord: room.autoRecord,
              status: room.status,
            }
          );
        } else {
          await axios.post(
            "http://localhost:5000/api/rooms",
            {
              name: room.title
                .replace(/\s+/g, "-")
                .toLowerCase(),
              title: room.title,
              teacher: room.teacher,
              date: room.date,
              time: room.time,
              type: room.type,
              password: room.password,
              allowGuest: room.allowGuest,
              guestCode: room.guestCode,
              memberAccess: room.memberAccess,
             autoRecord: room.autoRecord,
             status: room.status,
            }
          );
        }

        await loadRooms();

        setOpen(false);
        setEditingRoom(null);
      } catch (err) {
        console.log(err);
      }
    }}
  />

  <div className="page-header">

    <div>
      <h1 className="page-title">
        مدیریت رویدادها
      </h1>

      <p className="page-subtitle">
        مدیریت کلاس‌ها، وبینارها و جلسات آنلاین
      </p>
    </div>

    <div className="page-actions">

      <input
        className="search-input"
        placeholder="جستجوی رویداد..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <button
        className="create-btn"
        onClick={() => setOpen(true)}
      >
        + ایجاد رویداد
      </button>

    </div>

  </div>

  <div className="stats-grid">

    <div className="stat-card">

      <div className="stat-title">
        کل رویدادها
      </div>

      <div className="stat-value">
        {rooms.length}
      </div>

    </div>

    <div className="stat-card">

      <div className="stat-title">
        رویدادهای فعال
      </div>

      <div
        className="stat-value"
        style={{ color: "#16a34a" }}
      >
        {
          rooms.filter(
            (r) => r.status === "فعال"
          ).length
        }
      </div>

    </div>

    <div className="stat-card">

      <div className="stat-title">
        رویدادهای غیرفعال
      </div>

      <div
        className="stat-value"
        style={{ color: "#dc2626" }}
      >
        {
          rooms.filter(
            (r) => r.status !== "فعال"
          ).length
        }
      </div>

    </div>

    <div className="stat-card">

      <div className="stat-title">
        مجموع کاربران
      </div>

      <div
        className="stat-value"
        style={{ color: "#009693" }}
      >
        {rooms.reduce(
          (sum, room) =>
            sum + (room.students ?? 0),
          0
        )}
      </div>

    </div>

  </div>

  <div className="events-card">

    <table className="events-table">

      <thead>

        <tr>

          <th>عنوان رویداد</th>

          <th>مدرس</th>

          <th>تاریخ</th>

          <th>زمان</th>

          <th>اعضا</th>

          <th>نوع</th>

          <th>وضعیت</th>

          <th>عملیات</th>

        </tr>

      </thead>

      <tbody></tbody>
      {filteredRooms.map((item) => (
  <tr key={item.id}>

    <td>

      <div className="event-title">

        <div
          className="event-name"
          onClick={() =>
            window.open(
              `https://lg.jdeiut.ir/${item.name}`,
              "_blank"
            )
          }
        >
          {item.title}
        </div>

        <div className="event-link">
          {item.name}
        </div>

      </div>

    </td>

    <td className="center">
      {item.teacher}
    </td>

    <td className="center">
      {item.date}
    </td>

    <td className="center">
      {item.time}
    </td>

    <td className="center">
      <span className="student-count">
        {item.students ?? 0}
      </span>
    </td>

    <td className="center">

      <span
        className={
          item.type === "وبینار"
            ? "type webinar"
            : item.type === "جلسه"
            ? "type meeting"
            : "type class"
        }
      >
        {item.type}
      </span>

    </td>

    <td className="center">

      <span
        className={
          item.status === "فعال"
            ? "status active"
            : "status inactive"
        }
      >
        {item.status}
      </span>

    </td>

    <td>

      <div className="action-buttons">

        <Tooltip title="ورود به جلسه">

          <IconButton
            onClick={() =>
              window.open(
                `https://lg.jdeiut.ir/${item.name}`,
                "_blank"
              )
            }
          >
            <LaunchIcon />
          </IconButton>

        </Tooltip>

        <Tooltip title="عملیات">

          <IconButton
            onClick={(e) =>
              openMenu(e, item)
            }
          >
            <MoreVertIcon />
          </IconButton>

        </Tooltip>

      </div>

    </td>

  </tr>
))}
      </table>

    </div>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >

      <MenuItem
        onClick={() => {
          if (!selectedRoom) return;

          window.open(
            `https://lg.jdeiut.ir/${selectedRoom.name}`,
            "_blank"
          );

          closeMenu();
        }}
      >
        🚪 ورود به جلسه
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (!selectedRoom) return;

          navigator.clipboard.writeText(
            `https://lg.jdeiut.ir/${selectedRoom.name}`
          );

          alert("لینک رویداد کپی شد.");

          closeMenu();
        }}
      >
        📋 کپی لینک
      </MenuItem>

      <Divider />

      <MenuItem
  onClick={() => {
    if (!selectedRoom) return;

    setEditingRoom(selectedRoom);
    setOpen(true);
    closeMenu();
  }}
>
  ✏️ ویرایش
</MenuItem>

      <MenuItem
  onClick={async () => {

    if (!selectedRoom) return;

    const membersRes =
      await axios.get(
        `http://localhost:5000/api/rooms/${selectedRoom.id}/members`
      );

    const usersRes =
      await axios.get(
        "http://localhost:5000/api/users"
      );

    setMembers(
      membersRes.data.data
    );

    setUsers(
      usersRes.data.data
    );

    setMembersOpen(true);

    closeMenu();

  }}
>
  👥 اعضای رویداد
</MenuItem>

      <MenuItem disabled>
        📊 گزارش حضور
      </MenuItem>

      <MenuItem disabled>
        🎥 فایل‌های ضبط‌شده
      </MenuItem>

      <Divider />

      <MenuItem
        sx={{ color: "red" }}
        onClick={async () => {
          if (!selectedRoom) return;

          if (
            !window.confirm(
              "آیا از حذف این رویداد مطمئن هستید؟"
            )
          )
            return;

          try {
            await axios.delete(
              `http://localhost:5000/api/rooms/${selectedRoom.id}`
            );

            await loadRooms();

            closeMenu();
          } catch (err) {
            console.log(err);
          }
        }}
      >
        🗑 حذف
      </MenuItem>

    </Menu>
{membersOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      left: 0,
      top: 0,
      direction: "rtl",
    }}
  >
    <div
      style={{
     width: "850px",
     maxWidth: "95%",        background: "#fff",
        borderRadius: 14,
        padding: 25,
      }}
    >
      <h2>اعضای رویداد</h2>


  <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  }}
>
  <button onClick={() => setActiveRole("manager")}>
👑 مدیران
</button>

<button onClick={() => setActiveRole("assistant")}>
🟢 دستیاران
</button>

<button onClick={() => setActiveRole("participant")}>
👤 شرکت‌کنندگان
</button>
</div>
<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  }}
>
  <select
    value={selectedUserId}
    onChange={(e) => setSelectedUserId(e.target.value)}
    style={{
      flex: 1,
      padding: 10,
      height: 42,
    }}
  >
    <option value="">انتخاب کاربر...</option>

    {users.map((u: any) => (
      <option key={u.id} value={u.id}>
        {u.fullName}
      </option>
    ))}
  </select>

  <button
    style={{
      height: 42,
      padding: "0 20px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      borderRadius: 8,
      cursor: "pointer",
    }}
    onClick={async () => {
      if (!selectedUserId) return;

      await axios.post(
        `http://localhost:5000/api/rooms/${selectedRoom?.id}/members`,
        {
          userId: selectedUserId,
          role: activeRole,
        }
      );

      setSelectedUserId("");

      await refreshMembers();
    }}
  >
    افزودن
  </button>
</div>
</div>
      <table
        style={{
          width: "100%",
          marginTop: 25,
        }}
      >
        <thead>
          <tr>
            <th>نام</th>
            <th>کد ملی</th>
            <th>نقش</th>
            <th>عملیات</th>
          </tr>
        </thead>

        <tbody>
          {members
  .filter((m: any) => m.role === activeRole)
  .map((m: any) => (
            <tr key={m.id}>
              <td>{m.fullName}</td>

              <td>{m.nationalCode}</td>

              <td>
                {m.role === "manager"
                  ? "مدیر"
                  : m.role === "assistant"
                  ? "دستیار"
                  : "شرکت کننده"}
              </td>

              <td>
                <button
                  onClick={async () => {
                    await axios.delete(
                      `http://localhost:5000/api/event-members/${m.id}`
                    );

                    const res =
                      await axios.get(
                        `http://localhost:5000/api/rooms/${selectedRoom?.id}/members`
                      );

                    setMembers(
                      res.data.data
                    );
                  }}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  }}
>
  <button
    onClick={() => setMembersOpen(false)}
  >
    بستن
  </button>
</div>
    </div> 
)}
  </>
);

}

export default Classes;
