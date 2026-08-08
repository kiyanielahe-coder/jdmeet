import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  color?: string;
};

function StatCard({
  title,
  value,
  color = "#009693",
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 6px 20px rgba(15,23,42,.06)",
        border: "1px solid #eef2f7",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            color: "#64748b",
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <ArrowUpRight size={26} />
      </div>
    </div>
  );
}

export default StatCard;