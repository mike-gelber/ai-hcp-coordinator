interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-brand-400">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-gray-500">{sublabel}</p>}
    </div>
  );
}
