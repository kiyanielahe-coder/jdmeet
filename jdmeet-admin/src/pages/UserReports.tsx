import { useEffect, useState } from "react";
import { MoreVertical, RotateCcw, Sheet } from "lucide-react";
import * as XLSX from "xlsx";
import PersianDatePicker from "../components/PersianDatePicker";
import { api } from "../services/api";
import { formatPersianDate, toBackendDate, toPersianDigits } from "../utils/date";
import "./UserReports.css";

type Option = {
  id: number;
  name?: string;
  fullName?: string;
  username?: string;
};

type Connection = {
  id: number;
  userId: number;
  roomId: number;
  fullName: string;
  username: string;
  mobile: string | null;
  eventName: string;
  joinedAt: string;
  leftAt: string | null;
  durationSeconds: number | null;
  totalDurationSeconds: number;
  ipAddress: string | null;
  browser: string | null;
  browserVersion: string | null;
  deviceType: string | null;
  os: string | null;
  osVersion: string | null;
};

const asDate = (value: string) => new Date(`${value.replace(" ", "T")}Z`);

const time = (value: string | null) =>
  value
    ? asDate(value).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "ثبت نشده";

const duration = (seconds: number | null) => {
  if (seconds === null) return "خروج ثبت نشده";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return toPersianDigits(
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  );
};

export default function UserReports() {
  const [rows, setRows] = useState<Connection[]>([]);
  const [rooms, setRooms] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Connection | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/reports/users", {
          signal: controller.signal,
          params: {
            search: search || undefined,
            roomId: roomId || undefined,
            userId: userId || undefined,
            from: toBackendDate(fromDate) || undefined,
            to: toBackendDate(toDate) || undefined,
          },
        });
        setRows(response.data.data || []);
        setRooms(response.data.filters?.rooms || []);
        setUsers(response.data.filters?.users || []);
      } catch {
        if (!controller.signal.aborted) {
          setError("دریافت گزارش اتصال کاربران ناموفق بود.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, roomId, userId, fromDate, toDate]);

  const clear = () => {
    setSearch("");
    setRoomId("");
    setUserId("");
    setFromDate("");
    setToDate("");
  };

  const excel = () => {
    const data = rows.map((row) => ({
      "نام کاربر": row.fullName,
      موبایل: row.mobile || "-",
      رویداد: row.eventName,
      تاریخ: formatPersianDate(row.joinedAt.slice(0, 10)),
      ورود: time(row.joinedAt),
      خروج: time(row.leftAt),
      "مدت اتصال": duration(row.durationSeconds),
      "مجموع اتصال": duration(row.totalDurationSeconds),
      مرورگر: row.browser || "نامشخص",
      "نسخه مرورگر": row.browserVersion || "نامشخص",
      دستگاه: row.deviceType || "نامشخص",
      "سیستم‌عامل": row.os || "نامشخص",
      "نسخه سیستم‌عامل": row.osVersion || "نامشخص",
      IP: row.ipAddress || "نامشخص",
    }));
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      book,
      XLSX.utils.json_to_sheet(data),
      "گزارش کاربران"
    );
    XLSX.writeFile(book, "گزارش-اتصال-کاربران.xlsx");
  };

  return (
    <div className="user-report" dir="rtl">
      <h1>گزارش کاربران</h1>
      <p className="subtitle">گزارش واقعی ورود، خروج و مدت حضور کاربران در رویدادها</p>
      <section className="report-filters">
        <label>جستجو<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="نام، نام کاربری یا موبایل" /></label>
        <label>رویداد<select value={roomId} onChange={(e) => setRoomId(e.target.value)}><option value="">همه رویدادها</option>{rooms.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>کاربر<select value={userId} onChange={(e) => setUserId(e.target.value)}><option value="">همه کاربران</option>{users.map((x) => <option key={x.id} value={x.id}>{x.fullName} ({x.username})</option>)}</select></label>
        <label>از تاریخ<PersianDatePicker value={fromDate} onChange={setFromDate} /></label>
        <label>تا تاریخ<PersianDatePicker value={toDate} onChange={setToDate} /></label>
        <div className="filter-actions"><button className="secondary" onClick={clear}><RotateCcw size={17}/>پاک کردن</button><button onClick={excel} disabled={!rows.length}><Sheet size={17}/>خروجی Excel</button></div>
      </section>
      {error && <div className="report-error" role="alert">{error}</div>}
      <section className="report-table-wrap">
        {loading ? <div className="report-state">در حال دریافت گزارش...</div> : !rows.length ? <div className="report-state">هیچ اتصال ثبت‌شده‌ای مطابق فیلترها وجود ندارد.</div> : <table><thead><tr>{["نام و نام خانوادگی","شماره موبایل","نام رویداد","تاریخ","ساعت ورود","مدت اتصال","مجموع کل اتصال","جزئیات"].map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.fullName}</td><td>{row.mobile || "-"}</td><td>{row.eventName}</td><td>{formatPersianDate(row.joinedAt.slice(0, 10))}</td><td>{time(row.joinedAt)}</td><td><span className={row.leftAt ? "closed" : "open"}>{duration(row.durationSeconds)}</span></td><td>{duration(row.totalDurationSeconds)}</td><td><button className="details" aria-label="نمایش جزئیات اتصال" onClick={() => setDetail(row)}><MoreVertical size={20}/></button></td></tr>)}</tbody></table>}
      </section>
      {detail && <div className="detail-backdrop" onClick={() => setDetail(null)}><div className="detail-card" role="dialog" aria-modal="true" aria-label="جزئیات اتصال" onClick={(e) => e.stopPropagation()}><div className="detail-head"><h2>جزئیات اتصال</h2><button onClick={() => setDetail(null)}>×</button></div><dl><dt>نام کاربری</dt><dd>{detail.username}</dd><dt>ساعت خروج</dt><dd>{time(detail.leftAt)}</dd><dt>مرورگر</dt><dd>{detail.browser || "نامشخص"}</dd><dt>نسخه مرورگر</dt><dd>{detail.browserVersion || "نامشخص"}</dd><dt>نوع دستگاه</dt><dd>{detail.deviceType || "نامشخص"}</dd><dt>سیستم‌عامل</dt><dd>{detail.os || "نامشخص"}</dd><dt>نسخه سیستم‌عامل</dt><dd>{detail.osVersion || "نامشخص"}</dd><dt>IP Address</dt><dd dir="ltr">{detail.ipAddress || "نامشخص"}</dd></dl></div></div>}
    </div>
  );
}
