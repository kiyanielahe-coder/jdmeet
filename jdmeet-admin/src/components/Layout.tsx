import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div
      style={{
        display: "flex",
        direction: "rtl",
        background: "#f1f5f9",
        minHeight: "100vh",
        fontFamily: "Tahoma",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: 40,
        }}
      >
        <Header />

        <Outlet />
      </div>
    </div>
  );
}

export default Layout;