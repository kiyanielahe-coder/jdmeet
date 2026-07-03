import { Bell, Search, User } from "lucide-react";
function Header() {
  return (
    <div
      style={{
        background: "white",
        padding: "18px 30px",
        borderRadius: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
          }}
        >
          پنل مدیریت
        </h2>

        <div
          style={{
            color: "#64748b",
            marginTop: 5,
            fontSize: 14,
          }}
        >
          خوش آمدید مدیر سیستم
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div
          style={{
            background: "#f1f5f9",
            width: 42,
            height: 42,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          <Search size={20} color="#334155" />
        </div>

        <div
          style={{
            background: "#f1f5f9",
            width: 42,
            height: 42,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontSize: 18,
            position: "relative",
          }}
        >
          <Bell size={20} color="#334155" />

          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          ></span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#f8fafc",
            padding: "6px 12px",
            borderRadius: 30,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <User size={20} />
          </div>

          <div>
            <div style={{ fontWeight: "bold", fontSize: 14 }}>
              مدیر سیستم
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 12,
              }}
            >
              Administrator
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;