import { Bell, Search, User, LogOut } from "lucide-react";

function Header() {
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div
      style={{
        background: "#fff",
        height: 72,
        borderRadius: 14,
        padding: "0 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 12px rgba(15,23,42,.06)",
        marginBottom: 25,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: "#009693",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          J
        </div>

        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            JDMeet
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: 13,
            }}
          >
            سامانه مدیریت جلسات آنلاین
          </div>
        </div>
      </div>

      <div
        style={{
          width: 420,
          height: 45,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          padding: "0 15px",
          gap: 10,
        }}
      >
        <Search size={18} color="#64748b" />

        <input
          placeholder="جستجوی کاربران، رویدادها..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        />
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
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <Bell size={20} />

          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              background: "#ef4444",
              borderRadius: "50%",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "#009693",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <User size={20} />
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              مدیر سیستم
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 13,
              }}
            >
              Administrator
            </div>
          </div>
        </div>

        {/* دکمه خروج */}
        <button
          onClick={handleLogout}
          title="خروج از حساب"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #fecaca",
            color: "#dc2626",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default Header;