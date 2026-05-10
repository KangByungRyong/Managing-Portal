// src/app/components/home/HomeSafetyPanel.tsx
import { SafetySummaryItem } from "../../data/homeMockData";

interface HomeSafetyPanelProps {
  data: SafetySummaryItem[];
  onNavigate?: () => void;
}

const WORK_SAFETY_BORDER = ["#ef4444", "#f59e0b", "#3b82f6", "#6366f1"];

export function HomeSafetyPanel({ data, onNavigate }: HomeSafetyPanelProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5 ${onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""}`}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-[15px] font-bold text-gray-700">작업안전</span>
        <span className="text-[12px] text-gray-400 ml-1">당일/주간</span>
        {onNavigate && <span className="ml-auto text-[10px] text-gray-300">▶</span>}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {data.map((item, idx) => (
          <div
            key={item.label}
            className="rounded-md p-1.5 border-l-[3px] bg-gray-50 flex flex-col gap-0.5"
            style={{ borderLeftColor: WORK_SAFETY_BORDER[idx % WORK_SAFETY_BORDER.length] }}
          >
            <p className="text-[13px] text-gray-600 leading-tight truncate">{item.label}</p>
            <p className="mt-0.5 text-base font-semibold text-gray-700 font-mono leading-tight">
              {item.today} / {item.week}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
