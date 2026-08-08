import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div
      style={{
        display: "flex",
        direction: "rtl",
        minHeight: "100vh",
        background: "#F5F7FA",
        fontFamily: "Vazirmatn, Tahoma",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header />

        <main
          style={{
            flex: 1,
            padding: 30,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;