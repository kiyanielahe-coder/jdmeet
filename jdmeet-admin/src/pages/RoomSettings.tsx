function RoomSettings() {
  return (
    <>
      <h1>تنظیمات اتاق</h1>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <h3>Family 1A</h3>

        <p>رمز جلسه: ********</p>

        <p>ورود مهمان: فعال</p>

        <p>ضبط جلسه: غیرفعال</p>

        <p>نوع جلسه: آموزشی</p>

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          ذخیره تغییرات
        </button>
      </div>
    </>
  );
}

export default RoomSettings;