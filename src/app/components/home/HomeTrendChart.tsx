// src/app/components/home/HomeTrendChart.tsx
import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { CqTrendBundle, TrendPoint } from "../../data/homeMockData";

interface TrendPanelProps {
  title: string;
  data: TrendPoint[];
  yDomain: [number, number];
}

function TrendPanel({ title, data, yDomain }: TrendPanelProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <p className="text-[11px] text-gray-600 font-semibold mb-1 shrink-0">{title}</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 3" stroke="#9ca3af" strokeWidth={0.6} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={yDomain} tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v: number) => [`${v}%`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" iconSize={12} />
            <Line type="monotone" dataKey="전국" stroke="#6b7280"
              strokeWidth={1.4} strokeDasharray="4 3" dot={false} activeDot={{ r: 2 }} />
            <Line type="monotone" dataKey="공동망" stroke="#f97316"
              strokeWidth={1.5} dot={false} activeDot={{ r: 2 }} />
            <Line type="monotone" dataKey="단독망" stroke="#3b82f6"
              strokeWidth={1.5} dot={false} activeDot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type ActiveTab = "day" | "hour";

interface HomeTrendChartProps {
  trendData: CqTrendBundle;
  dayRange: string;
  hourRange: string;
}

export function HomeTrendChart({
  trendData,
  dayRange, hourRange,
}: HomeTrendChartProps) {
  const [selectedTarget, setSelectedTarget] = useState(trendData.defaultTarget);
  const [activeTab, setActiveTab] = useState<ActiveTab>("day");

  const resolvedTarget = useMemo(() => {
    return trendData.targets.some((target) => target.id === selectedTarget)
      ? selectedTarget
      : trendData.defaultTarget;
  }, [selectedTarget, trendData.defaultTarget, trendData.targets]);

  const tabLabel = activeTab === "day" ? `일별 (${dayRange})` : `시간별 (${hourRange})`;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5 flex flex-col" style={{ height: "100%" }}>
      {/* 헤더 */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap shrink-0">
        <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-base font-bold text-gray-700">CQ 품질 변화 추이</span>

        {trendData.targets.map((target) => (
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

      {/* 탭 */}
      <div className="flex gap-0 mb-2 border-b border-gray-200 shrink-0">
        {(["day", "hour"] as ActiveTab[]).map((tab) => {
          const label = tab === "day" ? `일별 (${dayRange})` : `시간별 (${hourRange})`;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-transparent text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={isActive ? { borderBottomColor: "var(--region-primary)", color: "var(--region-primary)" } : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 그래프 영역 — 1등급 / 4등급 이하 */}
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex-1 min-h-0 rounded-md border border-gray-200 bg-gray-50 px-2 pt-2 pb-1 flex flex-col">
          <TrendPanel
            title={`1등급 (${tabLabel})`}
            data={activeTab === "day"
              ? trendData.dayData1st[resolvedTarget]
              : trendData.hourData1st[resolvedTarget]}
            yDomain={activeTab === "day" ? [72, 92] : [68, 95]}
          />
        </div>
        <div className="flex-1 min-h-0 rounded-md border border-gray-200 bg-blue-50/40 px-2 pt-2 pb-1 flex flex-col">
          <TrendPanel
            title={`4등급 이하 (${tabLabel})`}
            data={activeTab === "day"
              ? trendData.dayData4th[resolvedTarget]
              : trendData.hourData4th[resolvedTarget]}
            yDomain={activeTab === "day" ? [3, 10] : [1, 14]}
          />
        </div>
      </div>
    </div>
  );
}
