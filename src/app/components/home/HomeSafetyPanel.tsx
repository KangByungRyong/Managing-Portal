// src/app/components/home/HomeSafetyPanel.tsx
import { SafetySummaryItem } from "../../data/homeMockData";

interface SecurityKpiItem {
  label: string;
  completed: number;
  total: number;
}

interface HomeSafetyPanelProps {
  data: SafetySummaryItem[];
  onNavigate?: () => void;
  securityItems?: SecurityKpiItem[];
  onNavigateSecurity?: () => void;
}

const WORK_SAFETY_BORDER = ["#ef4444", "#f59e0b", "#3b82f6", "#6366f1"];
const SECURITY_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706"];

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--region-primary)" }} />
      <span className="text-[10px] font-bold text-gray-700">{title}</span>
      <span className="text-[8px] text-gray-400">{sub}</span>
    </div>
  );
}

export function HomeSafetyPanel({ data, onNavigate, securityItems, onNavigateSecurity }: HomeSafetyPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 flex flex-col gap-2">
      {/* 패널 타이틀 */}
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-[11px] font-bold text-gray-700">안전/보안</span>
        <span className="text-[9px] text-gray-400 ml-1">Safety &amp; Security</span>
      </div>

      {/* 작업 안전 섹션 */}
      <div
        className={onNavigate ? "cursor-pointer hover:bg-gray-50 rounded-md transition-colors" : ""}
        onClick={onNavigate}
      >
        <SectionHeader title="작업 안전" sub="Work Safety" />
        <div className="grid grid-cols-4 gap-1.5">
          {data.map((item, idx) => (
            <div
              key={item.label}
              className="rounded-md p-1.5 border-l-[3px] bg-gray-50 flex flex-col gap-0.5"
              style={{ borderLeftColor: WORK_SAFETY_BORDER[idx % WORK_SAFETY_BORDER.length] }}
            >
              <p className="text-[9px] text-gray-500 leading-tight truncate">{item.label}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-gray-400">당일</span>
                  <span className="text-sm font-bold text-gray-800 font-mono leading-tight">{item.today}</span>
                </div>
                <span className="text-[9px] text-gray-300">/</span>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-gray-400">주간</span>
                  <span className="text-xs font-semibold text-gray-500 font-mono leading-tight">{item.week}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 보안 섹션 */}
      <div
        className={onNavigateSecurity ? "cursor-pointer hover:bg-gray-50 rounded-md transition-colors" : ""}
        onClick={onNavigateSecurity}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--region-primary)" }} />
          <span className="text-[10px] font-bold text-gray-700">보안</span>
          <span className="text-[8px] text-gray-400">Security</span>
          {onNavigateSecurity && <span className="ml-auto text-[8px] text-gray-300">▶</span>}
        </div>
        {securityItems && securityItems.length > 0 ? (
          <div className="grid grid-cols-4 gap-1">
            {securityItems.map((item, idx) => {
              const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              const SHORT_LABELS: Record<string, string> = {
                "평문정보 저장제한": "저장제한",
                "EOS 장비 교체 및 리빌딩": "EOS교체",
                "EDR 설치": "EDR설치",
                "SolidStep 설치": "SolidStep",
              };
              const shortLabel = SHORT_LABELS[item.label] ?? item.label;
              return (
                <div
                  key={item.label}
                  className="rounded-md p-1.5 border-l-[3px] bg-gray-50 flex flex-col gap-0.5"
                  style={{ borderLeftColor: SECURITY_COLORS[idx % SECURITY_COLORS.length] }}
                >
                  <p className="text-[9px] text-gray-500 leading-tight truncate">{shortLabel}</p>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-sm font-bold text-gray-800 font-mono leading-tight">{rate}%</span>
                    <span className="text-[8px] text-gray-400">{item.completed}/{item.total}대</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {["항목 1", "항목 2", "항목 3", "항목 4"].map((label) => (
              <div
                key={label}
                className="rounded-md p-1.5 border-l-[3px] bg-gray-50 flex flex-col gap-0.5"
                style={{ borderLeftColor: "#d1d5db" }}
              >
                <p className="text-[9px] text-gray-400 leading-tight">{label}</p>
                <span className="text-sm font-bold text-gray-300 font-mono">-</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
