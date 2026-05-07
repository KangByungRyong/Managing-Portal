// src/app/components/home/HomeTrendChart.tsx
import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { CqTrendBundle, TrendPoint } from "../../data/homeMockData";

interface TrendMiniProps {
  title: string;
  data: TrendPoint[];
  yDomain: [number, number];
}

function TrendMini({ title, data, yDomain }: TrendMiniProps) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 font-semibold mb-1">{title}</p>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={data} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fontSize: 8, fill: "#9ca3af" }}
            tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={yDomain} tick={{ fontSize: 8, fill: "#9ca3af" }}
            tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={{ fontSize: 10 }} formatter={(v: number) => [`${v}%`]} />
          <Legend wrapperStyle={{ fontSize: 9 }} iconType="plainline" iconSize={12} />
          <Line type="monotone" dataKey="전국" stroke="#6b7280"
            strokeWidth={1.4} strokeDasharray="4 3" dot={false} activeDot={{ r: 2 }} />
          <Line type="monotone" dataKey="공동망" stroke="#f97316"
            strokeWidth={1.5} dot={false} activeDot={{ r: 2 }} />
          <Line type="monotone" dataKey="단독망" stroke="#3b82f6"
            strokeWidth={1.5} dot={false} activeDot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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

  const resolvedTarget = useMemo(() => {
    return trendData.targets.some((target) => target.id === selectedTarget)
      ? selectedTarget
      : trendData.defaultTarget;
  }, [selectedTarget, trendData.defaultTarget, trendData.targets]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-xs font-bold text-gray-700">CQ 품질 변화 추이</span>
        <span className="text-[10px] text-gray-400 ml-1">Reference: 전국 현황</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {trendData.targets.map((target) => (
          <button
            key={target.id}
            type="button"
            onClick={() => setSelectedTarget(target.id)}
            className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
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
      <div className="grid grid-cols-2 gap-4">
        {/* 일별 */}
        <div>
          <p className="text-[10px] text-gray-400 mb-2">일별 ({dayRange})</p>
          <TrendMini title="1등급 (일별)" data={trendData.dayData1st[resolvedTarget]} yDomain={[72, 92]} />
          <TrendMini title="4등급 이하 (일별)" data={trendData.dayData4th[resolvedTarget]} yDomain={[3, 10]} />
        </div>
        {/* 시간별 */}
        <div>
          <p className="text-[10px] text-gray-400 mb-2">시간별 ({hourRange})</p>
          <TrendMini title="1등급 (시간별)" data={trendData.hourData1st[resolvedTarget]} yDomain={[68, 95]} />
          <TrendMini title="4등급 이하 (시간별)" data={trendData.hourData4th[resolvedTarget]} yDomain={[1, 14]} />
        </div>
      </div>
    </div>
  );
}
