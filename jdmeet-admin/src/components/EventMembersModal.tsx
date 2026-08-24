import { useEffect, useState } from "react";
import axios from "axios";

type Role = "manager" | "assistant" | "participant";

type Props = {
  open: boolean;
  room: any;
  onClose: () => void;
};

export default function EventMembersModal({
  open,
  room,
  onClose,
}: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [role, setRole] = useState<Role>("manager");

  const [selectedUser, setSelectedUser] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");

  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (!open || !room) return;

    setSearch("");
    setSelectedUser("");
    setShowResults(false);
    setShowCreateUser(false);

    loadData();
  }, [open, room]);

  async function loadData() {
    if (!room) return;

    try {
      setLoading(true);

      const [membersRes, usersRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/rooms/${room.id}/members`
        ),
        axios.get("http://localhost:5000/api/users"),
      ]);

      setMembers(membersRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error("خطا در دریافت اطلاعات اعضا:", err);
    } finally {
      setLoading(false);
    }
  }

  async function searchUsers(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      setShowResults(false);
      return;
    }

    try {
      setSearchLoading(true);
      setShowResults(true);

      const res = await axios.get(
        `http://localhost:5000/api/users?search=${encodeURIComponent(
          value.trim()
        )}`
      );

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("خطا در جستجوی کاربران:", err);
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function selectUser(user: any) {
    setSelectedUser(String(user.id));
    setSearch(user.fullName || "");
    setShowResults(false);
  }

  async function addMember() {
    if (!selectedUser || !room) {
      alert("ابتدا یک کاربر را انتخاب کنید.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/rooms/${room.id}/members`,
        {
          userId: selectedUser,
          role,
        }
      );

      setSelectedUser("");
      setSearch("");
      setShowResults(false);

      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "عضو اضافه نشد."
      );
    }
  }

  async function createUser() {
    if (!firstName.trim()) {
      alert("نام را وارد کنید.");
      return;
    }

    if (!lastName.trim()) {
      alert("نام خانوادگی را وارد کنید.");
      return;
    }

    if (!nationalCode.trim()) {
      alert("کد ملی را وارد کنید.");
      return;
    }

    try {
      setCreatingUser(true);

      const fullName =
        `${firstName.trim()} ${lastName.trim()}`;

      const res = await axios.post(
        "http://localhost:5000/api/users",
        {
          fullName,
          nationalCode: nationalCode.trim(),
          username: "",
          password: "",
          status: "فعال",
        }
      );

      const newUserId = res.data.id;

      setFirstName("");
      setLastName("");
      setNationalCode("");
      setShowCreateUser(false);

      await loadData();

      setSelectedUser(String(newUserId));
      setSearch(fullName);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "ایجاد کاربر انجام نشد."
      );
    } finally {
      setCreatingUser(false);
    }
  }

  async function removeMember(memberId: number) {
    if (!window.confirm("عضو حذف شود؟")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/event-members/${memberId}`
      );

      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "حذف عضو انجام نشد."
      );
    }
  }

  if (!open || !room) return null;

  const roleMembers = members.filter(
    (member: any) => member.role === role
  );

  return (
    <div
      dir="rtl"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.48)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 9999,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(900px, calc(100vw - 40px))",
          maxHeight: "calc(100vh - 40px)",
          background: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              اعضای رویداد
            </h2>

            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#64748b",
              }}
            >
              {room.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            style={{
              width: 38,
              height: 38,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              borderRadius: 9,
              fontSize: 24,
              lineHeight: 1,
              color: "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 24,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Role Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <button
              type="button"
              onClick={() => setRole("manager")}
              style={{
                padding: "13px 10px",
                borderRadius: 10,
                border:
                  role === "manager"
                    ? "2px solid #009693"
                    : "1px solid #e2e8f0",
                background:
                  role === "manager"
                    ? "#e8f7f6"
                    : "#ffffff",
                color:
                  role === "manager"
                    ? "#007f7c"
                    : "#334155",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              👑 مدیران
            </button>

            <button
              type="button"
              onClick={() => setRole("assistant")}
              style={{
                padding: "13px 10px",
                borderRadius: 10,
                border:
                  role === "assistant"
                    ? "2px solid #009693"
                    : "1px solid #e2e8f0",
                background:
                  role === "assistant"
                    ? "#e8f7f6"
                    : "#ffffff",
                color:
                  role === "assistant"
                    ? "#007f7c"
                    : "#334155",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              🟢 دستیاران
            </button>

            <button
              type="button"
              onClick={() => setRole("participant")}
              style={{
                padding: "13px 10px",
                borderRadius: 10,
                border:
                  role === "participant"
                    ? "2px solid #009693"
                    : "1px solid #e2e8f0",
                background:
                  role === "participant"
                    ? "#e8f7f6"
                    : "#ffffff",
                color:
                  role === "participant"
                    ? "#007f7c"
                    : "#334155",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              👤 شرکت‌کنندگان
            </button>
          </div>

          {/* Add Member */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 18,
              background: "#f8fafc",
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                افزودن عضو جدید
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateUser(!showCreateUser)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#009693",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                + افزودن کاربر جدید
              </button>
            </div>

            {/* Search */}
            <div
              style={{
                position: "relative",
                marginBottom: 12,
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  searchUsers(event.target.value)
                }
                onFocus={() => {
                  if (search.trim()) {
                    setShowResults(true);
                  }
                }}
                placeholder="جستجوی نام، نام خانوادگی یا کد ملی..."
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 9,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {showResults && (
                <div
                  style={{
                    position: "absolute",
                    top: 48,
                    right: 0,
                    left: 0,
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 9,
                    boxShadow:
                      "0 10px 25px rgba(15,23,42,.12)",
                    zIndex: 20,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  {searchLoading ? (
                    <div
                      style={{
                        padding: 16,
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: 13,
                      }}
                    >
                      در حال جستجو...
                    </div>
                  ) : users.length === 0 ? (
                    <div
                      style={{
                        padding: 16,
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: 13,
                      }}
                    >
                      کاربری پیدا نشد.
                    </div>
                  ) : (
                    users.map((user: any) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => selectUser(user)}
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom:
                            "1px solid #f1f5f9",
                          background: "#ffffff",
                          padding: "12px 14px",
                          cursor: "pointer",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#1e293b",
                            fontSize: 14,
                          }}
                        >
                          {user.fullName}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            color: "#64748b",
                            fontSize: 12,
                          }}
                        >
                          کد ملی:{" "}
                          {user.nationalCode || "-"}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Create User */}
            {showCreateUser && (
              <div
                style={{
                  marginTop: 14,
                  padding: 16,
                  background: "#ffffff",
                  border: "1px solid #dbe4e8",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 12,
                    fontSize: 14,
                  }}
                >
                  افزودن کاربر جدید
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  <input
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    placeholder="نام"
                    style={{
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      fontSize: 13,
                    }}
                  />

                  <input
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    placeholder="نام خانوادگی"
                    style={{
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      fontSize: 13,
                    }}
                  />

                  <input
                    value={nationalCode}
                    onChange={(event) =>
                      setNationalCode(
                        event.target.value
                      )
                    }
                    placeholder="کد ملی"
                    inputMode="numeric"
                    style={{
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      fontSize: 13,
                      gridColumn: "1 / -1",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateUser(false)
                    }
                    style={{
                      height: 40,
                      padding: "0 18px",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: 8,
                      background: "#ffffff",
                      color: "#475569",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    انصراف
                  </button>

                  <button
                    type="button"
                    onClick={createUser}
                    disabled={creatingUser}
                    style={{
                      height: 40,
                      padding: "0 18px",
                      border: "none",
                      borderRadius: 8,
                      background: "#009693",
                      color: "#ffffff",
                      cursor: creatingUser
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: 600,
                      opacity: creatingUser ? 0.7 : 1,
                    }}
                  >
                    {creatingUser
                      ? "در حال ایجاد..."
                      : "ایجاد کاربر"}
                  </button>
                </div>
              </div>
            )}

            {/* Selected user + add */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 9,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  color: selectedUser
                    ? "#334155"
                    : "#94a3b8",
                  fontSize: 14,
                }}
              >
                {selectedUser
                  ? search
                  : "کاربری انتخاب نشده است"}
              </div>

              <button
                type="button"
                onClick={addMember}
                style={{
                  height: 44,
                  padding: "0 22px",
                  border: "none",
                  borderRadius: 9,
                  background: "#009693",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                + افزودن عضو
              </button>
            </div>
          </div>

          {/* Members title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              اعضای فعال ({roleMembers.length} نفر)
            </div>
          </div>

          {/* Members table */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "right",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#eef8f7",
                    color: "#334155",
                  }}
                >
                  <th
                    style={{
                      padding: 13,
                      fontWeight: 700,
                    }}
                  >
                    نام کاربر
                  </th>

                  <th
                    style={{
                      padding: 13,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    نقش
                  </th>

                  <th
                    style={{
                      padding: 13,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      در حال دریافت اطلاعات...
                    </td>
                  </tr>
                ) : roleMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      عضوی برای این نقش ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  roleMembers.map((member: any) => (
                    <tr
                      key={member.id}
                      style={{
                        borderTop:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <td
                        style={{
                          padding: 13,
                          color: "#1e293b",
                          fontWeight: 500,
                        }}
                      >
                        {member.fullName ||
                          member.userName ||
                          member.name ||
                          "کاربر"}
                      </td>

                      <td
                        style={{
                          padding: 13,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 13px",
                            borderRadius: 20,
                            background: "#dcf5e9",
                            color: "#15803d",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {member.role === "manager"
                            ? "مدیر"
                            : member.role === "assistant"
                            ? "دستیار"
                            : "شرکت‌کننده"}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: 13,
                          textAlign: "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            removeMember(member.id)
                          }
                          style={{
                            padding: "7px 16px",
                            border:
                              "1px solid #fecaca",
                            borderRadius: 7,
                            background: "#fff1f2",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "flex-start",
            flexShrink: 0,
            background: "#ffffff",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              border: "1px solid #cbd5e1",
              borderRadius: 9,
              background: "#ffffff",
              color: "#334155",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}