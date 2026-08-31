import { useEffect, useState } from "react";
import { api } from "../services/api";

type Role = "manager" | "presenter" | "participant";

type Props = {
  open: boolean;
  room: any;
  onClose: () => void;
};

type User = {
  id: number;
  fullName: string;
  username: string;
  mobile?: string | null;
  status: string;
};

type Member = {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  mobile?: string | null;
  role: Role;
};

type NewUser = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  mobile: string;
};

const roleTitles: Record<Role, string> = {
  manager: "مدیران",
  presenter: "ارائه‌کنندگان",
  participant: "شرکت‌کنندگان",
};

const roleSingularTitles: Record<Role, string> = {
  manager: "مدیر",
  presenter: "ارائه‌کننده",
  participant: "شرکت‌کننده",
};

export default function EventMembersModal({
  open,
  room,
  onClose,
}: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [addingRole, setAddingRole] =
    useState<Role | null>(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] =
    useState<User[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [showNewUser, setShowNewUser] =
    useState(false);

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [creatingUser, setCreatingUser] =
    useState(false);

  const [newUser, setNewUser] =
    useState<NewUser>({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      mobile: "",
    });

  useEffect(() => {
    if (!open || !room) return;

    loadData();
  }, [open, room]);

  async function loadData() {
    if (!room) return;

    try {
      setLoading(true);

      const membersRes = await api.get(`/rooms/${room.id}/members`);

      setMembers(membersRes.data.data || []);
    } catch (error) {
      console.error(
        "خطا در دریافت اطلاعات اعضا:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function openAddMember(role: Role) {
    setAddingRole(role);
    setSearch("");
    setSearchResults([]);
    setSelectedUser(null);
  }

  function closeAddMember() {
    setAddingRole(null);
    setSearch("");
    setSearchResults([]);
    setSelectedUser(null);
  }

  async function handleSearch(value: string) {
    setSearch(value);
    setSelectedUser(null);

    const text = value.trim();

    if (!text) {
      setSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      console.log("SEARCH:", text);

      const response = await api.get(
        "/users",
        {
          params: {
            search: text,
          },
        }
      );

      console.log(
        "SEARCH RESULT:",
        response.data
      );

      setSearchResults(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "SEARCH ERROR:",
        error
      );

      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function getExistingMember(userId: number) {
    return members.find(
      (member) =>
        Number(member.userId) ===
        Number(userId)
    );
  }

  function selectUser(user: User) {
    setSelectedUser(user);
    setSearch(user.fullName);
    setSearchResults([]);
  }

  async function addMember() {
    if (!selectedUser || !addingRole) {
      alert("ابتدا یک کاربر را انتخاب کنید.");
      return;
    }

    const existing =
      getExistingMember(selectedUser.id);

    if (existing) {
      alert(
        `این کاربر قبلاً با نقش «${
          roleTitles[existing.role]
        }» عضو این رویداد است.`
      );
      return;
    }

    try {
      await api.post(
        `/rooms/${room.id}/members`,
        {
          userId: selectedUser.id,
          role: addingRole,
        }
      );

      closeAddMember();
      await loadData();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "افزودن عضو انجام نشد."
      );
    }
  }

  async function removeMember(
    memberId: number
  ) {
    if (
      !window.confirm(
        "این عضو از رویداد حذف شود؟"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/event-members/${memberId}`);

      await loadData();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "حذف عضو انجام نشد."
      );
    }
  }

  async function createUser() {
    const firstName =
      newUser.firstName.trim();

    const lastName =
      newUser.lastName.trim();

    const username =
      newUser.username.trim();

    const password =
      newUser.password;

    const mobile =
      newUser.mobile.trim();

    if (!firstName) {
      alert("نام را وارد کنید.");
      return;
    }

    if (!lastName) {
      alert("نام خانوادگی را وارد کنید.");
      return;
    }

    if (!username) {
      alert("نام کاربری را وارد کنید.");
      return;
    }

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

    try {
      setCreatingUser(true);

      await api.post(
        "/users",
        {
          firstName,
          lastName,
          username,
          password,
          mobile: mobile || null,
          status: "فعال",
        }
      );

      // دریافت مجدد کاربران از Backend
      await loadData();

      // پاک کردن وضعیت جستجو
      setSearch("");
      setSearchResults([]);
      setSelectedUser(null);

      // پاک کردن فرم
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        mobile: "",
      });

      setShowAdvanced(false);
      setShowNewUser(false);

      alert(
        "کاربر با موفقیت ایجاد شد. اکنون می‌توانید او را به یکی از بخش‌های رویداد اضافه کنید."
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "ایجاد کاربر انجام نشد."
      );
    } finally {
      setCreatingUser(false);
    }
  }

  function renderRoleSection(role: Role) {
    const roleMembers =
      members.filter(
        (member) => member.role === role
      );

    return (
      <section
        key={role}
        style={{
          marginBottom: 28,
        }}
      >
        {/* عنوان بخش */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            fontSize: 17,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          <span>
            {role === "manager" && "👑"}
            {role === "presenter" && "🎤"}
            {role === "participant" && "👤"}
          </span>

          <span>
            {roleTitles[role]}
          </span>

          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#64748b",
            }}
          >
            ({roleMembers.length} نفر)
          </span>
        </div>

        <div
  style={{
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    overflow: "visible",
    background: "#fff",
  }}
>
          {/* جدول اعضا */}

          {roleMembers.length === 0 ? (
            <div
              style={{
                padding: 18,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              هنوز عضوی در این بخش اضافه نشده است.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  <th
                    style={{
                      padding: 12,
                      textAlign: "right",
                      fontSize: 13,
                    }}
                  >
                    نام و نام خانوادگی
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    نام کاربری
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    شماره موبایل
                  </th>

                  <th
                    style={{
                      padding: 12,
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {roleMembers.map(
                  (member) => (
                    <tr
                      key={member.id}
                      style={{
                        borderTop:
                          "1px solid #f1f5f9",
                      }}
                    >
                      <td
                        style={{
                          padding: 12,
                          fontWeight: 600,
                        }}
                      >
                        {member.fullName}
                      </td>

                      <td
                        style={{
                          padding: 12,
                          textAlign:
                            "center",
                          color:
                            "#475569",
                        }}
                      >
                        {member.username ||
                          "-"}
                      </td>

                      <td
                        style={{
                          padding: 12,
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        {member.mobile ||
                          "-"}
                      </td>

                      <td
                        style={{
                          padding: 12,
                          textAlign:
                            "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            removeMember(
                              member.id
                            )
                          }
                          style={{
                            border:
                              "1px solid #fecaca",
                            background:
                              "#fff1f2",
                            color:
                              "#dc2626",
                            borderRadius: 7,
                            padding:
                              "6px 14px",
                            cursor:
                              "pointer",
                            fontWeight: 600,
                          }}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}

          {/* افزودن عضو */}

          <div
            style={{
              padding: 12,
              borderTop:
                "1px solid #f1f5f9",
            }}
          >
            {addingRole === role ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      position:
                        "relative",
                    }}
                  >
                    <input
                      value={search}
                      onChange={(e) =>
                        handleSearch(
                          e.target.value
                        )
                      }
                      placeholder="جستجوی نام، نام خانوادگی یا نام کاربری..."
                      autoFocus
                      style={{
                        width: "100%",
                        height: 40,
                        padding:
                          "0 12px",
                        border:
                          "1px solid #cbd5e1",
                        borderRadius: 8,
                        outline: "none",
                        boxSizing:
                          "border-box",
                      }}
                    />

                    {searching && (
                      <div
                        style={{
                          position:
                            "absolute",
                          top: 45,
                          right: 0,
                          left: 0,
                          background:
                            "#fff",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 12,
                          color:
                            "#64748b",
                          fontSize: 13,
                          zIndex: 30,
                        }}
                      >
                        در حال جستجو...
                      </div>
                    )}

                    {!searching &&
                      search &&
                      searchResults.length >
                        0 && (
                        <div
                          style={{
                            position:
                              "absolute",
                            top: 45,
                            right: 0,
                            left: 0,
                            background:
                              "#fff",
                            border:
                              "1px solid #e2e8f0",
                            borderRadius: 8,
                            boxShadow:
                              "0 10px 25px rgba(0,0,0,.10)",
                            zIndex: 30,
                            maxHeight:
                              230,
                            overflowY:
                              "auto",
                          }}
                        >
                          {searchResults.map(
                            (user) => {
                              const existing =
                                getExistingMember(
                                  user.id
                                );

                              const isSelected =
                                selectedUser?.id ===
                                user.id;

                              return (
                                <button
                                  type="button"
                                  key={
                                    user.id
                                  }
                                  onClick={() =>
                                    selectUser(
                                      user
                                    )
                                  }
                                  style={{
                                    width:
                                      "100%",
                                    display:
                                      "block",
                                    textAlign:
                                      "right",
                                    border:
                                      "none",
                                    borderBottom:
                                      "1px solid #f1f5f9",
                                    padding:
                                      "11px 12px",
                                    background:
                                      isSelected
                                        ? "#e8f7f6"
                                        : "#fff",
                                    cursor:
                                      "pointer",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight:
                                        600,
                                      color:
                                        "#1e293b",
                                    }}
                                  >
                                    {
                                      user.fullName
                                    }
                                  </div>

                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      flexWrap:
                                        "wrap",
                                      gap: 12,
                                      marginTop:
                                        4,
                                      fontSize:
                                        12,
                                      color:
                                        "#64748b",
                                    }}
                                  >
                                    <span>
                                      نام کاربری:{" "}
                                      {
                                        user.username
                                      }
                                    </span>

                                    {user.mobile && (
                                      <span>
                                        موبایل:{" "}
                                        {
                                          user.mobile
                                        }
                                      </span>
                                    )}
                                  </div>

                                  {existing && (
                                    <div
                                      style={{
                                        marginTop:
                                          5,
                                        fontSize:
                                          12,
                                        color:
                                          "#dc2626",
                                      }}
                                    >
                                      این کاربر قبلاً با نقش{" "}
                                      <strong>
                                        {
                                          roleTitles[
                                            existing
                                              .role
                                          ]
                                        }
                                      </strong>{" "}
                                      عضو این رویداد است.
                                    </div>
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}

                    {!searching &&
                      search &&
                      searchResults.length ===
                        0 && (
                        <div
                          style={{
                            position:
                              "absolute",
                            top: 45,
                            right: 0,
                            left: 0,
                            background:
                              "#fff",
                            border:
                              "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: 12,
                            color:
                              "#64748b",
                            fontSize:
                              13,
                            zIndex: 30,
                          }}
                        >
                          کاربری با این مشخصات پیدا نشد.
                        </div>
                      )}
                  </div>

                  <button
                    type="button"
                    onClick={addMember}
                    disabled={
                      !selectedUser
                    }
                    style={{
                      height: 40,
                      padding:
                        "0 18px",
                      border: "none",
                      borderRadius: 8,
                      background:
                        selectedUser
                          ? "#009693"
                          : "#cbd5e1",
                      color: "#fff",
                      cursor:
                        selectedUser
                          ? "pointer"
                          : "not-allowed",
                      fontWeight: 600,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    افزودن
                  </button>

                  <button
                    type="button"
                    onClick={
                      closeAddMember
                    }
                    style={{
                      height: 40,
                      padding:
                        "0 15px",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: 8,
                      background:
                        "#fff",
                      cursor:
                        "pointer",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    انصراف
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openAddMember(role)
                }
                style={{
                  width: "100%",
                  height: 40,
                  border:
                    "1px dashed #009693",
                  borderRadius: 8,
                  background:
                    "#f0fbfa",
                  color: "#007f7c",
                  cursor:
                    "pointer",
                  fontWeight: 600,
                }}
              >
                + افزودن{" "}
                {
                  roleSingularTitles[
                    role
                  ]
                }
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!open || !room) {
    return null;
  }

  return (
    <div
      dir="rtl"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,.50)",
        display: "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width:
            "min(950px, calc(100vw - 40px))",
          maxHeight:
            "calc(100vh - 40px)",
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 25px 70px rgba(0,0,0,.25)",
          display: "flex",
          flexDirection:
            "column",
        }}
      >
        {/* Header */}

        <div
          style={{
            padding:
              "20px 24px",
            borderBottom:
              "1px solid #e2e8f0",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 21,
                color:
                  "#0f172a",
              }}
            >
              اعضای رویداد
            </h2>

            <div
              style={{
                marginTop: 5,
                color:
                  "#64748b",
                fontSize: 14,
              }}
            >
              {room.title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems:
                "center",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowNewUser(
                  !showNewUser
                );
                setShowAdvanced(false);
              }}
              style={{
                height: 40,
                padding:
                  "0 16px",
                border: "none",
                borderRadius: 8,
                background:
                  "#009693",
                color: "#fff",
                cursor:
                  "pointer",
                fontWeight: 600,
              }}
            >
              + افزودن کاربر جدید
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: 38,
                height: 38,
                border:
                  "1px solid #e2e8f0",
                borderRadius: 8,
                background:
                  "#fff",
                fontSize: 23,
                cursor:
                  "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* New User */}

        {showNewUser && (
          <div
            style={{
              padding:
                "16px 24px",
              background:
                "#f8fafc",
              borderBottom:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  14,
              }}
            >
              <div
                style={{
                  fontWeight:
                    700,
                  color:
                    "#1e293b",
                }}
              >
                ایجاد کاربر جدید
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAdvanced(
                    !showAdvanced
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color:
                    "#009693",
                  cursor:
                    "pointer",
                  fontWeight:
                    600,
                  fontSize: 13,
                }}
              >
                {showAdvanced
                  ? "− بستن گزینه‌های پیشرفته"
                  : "⚙ گزینه‌های پیشرفته (اختیاری)"}
              </button>
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 10,
              }}
            >
              <input
                placeholder="نام"
                value={
                  newUser.firstName
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    firstName:
                      e.target.value,
                  })
                }
                style={{
                  height: 40,
                  padding:
                    "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    8,
                  outline:
                    "none",
                }}
              />

              <input
                placeholder="نام خانوادگی"
                value={
                  newUser.lastName
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    lastName:
                      e.target.value,
                  })
                }
                style={{
                  height: 40,
                  padding:
                    "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    8,
                  outline:
                    "none",
                }}
              />

              <input
                placeholder="نام کاربری"
                value={
                  newUser.username
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username:
                      e.target.value,
                  })
                }
                style={{
                  height: 40,
                  padding:
                    "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    8,
                  outline:
                    "none",
                }}
              />

              <input
                type="password"
                placeholder="رمز عبور"
                value={
                  newUser.password
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password:
                      e.target.value,
                  })
                }
                style={{
                  height: 40,
                  padding:
                    "0 12px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    8,
                  outline:
                    "none",
                }}
              />
            </div>

            {showAdvanced && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop:
                    12,
                  borderTop:
                    "1px solid #e2e8f0",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      6,
                    fontSize:
                      13,
                    color:
                      "#475569",
                    fontWeight:
                      600,
                  }}
                >
                  شماره موبایل
                  <span
                    style={{
                      fontWeight:
                        400,
                      color:
                        "#94a3b8",
                    }}
                  >
                    {" "}
                    (اختیاری)
                  </span>
                </label>

                <input
                  placeholder="مثلاً 09123456789"
                  value={
                    newUser.mobile
                  }
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      mobile:
                        e.target.value,
                    })
                  }
                  style={{
                    width:
                      "100%",
                    height: 40,
                    padding:
                      "0 12px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      8,
                    outline:
                      "none",
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>
            )}

            <div
              style={{
                marginTop: 12,
                display:
                  "flex",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={
                  createUser
                }
                disabled={
                  creatingUser
                }
                style={{
                  padding:
                    "8px 18px",
                  border:
                    "none",
                  borderRadius:
                    8,
                  background:
                    "#009693",
                  color:
                    "#fff",
                  cursor:
                    creatingUser
                      ? "not-allowed"
                      : "pointer",
                  fontWeight:
                    600,
                  opacity:
                    creatingUser
                      ? 0.7
                      : 1,
                }}
              >
                {creatingUser
                  ? "در حال ایجاد..."
                  : "ایجاد کاربر"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowNewUser(false);
                  setShowAdvanced(false);

                  setNewUser({
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    mobile: "",
                  });
                }}
                style={{
                  padding:
                    "8px 18px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    8,
                  background:
                    "#fff",
                  cursor:
                    "pointer",
                }}
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Body */}

        <div
          style={{
            padding: 24,
            overflowY:
              "auto",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 40,
                textAlign:
                  "center",
                color:
                  "#64748b",
              }}
            >
              در حال دریافت اعضای رویداد...
            </div>
          ) : (
            <>
              {renderRoleSection(
                "manager"
              )}

              {renderRoleSection(
                "presenter"
              )}

              {renderRoleSection(
                "participant"
              )}
            </>
          )}
        </div>

        {/* Footer */}

        <div
          style={{
            padding:
              "14px 24px",
            borderTop:
              "1px solid #e2e8f0",
            textAlign:
              "left",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding:
                "9px 22px",
              border:
                "1px solid #cbd5e1",
              borderRadius:
                8,
              background:
                "#fff",
              cursor:
                "pointer",
              fontWeight:
                600,
            }}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
