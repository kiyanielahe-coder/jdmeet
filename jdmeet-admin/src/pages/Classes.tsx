import { useState } from "react";
import CreateRoomModal from "../components/CreateRoomModal";

function Classes() {
  const [open, setOpen] = useState(false);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "family-1a",
      title: "Family 1A",
      type: "آموزشی",
      status: "فعال",
    },
    {
      id: 2,
      name: "manager-meeting",
      title: "جلسه مدیران",
      type: "جلسه",
      status: "فعال",
    },
    {
      id: 3,
      name: "ai-webinar",
      title: "وبینار هوش مصنوعی",
      type: "وبینار",
      status: "غیرفعال",
    },
  ]);

  return (
    <>
      <CreateRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(room) => {
          setRooms([
            ...rooms,
            {
              id: Date.now(),
              name: room.title
                .replace(/\s+/g, "-")
                .toLowerCase(),
              title: room.title,
              type: room.type,
              status: "فعال",
            },
          ]);
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <h1
  style={{
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 25,
    color: "#1e293b",
  }}
>
  مدیریت اتاق‌ها
</h1>

        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ➕ ایجاد اتاق جدید
        </button>
      </div>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: 12 }}>نام اتاق</th>
            <th style={{ padding: 12 }}>نوع</th>
            <th style={{ padding: 12 }}>وضعیت</th>
            <th style={{ padding: 12 }}>عملیات</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: 12 }}>{item.title}</td>

              <td style={{ padding: 12 }}>{item.type}</td>

              <td style={{ padding: 12 }}>
  <span
    style={{
      background:
        item.status === "فعال" ? "#dcfce7" : "#fee2e2",
      color:
        item.status === "فعال" ? "#166534" : "#991b1b",
      padding: "5px 12px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: "bold",
    }}
  >
    {item.status}
  </span>
</td>

              <td style={{ padding: 12 }}>
  <button
    onClick={() => {
      navigator.clipboard.writeText(
        `https://lg.jdeiut.ir/${item.name}`
      );
      alert("لینک کپی شد.");
    }}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
      marginLeft: 8,
    }}
  >
    📋
  </button>

  <button
    onClick={() =>
      window.open(
        `https://lg.jdeiut.ir/${item.name}`,
        "_blank"
      )
    }
    style={{
      background: "#16a34a",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
      marginLeft: 8,
    }}
  >
    ▶
  </button>

  <button
    onClick={() => {
      if (confirm("آیا از حذف این اتاق مطمئن هستید؟")) {
        setRooms(rooms.filter((room) => room.id !== item.id));
      }
    }}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    🗑
  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Classes;