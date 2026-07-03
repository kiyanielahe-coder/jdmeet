import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (room: {
    title: string;
    type: string;
    password: string;
    allowGuest: boolean;
  }) => void;
};

function CreateRoomModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("آموزشی");
  const [allowGuest, setAllowGuest] = useState(true);
const [password, setPassword] = useState("");

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
          background: "white",
          borderRadius: 12,
          padding: 25,
        }}
      >
        <h2>ایجاد اتاق جدید</h2>

        <input
          placeholder="نام اتاق"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 20,
            marginBottom: 15,
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
          }}
        >
          <option>آموزشی</option>
          <option>جلسه</option>
          <option>وبینار</option>
        </select>
        <input
  placeholder="رمز اتاق (اختیاری)"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
  }}
/>

<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    cursor: "pointer",
  }}
>
  <input
    type="checkbox"
    checked={allowGuest}
    onChange={(e) => setAllowGuest(e.target.checked)}
  />

  اجازه ورود مهمان
</label>

        <div
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button onClick={onClose}>
            انصراف
          </button>

          <button
            onClick={() => {
              onCreate({
                title,
                type,
                password,
                allowGuest,

              });

              setTitle("");
              setType("آموزشی");
              setPassword("");
              setAllowGuest(true);

              onClose();
            }}
          >
            ایجاد اتاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;