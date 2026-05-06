// src/app/components/GijigukKpiSidebar.tsx
import { X } from "lucide-react";
import { GijigukRow } from "../data/facilityStatusData";

// ─── Props ────────────────────────────────────────────────────
interface GijigukKpiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rows: GijigukRow[];
}

function sumRecord(r: Partial<Record<string, number>>): number {
  return Object.values(r).reduce((a, v) => a + (v ?? 0), 0);
}

// ─── 도넛 차트 (SVG 순수 구현) ────────────────────────────────
interface DonutSlice {
  label: string;
  value: number;
  color: string;
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
  const SIZE   = 150;
  const R      = 54;
  const CX     = SIZE / 2;
  const CY     = SIZE / 2;
  const STROKE = 22;
  const CIRC   = 2 * Math.PI * R;

  const filtered = slices.filter((s) => s.value > 0);
  const sum      = filtered.reduce((a, s) => a + s.value, 0);

  let offset = 0;
  const arcs = filtered.map((s) => {
    const pct  = sum > 0 ? s.value / sum : 0;
    const dash = pct * CIRC;
    const gap  = CIRC - dash;
    const arc  = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs font-bold text-gray-600 mb-3">{title}</p>
      <svg width={SIZE} height={SIZE}>
        {/* 배경 링 */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={STROKE}
        />
        {/* 데이터 슬라이스 */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset + CIRC / 4}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        ))}
        {/* 중앙 수치 */}
        <text
          x={CX} y={CY - 7}
          textAnchor="middle"
          style={{ fontSize: 20, fontWeight: 700, fill: "#111827", fontFamily: "monospace" }}
        >
          {total.toLocaleString()}
        </text>
        <text
          x={CX} y={CY + 11}
          textAnchor="middle"
          style={{ fontSize: 11, fill: "#9CA3AF" }}
        >
          {unit}
        </text>
      </svg>

      {/* 범례 */}
      <div className="mt-3 w-full space-y-1.5">
        {filtered.map((s) => {
          const pct = sum > 0 ? ((s.value / sum) * 100).toFixed(1) : "0.0";
          return (
            <div key={s.label} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-gray-600 truncate">{s.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="font-mono font-semibold text-gray-800">
                  {s.value.toLocaleString()}
                </span>
                <span className="text-gray-400 w-11 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 색상 팔레트 ───────────────────────────────────────────────
const REGION_COLORS: Record<string, string> = {
  "천안시":  "#3B82F6", "아산시":  "#8B5CF6", "서산시":  "#06B6D4",
  "당진시":  "#10B981", "홍성군":  "#F59E0B", "보령시":  "#EF4444",
  "논산시":  "#EC4899", "공주시":  "#F97316", "청주시":  "#6366F1",
  "충주시":  "#14B8A6", "제천시":  "#84CC16", "전주시":  "#A78BFA",
  "익산시":  "#FB923C", "군산시":  "#34D399", "목포시":  "#60A5FA",
  "여수시":  "#F472B6", "순천시":  "#FBBF24", "제주시":  "#4ADE80",
  "서귀포시":"#C084FC",
};
const FALLBACK = [
  "#94A3B8","#CBD5E1","#FCA5A5","#FCD34D",
  "#6EE7B7","#93C5FD","#C4B5FD","#FDB4A4",
];
function regionColor(region: string, idx: number) {
  return REGION_COLORS[region] ?? FALLBACK[idx % FALLBACK.length];
}

const TECH_COLORS = {
  "5G":   "#7C3AED",
  "LTE":  "#2563EB",
  "3G":   "#059669",
  "LoRa": "#EA580C",
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export function GijigukKpiSidebar({
  isOpen,
  onClose,
  rows,
}: GijigukKpiSidebarProps) {

  // ── ① 광역시도별 사이트 수 집계 ───────────────────────────
  const regionMap: Record<string, number> = {};
  rows.forEach((r) => {
    regionMap[r.state] = (regionMap[r.state] ?? 0) + r.siteCount;
  });
  const regionEntries = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);
  const regionSlices: DonutSlice[] = regionEntries.map(([label, value], idx) => ({
    label,
    value,
    color: regionColor(label, idx),
  }));
  const totalSites = rows.reduce((a, r) => a + r.siteCount, 0);

  // ── ② 장비 카테고리별 집계 ────────────────────────────────
  const techTotals = {
    "5G": rows.reduce((a, r) => a + sumRecord(r.fiveG), 0),
    "LTE": rows.reduce((a, r) => a + sumRecord(r.lte), 0),
    "3G": rows.reduce((a, r) => a + sumRecord(r.wcdma), 0),
    "LoRa": rows.reduce((a, r) => a + sumRecord(r.lora), 0),
  };
  const techSlices: DonutSlice[] = (
    Object.entries(techTotals) as [keyof typeof TECH_COLORS, number][]
  ).map(([label, value]) => ({
    label,
    value,
    color: TECH_COLORS[label],
  }));
  const totalEquip = Object.values(techTotals).reduce((a, v) => a + v, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[300] transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-[301]
          transform transition-transform duration-500
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ── */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--region-light)",
            borderBottomColor: "var(--region-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-0.5 h-5 rounded"
              style={{ backgroundColor: "var(--region-primary)" }}
            />
            <h2 className="text-lg font-bold text-gray-900">전체 기지국 현황</h2>
            <span className="text-sm text-gray-500 font-normal ml-1">
              총 {totalSites.toLocaleString()}개소
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="p-6 overflow-y-auto h-[calc(100%-73px)] space-y-5">

          {/* ① 광역시도별 사이트 도넛 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <div
                className="w-0.5 h-3.5 rounded"
                style={{ backgroundColor: "var(--region-primary)" }}
              />
              <h3 className="text-sm font-bold text-gray-700">광역시도별 사이트 현황</h3>
            </div>
            <DonutChart
              slices={regionSlices}
              title="전체 사이트"
              total={totalSites}
              unit="개소"
            />
          </div>

          {/* ② 장비 카테고리별 도넛 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <div
                className="w-0.5 h-3.5 rounded"
                style={{ backgroundColor: "var(--region-primary)" }}
              />
              <h3 className="text-sm font-bold text-gray-700">장비 카테고리별 현황</h3>
            </div>
            <DonutChart
              slices={techSlices}
              title="전체 장비"
              total={totalEquip}
              unit="대"
            />
          </div>

        </div>
      </div>
    </>
  );
}
