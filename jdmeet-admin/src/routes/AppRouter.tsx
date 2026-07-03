import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Dashboard from "../pages/Dashboard";
import Classes from "../pages/Classes";
import Users from "../pages/Users";
import RoomSettings from "../pages/RoomSettings";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/users" element={<Users />} />
          <Route path="/room-settings" element={<RoomSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;