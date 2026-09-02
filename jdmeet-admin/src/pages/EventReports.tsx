import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { api } from "../services/api";
import PersianDatePicker from "../components/PersianDatePicker";
import {
  formatPersianDate,
  formatPersianTime,
  isDateWithinRange,
} from "../utils/date";

type Room = {
  id: number;
  name: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

function EventReports() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [teacher, setTeacher] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/rooms")
      .then((response) => {
        setRooms(response.data.data || []);
      })
      .catch(() => {
        setError("دریافت اطلاعات گزارش‌ها ناموفق بود.");
      })
      .finally(() => setLoading(false));
  }, []);

  const teachers = useMemo(() => {
    return [
      ...new Set(
        rooms.map((room) => room.teacher).filter(Boolean)
      ),
    ];
  }, [rooms]);

  const types = useMemo(() => {
    return [
      ...new Set(
        rooms.map((room) => room.type).filter(Boolean)
      ),
    ];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (!isDateWithinRange(room.date, fromDate, toDate)) {
        return false;
      }

      if (teacher && room.teacher !== teacher) {
        return false;
      }

      if (status && room.status !== status) {
        return false;
      }

      if (type && room.type !== type) {
        return false;
      }

      return true;
    });
  }, [
    rooms,
    fromDate,
    toDate,
    teacher,
    status,
    type,
  ]);

  const activeCount = filteredRooms.filter(
    (room) =>
      room.status === "فعال" ||
      room.status === "active"
  ).length;

  const teacherCount = [
    ...new Set(
      filteredRooms
        .map((room) => room.teacher)
        .filter(Boolean)
    ),
  ].length;

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setTeacher("");
    setStatus("");
    setType("");
  };

  const handleDownloadReport = () => {
    const data = filteredRooms.map((room, index) => ({
      "ردیف": index + 1,
      "نام رویداد": room.title || room.name,
      "مدرس": room.teacher || "-",
      "تاریخ": formatPersianDate(room.date),
      "ساعت": formatPersianTime(room.time),
      "نوع": room.type || "-",
      "وضعیت":
        room.status === "active"
          ? "فعال"
          : room.status === "inactive"
          ? "غیرفعال"
          : room.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "گزارش رویدادها"
    );

    XLSX.writeFile(
      workbook,
      "گزارش-رویدادها.xlsx"
    );
  };

  return (
    <div
      style={{
        direction: "rtl",
        width: "100%",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "#0f172a",
          fontSize: 28,
        }}
      >
        گزارش رویدادها
      </h1>

      <p
        style={{
          color: "#64748b",
          marginTop: 8,
          marginBottom: 25,
        }}
      >
        گزارش و بررسی وضعیت برگزاری رویدادها و جلسات
      </p>
      {loading && (
        <div style={{ padding: 24, color: "#64748b" }}>
          در حال دریافت گزارش‌ها...
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: 16,
            marginBottom: 20,
            color: "#991b1b",
            background: "#fee2e2",
            borderRadius: 10,
          }}
        >
          {error}
        </div>
      )}

      {/* آمار */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
          marginBottom: 25,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 22,
            boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 14 }}>
            تعداد کل رویدادها
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#009693",
              marginTop: 8,
            }}
          >
            {filteredRooms.length}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 22,
            boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 14 }}>
            رویدادهای فعال
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#009693",
              marginTop: 8,
            }}
          >
            {activeCount}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 22,
            boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 14 }}>
            تعداد مدرس‌ها
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#009693",
              marginTop: 8,
            }}
          >
            {teacherCount}
          </div>
        </div>
      </div>

      {/* فیلتر */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 22,
          marginBottom: 25,
          boxShadow: "0 4px 15px rgba(15,23,42,.06)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#0f172a",
          }}
        >
          فیلتر گزارش
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 14,
          }}
        >
          {/* از تاریخ */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 7,
              }}
            >
              از تاریخ
            </label>

            <PersianDatePicker
              value={fromDate}
              onChange={setFromDate}
            />
          </div>

          {/* تا تاریخ */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 7,
              }}
            >
              تا تاریخ
            </label>

            <PersianDatePicker
              value={toDate}
              onChange={setToDate}
            />
          </div>

          {/* مدرس */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 7,
              }}
            >
              مدرس
            </label>

            <select
              value={teacher}
              onChange={(e) =>
                setTeacher(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            >
              <option value="">
                همه مدرس‌ها
              </option>

              {teachers.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* وضعیت */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 7,
              }}
            >
              وضعیت
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            >
              <option value="">
                همه وضعیت‌ها
              </option>

              <option value="فعال">
                فعال
              </option>

              <option value="غیرفعال">
                غیرفعال
              </option>

              <option value="active">
                فعال
              </option>

              <option value="inactive">
                غیرفعال
              </option>
            </select>
          </div>

          {/* نوع جلسه */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 7,
              }}
            >
              نوع جلسه
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            >
              <option value="">
                همه انواع
              </option>

              {types.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            onClick={clearFilters}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 9,
              background: "#e2e8f0",
              color: "#334155",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            پاک کردن فیلترها
          </button>

          <button
            onClick={handleDownloadReport}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 9,
              background: "#009693",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            دریافت گزارش
          </button>
        </div>
      </div>

      {/* جدول */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={{ padding: 14 }}>
                ردیف
              </th>

              <th style={{ padding: 14 }}>
                نام رویداد
              </th>

              <th style={{ padding: 14 }}>
                مدرس
              </th>

              <th style={{ padding: 14 }}>
                تاریخ
              </th>

              <th style={{ padding: 14 }}>
                ساعت
              </th>

              <th style={{ padding: 14 }}>
                نوع
              </th>

              <th style={{ padding: 14 }}>
                وضعیت
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.map(
              (room, index) => (
                <tr
                  key={room.id}
                  style={{
                    borderBottom:
                      "1px solid #f1f5f9",
                  }}
                >
                  <td
                    style={{
                      padding: 14,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </td>

                  <td style={{ padding: 14 }}>
                    {room.title ||
                      room.name}
                  </td>

                  <td style={{ padding: 14 }}>
                    {room.teacher || "-"}
                  </td>

                  <td style={{ padding: 14 }}>
                    {formatPersianDate(room.date)}
                  </td>

                  <td style={{ padding: 14 }}>
                    {formatPersianTime(room.time)}
                  </td>

                  <td style={{ padding: 14 }}>
                    {room.type || "-"}
                  </td>

                  <td style={{ padding: 14 }}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: 20,
                        background:
                          room.status ===
                            "فعال" ||
                          room.status ===
                            "active"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          room.status ===
                            "فعال" ||
                          room.status ===
                            "active"
                            ? "#166534"
                            : "#991b1b",
                        fontSize: 13,
                      }}
                    >
                      {room.status ===
                      "active"
                        ? "فعال"
                        : room.status ===
                          "inactive"
                        ? "غیرفعال"
                        : room.status ||
                          "-"}
                    </span>
                  </td>
                </tr>
              )
            )}

            {filteredRooms.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  گزارشی برای نمایش وجود ندارد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventReports;
