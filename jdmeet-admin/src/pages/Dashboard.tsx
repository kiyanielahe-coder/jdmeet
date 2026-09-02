import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { formatPersianDate, formatPersianTime } from "../utils/date";

type DashboardSummary = {
  totalUsers: number;
  totalRooms: number;
  activeRooms: number;
};

type RecentRoom = {
  id: number;
  title: string;
  teacher: string;
  date: string;
  time: string;
  status: string;
};

function isActiveStatus(status: string) {
  const normalized = String(status || "").trim().toLowerCase();
  return normalized === "فعال" || normalized === "active";
}

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardSummary>({
    totalUsers: 0,
    totalRooms: 0,
    activeRooms: 0,
  });
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, roomsResponse] = await Promise.all([
        api.get("/dashboard"),
        api.get("/dashboard/rooms"),
      ]);

      setDashboard(dashboardResponse.data.data);
      setRecentRooms(roomsResponse.data.data || []);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "دریافت اطلاعات داشبورد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const cards = [
    {
      title: "کل کاربران",
      value: dashboard.totalUsers,
      color: "#2563eb",
    },
    {
      title: "کل رویدادها",
      value: dashboard.totalRooms,
      color: "#16a34a",
    },
    {
      title: "رویدادهای فعال",
      value: dashboard.activeRooms,
      color: "#ea580c",
    },
    {
      title: "سامانه JDMeet",
      value: "✓",
      color: "#7c3aed",
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        در حال دریافت اطلاعات داشبورد...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button type="button" onClick={loadDashboard}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <>
      <h1
        style={{
          marginBottom: 30,
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        داشبورد JDMeet
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              borderTop: `5px solid ${card.color}`,
              boxShadow: "0 2px 10px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ fontSize: 14, color: "#666" }}>{card.title}</div>
            <div
              style={{
                fontSize: 34,
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          marginTop: 35,
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>آخرین رویدادها</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: 12 }}>عنوان</th>
              <th style={{ padding: 12 }}>مدرس</th>
              <th style={{ padding: 12 }}>تاریخ</th>
              <th style={{ padding: 12 }}>ساعت</th>
              <th style={{ padding: 12 }}>وضعیت</th>
            </tr>
          </thead>

          <tbody>
            {recentRooms.map((room) => {
              const active = isActiveStatus(room.status);

              return (
                <tr key={room.id}>
                  <td style={{ padding: 12 }}>{room.title || "-"}</td>
                  <td style={{ padding: 12 }}>{room.teacher || "-"}</td>
                  <td style={{ padding: 12 }}>{formatPersianDate(room.date)}</td>
                  <td style={{ padding: 12 }}>{formatPersianTime(room.time)}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background: active ? "#dcfce7" : "#fee2e2",
                        color: active ? "#15803d" : "#b91c1c",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 13,
                      }}
                    >
                      {active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {recentRooms.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: 35,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  هنوز رویدادی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
