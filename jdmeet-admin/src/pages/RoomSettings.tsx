import { useEffect, useState, type ChangeEvent } from "react";
import { api } from "../services/api";
import { isCurrentUserAdmin } from "../services/auth";

type MeetingSettings = {
  siteName: string;
  meetingDomain: string;
  allowGuest: boolean;
  autoRecord: boolean;
  startWithAudioMuted: boolean;
  startWithVideoMuted: boolean;
  hasDefaultMeetingCode: boolean;
  capabilities: {
    guestAccessEnforced: boolean;
    defaultMeetingCodeApplied: boolean;
    autoRecordSupported: boolean;
  };
};

const initialSettings: MeetingSettings = {
  siteName: "",
  meetingDomain: "",
  allowGuest: false,
  autoRecord: false,
  startWithAudioMuted: false,
  startWithVideoMuted: false,
  hasDefaultMeetingCode: false,
  capabilities: {
    guestAccessEnforced: false,
    defaultMeetingCodeApplied: false,
    autoRecordSupported: false,
  },
};

function RoomSettings() {
  const isAdmin = isCurrentUserAdmin();
  const [settings, setSettings] = useState(initialSettings);
  const [defaultMeetingCode, setDefaultMeetingCode] = useState("");
  const [clearDefaultMeetingCode, setClearDefaultMeetingCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await api.get("/settings/meeting");
        setSettings(response.data.data);
      } catch {
        setError("دریافت تنظیمات Meeting ناموفق بود.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
  };

  const saveSettings = async () => {
    if (!isAdmin) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: Record<string, string | boolean> = {
        siteName: settings.siteName,
        meetingDomain: settings.meetingDomain,
        allowGuest: settings.allowGuest,
        autoRecord: settings.autoRecord,
        startWithAudioMuted: settings.startWithAudioMuted,
        startWithVideoMuted: settings.startWithVideoMuted,
        clearDefaultMeetingCode,
      };

      if (defaultMeetingCode.trim()) {
        payload.defaultMeetingCode = defaultMeetingCode.trim();
      }

      const response = await api.put("/settings/meeting", payload);
      setSettings(response.data.data);
      setDefaultMeetingCode("");
      setClearDefaultMeetingCode(false);
      setSuccess("تنظیمات با موفقیت ذخیره شد.");
    } catch {
      setError("ذخیره تنظیمات Meeting ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>در حال دریافت تنظیمات...</p>;

  return (
    <>
      <h1 style={{ fontSize: 24, marginBottom: 25 }}>تنظیمات سامانه</h1>

      <div
        style={{
          background: "#fff",
          padding: 25,
          borderRadius: 12,
          maxWidth: 700,
        }}
      >
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        {success && <p style={{ color: "#16a34a" }}>{success}</p>}
        {!isAdmin && (
          <p style={{ color: "#64748b" }}>
            تنظیمات برای حساب شما فقط خواندنی است.
          </p>
        )}

        <div style={{ marginBottom: 20 }}>
          <label>نام سامانه</label>
          <input
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            disabled={!isAdmin}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>دامنه یا Base URL زیرساخت Meeting</label>
          <input
            name="meetingDomain"
            value={settings.meetingDomain}
            onChange={handleChange}
            disabled={!isAdmin}
            placeholder="meet.example.com"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>کد پیش‌فرض جلسات</label>
          <input
            type="password"
            value={defaultMeetingCode}
            onChange={(event) => {
              setDefaultMeetingCode(event.target.value);
              setClearDefaultMeetingCode(false);
            }}
            disabled={!isAdmin}
            placeholder={
              settings.hasDefaultMeetingCode
                ? "کد ذخیره شده است؛ برای جایگزینی مقدار جدید وارد کنید"
                : "اختیاری"
            }
            autoComplete="new-password"
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
          {isAdmin && settings.hasDefaultMeetingCode && (
            <label style={{ display: "block", marginTop: 8 }}>
              <input
                type="checkbox"
                checked={clearDefaultMeetingCode}
                onChange={(event) => {
                  setClearDefaultMeetingCode(event.target.checked);
                  if (event.target.checked) setDefaultMeetingCode("");
                }}
              />{" "}
              حذف کد ذخیره‌شده
            </label>
          )}
          <small style={{ color: "#b45309" }}>
            کد ذخیره‌شده به Frontend بازگردانده نمی‌شود و اعمال آن نیازمند
            پیکربندی احراز هویت زیرساخت Meeting است.
          </small>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>
            <input
              type="checkbox"
              name="allowGuest"
              checked={settings.allowGuest}
              onChange={handleChange}
              disabled={!isAdmin}
            />{" "}
            اجازه ورود مهمان (سیاست موردنظر)
          </label>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>
            <input
              type="checkbox"
              name="startWithAudioMuted"
              checked={settings.startWithAudioMuted}
              onChange={handleChange}
              disabled={!isAdmin}
            />{" "}
            شروع جلسه با صدای بسته
          </label>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>
            <input
              type="checkbox"
              name="startWithVideoMuted"
              checked={settings.startWithVideoMuted}
              onChange={handleChange}
              disabled={!isAdmin}
            />{" "}
            شروع جلسه با تصویر بسته
          </label>
        </div>

        <div style={{ marginBottom: 25 }}>
          <label>
            <input
              type="checkbox"
              name="autoRecord"
              checked={settings.autoRecord}
              onChange={handleChange}
              disabled={!isAdmin}
            />{" "}
            ضبط خودکار (سیاست موردنظر)
          </label>
          <small style={{ display: "block", color: "#b45309", marginTop: 6 }}>
            اعمال ضبط خودکار نیازمند Jibri یا سرویس ضبط سمت زیرساخت است و در
            این نسخه فعال نمی‌شود.
          </small>
        </div>

        {isAdmin && (
          <button
            onClick={saveSettings}
            disabled={saving}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: 8,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        )}
      </div>
    </>
  );
}

export default RoomSettings;