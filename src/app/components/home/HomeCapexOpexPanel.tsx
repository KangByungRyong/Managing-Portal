// src/app/components/home/HomeCapexOpexPanel.tsx
import { CapexSummaryItem, OpexSummaryItem } from "../../data/homeMockData";

interface BudgetBarProps {
  label: string;
  budget: number;
  actual: number;
  rate: number;
}

function BudgetBar({ label, budget, actual, rate }: BudgetBarProps) {
  const rateColor = rate >= 50 ? "#1a7a4a" : rate >= 35 ? "#f59e0b" : "#9ca3af";
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color: rateColor }}>
          {rate}%
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${rate}%`, backgroundColor: rateColor }}
          />
        </div>
        <span className="text-[9px] text-gray-400 tabular-nums w-16 text-right">
          {actual}/{budget}억
        </span>
      </div>
    </div>
  );
}

interface BudgetPanelProps {
  title: string;
  subtitle: string;
  items: (CapexSummaryItem | OpexSummaryItem)[];
  totalBudget: number;
  totalActual: number;
  totalRate: number;
  baseDate: string;
  accentColor?: string;
  onNavigate?: () => void;
}

export function BudgetPanel({
  title, subtitle, items,
  totalBudget, totalActual, totalRate,
  baseDate, accentColor = "var(--region-primary)", onNavigate,
}: BudgetPanelProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5 ${onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""}`}
      onClick={onNavigate}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: accentColor }} />
          <span className="text-[11px] font-bold text-gray-700">{title}</span>
          <span className="text-[9px] text-gray-400">{subtitle}</span>
          {onNavigate && <span className="ml-1 text-[8px] text-gray-300">▶</span>}
        </div>
        <span className="text-[9px] text-gray-400">{baseDate}</span>
      </div>

      {/* 총계 */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
        <div>
          <p className="text-[8px] text-gray-400">총 예산</p>
          <p className="text-sm font-bold text-gray-800 font-mono">{totalBudget}억</p>
        </div>
        <div>
          <p className="text-[8px] text-gray-400">집행액</p>
          <p className="text-sm font-bold text-gray-800 font-mono">{totalActual}억</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[8px] text-gray-400">집행률</p>
          <p className="text-base font-bold font-mono" style={{ color: accentColor }}>
            {totalRate}%
          </p>
        </div>
      </div>

      {/* 항목별 */}
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <BudgetBar key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
