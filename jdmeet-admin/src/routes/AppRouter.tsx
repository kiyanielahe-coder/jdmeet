import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import EventMembers from "../pages/EventMembers";
import Dashboard from "../pages/Dashboard";
import Classes from "../pages/Classes";
import Users from "../pages/Users";
import RoomSettings from "../pages/RoomSettings";
import Reports from "../pages/Reports";
import EventReports from "../pages/EventReports";
import Meeting from "../pages/Meeting";
import UserReports from "../pages/UserReports";
import { clearAuthSession, getAuthUser, hasValidAuthSession } from "../services/auth";

function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasValidAuthSession);
  const isAdmin = getAuthUser()?.role === "admin";
  useEffect(() => {
    if (!hasValidAuthSession()) {
      clearAuthSession();
      setIsLoggedIn(false);
    }
  }, []);
 if (!isLoggedIn) {
  return (
    <Login
      onLogin={() => {
        setIsLoggedIn(true);
      }}
    />
  );
}
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/meeting/:roomName" element={<Meeting />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/users" element={<Users />} />
          <Route path="/room-settings" element={<RoomSettings />} />
          <Route path="/events/:id/members" element={<EventMembers />} />
          <Route path="/reports" element={<Reports />} />
          <Route
  path="/reports/events"
  element={<EventReports />}
/>
          <Route
  path="/reports/users"
  element={isAdmin ? <UserReports /> : <Navigate to="/reports" replace />}
/>
          <Route
  path="/events/:id"
  element={<EventDetails />}
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
