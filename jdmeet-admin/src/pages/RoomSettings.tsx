import { useState } from "react";

function RoomSettings() {
  const [settings, setSettings] = useState({
    siteName: "سامانه جلسات آنلاین JDEIUT",
    jitsiUrl: "https://lg.jdeiut.ir",
    allowGuest: true,
    recording: false,
    defaultPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    alert("تنظیمات با موفقیت ذخیره شد.");
  };

  return (
    <>
      <h1
        style={{
          fontSize: 24,
          marginBottom: 25,
        }}
      >
        تنظیمات سامانه
      </h1>

      <div
        style={{
          background: "#fff",
          padding: 25,
          borderRadius: 12,
          maxWidth: 700,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label>نام سامانه</label>

          <input
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>آدرس سرور Jitsi</label>

          <input
            name="jitsiUrl"
            value={settings.jitsiUrl}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>رمز پیش‌فرض جلسات</label>

          <input
            name="defaultPassword"
            value={settings.defaultPassword}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>
            <input
              type="checkbox"
              name="allowGuest"
              checked={settings.allowGuest}
              onChange={handleChange}
            />{" "}
            اجازه ورود مهمان
          </label>
        </div>

        <div style={{ marginBottom: 25 }}>
          <label>
            <input
              type="checkbox"
              name="recording"
              checked={settings.recording}
              onChange={handleChange}
            />{" "}
            فعال بودن ضبط جلسات
          </label>
        </div>

        <button
          onClick={saveSettings}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ذخیره تنظیمات
        </button>
      </div>
    </>
  );
}

export default RoomSettings;