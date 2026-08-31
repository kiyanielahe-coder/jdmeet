import { useEffect, useState } from "react";
import { api } from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalRooms: 0,
    activeRooms: 0,
  });

  const [todayMeetings, setTodayMeetings] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardRes = await api.get("/dashboard");

      setDashboard(dashboardRes.data.data);

      const meetingsRes = await api.get("/dashboard/rooms");

      setTodayMeetings(meetingsRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

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
            <div
              style={{
                fontSize: 14,
                color: "#666",
              }}
            >
              {card.title}
            </div>

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
        }}
      >
        <h2 style={{ marginBottom: 20 }}>آخرین رویدادها</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 12 }}>عنوان</th>
              <th style={{ padding: 12 }}>مدرس</th>
              <th style={{ padding: 12 }}>ساعت</th>
              <th style={{ padding: 12 }}>وضعیت</th>
            </tr>
          </thead>

          <tbody>
            {todayMeetings.map((item: any, index) => (
              <tr key={index}>
                <td style={{ padding: 12 }}>{item.title}</td>
                <td style={{ padding: 12 }}>{item.teacher}</td>
                <td style={{ padding: 12 }}>
                  {item.time || "-"}
                </td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 13,
                    }}
                  >
                    فعال
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
