import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  FolderKanban,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "داشبورد",
    icon: <LayoutDashboard size={20} />,
    path: "/",
  },
  {
    title: "رویدادها",
    icon: <CalendarDays size={20} />,
    path: "/classes",
  },
  {
    title: "کاربران",
    icon: <Users size={20} />,
    path: "/users",
  },
  {
    title: "گزارش‌ها",
    icon: <FolderKanban size={20} />,
    path: "/reports",
  },
  {
    title: "تنظیمات",
    icon: <Settings size={20} />,
    path: "/room-settings",
  },
];

function Sidebar() {
  return (
    <div
      style={{
        width: 270,
        minHeight: "100vh",
        background: "#009693",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: 170,
            marginBottom: 18,
          }}
        />

        <div
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          JDMeet
        </div>

        <div
          style={{
            color: "rgba(255,255,255,.8)",
            fontSize: 13,
            marginTop: 8,
          }}
        >
          سامانه مدیریت جلسات آنلاین
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              borderRadius: 14,
              textDecoration: "none",
              color: "#fff",
              background: isActive
                ? "rgba(255,255,255,.18)"
                : "transparent",
              transition: ".2s",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,.2)",
          paddingTop: 20,
          color: "rgba(255,255,255,.8)",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        نسخه 1.0.0
      </div>
    </div>
  );
}

export default Sidebar;