import { X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { StationKpiStats, KpiMetric } from "../../data/homeMockData";

interface KpiChartPairProps {
  title: string;
  metric: KpiMetric;
}

function KpiChartPair({ title, metric }: KpiChartPairProps) {
  const { dayData, hourData, yDomain, unit } = metric;

  const tickFmt = (v: number) => `${v}${unit}`;

  const chartProps = (data: typeof dayData) => (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={data} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 8, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={yDomain}
          tick={{ fontSize: 8, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={tickFmt}
          width={42}
        />
        <Tooltip contentStyle={{ fontSize: 10 }} formatter={(v: number) => [`${v}${unit}`]} />
        <Legend wrapperStyle={{ fontSize: 9 }} iconType="plainline" iconSize={12} />
        <Line
          type="monotone"
          dataKey="공동망"
          stroke="#f97316"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="단독망"
          stroke="#3b82f6"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-sm font-bold text-gray-700">{title}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1 font-medium">{title} (day)</p>
          {chartProps(dayData)}
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1 font-medium">{title} (hour)</p>
          {chartProps(hourData)}
        </div>
      </div>
    </div>
  );
}

interface StationKpiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  kpiData: StationKpiStats | null;
  region: "central" | "west";
}

export function StationKpiSidebar({ isOpen, onClose, kpiData, region }: StationKpiSidebarProps) {
  const regionLabel = region === "central" ? "중부" : "서부";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-[340]" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-[341] transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--region-light)",
            borderBottomColor: "var(--region-border)",
          }}
        >
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900">기지국 성능 통계</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {kpiData
                ? `${kpiData.targetName} · Base Station KPI Statistics`
                : "대상을 선택하세요"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-[calc(100%-73px)]">
          {!kpiData ? (
            <div className="text-base text-gray-400 mt-8 text-center">선택된 항목이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 px-1">
                <span>{`5G ${regionLabel} 기준`}</span>
                <span>일별 {kpiData.meta.dayRange}</span>
                <span>시간별 {kpiData.meta.hourRange}</span>
              </div>

              <KpiChartPair title="ENDC 성공률" metric={kpiData.endc} />
              <KpiChartPair title="ERAB 성공률" metric={kpiData.erab} />
              <KpiChartPair title="Call Drop률" metric={kpiData.callDrop} />
              <KpiChartPair title="RACH 성공률" metric={kpiData.rach} />
              <KpiChartPair title="동시접속자 MAX" metric={kpiData.concurrentMax} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
