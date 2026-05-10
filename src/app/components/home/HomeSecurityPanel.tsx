import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SecurityKpiItem {
  label: string;
  completed: number;
  total: number;
}

interface HomeSecurityPanelProps {
  items: SecurityKpiItem[];
  serverTotal: number;
  onNavigate?: () => void;
}

const SECURITY_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

const SECURITY_SHORT_LABELS: Record<string, string> = {
  "평문정보 저장제한": "저장제한",
  "EOS 장비 교체 및 리빌딩": "EOS교체",
  "EDR 설치": "EDR설치",
  "SolidStep 설치": "SolidStep",
};

// Custom tooltip component - receives completed count from item
const createCustomTooltip = (completed: number) => {
  return ({ active }: any) => {
    if (active) {
      return (
        <div className="bg-gray-800 text-white px-2 py-1 rounded text-[11px] shadow-lg">
          {completed}대
        </div>
      );
    }
    return null;
  };
};

// Security chart component for each item
const SecurityDonutChart = ({ item, color, index }: { item: SecurityKpiItem; color: string; index: number }) => {
  const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
  const shortLabel = SECURITY_SHORT_LABELS[item.label] ?? item.label;

  const pieData = [
    { name: "completed", value: item.completed },
    { name: "remaining", value: item.total - item.completed },
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Donut Chart with custom center label */}
      <div className="w-full h-24 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={45}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={false}
              tooltip={{ content: createCustomTooltip(item.completed), cursor: { fill: "rgba(0,0,0,0.1)" } }}
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Overlay center percentage */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[14px] font-bold text-gray-800">{rate}%</span>
        </div>
      </div>

      {/* Chart title below */}
      <p className="text-[11px] text-gray-600 font-medium text-center truncate w-full">{shortLabel}</p>
    </div>
  );
};

export function HomeSecurityPanel({ items, serverTotal, onNavigate }: HomeSecurityPanelProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-2 ${
        onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""
      }`}
      onClick={onNavigate}
    >
      {/* Header with title and total server count */}
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-[15px] font-bold text-gray-700">보안</span>
        <span className="text-sm text-gray-500">총 {serverTotal}대</span>
        {onNavigate && <span className="ml-auto text-[10px] text-gray-300">▶</span>}
      </div>

      {/* Donut charts grid - 1 row x 4 columns */}
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((item, idx) => (
          <SecurityDonutChart
            key={item.label}
            item={item}
            color={SECURITY_COLORS[idx % SECURITY_COLORS.length]}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
