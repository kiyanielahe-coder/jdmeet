import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import LaunchIcon from "@mui/icons-material/Launch";

import CreateRoomModal from "../components/CreateRoomModal";
import "./Classes.css";
import { isCurrentUserAdmin } from "../services/auth";

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
  const isAdmin = isCurrentUserAdmin();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null);

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [selectedRoom, setSelectedRoom] =
    useState<Room | null>(null);


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
  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const res = await api.get("/rooms");

      setRooms(res.data.data);
    } catch (err) {
      console.log(err);
    }
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
          await api.put(
            `/rooms/${editingRoom.id}`,
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
          await api.post(
            "/rooms",
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

      {isAdmin && (
        <button
          className="create-btn"
          onClick={() => setOpen(true)}
        >
          + ایجاد رویداد
        </button>
      )}

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
            navigate(`/events/${item.id}`)
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

      <MenuItem
        onClick={() => {
          if (!selectedRoom) return;

          navigate(`/events/${selectedRoom.id}`);
          closeMenu();
        }}
      >
        ℹ️ مشخصات رویداد
      </MenuItem>

      {isAdmin && <Divider />}

      {isAdmin && <MenuItem
  onClick={() => {
    if (!selectedRoom) return;

    setEditingRoom(selectedRoom);
    setOpen(true);
    closeMenu();
  }}
>
  ✏️ ویرایش
</MenuItem>}

      {isAdmin && <MenuItem
        onClick={() => {
          if (!selectedRoom) return;
          navigate(`/events/${selectedRoom.id}/members`);
          closeMenu();
        }}
      >
        👥 اعضای رویداد
      </MenuItem>}

      <MenuItem disabled>
        📊 گزارش حضور
      </MenuItem>

      <MenuItem disabled>
        🎥 فایل‌های ضبط‌شده
      </MenuItem>


      {isAdmin && <Divider />}

      {isAdmin && <MenuItem
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
            await api.delete(`/rooms/${selectedRoom.id}`);

            await loadRooms();

            closeMenu();
          } catch (err) {
            console.log(err);
          }
        }}
      >
        🗑 حذف
      </MenuItem>}

    </Menu>
  </>
);

}

export default Classes;
