import { useState } from "react";
import { api } from "../services/api";
import { type AuthUser, saveAuthSession } from "../services/auth";

type LoginProps = {
  onLogin: () => void;
};

type LoginResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      });

      saveAuthSession(response.data.token, response.data.user);
      onLogin();
    } catch (error: any) {
      alert(error.response?.data?.message || "ورود انجام نشد.");
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
          onChange={(event) => setUsername(event.target.value)}
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
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleLogin();
          }}
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
