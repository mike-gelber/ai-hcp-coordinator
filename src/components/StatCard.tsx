interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky";
}

const colorMap = {
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

export function StatCard({ label, value, sublabel, color = "indigo" }: StatCardProps) {
  return (
    <div className={`rounded-xl p-6 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sublabel && <p className="mt-1 text-xs opacity-60">{sublabel}</p>}
    </div>
  );
}
