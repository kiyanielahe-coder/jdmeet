import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { isCurrentUserAdmin } from "../services/auth";
import PersianDatePicker from "../components/PersianDatePicker";

type RoomDetails = {
  id: number;
  name: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

const fieldStyle = {
  width: "100%",
  padding: 12,
  marginTop: 8,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

function EventDetails() {
  const { id } = useParams();
  const isAdmin = isCurrentUserAdmin();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRoom = useCallback(async () => {
    if (!id) {
      setError("شناسه رویداد معتبر نیست.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data.data);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "دریافت اطلاعات رویداد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const updateField = (field: keyof RoomDetails, value: string) => {
    setSuccess("");
    setRoom((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const saveRoom = async () => {
    if (!room || !id) return;
    if (!room.title.trim()) {
      setError("عنوان رویداد الزامی است.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await api.put(`/rooms/${id}`, {
        title: room.title.trim(),
        teacher: room.teacher.trim(),
        date: room.date,
        time: room.time,
        type: room.type,
        status: room.status,
      });
      setSuccess("تغییرات رویداد با موفقیت ذخیره شد.");
      await loadRoom();
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "ذخیره تغییرات رویداد انجام نشد."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        در حال دریافت اطلاعات رویداد...
      </div>
    );
  }

  if (error && !room) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button type="button" onClick={loadRoom}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!room) return null;

  return (
    <>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 25,
          color: "#1e293b",
        }}
      >
        مشخصات رویداد
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 6px 20px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 15,
            marginBottom: 25,
          }}
        >
          <h2 style={{ margin: 0, color: "#009693" }}>اطلاعات رویداد</h2>
          {!isAdmin && (
            <p style={{ color: "#64748b", marginBottom: 0 }}>
              دسترسی شما فقط برای مشاهده اطلاعات است.
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            style={{
              background: "#f0fdf4",
              color: "#166534",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
            }}
          >
            {success}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 20,
          }}
        >
          <div>
            <label style={{ fontWeight: 600 }}>عنوان رویداد</label>
            <input
              value={room.title || ""}
              disabled={!isAdmin}
              onChange={(event) => updateField("title", event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>مدرس</label>
            <input
              value={room.teacher || ""}
              disabled={!isAdmin}
              onChange={(event) => updateField("teacher", event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>تاریخ</label>
            <PersianDatePicker
              value={room.date || ""}
              disabled={!isAdmin}
              onChange={(value) => updateField("date", value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>ساعت</label>
            <input
              type="time"
              value={room.time || ""}
              disabled={!isAdmin}
              onChange={(event) => updateField("time", event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>نوع رویداد</label>
            <select
              value={room.type || "آموزشی"}
              disabled={!isAdmin}
              onChange={(event) => updateField("type", event.target.value)}
              style={fieldStyle}
            >
              <option value="آموزشی">آموزشی</option>
              <option value="وبینار">وبینار</option>
              <option value="جلسه">جلسه</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>وضعیت</label>
            <select
              value={room.status || "غیرفعال"}
              disabled={!isAdmin}
              onChange={(event) => updateField("status", event.target.value)}
              style={fieldStyle}
            >
              <option value="فعال">فعال</option>
              <option value="غیرفعال">غیرفعال</option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <button
              type="button"
              onClick={saveRoom}
              disabled={saving}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: 10,
                background: "#009693",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default EventDetails;
