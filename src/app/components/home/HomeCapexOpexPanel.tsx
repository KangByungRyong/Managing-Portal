// src/app/components/home/HomeCapexOpexPanel.tsx
import { CapexKpi, OpexSummaryItem } from "../../data/homeMockData";

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
      <div className="flex items-center justify-between text-base">
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
  items: OpexSummaryItem[];
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

// ─────────────────────────────────────────────────────────────────────────────
// CapEx KPI 패널 (CapEx 페이지 KPI 4항목과 일치)
// ─────────────────────────────────────────────────────────────────────────────
interface HomeCapexKpiPanelProps {
  data: CapexKpi;
  onNavigate?: () => void;
}

const fmtM = (v: number) => v.toLocaleString();

export function HomeCapexKpiPanel({ data, onNavigate }: HomeCapexKpiPanelProps) {
  const accentColor = "var(--region-primary)";
  const soakBadge = data.soakRate >= 35 ? { label: "목표 달성", color: "#1a7a4a" } : { label: "목표 미달", color: "#f59e0b" };
  const completeBadge = data.completionRate >= 40
    ? { color: "#1a7a4a" } : data.completionRate >= 25
    ? { color: "#f59e0b" } : { color: "#ef4444" };

  const kpiItems = [
    {
      label: "AFE 승인예산 (계획)",
      value: `${fmtM(data.totalConfirmM)}`,
      unit: "백만원",
      sub: `AFE ${data.approvedAfeCount}차 기준`,
      badge: null as null | { label: string; color: string },
      color: "#374151",
    },
    {
      label: "공사 집행금액 (실적)",
      value: `${fmtM(data.totalExecutionM)}`,
      unit: "백만원",
      sub: `당월 ${fmtM(data.curMonthExecM)}M · 잔여 ${fmtM(data.totalConfirmM - data.totalExecutionM)}M`,
      badge: null as null | { label: string; color: string },
      color: "#374151",
    },
    {
      label: "예산 소진율",
      value: `${data.soakRate.toFixed(1)}`,
      unit: "%",
      sub: `당월 ${fmtM(data.curMonthExecM)}M`,
      badge: soakBadge,
      color: soakBadge.color,
    },
    {
      label: "공사 완료율",
      value: `${data.completionRate.toFixed(1)}`,
      unit: "%",
      sub: `당월 개통 ${data.curMonthCompletion}건`,
      badge: { label: `${data.completionDone}건 / ${data.completionTotal}건`, color: completeBadge.color },
      color: completeBadge.color,
    },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5 ${onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""}`}
      onClick={onNavigate}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: accentColor }} />
          <span className="text-[11px] font-bold text-gray-700">CapEx 집행</span>
          <span className="text-[9px] text-gray-400">Capital Expenditure</span>
          {onNavigate && <span className="ml-1 text-[8px] text-gray-300">▶</span>}
        </div>
        <span className="text-[9px] text-gray-400">{data.baseDate}</span>
      </div>

      {/* KPI 2×2 그리드 */}
      <div className="grid grid-cols-2 gap-1.5">
        {kpiItems.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-md px-2 py-1.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-400 leading-none">{item.label}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[15px] font-bold tabular-nums leading-none" style={{ color: item.color }}>
                {item.value}
              </span>
              <span className="text-[9px] text-gray-400 leading-none">{item.unit}</span>
              {item.badge && (
                <span
                  className="ml-auto text-[8px] font-semibold px-1 py-0.5 rounded-full leading-none"
                  style={{ color: item.badge.color, backgroundColor: `${item.badge.color}18` }}
                >
                  {item.badge.label}
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400 leading-none truncate">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
