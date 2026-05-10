// src/app/components/home/HomeCapexOpexPanel.tsx
import { CapexKpi, OpexMeta, OpexSummaryItem } from "../../data/homeMockData";

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
      <div className="flex items-center justify-between text-lg">
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
        <span className="text-xs text-gray-400 tabular-nums w-16 text-right">
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
          <span className="text-[15px] font-bold text-gray-700">{title}</span>
          <span className="text-[10px] text-gray-400">{subtitle}</span>
          {onNavigate && <span className="ml-1 text-[10px] text-gray-300">▶</span>}
        </div>
        <span className="text-[10px] text-gray-400">{baseDate}</span>
      </div>

      {/* 총계 */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
        <div>
          <p className="text-[10px] text-gray-400">종 예산</p>
          <p className="text-base font-bold text-gray-800 font-mono">{totalBudget}억</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400">집행액</p>
          <p className="text-base font-bold text-gray-800 font-mono">{totalActual}억</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] text-gray-400">집행률</p>
          <p className="text-lg font-bold font-mono" style={{ color: accentColor }}>
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
const CAPEX_BORDER = ["#3b82f6", "#06b6d4", "#1a7a4a", "#f59e0b"];

export function HomeCapexKpiPanel({ data, onNavigate }: HomeCapexKpiPanelProps) {
  const accentColor = "var(--region-primary)";

  const kpiItems = [
    {
      label: "AFE 승인예산 (계획)",
      value: `${fmtM(data.totalConfirmM)}`,
      unit: "백만원",
      sub: `AFE ${data.approvedAfeCount}차 기준`,
      color: "#374151",
    },
    {
      label: "공사 집행금액 (실적)",
      value: `${fmtM(data.totalExecutionM)}`,
      unit: "백만원",
      sub: `당월 ${fmtM(data.curMonthExecM)}M · 잔여 ${fmtM(data.totalConfirmM - data.totalExecutionM)}M`,
      color: "#374151",
    },
    {
      label: "예산 소진율",
      value: `${data.soakRate.toFixed(1)}`,
      unit: "%",
      sub: `당월 ${fmtM(data.curMonthExecM)}M`,
      color: data.soakRate >= 50 ? "#1a7a4a" : data.soakRate >= 35 ? "#f59e0b" : "#9ca3af",
    },
    {
      label: "공사 완료율",
      value: `${data.completionRate.toFixed(1)}`,
      unit: "%",
      sub: `당월 개통 ${data.curMonthCompletion}건`,
      color: data.completionRate >= 40 ? "#1a7a4a" : data.completionRate >= 25 ? "#f59e0b" : "#ef4444",
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
          <span className="text-[15px] font-bold text-gray-700">CapEx 집행</span>
          <span className="text-[10px] text-gray-400">Capital Expenditure</span>
          {onNavigate && <span className="ml-1 text-[10px] text-gray-300">▶</span>}
        </div>
        <span className="text-[10px] text-gray-400">{data.baseDate}</span>
      </div>

      {/* KPI 1줄 그리드 */}
      <div className="grid grid-cols-4 gap-1.5">
        {kpiItems.map((item, idx) => (
          <div key={item.label} className="bg-gray-50 rounded-md px-2 py-1.5 flex flex-col gap-0.5 border-l-[3px]" style={{ borderLeftColor: CAPEX_BORDER[idx % CAPEX_BORDER.length] }}>
            <span className="text-[13px] text-gray-600">{item.label}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-semibold" style={{ color: item.color }}>
                {item.value}
              </span>
              <span className="text-[10px] text-gray-400">{item.unit}</span>
            </div>
            <span className="text-[10px] text-gray-400 truncate">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HomeOpexKpiPanelProps {
  data: OpexMeta;
  onNavigate?: () => void;
}

const fmtOk = (value: number) => value.toFixed(1);
const getRateColor = (rate: number) => {
  if (rate < 90) return "#ef4444";
  if (rate > 110) return "#f59e0b";
  return "#1a7a4a";
};
const OPEX_BORDER = ["#7c3aed", "#3b82f6", "#1a7a4a", "#f59e0b"];

export function HomeOpexKpiPanel({ data, onNavigate }: HomeOpexKpiPanelProps) {
  const accentColor = "#7c3aed";

  const kpiItems = [
    {
      label: `당월 집행금액 (${data.baseMonth}월)`,
      value: fmtOk(data.monthActual),
      unit: "억원",
      sub: `계획 ${fmtOk(data.monthPlan)}억원`,
      color: "#374151",
    },
    {
      label: "누적 집행금액",
      value: fmtOk(data.totalActual),
      unit: "억원",
      sub: `연간예산 ${fmtOk(data.totalBudget)}억원`,
      color: "#374151",
    },
    {
      label: `당월 매출 (${data.baseMonth}월)`,
      value: fmtOk(data.salesMonthActual),
      unit: "억원",
      sub: `계획 ${fmtOk(data.salesMonthPlan)}억원`,
      color: "#374151",
    },
    {
      label: `당월 EBITDA (${data.baseMonth}월)`,
      value: fmtOk(data.ebitdaMonthActual),
      unit: "억원",
      sub: `계획 ${fmtOk(data.ebitdaMonthPlan)}억원`,
      color: data.ebitdaMonthActual >= data.ebitdaMonthPlan ? "#1a7a4a" : "#f59e0b",
    },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5 ${onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""}`}
      onClick={onNavigate}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: accentColor }} />
          <span className="text-[15px] font-bold text-gray-700">OpEx 집행</span>
          <span className="text-[10px] text-gray-400">Operating Expenditure</span>
          {onNavigate && <span className="ml-1 text-[10px] text-gray-300">▶</span>}
        </div>
        <span className="text-[10px] text-gray-400">{data.baseDate}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {kpiItems.map((item, idx) => (
          <div key={item.label} className="bg-gray-50 rounded-md px-2 py-1.5 flex flex-col gap-0.5 border-l-[3px]" style={{ borderLeftColor: OPEX_BORDER[idx % OPEX_BORDER.length] }}>
            <span className="text-[13px] text-gray-600">{item.label}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-semibold" style={{ color: item.color }}>
                {item.value}
              </span>
              <span className="text-[10px] text-gray-400">{item.unit}</span>
            </div>
            <span className="text-[10px] text-gray-400 truncate">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
