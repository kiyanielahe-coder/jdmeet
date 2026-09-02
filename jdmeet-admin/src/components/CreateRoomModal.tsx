import { useEffect, useState } from "react";
import PersianDatePicker from "./PersianDatePicker";

export type RoomFormValues = {
  title: string;
  teacher: string;
  date: string;
  time: string;
  type: string;
  password: string;
  allowGuest: boolean;
  status: string;
  guestCode: string;
  memberAccess: string;
  autoRecord: boolean;
};

type Props = {
  open: boolean;
  room?: Partial<RoomFormValues> | null;
  onClose: () => void;
  onCreate: (room: RoomFormValues) => void | Promise<void>;
};

const inputStyle = {
  width: "100%",
  minHeight: 42,
  padding: "10px 12px",
  border: "1px solid #dbe3ec",
  borderRadius: 9,
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
  background: "#fff",
};

const sectionStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 18,
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 7,
};

function CreateRoomModal({ open, room, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("آموزشی");
  const [password, setPassword] = useState("");
  const [allowGuest, setAllowGuest] = useState(true);
  const [status, setStatus] = useState("فعال");
  const [guestCode, setGuestCode] = useState("");
  const [memberAccess, setMemberAccess] = useState("participant");
  const [autoRecord, setAutoRecord] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(room?.title || "");
    setTeacher(room?.teacher || "");
    setDate(room?.date || "");
    setTime(room?.time || "");
    setType(room?.type || "آموزشی");
    setPassword(room?.password || "");
    setAllowGuest(room?.allowGuest ?? true);
    setStatus(room?.status || "فعال");
    setGuestCode(room?.guestCode || "");
    setMemberAccess(room?.memberAccess || "participant");
    setAutoRecord(room?.autoRecord ?? false);
  }, [open, room]);

  if (!open) return null;

  const submit = async () => {
    if (!title.trim()) {
      window.alert("عنوان رویداد الزامی است.");
      return;
    }

    await onCreate({
      title: title.trim(),
      teacher: teacher.trim(),
      date,
      time,
      type,
      password,
      allowGuest,
      status,
      guestCode: allowGuest ? guestCode.trim() : "",
      memberAccess,
      autoRecord,
    });
  };

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        background: "rgba(15, 23, 42, 0.58)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        direction: "rtl",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        style={{
          width: "min(760px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
        }}
      >
        <div style={{ padding: "22px 24px 12px" }}>
          <h2 id="room-modal-title" style={{ margin: 0, color: "#0f172a" }}>
            {room ? "ویرایش رویداد" : "ایجاد رویداد جدید"}
          </h2>
        </div>

        <div style={{ display: "grid", gap: 16, padding: "12px 24px 24px" }}>
          <section style={sectionStyle}>
            <h3 style={{ margin: "0 0 16px", color: "#0f766e" }}>
              اطلاعات اصلی رویداد
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <label style={fieldStyle}>
                عنوان رویداد
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle}>
                تاریخ برگزاری
                <PersianDatePicker value={date} onChange={setDate} />
              </label>

              <label style={fieldStyle}>
                ساعت
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle}>
                مدرس
                <input
                  value={teacher}
                  onChange={(event) => setTeacher(event.target.value)}
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle}>
                نوع رویداد
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  style={inputStyle}
                >
                  <option value="آموزشی">آموزشی</option>
                  <option value="جلسه">جلسه</option>
                  <option value="وبینار">وبینار</option>
                </select>
              </label>
            </div>
          </section>

          <section style={sectionStyle}>
            <h3 style={{ margin: "0 0 16px", color: "#0f766e" }}>
              تنظیمات دسترسی
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <label style={fieldStyle}>
                وضعیت
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  style={inputStyle}
                >
                  <option value="فعال">فعال</option>
                  <option value="غیرفعال">غیرفعال</option>
                </select>
              </label>

              <label style={fieldStyle}>
                سطح دسترسی اعضا
                <select
                  value={memberAccess}
                  onChange={(event) => setMemberAccess(event.target.value)}
                  style={inputStyle}
                >
                  <option value="participant">شرکت‌کننده</option>
                  <option value="manager">مدیر</option>
                </select>
              </label>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginTop: 16,
              }}
            >
              <input
                type="checkbox"
                checked={allowGuest}
                onChange={(event) => setAllowGuest(event.target.checked)}
              />
              اجازه ورود مهمان
            </label>

            {allowGuest && (
              <label style={{ ...fieldStyle, marginTop: 14 }}>
                کد ورود مهمان
                <input
                  value={guestCode}
                  onChange={(event) => setGuestCode(event.target.value)}
                  placeholder="اختیاری"
                  style={inputStyle}
                />
              </label>
            )}
          </section>

          <section style={sectionStyle}>
            <h3 style={{ margin: "0 0 16px", color: "#0f766e" }}>
              تنظیمات جلسه
            </h3>

            <label style={fieldStyle}>
              رمز اتاق
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  room
                    ? "برای حفظ رمز فعلی خالی بگذارید"
                    : "اختیاری"
                }
                autoComplete="new-password"
                style={inputStyle}
              />
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginTop: 16,
              }}
            >
              <input
                type="checkbox"
                checked={autoRecord}
                onChange={(event) => setAutoRecord(event.target.checked)}
              />
              ضبط خودکار جلسه
            </label>
            <small style={{ display: "block", marginTop: 8, color: "#b45309" }}>
              اجرای ضبط خودکار نیازمند سرویس ضبط سمت زیرساخت است.
            </small>
          </section>
        </div>

        <footer
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#fff",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "1px solid #cbd5e1",
              borderRadius: 9,
              background: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={submit}
            style={{
              padding: "10px 22px",
              border: 0,
              borderRadius: 9,
              background: "#009693",
              color: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {room ? "ذخیره تغییرات" : "ایجاد رویداد"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CreateRoomModal;