import { Link } from "react-router-dom";

function Sidebar() {
  const linkStyle = {
    display: "block",
    marginBottom: 20,
    color: "white",
    textDecoration: "none",
    fontSize: 16,
  };

  return (
    <div
      style={{
        width: 250,
        background: "#1e293b",
        color: "white",
        padding: 20,
        minHeight: "100vh",
      }}
    >
      <div
  style={{
    textAlign: "center",
    marginBottom: 35,
  }}
>
  {/* بعداً لوگو اینجا قرار می‌گیرد */}

<img
  src="/logo.png"
  alt="JDMeet"
  style={{
    width: 180,
    marginBottom: 15,
  }}
/>
  <h2
    style={{
      color: "white",
      margin: 0,
      fontSize: 28,
      fontWeight: "bold",
    }}
  >
    JDMeet
  </h2>

  <div
    style={{
      color: "#cbd5e1",
      fontSize: 12,
      marginTop: 8,
      lineHeight: 1.8,
    }}
  >
    سامانه مدیریت کلاس آنلاین
    <br />
    جهاد دانشگاهی
  </div>
</div>

      <Link to="/" style={linkStyle}>
        🏠 داشبورد
      </Link>

      <Link to="/classes" style={linkStyle}>
  👨‍🏫 کلاس‌ها
      </Link>

      <Link to="/users" style={linkStyle}>
        👥 کاربران
      </Link>

      <Link to="/room-settings" style={linkStyle}>
  ⚙️ تنظیمات
    </Link>
    </div>
  );
}

export default Sidebar;