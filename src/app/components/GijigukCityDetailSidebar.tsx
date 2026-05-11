import { useMemo } from "react";
import { X } from "lucide-react";
import {
  GijigukCityStats,
  GijigukRow,
  GIJIGUK_5G_EQUIP,
  GIJIGUK_LTE_EQUIP,
  GIJIGUK_WCDMA_EQUIP,
  GIJIGUK_LORA_EQUIP,
} from "../data/facilityStatusData";

interface GijigukCityDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rows: GijigukRow[];
  selectedCityStat: GijigukCityStats | null;
}

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface BarItem {
  label: string;
  value: number;
  color: string;
}

type EquipRecordKey = "fiveG" | "lte" | "wcdma" | "lora";

const CATEGORY_CONFIG: Array<{
  label: string;
  recordKey: EquipRecordKey;
  equipKeys: readonly string[];
  color: string;
}> = [
  {
    label: "5G",
    recordKey: "fiveG",
    equipKeys: GIJIGUK_5G_EQUIP,
    color: "#7C3AED",
  },
  {
    label: "LTE",
    recordKey: "lte",
    equipKeys: GIJIGUK_LTE_EQUIP,
    color: "#2563EB",
  },
  {
    label: "WCDMA",
    recordKey: "wcdma",
    equipKeys: GIJIGUK_WCDMA_EQUIP,
    color: "#16A34A",
  },
  {
    label: "LoRa",
    recordKey: "lora",
    equipKeys: GIJIGUK_LORA_EQUIP,
    color: "#EA580C",
  },
];

const PALETTE = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#EA580C",
  "#EF4444",
  "#DB2777",
  "#0891B2",
  "#4F46E5",
  "#65A30D",
  "#0D9488",
];

function colorAt(index: number) {
  return PALETTE[index % PALETTE.length];
}

function DonutChart({
  title,
  unit,
  total,
  slices,
}: {
  title: string;
  unit: string;
  total: number;
  slices: DonutSlice[];
}) {
  const SIZE = 160;
  const R = 54;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const STROKE = 20;
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
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-700 mb-3">{title}</h3>
      <div className="flex items-start gap-4">
        <svg width={SIZE} height={SIZE} className="shrink-0">
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
            y={CY - 6}
            textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 700, fill: "#111827", fontFamily: "monospace" }}
          >
            {total.toLocaleString()}
          </text>
          <text x={CX} y={CY + 11} textAnchor="middle" style={{ fontSize: 11, fill: "#9CA3AF" }}>
            {unit}
          </text>
        </svg>

        <div className="flex-1 space-y-1.5 min-w-0 max-h-[160px] overflow-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-[11px] text-gray-400">표시할 장비 데이터가 없습니다.</div>
          )}
          {filtered.map((slice) => {
            const pct = sum > 0 ? ((slice.value / sum) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={slice.label}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate text-gray-600">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-semibold text-gray-800">
                    {slice.value.toLocaleString()}
                  </span>
                  <span className="w-10 text-right text-gray-400">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoryBarChart({
  title,
  items,
  accentColor,
}: {
  title: string;
  items: BarItem[];
  accentColor: string;
}) {
  const maxValue = items.length > 0 ? Math.max(...items.map((item) => item.value)) : 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2.5 max-h-[260px] overflow-auto pr-1">
        {items.length === 0 && (
          <div className="text-[11px] text-gray-400">표시할 장비 형태 데이터가 없습니다.</div>
        )}
        {items.map((item) => {
          const widthPercent = maxValue > 0 ? Math.max(8, (item.value / maxValue) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate text-gray-700">{item.label}</span>
                <span className="font-mono font-semibold text-gray-800">
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: item.color || accentColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GijigukCityDetailSidebar({
  isOpen,
  onClose,
  rows,
  selectedCityStat,
}: GijigukCityDetailSidebarProps) {
  const targetRows = useMemo(() => {
    if (!selectedCityStat) return [];
    return rows.filter(
      (row) =>
        row.state === selectedCityStat.state &&
        row.city === selectedCityStat.city &&
        row.team === selectedCityStat.team,
    );
  }, [rows, selectedCityStat]);

  const categorySeries = useMemo(() => {
    return CATEGORY_CONFIG.map((category) => {
      const items = category.equipKeys
        .map((key, index) => {
          const value = targetRows.reduce(
            (sum, row) => sum + (row[category.recordKey][key] ?? 0),
            0,
          );
          return {
            label: key,
            value,
            color: colorAt(index),
          };
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);

      const total = items.reduce((sum, item) => sum + item.value, 0);

      return {
        ...category,
        total,
        items,
      };
    });
  }, [targetRows]);

  const categoryDonut = useMemo(() => {
    const slices = categorySeries
      .map((category) => ({
        label: category.label,
        value: category.total,
        color: category.color,
      }))
      .filter((slice) => slice.value > 0);

    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    return { slices, total };
  }, [categorySeries]);

  const locationLabel = selectedCityStat
    ? `${selectedCityStat.state} ${selectedCityStat.city} · ${selectedCityStat.team}`
    : "선택된 행 없음";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-[320]" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-[321] transform transition-transform duration-500 ${
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
            <h2 className="text-lg font-bold text-gray-900">기지국 세부 장비 현황</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{locationLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-73px)] space-y-4">
          <DonutChart
            title="장비 Category 현황"
            unit="대"
            total={categoryDonut.total}
            slices={categoryDonut.slices}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {categorySeries.map((category) => (
              <CategoryBarChart
                key={category.label}
                title={`${category.label} 형태별 현황`}
                items={category.items}
                accentColor={category.color}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
