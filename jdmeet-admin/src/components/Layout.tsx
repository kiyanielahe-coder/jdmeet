import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div
      className="app-layout"
      style={{
        display: "flex",
        direction: "rtl",
        minHeight: "100vh",
        width: "100%",
        background: "#F5F7FA",
        fontFamily: "Vazirmatn, Tahoma",
      }}
    >
      <Sidebar />

      <div
        className="main-wrapper"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />

        <main
          className="main-content"
          style={{
            flex: 1,
            minWidth: 0,
            padding: 30,
            overflowY: "auto",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html,
          body,
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
          }

          body {
            overflow-x: auto;
          }

          .app-layout {
            width: 100%;
            min-width: 0;
          }

          .main-wrapper {
            min-width: 0;
          }

          .main-content {
            width: 100%;
            min-width: 0;
          }

          @media (max-width: 768px) {
            .main-content {
              width: 100%;
              padding: 70px 15px 20px 15px !important;
              overflow-x: auto !important;
              overflow-y: auto !important;
            }

            .main-wrapper {
              width: 100%;
              min-width: 0;
            }
          }

          @media (min-width: 769px) and (max-width: 1100px) {
            .main-content {
              padding: 25px 20px !important;
              overflow-x: auto;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Layout;