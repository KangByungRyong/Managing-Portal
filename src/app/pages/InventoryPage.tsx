import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HqDivision } from "../data/facilityStatusData";
import {
  getInventoryData,
  MaterialClass,
  RegionalInventoryData,
} from "../data/inventoryMockData";

interface InventoryPageProps {
  region: HqDivision;
}

type KpiMetric = {
  key: "totalItems" | "newQty" | "oldQty" | "totalQty" | "holdingItems";
  label: string;
  unit: string;
  value: number;
  prevValue: number;
};

const PIE_COLORS = ["#3b82f6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#64748b"];
const DONUT_COLORS = ["#2196F3", "#81D4FA", "#26A69A", "#FF9800", "#EF5350", "#7E57C2", "#D4E157"];
const CONDITION_COLORS = ["#1565C0", "#90CAF9"];

const MATERIAL_CLASS_ORDER: MaterialClass[] = [
  "광모듈/SFP",
  "안테나",
  "분배기/결합기",
  "전원/케이블",
  "중계기/증폭기",
  "인프라/외함",
  "커넥터/브라켓",
];

function latestMonth(list: RegionalInventoryData["list"]): number {
  return list.reduce((max, item) => {
    const month = Number(item.inboundDate.slice(5, 7));
    return month > max ? month : max;
  }, 1);
}

function buildMetrics(list: RegionalInventoryData["list"]): Omit<KpiMetric, "prevValue">[] {
  const totalItems = list.length;
  const newQty = list
    .filter((item) => item.condition === "신품(양호)")
    .reduce((sum, item) => sum + item.quantity, 0);
  const oldQty = list
    .filter((item) => item.condition !== "신품(양호)")
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalQty = list.reduce((sum, item) => sum + item.quantity, 0);
  const holdingItems = new Set(list.map((item) => item.materialCode)).size;

  return [
    { key: "totalItems", label: "전체 자재 항목", unit: "건", value: totalItems },
    { key: "newQty", label: "신품 수량", unit: "개", value: newQty },
    { key: "oldQty", label: "구품 수량", unit: "개", value: oldQty },
    { key: "totalQty", label: "총재고", unit: "개", value: totalQty },
    { key: "holdingItems", label: "재고 보유 항목", unit: "건", value: holdingItems },
  ];
}

function formatDelta(value: number, prevValue: number): string {
  const delta = value - prevValue;
  if (prevValue === 0) return `${delta >= 0 ? "+" : ""}${delta.toLocaleString()}`;
  const pct = (delta / prevValue) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toLocaleString()} (${delta >= 0 ? "+" : ""}${pct.toFixed(1)}%)`;
}

function deltaClass(value: number, prevValue: number): string {
  const delta = value - prevValue;
  if (delta > 0) return "text-green-600";
  if (delta < 0) return "text-red-600";
  return "text-gray-500";
}

function InventoryKpiCard({ item }: { item: KpiMetric }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-[11px] font-semibold text-gray-600">{item.label}</p>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-2xl leading-none font-bold text-gray-900 font-mono">{item.value.toLocaleString()}</span>
        <span className="text-[11px] text-gray-500 mb-0.5">{item.unit}</span>
      </div>
      <p className="text-[10px] mt-1 text-gray-600">
        전월 대비
        <span className={`ml-1 font-semibold ${deltaClass(item.value, item.prevValue)}`}>
          {formatDelta(item.value, item.prevValue)}
        </span>
      </p>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
      <span className="text-sm font-bold text-gray-700">{title}</span>
      <span className="text-[10px] text-gray-400">{subtitle}</span>
    </div>
  );
}

const RADIAN = Math.PI / 180;

function renderPieLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  name: string;
  percent: number;
  value: number;
}) {
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 4) * cos;
  const sy = cy + (outerRadius + 4) * sin;
  const mx = cx + (outerRadius + 18) * cos;
  const my = cy + (outerRadius + 18) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 14;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#9ca3af" fill="none" strokeWidth={1} />
      <circle cx={ex} cy={ey} r={1.5} fill="#9ca3af" />
      <text
        x={ex + (cos >= 0 ? 3 : -3)}
        y={ey}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={14}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
}

function renderClassPieLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  name: string;
  percent: number;
  value: number;
}) {
  if (percent < 0.02) return null;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 4) * cos;
  const sy = cy + (outerRadius + 4) * sin;
  const mx = cx + (outerRadius + 18) * cos;
  const my = cy + (outerRadius + 18) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 14;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#9ca3af" fill="none" strokeWidth={1} />
      <circle cx={ex} cy={ey} r={1.5} fill="#9ca3af" />
      <text
        x={ex + (cos >= 0 ? 3 : -3)}
        y={ey}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={14}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
}

function DonutCenter({ total, unit }: { total: number; unit: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      <span className="text-[10px] text-gray-500">총 수량</span>
      <span className="text-lg font-bold text-gray-800 font-mono">{total.toLocaleString()}</span>
      <span className="text-[10px] text-gray-500">{unit}</span>
    </div>
  );
}

export function InventoryPage({ region }: InventoryPageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const data = getInventoryData(regionKey);

  const currentMonth = useMemo(() => latestMonth(data.list), [data.list]);

  const prevMonthList = useMemo(
    () => data.list.filter((item) => Number(item.inboundDate.slice(5, 7)) !== currentMonth),
    [data.list, currentMonth],
  );

  const kpis = useMemo<KpiMetric[]>(() => {
    const now = buildMetrics(data.list);
    const prev = buildMetrics(prevMonthList);
    const prevMap = new Map(prev.map((item) => [item.key, item.value]));
    return now.map((item) => ({ ...item, prevValue: prevMap.get(item.key) ?? 0 }));
  }, [data.list, prevMonthList]);

  const conditionPieData = useMemo(() => {
    const newQty = data.list
      .filter((item) => item.condition === "신품(양호)")
      .reduce((sum, item) => sum + item.quantity, 0);
    const oldQty = data.list
      .filter((item) => item.condition !== "신품(양호)")
      .reduce((sum, item) => sum + item.quantity, 0);

    return [
      { name: "신품", value: newQty },
      { name: "구품", value: oldQty },
    ];
  }, [data.list]);

  const classPieData = useMemo(() => {
    return MATERIAL_CLASS_ORDER.map((materialClass) => {
      const label = materialClass === "커넥터/브라켓" ? "커넥터/브라겟" : materialClass;
      return {
        name: label,
        value: data.summary.byMaterialClass[materialClass]?.totalQty ?? 0,
      };
    });
  }, [data.summary.byMaterialClass]);
  const classTotalQty = useMemo(() => classPieData.reduce((s, d) => s + d.value, 0), [classPieData]);
  const classSmallItems = useMemo(
    () => classPieData.map((d, idx) => ({ ...d, idx })).filter((d) => classTotalQty > 0 && d.value / classTotalQty < 0.02),
    [classPieData, classTotalQty],
  );
  const inboundPieData = useMemo(() => {
    return Object.entries(data.summary.byInboundType).map(([name, value]) => ({ name, value }));
  }, [data.summary.byInboundType]);

  const companyBarData = useMemo(() => {
    return Object.keys(data.summary.byCompany)
      .map((company) => {
        const companyList = data.list.filter((item) => item.companyName === company);
        const newQty = companyList
          .filter((item) => item.condition === "신품(양호)")
          .reduce((sum, item) => sum + item.quantity, 0);
        const oldQty = companyList
          .filter((item) => item.condition !== "신품(양호)")
          .reduce((sum, item) => sum + item.quantity, 0);
        const totalQty = newQty + oldQty;

        return {
          company,
          newQty,
          oldQty,
          totalQty,
          ratioLabel: totalQty > 0 ? `신품 ${Math.round((newQty / totalQty) * 100)}% / 구품 ${Math.round((oldQty / totalQty) * 100)}%` : "신품 0% / 구품 0%",
        };
      })
      .sort((a, b) => b.totalQty - a.totalQty);
  }, [data.list, data.summary.byCompany]);

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <SectionTitle title="자재 현황 요약" subtitle={`Inventory KPI · 누적 기준 (전월 대비 ${currentMonth}월 증감)`} />
        <div className="grid grid-cols-5 gap-2">
          {kpis.map((item) => (
            <InventoryKpiCard key={item.key} item={item} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 auto-rows-fr">
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col min-h-0">
          <SectionTitle title="신품/구품 비율" subtitle="수량 기준" />
          <div className="relative flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 28, right: 72, bottom: 28, left: 72 }}>
                <Pie data={conditionPieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} label={renderPieLabel} labelLine={false}>
                  {conditionPieData.map((entry, idx) => (
                    <Cell key={entry.name} fill={CONDITION_COLORS[idx % CONDITION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()}개`, "수량"]} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter total={conditionPieData.reduce((sum, item) => sum + item.value, 0)} unit="개" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col min-h-0">
          <SectionTitle title="항목별 재고 현황" subtitle="자재 분류별 수량" />
          <div className="relative flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 28, right: 72, bottom: 28, left: 72 }}>
                <Pie data={classPieData} dataKey="value" nameKey="name" innerRadius={88} outerRadius={144} label={renderClassPieLabel} labelLine={false}>
                  {classPieData.map((entry, idx) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()}개`, "수량"]} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter total={classTotalQty} unit="개" />
            {classSmallItems.length > 0 && (
              <div className="absolute bottom-2 right-2 border border-gray-200 bg-white/90 rounded px-2.5 py-1.5 flex flex-col gap-1">
                {classSmallItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <svg width="28" height="12">
                      <line x1="0" y1="6" x2="20" y2="6" stroke="#9ca3af" strokeWidth="1" />
                      <circle cx="20" cy="6" r="1.5" fill="#9ca3af" />
                      <rect x="22" y="3" width="6" height="6" rx="1" fill={DONUT_COLORS[item.idx % DONUT_COLORS.length]} />
                    </svg>
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      {item.name} {classTotalQty > 0 ? ((item.value / classTotalQty) * 100).toFixed(1) : 0}% ({item.value.toLocaleString()}개)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col min-h-0">
          <SectionTitle title="입고 데이터 분석" subtitle="입고 구분별 건수" />
          <div className="relative flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 28, right: 72, bottom: 28, left: 72 }}>
                <Pie data={inboundPieData} dataKey="value" nameKey="name" innerRadius={88} outerRadius={144} label={renderPieLabel} labelLine={false}>
                  {inboundPieData.map((entry, idx) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()}건`, "건수"]} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter total={inboundPieData.reduce((sum, item) => sum + item.value, 0)} unit="건" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col min-h-0">
          <SectionTitle title="업체별 재고 현황" subtitle="신품/구품 비율 포함" />
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyBarData} margin={{ top: 30, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="company" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={56} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()}개`,
                    name === "newQty" ? "신품" : "구품",
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend formatter={(value) => (value === "newQty" ? "신품" : "구품")} />
                <Bar dataKey="newQty" stackId="qty" fill={CONDITION_COLORS[0]} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="ratioLabel" position="top" offset={14} style={{ fontSize: 14, fill: "#6b7280" }} />
                </Bar>
                <Bar dataKey="oldQty" stackId="qty" fill={CONDITION_COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
