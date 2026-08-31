import "./Users.css";
import { isCurrentUserAdmin } from "../services/auth";

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
  mobile?: string;
  status?: string;
  className?: string;
  lastLogin?: string;
  createdAt?: string;
  online?: boolean;
};

function Users() {
  const isAdmin = isCurrentUserAdmin();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");

  const [users, setUsers] = useState<User[]>([]);

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  const [newPassword, setNewPassword] = useState("");

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: User
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
      user.mobile?.includes(search);

    const normalizedStatus =
      user.status === "active"
        ? "فعال"
        : user.status === "inactive"
        ? "غیرفعال"
        : user.status || "فعال";

    const matchStatus =
      statusFilter === "همه" ||
      normalizedStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) =>
      user.status === "فعال" ||
      user.status === "active" ||
      !user.status
  ).length;

  const inactiveUsers = users.filter(
    (user) =>
      user.status === "غیرفعال" ||
      user.status === "inactive"
  ).length;

  /*
    فعلاً آنلاین بودن را از فیلد online می‌خوانیم.
    اگر بک‌اند این فیلد را نداشته باشد، مقدار صفر نمایش داده می‌شود.
  */
  const onlineUsers = users.filter(
    (user) => user.online === true
  ).length;

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
      <CreateUserModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingUser(null);
        }}
        onCreate={handleCreateUser}
        editingUser={editingUser}
      />

      {/* Header */}

      <div className="users-page-header">
        <div>
          <h1 className="users-page-title">
            مدیریت کاربران
          </h1>

          <p className="users-page-subtitle">
            مدیریت کاربران، وضعیت حساب‌ها و دسترسی‌ها
          </p>
        </div>

        <div className="users-page-actions">
          <input
            className="users-search-input"
            type="text"
            placeholder="جستجوی کاربر..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="users-filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="همه">
              همه وضعیت‌ها
            </option>

            <option value="فعال">
              فعال
            </option>

            <option value="غیرفعال">
              غیرفعال
            </option>
          </select>

          {isAdmin && (
            <button
              className="users-create-btn"
              onClick={() => {
                setEditingUser(null);
                setOpen(true);
              }}
            >
              + افزودن کاربر
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}

      <div className="users-stats-grid">

        <div className="users-stat-card">
          <div className="users-stat-title">
            تعداد کل کاربران
          </div>

          <div className="users-stat-value total">
            {totalUsers}
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-title">
            کاربران آنلاین
          </div>

          <div className="users-stat-value online">
            {onlineUsers}
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-title">
            کاربران فعال
          </div>

          <div className="users-stat-value active">
            {activeUsers}
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-title">
            کاربران غیرفعال
          </div>

          <div className="users-stat-value inactive">
            {inactiveUsers}
          </div>
        </div>

      </div>

      {/* Users Table */}

      <div className="users-card">

        <div className="users-card-header">
          <div>
            <h3>لیست کاربران</h3>

            <span>
              {filteredUsers.length} کاربر
            </span>
          </div>
        </div>

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>نام کاربری</th>
                <th>شماره موبایل</th>
                <th>وضعیت</th>
                <th>آخرین ورود</th>
                {isAdmin && <th>عملیات</th>}
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => {

                const isActive =
                  user.status === "فعال" ||
                  user.status === "active" ||
                  !user.status;

                return (
                  <tr key={user.id}>

                    <td>
                      <div className="user-name">
                        {user.fullName || "-"}
                      </div>
                    </td>

                    <td>
                      <span className="username">
                        {user.username || "-"}
                      </span>
                    </td>

                    <td>
                      {user.mobile || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          isActive
                            ? "user-status active"
                            : "user-status inactive"
                        }
                      >
                        {isActive
                          ? "فعال"
                          : "غیرفعال"}
                      </span>
                    </td>

                    <td>
                      {user.lastLogin || "-"}
                    </td>

                    {isAdmin && <td className="user-action-cell">

                      <IconButton
                        className="user-action-button"
                        size="small"
                        onClick={(e) =>
                          handleMenuOpen(e, user)
                        }
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>

                    </td>}

                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="users-empty"
                  >
                    کاربری برای نمایش وجود ندارد.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Menu */}

      {isAdmin && <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >

        <MenuItem
          onClick={() => {
            if (!selectedUser) return;

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

            if (
              !window.confirm(
                "آیا از حذف این کاربر مطمئن هستید؟"
              )
            ) {
              handleMenuClose();
              return;
            }

            try {

              await deleteUser(
                selectedUser.id
              );

              alert(
                "کاربر با موفقیت حذف شد."
              );

              await fetchUsers();

              handleMenuClose();

            } catch (error) {

              console.error(
                "Delete Error:",
                error
              );

              alert(
                "حذف کاربر انجام نشد."
              );
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

      </Menu>}

      {/* Password Modal */}

      {passwordModalOpen && (

        <div className="password-modal-overlay">

          <div className="password-modal">

            <h3>
              تغییر رمز عبور
            </h3>

            <input
              type="password"
              placeholder="رمز عبور جدید"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <div className="password-modal-actions">

              <button
                className="password-cancel-btn"
                onClick={() => {
                  setPasswordModalOpen(false);
                  setNewPassword("");
                }}
              >
                انصراف
              </button>

              <button
                className="password-save-btn"
                onClick={async () => {

                  if (!selectedUser) {
                    alert(
                      "کاربری انتخاب نشده است."
                    );
                    return;
                  }

                  if (
                    newPassword.length < 6
                  ) {
                    alert(
                      "رمز عبور باید حداقل 6 کاراکتر باشد."
                    );
                    return;
                  }

                  try {

                    await changePassword(
                      selectedUser.id,
                      newPassword
                    );

                    alert(
                      "رمز عبور با موفقیت تغییر کرد."
                    );

                    setPasswordModalOpen(false);
                    setNewPassword("");
                    setSelectedUser(null);

                  } catch (error: any) {

                    console.error(error);

                    alert(
                      error.response?.data
                        ?.message ||
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
