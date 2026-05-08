interface KpiCardProps {
  label: string;
  value: number | string;
  unit: string;
  yoy?: number | null;
  variant?: "default" | "warn" | "danger";
  sub?: string;
  badge?: string;
  badgeTone?: "good" | "warn" | "danger";
  className?: string;
  onClick?: () => void;
}

export function KpiCard({
  label,
  value,
  unit,
  yoy,
  variant = "default",
  sub,
  badge,
  badgeTone = "good",
  className,
  onClick,
}: KpiCardProps) {
  const borderColors = {
    default: "var(--region-primary)",
    warn: "var(--warn)",
    danger: "var(--danger)",
  };
  const badgeStyles = {
    good: "bg-emerald-50 text-emerald-600",
    warn: "bg-orange-50 text-orange-500",
    danger: "bg-red-50 text-red-500",
  };
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-3.5 shadow-sm border-t-[3px] transition-all ${
        isClickable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""
      } ${className ?? ""}`}
      style={{ borderTopColor: borderColors[variant] }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="text-base font-bold text-[#333333] leading-snug">{label}</div>
        {badge && (
          <span
            className={`text-[14px] font-bold px-1.5 py-0 rounded-full flex-shrink-0 ${badgeStyles[badgeTone]}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold text-gray-900 font-mono">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      {sub && <div className="mt-1 text-[16px] text-gray-900">{sub}</div>}
      {yoy !== null && yoy !== undefined && (
        <div className="mt-1 text-[14px] text-gray-400">
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
