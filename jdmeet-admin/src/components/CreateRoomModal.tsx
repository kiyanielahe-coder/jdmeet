import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  room?: any;
  onClose: () => void;
  onCreate: (room: {
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
}) => void;
};

function CreateRoomModal({
  open,
  room,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("آموزشی");
  const [allowGuest, setAllowGuest] = useState(true);
const [password, setPassword] = useState("");
const [teacher, setTeacher] = useState("");
const [date, setDate] = useState("");
const [time, setTime] = useState("");
const [status, setStatus] = useState("فعال");

const [guestCode, setGuestCode] = useState("");

const [memberAccess, setMemberAccess] =
  useState("participant");

const [autoRecord, setAutoRecord] =
  useState(false);
useEffect(() => {
  if (room) {
    setTitle(room.title || "");
    setTeacher(room.teacher || "");
    setDate(room.date || "");
    setTime(room.time || "");
    setType(room.type || "آموزشی");
    setPassword(room.password || "");
    setAllowGuest(room.allowGuest ?? true);
    setStatus(room.status ?? "فعال");
setGuestCode(room.guestCode ?? "");
setMemberAccess(room.memberAccess ?? "participant");
setAutoRecord(room.autoRecord ?? false);
  }
}, [room]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 450,
          background: "white",
          borderRadius: 12,
          padding: 25,
        }}
      >
       <h2>{room ? "ویرایش رویداد" : "ایجاد رویداد جدید"}</h2>

        <input
          placeholder="نام اتاق"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 20,
            marginBottom: 15,
          }}
        />
        <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 15,
  }}
/>
<input
  type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 15,
  }}
/>
<input
  placeholder="نام مدرس"
  value={teacher}
  onChange={(e) => setTeacher(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 15,
  }}
/>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
          }}
        >
          <option>آموزشی</option>
          <option>جلسه</option>
          <option>وبینار</option>
        </select>
        <input
  placeholder="رمز اتاق (اختیاری)"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
  }}
/>

<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    cursor: "pointer",
  }}
>
  <input
    type="checkbox"
    checked={allowGuest}
    onChange={(e) => setAllowGuest(e.target.checked)}
  />

  اجازه ورود مهمان
</label>
<hr style={{ margin: "20px 0" }} />

<h3>تنظیمات رویداد</h3>

<div style={{ marginBottom: 15 }}>
  <label>وضعیت</label>

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    style={{ width: "100%", padding: 10 }}
  >
    <option value="فعال">فعال</option>
    <option value="غیرفعال">غیرفعال</option>
  </select>
</div>

<div style={{ marginBottom: 15 }}>
  <label>
    <input
      type="checkbox"
      checked={allowGuest}
      onChange={(e) => setAllowGuest(e.target.checked)}
    />
    {" "}امکان ورود مهمان
  </label>
</div>

<div style={{ marginBottom: 15 }}>
  <label>کد ورود مهمان (اختیاری)</label>

  <input
    value={guestCode}
    onChange={(e) => setGuestCode(e.target.value)}
    placeholder="در صورت نیاز کد وارد کنید"
    style={{ width: "100%", padding: 10 }}
  />
</div>

<div style={{ marginBottom: 15 }}>
  <label>سطح دسترسی اعضا</label>

  <select
    value={memberAccess}
    onChange={(e) => setMemberAccess(e.target.value)}
    style={{ width: "100%", padding: 10 }}
  >
    <option value="participant">شرکت کننده</option>
    <option value="manager">مدیر</option>
  </select>
</div>

<div style={{ marginBottom: 15 }}>
  <label>
    <input
      type="checkbox"
      checked={autoRecord}
      onChange={(e) => setAutoRecord(e.target.checked)}
    />
    {" "}ضبط خودکار جلسه
  </label>
</div>
        <div
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={onClose}>
            انصراف
          </button>

          <button
            onClick={() => {
             onCreate({
  title,
  teacher,
  date,
  time,
  type,
  password,
  allowGuest,

  status,
  guestCode,
  memberAccess,
  autoRecord,
});

              setTitle("");
setTeacher("");
setDate("");
setTime("");
setType("آموزشی");
setPassword("");
setAllowGuest(true);
setStatus("فعال");
setGuestCode("");
setMemberAccess("participant");
setAutoRecord(false);

              onClose();
            }}
          >
           {room ? "ذخیره تغییرات" : "ایجاد اتاق"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;