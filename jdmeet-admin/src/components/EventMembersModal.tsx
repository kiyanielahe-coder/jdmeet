import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  open: boolean;
  room: any;
  onClose: () => void;
};

export default function EventMembersModal({
  open,
  room,
  onClose,
}: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [role, setRole] = useState<
    "manager" | "assistant" | "participant"
  >("manager");

  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (!open || !room) return;

    loadData();
  }, [open, room]);

  async function loadData() {
    const membersRes = await axios.get(
      `http://localhost:5000/api/rooms/${room.id}/members`
    );

    const usersRes = await axios.get(
      "http://localhost:5000/api/users"
    );

    setMembers(membersRes.data.data);
    setUsers(usersRes.data.data);
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 900,
          background: "#fff",
          borderRadius: 15,
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
  <button
    onClick={() => setRole("manager")}
    style={{
      padding: "10px 18px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      background:
        role === "manager"
          ? "#009693"
          : "#f1f5f9",
      color:
        role === "manager"
          ? "#fff"
          : "#333",
    }}
  >
    👑 مدیران
  </button>

  <button
    onClick={() => setRole("assistant")}
    style={{
      padding: "10px 18px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      background:
        role === "assistant"
          ? "#009693"
          : "#f1f5f9",
      color:
        role === "assistant"
          ? "#fff"
          : "#333",
    }}
  >
    🟢 دستیاران
  </button>

  <button
    onClick={() => setRole("participant")}
    style={{
      padding: "10px 18px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      background:
        role === "participant"
          ? "#009693"
          : "#f1f5f9",
      color:
        role === "participant"
          ? "#fff"
          : "#333",
    }}
  >
    👤 شرکت‌کنندگان
  </button>
</div>

<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 20,
  }}
><h3 style={{color:"red"}}>TEST</h3>
  <select
    value={selectedUser}
    onChange={(e) =>
      setSelectedUser(e.target.value)
    }
    style={{
      flex: 1,
      padding: 10,
      borderRadius: 8,
    }}
  >
    <option value="">
      انتخاب کاربر...
    </option>

    {users.map((u: any) => (
      <option
        key={u.id}
        value={u.id}
      >
        {u.fullName}
      </option>
    ))}
  </select>

  <button
  onClick={async () => {
    if (!selectedUser) {
      alert("یک کاربر انتخاب کنید.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/rooms/${room.id}/members`,
        {
          userId: selectedUser,
          role,
        }
      );

      setSelectedUser("");

      loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "عضو اضافه نشد."
      );
    }
  }}
  style={{
    padding: "10px 20px",
    background: "#009693",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  افزودن
</button>
</div>
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  }}
>
  <thead>
    <tr
      style={{
        background: "#009693",
        color: "#fff",
      }}
    >
      <th style={{ padding: 12 }}>نام</th>
      <th style={{ padding: 12 }}>نقش</th>
      <th style={{ padding: 12 }}>عملیات</th>
    </tr>
  </thead>

  <tbody>
    {members
      .filter((m: any) => m.role === role)
      .map((m: any) => (
        <tr
          key={m.id}
          style={{
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <td style={{ padding: 12 }}>
            {m.fullName}
          </td>

          <td style={{ padding: 12 }}>
            {m.role === "manager"
              ? "مدیر"
              : m.role === "assistant"
              ? "دستیار"
              : "شرکت‌کننده"}
          </td>

          <td style={{ padding: 12 }}>
            <button
  onClick={async () => {
    if (!window.confirm("عضو حذف شود؟")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/event-members/${m.id}`
      );

      loadData();
    } catch (err) {
      console.log(err);
    }
  }}
  style={{
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    cursor: "pointer",
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
    marginTop: 25,
    display: "flex",
    justifyContent: "flex-end",
  }}
>
  <button
    onClick={onClose}
    style={{
      padding: "10px 20px",
      border: "none",
      borderRadius: 8,
      background: "#64748b",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    بستن
  </button>
</div>
      </div>
    </div>
  );
}
