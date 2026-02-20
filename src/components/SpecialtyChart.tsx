"use client";

interface SpecialtyChartProps {
  data: Array<{ name: string; count: number }>;
  maxItems?: number;
}

export function SpecialtyChart({ data, maxItems = 10 }: SpecialtyChartProps) {
  const items = data.slice(0, maxItems);
  const max = Math.max(...items.map((d) => d.count));

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="w-40 truncate text-right text-xs text-gray-600 dark:text-gray-400">
            {item.name}
          </span>
          <div className="flex-1">
            <div className="h-5 rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-5 rounded-full bg-brand-500/80 transition-all duration-500"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-10 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
