import "./Users.css";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  changePassword,
} from "../services/userService";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import CreateUserModal from "../components/CreateUserModal";

type User = {
  id: number;
  fullName: string;
  username: string;
  password: string;
  nationalCode?: string;
  status?: string;
  className?: string;
  lastLogin?: string;
  createdAt?: string;
};

function Users() {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("همه");
  const [users, setUsers] = useState<User[]>([]);
const [userToDelete, setUserToDelete] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [selectedUser, setSelectedUser] = useState<any>(null);
const [passwordModalOpen, setPasswordModalOpen] = useState(false);
const [newPassword, setNewPassword] = useState("");
const handleMenuOpen = (
  event: React.MouseEvent<HTMLElement>,
  user: any
) => {
  setAnchorEl(event.currentTarget);
  setSelectedUser(user);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("خطا در دریافت کاربران", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
  const keyword = search.toLowerCase();

  const matchSearch =
    user.fullName?.toLowerCase().includes(keyword) ||
    user.username?.toLowerCase().includes(keyword) ||
    user.nationalCode?.includes(search) ||
    user.status?.toLowerCase().includes(keyword);

  const matchStatus =
    statusFilter === "همه" ||
    (user.status ?? "فعال") === statusFilter;

return matchSearch && matchStatus;});
    const handleCreateUser = async (user: any) => {
  try {
    if (editingUser) {
      await updateUser(editingUser.id, user);
    } else {
      await createUser(user);
    }
await fetchUsers();

setEditingUser(null);
setOpen(false);
  } catch (error: any) {
  console.error(error);

  alert(
    error.response?.data?.message ||
    "خطا در ایجاد یا ویرایش کاربر."
  );
}
};

  return (
    <>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        مدیریت کاربران
      </h1>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <div
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
  }}
>
  <input
    type="text"
    placeholder="جستجوی کاربران..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: 280,
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  >
    <option value="همه">همه وضعیت‌ها</option>
    <option value="فعال">فعال</option>
    <option value="غیرفعال">غیرفعال</option>
  </select>
</div>

  <button
    onClick={() => {
      setEditingUser(null);
      setOpen(true);
    }}
    style={{
      background: "#009693",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    + افزودن کاربر
  </button>
</div>

      <CreateUserModal
  open={open}
  onClose={() => {
    setOpen(false);
    setEditingUser(null);
  }}
  onCreate={handleCreateUser}
  editingUser={editingUser}
/>
<div
  style={{
    display: "flex",
    gap: 20,
    marginBottom: 20,
  }}
>
  <div
    style={{
      flex: 1,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    }}
  >
    <div style={{ color: "#64748b", fontSize: 14 }}>
      تعداد کاربران
    </div>

    <div
      style={{
        fontSize: 30,
        fontWeight: "bold",
        color: "#2563eb",
      }}
    >
      {users.length}
    </div>
  </div>

  <div
    style={{
      flex: 1,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    }}
  >
    <div style={{ color: "#64748b", fontSize: 14 }}>
      کاربران فعال
    </div>

    <div
      style={{
        fontSize: 30,
        fontWeight: 600,
        color: "#16a34a",
      }}
    >
      {
        users.filter(
          (u) => (u.status ?? "فعال") === "فعال"
        ).length
      }
    </div>
  </div>

  <div
    style={{
      flex: 1,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    }}
  >
    <div style={{ color: "#64748b", fontSize: 14 }}>
      کاربران غیرفعال
    </div>

    <div
      style={{
        fontSize: 30,
        fontWeight: 600,
        color: "#dc2626",
      }}
    >
      {
        users.filter(
          (u) => (u.status ?? "فعال") !== "فعال"
        ).length
      }
    </div>
  </div>
</div>
     <div className="users-card">
  <div className="users-card">
  <table className="users-table">
    <thead>
      <tr>
        <th>نام و نام خانوادگی</th>
        <th>کد ملی</th>
        <th>نام کاربری</th>
        <th>وضعیت</th>
        <th>عملیات</th>
      </tr>
    </thead>

    <tbody>
      {filteredUsers.map((user) => (
        <tr key={user.id}>
          <td>{user.fullName}</td>

          <td>{user.nationalCode}</td>

          <td>{user.username}</td>

          <td>
            <span
              className={`status ${
                user.status === "active" || user.status === "فعال"
                  ? "active"
                  : "inactive"
              }`}
            >
              {user.status === "active"
                ? "فعال"
                : user.status === "inactive"
                ? "غیرفعال"
                : user.status}
            </span>
          </td>

          <td className="center">
            <IconButton onClick={(e) => handleMenuOpen(e, user)}>
              <MoreVertIcon />
            </IconButton>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>

<div>
  تعداد کاربران: {filteredUsers.length}
</div>
      <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={() => {
      setEditingUser(selectedUser);
      setOpen(true);
      handleMenuClose();
    }}
  >
    ویرایش
  </MenuItem>

  <MenuItem
    onClick={async () => {
      if (!selectedUser) return;

      console.log("Selected User:", selectedUser);
      console.log("User ID:", selectedUser.id);

      if (!window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
        handleMenuClose();
        return;
      }

      try {
        await deleteUser(selectedUser.id);

        alert("کاربر با موفقیت حذف شد.");

        await fetchUsers();

        handleMenuClose();
      } catch (error) {
        console.error("Delete Error:", error);
        alert("حذف کاربر انجام نشد.");
      }
    }}
  >
    حذف
  </MenuItem>

  <MenuItem
  onClick={() => {
    setPasswordModalOpen(true);
    setNewPassword("");
    handleMenuClose();
  }}
>
  تغییر رمز عبور
</MenuItem>
</Menu>
{passwordModalOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 400,
        background: "#fff",
        borderRadius: 12,
        padding: 25,
      }}
    >
      <h3>تغییر رمز عبور</h3>

      <input
        type="password"
        placeholder="رمز عبور جدید"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
  onClick={async () => {
    if (!selectedUser) {
      alert("کاربری انتخاب نشده است.");
      return;
    }

    if (newPassword.length < 6) {
      alert("رمز عبور باید حداقل 6 کاراکتر باشد.");
      return;
    }

    try {
      await changePassword(selectedUser.id, newPassword);

      alert("رمز عبور با موفقیت تغییر کرد.");

      setPasswordModalOpen(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "تغییر رمز عبور انجام نشد."
      );
    }
  }}
>
  ذخیره
</button>
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default Users;
  