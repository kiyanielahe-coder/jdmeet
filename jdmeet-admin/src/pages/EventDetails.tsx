
function EventDetails() {

  return (
  <>
    <h1
      style={{
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 25,
        color: "#1e293b",
      }}
    >
      مشخصات رویداد
    </h1>

    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 30,
        boxShadow: "0 6px 20px rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: 15,
          marginBottom: 25,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#009693",
          }}
        >
          اطلاعات رویداد
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 20,
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>عنوان رویداد</label>
          <input
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>مدرس</label>
          <input
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>تاریخ</label>
          <input
            type="date"
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>ساعت</label>
          <input
            type="time"
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>نوع رویداد</label>
          <select
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          >
            <option>آموزشی</option>
            <option>وبینار</option>
            <option>جلسه</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>وضعیت</label>
          <select
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          >
            <option>فعال</option>
            <option>غیرفعال</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 30,
          gap: 10,
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: 10,
            background: "#009693",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  </>
);
}

export default EventDetails;