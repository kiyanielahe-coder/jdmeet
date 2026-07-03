type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
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
          style={{
            width: "100%",
            padding: 12,
            marginTop: 15,
            borderRadius: 8,
          }}
        />

        <button
          onClick={onLogin}
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
