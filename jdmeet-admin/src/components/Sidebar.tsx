import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  FolderKanban,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* دکمه موبایل */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: 15,
          right: 15,
          zIndex: 1001,
          width: 45,
          height: 45,
          border: "none",
          borderRadius: 12,
          background: "#009693",
          color: "#fff",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        className="mobile-menu-button"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* پس زمینه موبایل */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="sidebar-overlay"
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-open" : ""
        }`}
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
              width: 150,
              maxWidth: "100%",
              marginBottom: 15,
            }}
          />

          <div
            style={{
              color: "#fff",
              fontSize: 26,
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
            gap: 8,
          }}
        >
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
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
            borderTop:
              "1px solid rgba(255,255,255,.2)",
            paddingTop: 20,
            color: "rgba(255,255,255,.8)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          نسخه 1.0.0
        </div>
      </aside>

      <style>
        {`
          .sidebar {
            width: 270px;
            min-height: 100vh;
            background: #009693;
            display: flex;
            flex-direction: column;
            padding: 24px;
            box-sizing: border-box;
            flex-shrink: 0;
          }

          .sidebar-overlay {
            display: none;
          }

          @media (max-width: 768px) {
            .mobile-menu-button {
              display: flex !important;
            }

            .sidebar {
              position: fixed;
              top: 0;
              right: -290px;
              width: 270px;
              height: 100vh;
              min-height: 100vh;
              z-index: 1000;
              transition: right .25s ease;
              box-shadow: -5px 0 25px rgba(0,0,0,.15);
              overflow-y: auto;
            }

            .sidebar.sidebar-open {
              right: 0;
            }

            .sidebar-overlay {
              display: block;
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,.4);
              z-index: 999;
            }
          }
        `}
      </style>
    </>
  );
}

export default Sidebar;