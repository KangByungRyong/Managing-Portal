interface KpiCardProps {
  label: string;
  value: number | string;
  unit: string;
  yoy?: number | null;
  variant?: "default" | "warn" | "danger";
  onClick?: () => void;
}

export function KpiCard({ label, value, unit, yoy, variant = "default", onClick }: KpiCardProps) {
  const borderColors = {
    default: "var(--region-primary)",
    warn: "var(--warn)",
    danger: "var(--danger)",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-3.5 shadow-sm border-t-[3px] cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderTopColor: borderColors[variant] }}
    >
      <div className="text-xs text-gray-500 mb-1.5 font-medium">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold text-gray-900 font-mono">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      {yoy !== null && yoy !== undefined && (
        <div className="mt-1 text-[10px] text-gray-400">
          전년 대비{" "}
          {yoy >= 0 ? (
            <span className="text-green-600 font-semibold">+{yoy}%</span>
          ) : (
            <span className="text-red-600 font-semibold">{yoy}%</span>
          )}
        </div>
      )}
    </div>
  );
}
