import { X } from "lucide-react";
import { RepeaterRow } from "../data/facilityStatusData";

interface RepeaterEquipDrilldownSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rows: RepeaterRow[];
  equipLabel: string;
  equipKeys: readonly string[];
  recordKey: "fiveG" | "lte" | "wcdma" | "wibro" | "idong";
}

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

const FALLBACK = [
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#F97316",
  "#14B8A6",
  "#6366F1",
];

function colorAt(index: number) {
  return FALLBACK[index % FALLBACK.length];
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
  const SIZE = 160;
  const R = 58;
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
        {arcs.map((arc, i) => (
          <circle
            key={i}
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
        {filtered.map((s) => {
          const pct = sum > 0 ? ((s.value / sum) * 100).toFixed(1) : "0.0";
          return (
            <div key={s.label} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-gray-600 truncate">{s.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="font-mono font-semibold text-gray-800">{s.value.toLocaleString()}</span>
                <span className="text-gray-400 w-11 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RepeaterEquipDrilldownSidebar({
  isOpen,
  onClose,
  rows,
  equipLabel,
  equipKeys,
  recordKey,
}: RepeaterEquipDrilldownSidebarProps) {
  const stateTotalsMap: Record<string, number> = {};
  rows.forEach((row) => {
    const equipRecord = row[recordKey] as Partial<Record<string, number>>;
    const stateTotal = Object.values(equipRecord).reduce((sum, value) => sum + (value ?? 0), 0);
    stateTotalsMap[row.state] = (stateTotalsMap[row.state] ?? 0) + stateTotal;
  });

  const stateSlices = Object.entries(stateTotalsMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], idx) => ({ label, value, color: colorAt(idx) }));

  const typeTotals = equipKeys
    .map((type) => ({
      type,
      value: rows.reduce((sum, row) => {
        const equipRecord = row[recordKey] as Partial<Record<string, number>>;
        return sum + (equipRecord[type] ?? 0);
      }, 0),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const maxTypeValue = typeTotals.length > 0 ? Math.max(...typeTotals.map((item) => item.value)) : 0;
  const totalEquip = typeTotals.reduce((sum, item) => sum + item.value, 0);

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
            <h2 className="text-lg font-bold text-gray-900">{equipLabel} 장비 운용 현황</h2>
            <span className="text-sm text-gray-500 font-normal ml-1">총 {totalEquip.toLocaleString()}대</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-73px)] space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">광역시도별 {equipLabel} 장비 현황</h3>
            <DonutChart slices={stateSlices} title={`${equipLabel} 장비`} total={totalEquip} unit="대" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{equipLabel} 장비 형태별 구성</h3>
            <div className="space-y-3">
              {typeTotals.length === 0 && <div className="text-xs text-gray-400">표시할 {equipLabel} 데이터가 없습니다.</div>}
              {typeTotals.map((item) => {
                const widthPercent = maxTypeValue > 0 ? Math.max(6, (item.value / maxTypeValue) * 100) : 0;
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700">{item.type}</span>
                      <span className="font-mono text-gray-800">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${widthPercent}%`, backgroundColor: "var(--region-primary)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
