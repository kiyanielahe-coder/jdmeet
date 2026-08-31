import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { isCurrentUserAdmin } from "../services/auth";

const EVENT_MEMBER_ROLES = [
  { value: "manager", label: "مدیر" },
  { value: "presenter", label: "ارائه‌کننده" },
  { value: "participant", label: "شرکت‌کننده" },
] as const;

type MemberRole = (typeof EVENT_MEMBER_ROLES)[number]["value"];

type Room = {
  id: number;
  title: string;
  teacher: string;
  date: string;
  time: string;
  status: string;
};

type Member = {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  mobile?: string | null;
  role: MemberRole;
};

type User = {
  id: number;
  fullName: string;
  username: string;
  mobile?: string | null;
};

function roleLabel(role: MemberRole) {
  return (
    EVENT_MEMBER_ROLES.find((item) => item.value === role)?.label || role
  );
}

function EventMembers() {
  const { id } = useParams();
  const roomId = Number(id);
  const isAdmin = isCurrentUserAdmin();

  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] =
    useState<MemberRole>("participant");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!Number.isInteger(roomId) || roomId <= 0) {
      setError("شناسه رویداد معتبر نیست.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [roomResponse, membersResponse] = await Promise.all([
        api.get(`/rooms/${roomId}`),
        api.get(`/rooms/${roomId}/members`),
      ]);

      setRoom(roomResponse.data.data);
      setMembers(membersResponse.data.data || []);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "دریافت اطلاعات اعضای رویداد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const searchUsers = async () => {
    const query = search.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError("");
      const response = await api.get("/users", {
        params: { search: query },
      });
      setSearchResults(response.data.data || []);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "جست‌وجوی کاربران انجام نشد."
      );
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addMember = async () => {
    if (!selectedUserId) {
      setError("ابتدا یک کاربر را انتخاب کنید.");
      return;
    }

    if (members.some((member) => member.userId === selectedUserId)) {
      setError("این کاربر قبلاً عضو رویداد است.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await api.post(`/rooms/${roomId}/members`, {
        userId: selectedUserId,
        role: selectedRole,
      });
      setSuccess("عضو با موفقیت به رویداد اضافه شد.");
      setSearch("");
      setSearchResults([]);
      setSelectedUserId(null);
      await loadData();
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "افزودن عضو انجام نشد."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (member: Member) => {
    if (!window.confirm(`${member.fullName} از رویداد حذف شود؟`)) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/rooms/${roomId}/members/${member.id}`);
      setSuccess("عضو با موفقیت از رویداد حذف شد.");
      await loadData();
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "حذف عضو انجام نشد."
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        در حال دریافت اعضای رویداد...
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <p style={{ color: "#dc2626" }}>{error || "رویداد پیدا نشد."}</p>
        <button type="button" onClick={loadData}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 25 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 8,
          }}
        >
          اعضای رویداد
        </h1>
        <div style={{ color: "#64748b" }}>
          {room.title} — {room.teacher || "بدون مدرس"} — {room.date || "-"}{" "}
          {room.time || ""}
        </div>
        {!isAdmin && (
          <div style={{ color: "#64748b", marginTop: 8 }}>
            دسترسی شما فقط برای مشاهده اعضای رویداد است.
          </div>
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

      {isAdmin && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#009693" }}>افزودن عضو</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchUsers();
              }}
              placeholder="جست‌وجوی نام یا نام کاربری..."
              style={{
                flex: "1 1 280px",
                padding: 11,
                border: "1px solid #cbd5e1",
                borderRadius: 8,
              }}
            />
            <button type="button" onClick={searchUsers} disabled={searching}>
              {searching ? "در حال جست‌وجو..." : "جست‌وجو"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                marginTop: 12,
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {searchResults.map((user) => {
                const existing = members.some(
                  (member) => member.userId === user.id
                );

                return (
                  <button
                    type="button"
                    key={user.id}
                    disabled={existing}
                    onClick={() => setSelectedUserId(user.id)}
                    style={{
                      width: "100%",
                      padding: 12,
                      textAlign: "right",
                      border: "none",
                      borderBottom: "1px solid #f1f5f9",
                      background:
                        selectedUserId === user.id ? "#e8f7f6" : "#fff",
                      cursor: existing ? "not-allowed" : "pointer",
                      opacity: existing ? 0.55 : 1,
                    }}
                  >
                    <strong>{user.fullName || user.username}</strong>
                    <span style={{ marginRight: 10, color: "#64748b" }}>
                      {user.username}
                    </span>
                    {existing && (
                      <span style={{ marginRight: 10, color: "#b45309" }}>
                        قبلاً عضو است
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as MemberRole)
              }
              style={{
                padding: 10,
                border: "1px solid #cbd5e1",
                borderRadius: 8,
              }}
            >
              {EVENT_MEMBER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={addMember}
              disabled={!selectedUserId || saving}
              style={{
                background: "#009693",
                color: "#fff",
                border: "none",
                padding: "11px 20px",
                borderRadius: 8,
                cursor:
                  !selectedUserId || saving ? "not-allowed" : "pointer",
                opacity: !selectedUserId || saving ? 0.6 : 1,
              }}
            >
              {saving ? "در حال افزودن..." : "افزودن عضو"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 15px rgba(15,23,42,.06)",
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#009693" }}>
          فهرست اعضا ({members.length})
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: 12, textAlign: "right" }}>نام</th>
              <th style={{ padding: 12 }}>نام کاربری</th>
              <th style={{ padding: 12 }}>موبایل</th>
              <th style={{ padding: 12 }}>نقش</th>
              {isAdmin && <th style={{ padding: 12 }}>عملیات</th>}
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td style={{ padding: 12 }}>{member.fullName}</td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {member.username || "-"}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {member.mobile || "-"}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {roleLabel(member.role)}
                </td>
                {isAdmin && (
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => removeMember(member)}
                      style={{
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#dc2626",
                        borderRadius: 7,
                        padding: "6px 14px",
                        cursor: "pointer",
                      }}
                    >
                      حذف
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  style={{
                    padding: 35,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  هنوز عضوی برای این رویداد ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EventMembers;
