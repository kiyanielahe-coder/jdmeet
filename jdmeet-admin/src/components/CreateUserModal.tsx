import { useEffect, useState } from "react";

type User = {
  id?: number;
  fullName: string;
  username: string;
  password?: string;
  mobile?: string | null;
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: User) => void | Promise<void>;
  editingUser: User | null;
};

function CreateUserModal({
  open,
  onClose,
  onCreate,
  editingUser,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState("فعال");

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingUser) {
      const parts =
        editingUser.fullName
          ?.trim()
          .split(" ") || [];

      setFirstName(parts[0] || "");
      setLastName(
        parts.slice(1).join(" ") || ""
      );
      setUsername(
        editingUser.username || ""
      );
      setPassword("");
      setMobile(
        editingUser.mobile || ""
      );
      setStatus(
        editingUser.status || "فعال"
      );
    } else {
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setMobile("");
      setStatus("فعال");
      setShowAdvanced(false);
    }
  }, [open, editingUser]);

  if (!open) return null;

  async function handleSubmit() {
    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanUsername =
      username.trim();

    const cleanMobile =
      mobile.trim();

    if (!cleanFirstName) {
      alert("نام را وارد کنید.");
      return;
    }

    if (!cleanLastName) {
      alert("نام خانوادگی را وارد کنید.");
      return;
    }

    if (!cleanUsername) {
      alert("نام کاربری را وارد کنید.");
      return;
    }

    // هنگام ایجاد کاربر رمز عبور الزامی است
    if (!editingUser) {
      if (!password) {
        alert("رمز عبور را وارد کنید.");
        return;
      }

      if (password.length < 6) {
        alert(
          "رمز عبور باید حداقل ۶ کاراکتر باشد."
        );
        return;
      }
    }

    try {
      setSaving(true);

      await onCreate({
        ...(editingUser || {}),
        id: editingUser?.id,
        fullName:
          `${cleanFirstName} ${cleanLastName}`.trim(),
        username: cleanUsername,
        password: password || undefined,
        mobile:
          cleanMobile || null,
        status,
      });

      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setMobile("");
      setStatus("فعال");
      setShowAdvanced(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      dir="rtl"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15, 23, 42, 0.50)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 10000,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width:
            "min(500px, calc(100vw - 40px))",
          background: "#fff",
          borderRadius: 16,
          boxShadow:
            "0 25px 70px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}

        <div
          style={{
            padding: "20px 24px",
            borderBottom:
              "1px solid #e2e8f0",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 21,
                color: "#0f172a",
              }}
            >
              {editingUser
                ? "ویرایش کاربر"
                : "ایجاد کاربر جدید"}
            </h2>

            <div
              style={{
                marginTop: 5,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              {editingUser
                ? "ویرایش اطلاعات کاربر"
                : "ثبت کاربر جدید در سامانه"}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              border:
                "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div
          style={{
            padding: 24,
          }}
        >
          {/* نام */}

          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            نام *
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            placeholder="نام"
            style={{
              width: "100%",
              height: 42,
              boxSizing: "border-box",
              padding: "0 12px",
              border:
                "1px solid #cbd5e1",
              borderRadius: 8,
              marginBottom: 14,
              outline: "none",
            }}
          />

          {/* نام خانوادگی */}

          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            نام خانوادگی *
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            placeholder="نام خانوادگی"
            style={{
              width: "100%",
              height: 42,
              boxSizing: "border-box",
              padding: "0 12px",
              border:
                "1px solid #cbd5e1",
              borderRadius: 8,
              marginBottom: 14,
              outline: "none",
            }}
          />

          {/* نام کاربری */}

          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            نام کاربری *
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="نام کاربری"
            autoComplete="username"
            style={{
              width: "100%",
              height: 42,
              boxSizing: "border-box",
              padding: "0 12px",
              border:
                "1px solid #cbd5e1",
              borderRadius: 8,
              marginBottom: 14,
              outline: "none",
            }}
          />

          {/* رمز عبور */}

          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            {editingUser
              ? "رمز عبور جدید (اختیاری)"
              : "رمز عبور *"}
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder={
              editingUser
                ? "برای تغییر رمز وارد کنید"
                : "رمز عبور"
            }
            autoComplete={
              editingUser
                ? "new-password"
                : "new-password"
            }
            style={{
              width: "100%",
              height: 42,
              boxSizing: "border-box",
              padding: "0 12px",
              border:
                "1px solid #cbd5e1",
              borderRadius: 8,
              marginBottom: 16,
              outline: "none",
            }}
          />

          {/* Advanced */}

          <button
            type="button"
            onClick={() =>
              setShowAdvanced(
                !showAdvanced
              )
            }
            style={{
              width: "100%",
              border: "none",
              background:
                "#f8fafc",
              borderRadius: 8,
              padding: "11px 14px",
              textAlign: "right",
              color: "#007f7c",
              cursor: "pointer",
              fontWeight: 600,
              marginBottom: showAdvanced
                ? 12
                : 0,
            }}
          >
            {showAdvanced
              ? "− بستن گزینه‌های پیشرفته"
              : "⚙ گزینه‌های پیشرفته (اختیاری)"}
          </button>

          {showAdvanced && (
            <div
              style={{
                padding: 14,
                background: "#f8fafc",
                borderRadius: 10,
                border:
                  "1px solid #e2e8f0",
                marginBottom: 18,
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                شماره موبایل
                <span
                  style={{
                    color: "#94a3b8",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  (اختیاری)
                </span>
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value
                  )
                }
                placeholder="مثلاً 09123456789"
                style={{
                  width: "100%",
                  height: 42,
                  boxSizing:
                    "border-box",
                  padding: "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: 8,
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Status فقط هنگام ویرایش */}

          {editingUser && (
            <div
              style={{
                marginTop: 14,
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                وضعیت
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  height: 42,
                  padding:
                    "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <option value="فعال">
                  فعال
                </option>
                <option value="غیرفعال">
                  غیرفعال
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}

        <div
          style={{
            padding:
              "16px 24px",
            borderTop:
              "1px solid #e2e8f0",
            display: "flex",
            justifyContent:
              "flex-start",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              height: 40,
              padding:
                "0 20px",
              border:
                "1px solid #cbd5e1",
              borderRadius: 8,
              background: "#fff",
              color: "#334155",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            style={{
              height: 40,
              padding:
                "0 22px",
              border: "none",
              borderRadius: 8,
              background:
                saving
                  ? "#94a3b8"
                  : "#009693",
              color: "#fff",
              cursor:
                saving
                  ? "not-allowed"
                  : "pointer",
              fontWeight: 600,
            }}
          >
            {saving
              ? "در حال ذخیره..."
              : editingUser
              ? "ذخیره تغییرات"
              : "ایجاد کاربر"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;