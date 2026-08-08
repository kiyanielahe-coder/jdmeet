import { useState } from "react";
import axios from "axios";
type LoginProps = {
  onLogin: () => void;
};
function Login({ onLogin }: LoginProps) {
  
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/login",
      {
        username,
        password,
      }
    );

    if (response.data.success) {
      console.log(response.data.role);
  localStorage.setItem("role", response.data.role);
  onLogin();
}
  } catch (error) {
    alert("نام کاربری یا رمز عبور اشتباه است");
  }
};

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#1e293b",
          padding: 40,
          borderRadius: 16,
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>JDMeet</h1>

        <p>سامانه مدیریت کلاس آنلاین</p>

        <input
  placeholder="نام کاربری"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    marginTop: 25,
    borderRadius: 8,
  }}
/>

        <input
  type="password"
  placeholder="رمز عبور"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    marginTop: 15,
    borderRadius: 8,
  }}
/>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 25,
            borderRadius: 8,
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          ورود به پنل
        </button>
      </div>
    </div>
  );
}

export default Login;
