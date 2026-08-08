import { useEffect, useState } from "react";

type User = {
  id?: number;
  fullName: string;
  nationalCode?: string;
  username: string;
  password: string;
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
  editingUser: User | null;
};

function CreateUserModal({
  open,
  onClose,
  onCreate,
  editingUser,

}: Props) {  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [nationalCode, setNationalCode] = useState("");
const [status, setStatus] = useState("فعال");
  useEffect(() => {
  if (!editingUser) return;
  setUsername(editingUser.username);
  setPassword(editingUser.password);
  setNationalCode(editingUser.nationalCode || "");
setStatus(editingUser.status || "فعال");
  setFirstName(editingUser.fullName.split(" ")[0] || "");
setLastName(editingUser.fullName.split(" ").slice(1).join(" ") || "");
}, [editingUser]);

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
          background: "#fff",
          borderRadius: 12,
          padding: 25,
        }}
      >
<h2>{editingUser ? "ویرایش کاربر" : "ایجاد کاربر"}</h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginTop: 20,
    marginBottom: 15,
  }}
>
  <input
    placeholder="نام"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    style={{
      width: "100%",
      padding: 10,
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  />

  <input
    placeholder="نام خانوادگی"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    style={{
      width: "100%",
      padding: 10,
      borderRadius: 8,
      border: "1px solid #d1d5db",
    }}
  />
</div>

<input
  placeholder="کد ملی"
  value={nationalCode}
  onChange={(e) => setNationalCode(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  }}
/>

              <input
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 15 }}
        />

        {!editingUser && (
  <input
    type="password"
    placeholder="رمز عبور"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: "100%",
      padding: 10,
      marginTop: 10,
    }}
  />
)}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={onClose}>
            انصراف
          </button>

          <button
  onClick={async () => {
              console.log("Save Click");
  console.log("Create Button Clicked");
  if (!firstName.trim() || !lastName.trim()) {
  alert("نام و نام خانوادگی را وارد کنید.");
  return;
}

if (!/^\d{10}$/.test(nationalCode)) {
  alert("کد ملی باید دقیقا 10 رقم و فقط شامل عدد باشد.");
  return;
}

if (!username.trim()) {
  alert("نام کاربری را وارد کنید.");
  return;
}

if (!editingUser) {
  if (!password.trim()) {
    alert("رمز عبور را وارد کنید.");
    return;
  }

  if (password.length < 6) {
    alert("رمز عبور باید حداقل 6 کاراکتر باشد.");
    return;
  }
}

if (editingUser) {
  await onCreate({
    ...editingUser,
    fullName: `${firstName} ${lastName}`,
    nationalCode,
    username,
    password,
    status,
  });
} else {
  await onCreate({
    fullName: `${firstName} ${lastName}`,
    nationalCode,
    username,
    password,
    status,
  } as User);
}
              setUsername("");
              setPassword("");
              setFirstName("");
              setLastName("");
              setNationalCode("");
              setStatus("فعال");
              onClose();
            }}
          >
{editingUser ? "ذخیره تغییرات" : "ایجاد کاربر"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;