// src/app/components/home/HomeQualityPanel.tsx
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  QualitySummaryBundle,
  CqBarItem,
  EndcSlice,
} from "../../data/homeMockData";

// ── CQ 바 ─────────────────────────────────────────────────────────────────────
function CqBar({ label, value, color }: CqBarItem & { color: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="text-sm text-gray-500 w-28 shrink-0 text-right leading-tight">
        {label}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[14px] font-semibold text-gray-700 w-14 text-right tabular-nums">
        {value.toFixed(2)}%
      </span>
    </div>
  );
}

// ── CQ KPI 카드 ───────────────────────────────────────────────────────────────
interface CqKpiCardProps {
  title: string;
  label: string; // 전일 | 금일
  snapshot: CqKpiSnapshot;
  gradeKey: "grade1st" | "grade4th";
  barColor: string;
  accentColor: string;
  onClick?: () => void;
}

function CqKpiCard({ title, label, snapshot, gradeKey, barColor, accentColor, onClick }: CqKpiCardProps) {
  const items = snapshot[gradeKey];
  const isInteractive = Boolean(onClick);
  return (
    <div
      className={`bg-white rounded-lg shadow-sm px-3 pt-2.5 pb-3 flex flex-col gap-2.5 border-t-[3px] transition-all ${
        isInteractive ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-orange-200" : ""
      }`}
      style={{ borderTopColor: accentColor }}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-bold leading-snug" style={{ color: accentColor }}>{title}</span>
        <span className="ml-auto text-base text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{label}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <CqBar key={item.label} {...item} color={barColor} />
        ))}
      </div>
    </div>
  );
}

// ── ENDC 파이차트 (파이 + 우측 Legend) ──────────────────────────────────────────
function EndcPie({ title, data }: { title: string; data: EndcSlice[] }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-1.5">{title}</p>
      <div className="flex items-center gap-2">
        {/* 파이 차트 */}
        <div style={{ width: 76, height: 76, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filtered}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={34}
                strokeWidth={1}
              >
                {filtered.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 우측 Legend */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-500 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-700 tabular-nums ml-1 shrink-0">
                {item.value > 0 ? `${item.value}%` : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ENDC 카드 ─────────────────────────────────────────────────────────────────
function EndcCard({ snapshot }: { snapshot: EndcSnapshot }) {
  return (
    <div className="bg-white rounded-lg shadow-sm px-3 pt-2.5 pb-3 flex flex-col gap-2 border-t-[3px] border-t-purple-500">
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-bold text-purple-700 leading-snug">ENDC 시도호</span>
        <span className="ml-auto text-base text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
          {snapshot.dateLabel.split(" ")[0]}
        </span>
      </div>
      {/* 수평 정렬: SKT 제공망 | SKT 이용망 */}
      <div className="flex flex-row gap-2 items-start">
        <div className="flex-1 min-w-0">
          <EndcPie title="SKT 제공망" data={snapshot.sktProvide} />
        </div>
        <div className="flex-1 min-w-0">
          <EndcPie title="SKT 이용망" data={snapshot.sktUse} />
        </div>
      </div>
    </div>
  );
}

// ── 메인 패널 ─────────────────────────────────────────────────────────────────
interface HomeQualityPanelProps {
  qualityData: QualitySummaryBundle;
  onSelectCq1st?: (payload: { periodLabel: "전일" | "금일"; dateLabel: string }) => void;
  onSelectCq4th?: (payload: { periodLabel: "전일" | "금일"; dateLabel: string }) => void;
}

export function HomeQualityPanel({
  qualityData,
  onSelectCq1st,
  onSelectCq4th,
}: HomeQualityPanelProps) {
  const [selectedTarget, setSelectedTarget] = useState(qualityData.defaultTarget);
  const resolvedTarget = useMemo(() => (
    qualityData.targets.some((target) => target.id === selectedTarget)
      ? selectedTarget
      : qualityData.defaultTarget
  ), [qualityData.defaultTarget, qualityData.targets, selectedTarget]);

  const prevCq = qualityData.cqPrev[resolvedTarget];
  const todayCq = qualityData.cqToday[resolvedTarget];
  const prevEndc = qualityData.endcPrev[resolvedTarget];
  const todayEndc = qualityData.endcToday[resolvedTarget];

  return (
    <div className="flex flex-col gap-3">
      {/* 섹션 헤더 + 필터 (같은 행에 배치) */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="w-0.5 h-4 rounded shrink-0" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-base font-bold text-gray-700 shrink-0">품질 등급 요약</span>
        {/* 필터 버튼 */}
        <div className="flex flex-wrap gap-1 ml-1">
          {qualityData.targets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => setSelectedTarget(target.id)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                resolvedTarget === target.id
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={resolvedTarget === target.id ? { backgroundColor: "var(--region-primary)" } : undefined}
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      {/* 전일 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-1.5 pl-1">
          <p className="text-sm font-semibold text-gray-600">● 전일</p>
          <span className="text-xs text-gray-500">({prevCq.dateLabel} 집계 기준)</span>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1.5fr" }}>
          <CqKpiCard title="CQ 1등급" label="전일" snapshot={prevCq} gradeKey="grade1st"
            barColor="#1a7a4a" accentColor="#1a7a4a"
            onClick={() => onSelectCq1st?.({ periodLabel: "전일", dateLabel: prevCq.dateLabel })}
          />
          <CqKpiCard title="CQ 4등급 이하" label="전일" snapshot={prevCq} gradeKey="grade4th"
            barColor="#f97316" accentColor="#ea580c"
            onClick={() => onSelectCq4th?.({ periodLabel: "전일", dateLabel: prevCq.dateLabel })}
          />
          <EndcCard snapshot={prevEndc} />
        </div>
      </div>

      {/* 금일 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-1.5 pl-1">
          <p className="text-sm font-semibold text-gray-600">● 금일</p>
          <span className="text-xs text-gray-500">({todayCq.dateLabel} · 06시 이후 기준)</span>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1.5fr" }}>
          <CqKpiCard title="CQ 1등급" label="금일" snapshot={todayCq} gradeKey="grade1st"
            barColor="#1a7a4a" accentColor="#1a7a4a"
            onClick={() => onSelectCq1st?.({ periodLabel: "금일", dateLabel: todayCq.dateLabel })}
          />
          <CqKpiCard title="CQ 4등급 이하" label="금일" snapshot={todayCq} gradeKey="grade4th"
            barColor="#f97316" accentColor="#ea580c"
            onClick={() => onSelectCq4th?.({ periodLabel: "금일", dateLabel: todayCq.dateLabel })}
          />
          <EndcCard snapshot={todayEndc} />
        </div>
      </div>
    </div>
  );
}
