import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMemo } from "react";

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
  chartId?: string;
}

export function DonutChart({ title, data, chartId }: DonutChartProps) {
  const id = useMemo(() => chartId || `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [chartId]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5 h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <div
            className="w-0.5 h-3 rounded"
            style={{ backgroundColor: "var(--region-primary)" }}
          />
          {title}
        </div>
        <span className="text-[10px] text-gray-300">📂 SQL</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`${id}-${entry.name}-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MapPlaceholderProps {
  stationCount: number;
  stations: Array<{
    id: string;
    name: string;
    lat?: number;
    lng?: number;
    status: "정상" | "점검필요" | "긴급";
  }>;
}

export function MapPlaceholder({ stationCount, stations }: MapPlaceholderProps) {
  // 지도 영역 내 상대 좌표로 변환 (실제로는 위경도 -> 픽셀 변환)
  const getMapPosition = (lat?: number, lng?: number) => {
    if (!lat || !lng) return null;
    // 중부권 대략적 범위: 위도 36-37.5, 경도 126.5-127.5
    const x = ((lng - 126.5) / 1.0) * 100;
    const y = (1 - (lat - 36.0) / 1.5) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const statusCounts = {
    정상: stations.filter((s) => s.status === "정상").length,
    점검필요: stations.filter((s) => s.status === "점검필요").length,
    긴급: stations.filter((s) => s.status === "긴급").length,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5 h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <div
            className="w-0.5 h-3 rounded"
            style={{ backgroundColor: "var(--region-primary)" }}
          />
          통합국 위치 현황
        </div>
        <span className="text-[10px] text-gray-300">🗺️ 핀 클릭 → 세부 정보</span>
      </div>
      <div
        className="rounded-lg h-[300px] relative border overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #E8F4FD, #D6EAF8 50%, #EBF5FB)",
          borderColor: "var(--region-border)",
        }}
      >
        {/* 배경 텍스트 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ color: "var(--region-primary)", opacity: 0.15 }}
        >
          <div className="text-3xl mb-1">🗺️</div>
          <div className="text-xs font-bold">중부권 (대전·세종·충남·충북)</div>
          <div className="text-[10px] mt-0.5">Kakao Maps API 연동 예정</div>
        </div>

        {/* 국사 핀 */}
        {stations.map((station) => {
          const pos = getMapPosition(station.lat, station.lng);
          if (!pos) return null;

          const pinColors = {
            정상: "var(--region-primary)",
            점검필요: "var(--warn)",
            긴급: "var(--danger)",
          };

          return (
            <div
              key={station.id}
              className="absolute w-2.5 h-2.5 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-150 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                backgroundColor: pinColors[station.status],
                transform: "translate(-50%, -50%)",
              }}
              title={`${station.name} (${station.status})`}
            >
              {/* 툴팁 */}
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg border-l-2"
                style={{ borderLeftColor: pinColors[station.status] }}
              >
                <div className="font-bold">{station.name}</div>
                <div className="text-gray-300">{station.status}</div>
              </div>
            </div>
          );
        })}

        {/* 범례 */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 rounded-lg px-2.5 py-2 text-[10px] shadow-md">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--region-primary)" }}
            />
            <span className="text-gray-700">정상</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--warn)" }}
            />
            <span className="text-gray-700">점검필요</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--danger)" }}
            />
            <span className="text-gray-700">긴급</span>
          </div>
        </div>

        {/* 카운터 */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 rounded-lg px-2.5 py-2 text-[10px] shadow-md font-mono">
          <div className="flex justify-between gap-4 mb-0.5">
            <span className="text-gray-500">정상</span>
            <span className="font-bold text-gray-900">{statusCounts.정상}</span>
          </div>
          <div className="flex justify-between gap-4 mb-0.5">
            <span className="text-gray-500">점검필요</span>
            <span className="font-bold text-gray-900">{statusCounts.점검필요}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">긴급</span>
            <span className="font-bold text-gray-900">{statusCounts.긴급}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  title: string;
  data: ChartData[];
}

export function HorizontalBarChart({ title, data }: HorizontalBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
        <div
          className="w-0.5 h-3 rounded"
          style={{ backgroundColor: "var(--region-primary)" }}
        />
        {title}
      </div>
      <div className="flex rounded-lg overflow-hidden border border-gray-200 h-10">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          if (percentage === 0) return null;

          return (
            <div
              key={index}
              className="flex items-center justify-center transition-all duration-300 relative group"
              style={{
                width: `${percentage}%`,
                backgroundColor: item.fill,
              }}
            >
              <div className="flex flex-col items-center justify-center text-white">
                <span className="text-[10px] font-bold">{item.name}</span>
                <span className="text-xs font-bold">{item.value}</span>
              </div>
              {/* 호버 시 퍼센트 표시 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-white">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
