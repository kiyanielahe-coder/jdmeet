import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  open: boolean;
  room: any;
  onClose: () => void;
};

type Role = "manager" | "assistant" | "participant";

export default function EventMembersModal({
  open,
  room,
  onClose,
}: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState<Role>("manager");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !room) return;

    loadData();
  }, [open, room]);

  async function loadData() {
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

  async function addMember() {
    if (!selectedUser) {
      alert("یک کاربر انتخاب کنید.");
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
      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "عضو اضافه نشد."
      );
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

  if (!open) return null;

  const roleLabel = (memberRole: string) => {
    if (memberRole === "manager") return "مدیر";
    if (memberRole === "assistant") return "دستیار";
    return "شرکت‌کننده";
  };

  return (
    <div
      dir="rtl"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          padding: 28,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 18,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              اعضای رویداد
            </h2>

            <div
              style={{
                marginTop: 6,
                color: "#64748b",
                fontSize: 14,
              }}
            >
              {room?.title || "رویداد"}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              border: "none",
              borderRadius: 10,
              background: "#f1f5f9",
              color: "#475569",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        {/* Role Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 22,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("manager")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
              background:
                role === "manager"
                  ? "#009693"
                  : "#f1f5f9",
              color:
                role === "manager"
                  ? "#fff"
                  : "#334155",
              fontWeight: 600,
            }}
          >
            👑 مدیران
          </button>

          <button
            type="button"
            onClick={() => setRole("assistant")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
              background:
                role === "assistant"
                  ? "#009693"
                  : "#f1f5f9",
              color:
                role === "assistant"
                  ? "#fff"
                  : "#334155",
              fontWeight: 600,
            }}
          >
            🟢 دستیاران
          </button>

          <button
            type="button"
            onClick={() => setRole("participant")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
              background:
                role === "participant"
                  ? "#009693"
                  : "#f1f5f9",
              color:
                role === "participant"
                  ? "#fff"
                  : "#334155",
              fontWeight: 600,
            }}
          >
            👤 شرکت‌کنندگان
          </button>
        </div>

        {/* Add Member */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 18,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 12,
            }}
          >
            افزودن عضو جدید
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(e.target.value)
              }
              style={{
                flex: 1,
                minWidth: 250,
                padding: "11px 12px",
                borderRadius: 9,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#334155",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="">
                انتخاب کاربر
              </option>

              {users.map((user: any) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.fullName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={addMember}
              style={{
                padding: "11px 22px",
                background: "#009693",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              + افزودن عضو
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                color: "#334155",
              }}
            >
              اعضای فعلی
            </h3>

            <span
              style={{
                background: "#e2f5f4",
                color: "#007d7a",
                borderRadius: 20,
                padding: "5px 12px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {members.length} نفر
            </span>
          </div>

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
                    background: "#f8fafc",
                    color: "#475569",
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
                    }}
                  >
                    نقش
                  </th>

                  <th
                    style={{
                      padding: 13,
                      fontWeight: 700,
                      width: 110,
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
                        padding: 30,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      در حال دریافت اطلاعات...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: 30,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      هنوز عضوی برای این رویداد ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  members.map((member: any) => (
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
                          color: "#334155",
                        }}
                      >
                        {member.fullName ||
                          member.userName ||
                          "کاربر"}
                      </td>

                      <td
                        style={{
                          padding: 13,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 10px",
                            borderRadius: 20,
                            background: "#f1f5f9",
                            color: "#475569",
                            fontSize: 13,
                          }}
                        >
                          {roleLabel(member.role)}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: 13,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            removeMember(member.id)
                          }
                          style={{
                            border: "none",
                            borderRadius: 7,
                            padding: "6px 12px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontWeight: 600,
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
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              border: "1px solid #cbd5e1",
              borderRadius: 9,
              background: "#fff",
              color: "#475569",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}