import { X } from "lucide-react";
import { RepeaterRow } from "../data/facilityStatusData";

interface RepeaterKpiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rows: RepeaterRow[];
}

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

const STATE_COLORS: Record<string, string> = {
  충북: "#2563EB",
  세종: "#7C3AED",
  대전: "#0891B2",
  충남: "#16A34A",
  전북: "#4F46E5",
  광주: "#DB2777",
  전남: "#EA580C",
  제주: "#65A30D",
};

const TECH_COLORS = {
  "5G": "#7C3AED",
  LTE: "#2563EB",
  WCDMA: "#16A34A",
  WiBro: "#0EA5E9",
  이동형: "#EA580C",
};

function sumRecord(record: Partial<Record<string, number>>): number {
  return Object.values(record).reduce((sum, value) => sum + (value ?? 0), 0);
}

function colorByState(state: string, index: number) {
  const fallback = ["#94A3B8", "#60A5FA", "#A78BFA", "#34D399", "#FBBF24"];
  return STATE_COLORS[state] ?? fallback[index % fallback.length];
}

function DonutChart({
  slices,
  title,
  total,
  unit,
}: {
  slices: DonutSlice[];
  title: string;
  total: number;
  unit: string;
}) {
  const SIZE = 150;
  const R = 54;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const STROKE = 22;
  const CIRC = 2 * Math.PI * R;

  const filtered = slices.filter((s) => s.value > 0);
  const sum = filtered.reduce((a, s) => a + s.value, 0);

  let offset = 0;
  const arcs = filtered.map((s) => {
    const pct = sum > 0 ? s.value / sum : 0;
    const dash = pct * CIRC;
    const gap = CIRC - dash;
    const arc = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs font-bold text-gray-600 mb-3">{title}</p>
      <svg width={SIZE} height={SIZE}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F3F4F6" strokeWidth={STROKE} />
        {arcs.map((arc, index) => (
          <circle
            key={`${arc.label}-${index}`}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset + CIRC / 4}
            strokeLinecap="butt"
          />
        ))}
        <text
          x={CX}
          y={CY - 7}
          textAnchor="middle"
          style={{ fontSize: 20, fontWeight: 700, fill: "#111827", fontFamily: "monospace" }}
        >
          {total.toLocaleString()}
        </text>
        <text x={CX} y={CY + 11} textAnchor="middle" style={{ fontSize: 11, fill: "#9CA3AF" }}>
          {unit}
        </text>
      </svg>

      <div className="mt-3 w-full space-y-1.5">
        {filtered.map((slice) => {
          const pct = sum > 0 ? ((slice.value / sum) * 100).toFixed(1) : "0.0";
          return (
            <div key={slice.label} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-gray-600 truncate">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="font-mono font-semibold text-gray-800">{slice.value.toLocaleString()}</span>
                <span className="text-gray-400 w-11 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RepeaterKpiSidebar({ isOpen, onClose, rows }: RepeaterKpiSidebarProps) {
  const stateMap: Record<string, number> = {};
  rows.forEach((row) => {
    stateMap[row.state] = (stateMap[row.state] ?? 0) + row.siteCount;
  });

  const stateSlices: DonutSlice[] = Object.entries(stateMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], index) => ({
      label,
      value,
      color: colorByState(label, index),
    }));

  const techTotals = {
    "5G": rows.reduce((sum, row) => sum + sumRecord(row.fiveG), 0),
    LTE: rows.reduce((sum, row) => sum + sumRecord(row.lte), 0),
    WCDMA: rows.reduce((sum, row) => sum + sumRecord(row.wcdma), 0),
    WiBro: rows.reduce((sum, row) => sum + sumRecord(row.wibro), 0),
    이동형: rows.reduce((sum, row) => sum + sumRecord(row.idong), 0),
  };

  const techSlices: DonutSlice[] = (Object.entries(techTotals) as Array<[
    keyof typeof TECH_COLORS,
    number,
  ]>).map(([label, value]) => ({
    label,
    value,
    color: TECH_COLORS[label],
  }));

  const totalSite = rows.reduce((sum, row) => sum + row.siteCount, 0);
  const totalEquip = Object.values(techTotals).reduce((sum, value) => sum + value, 0);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-[300]" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-[301] transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: "var(--region-light)", borderBottomColor: "var(--region-border)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
            <h2 className="text-lg font-bold text-gray-900">전체 중계기 현황</h2>
            <span className="text-sm text-gray-500 font-normal ml-1">총 {totalSite.toLocaleString()}개소</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-73px)] space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">광역시도별 사이트 현황</h3>
            <DonutChart slices={stateSlices} title="중계기 사이트" total={totalSite} unit="개소" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">장비 카테고리별 현황</h3>
            <DonutChart slices={techSlices} title="중계기 장비" total={totalEquip} unit="대" />
          </div>
        </div>
      </div>
    </>
  );
}
