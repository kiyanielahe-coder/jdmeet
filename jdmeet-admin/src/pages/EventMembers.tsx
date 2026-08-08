import { useEffect, useState } from "react";
import axios from "axios";
function EventMembers() {
    const [users, setUsers] = useState<any[]>([]);
const [manager, setManager] = useState("");
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users"
      );

      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchUsers();
}, []);
  return (
    <>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 25,
        }}
      >
        اعضای رویداد
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 6px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            color: "#009693",
            marginTop: 0,
            marginBottom: 25,
          }}
        >
          مدیریت اعضای رویداد
        </h2>

        {/* مدیر رویداد */}

        <div style={{ marginBottom: 30 }}>
          <label
            style={{
              fontWeight: 600,
              display: "block",
              marginBottom: 10,
            }}
          >
            مدیر رویداد
          </label>

          <select
  value={manager}
  onChange={(e) => setManager(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  }}
>
  <option value="">انتخاب مدیر...</option>

  {users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.fullName}
    </option>
  ))}
</select>
        </div>

        {/* همکاران */}

        <div style={{ marginBottom: 25 }}>
          <label
            style={{
              fontWeight: 600,
              display: "block",
              marginBottom: 10,
            }}
          >
            همکاران مدرس
          </label>

          <button
            style={{
              background: "#009693",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 20,
            }}
          >
            + افزودن همکار
          </button>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                padding: 15,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>هنوز همکاری اضافه نشده است.</span>
            </div>
          </div>
        </div>

        <button
          style={{
            background: "#009693",
            color: "#fff",
            border: "none",
            padding: "12px 26px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ذخیره تغییرات
        </button>
      </div>
    </>
  );
}

export default EventMembers;