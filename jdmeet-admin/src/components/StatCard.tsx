type Props = {
  title: string;
  value: number;
};

function StatCard({ title, value }: Props) {
  return (
    <div
      style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 3px 10px rgba(0,0,0,.1)",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default StatCard;
