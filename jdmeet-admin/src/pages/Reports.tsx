import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();

  return (
    <div style={{ direction: "rtl" }}>
      <h1 style={{ color: "#0f172a", marginBottom: 8 }}>گزارش‌ها</h1>

      <p style={{ color: "#64748b", marginBottom: 30 }}>
        بررسی و تحلیل رویدادها و فعالیت کاربران
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
        }}
      >
        <div
          onClick={() => navigate("/reports/events")}
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 18,
            boxShadow: "0 4px 18px rgba(15,23,42,.06)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>📊</div>

          <h2 style={{ color: "#0f172a" }}>گزارش رویدادها</h2>

          <p style={{ color: "#64748b", lineHeight: 1.8 }}>
            مشاهده آمار برگزاری رویدادها، جلسات، مدرس‌ها،
            تعداد شرکت‌کنندگان و مدت برگزاری.
          </p>

          <button
            style={{
              marginTop: 15,
              background: "#009693",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            مشاهده گزارش
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 18,
            boxShadow: "0 4px 18px rgba(15,23,42,.06)",
            opacity: 0.65,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>👥</div>

          <h2 style={{ color: "#0f172a" }}>گزارش کاربران</h2>

          <p style={{ color: "#64748b", lineHeight: 1.8 }}>
            مشاهده ورود و خروج کاربران، مدت حضور، رویداد،
            دستگاه، سیستم‌عامل، مرورگر و IP.
          </p>

          <button
            type="button"
            disabled
            style={{
              marginTop: 15,
              background: "#94a3b8",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              cursor: "not-allowed",
            }}
          >
            به‌زودی
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
