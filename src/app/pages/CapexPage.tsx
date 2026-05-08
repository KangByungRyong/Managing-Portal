// src/app/pages/CapexPage.tsx
import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import { HqDivision } from "../data/facilityStatusData";
import { getCapexDataByRegionKey } from "../data/capexMockData";
import { capexConfirmData, capexConstructionData } from "../data/capexConfirmData";

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: AFE 차수는 기본 4차 구조. 추후 5차~N차로 확장 가능.
// 현재 기준: AFE 1차만 승인완료, 2차는 5월 승인 예정.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 데이터 상수 — AFE 차수별 시리즈
// status: "진행중" | "승인완료" → 실선, "예정" → 점선
// ─────────────────────────────────────────────────────────────────────────────
interface AfeSeriesRow {
  afe: string;
  month: string;
  confirmNew: number;   // 해당 차수 신규 승인 (백만원)
  executionNew: number; // 해당 차수 집행 기여분 (백만원)
  status: "진행중" | "승인완료" | "예정";
}

// 4차 기본 구조. 추후 차수 추가 시 배열에 항목 추가하면 자동 반영.
const AFE_SERIES: Record<"central" | "west", AfeSeriesRow[]> = {
  central: [
    { afe: "AFE 1차", month: "1월", confirmNew: 9308, executionNew: 3200, status: "진행중" },
    { afe: "AFE 2차", month: "5월", confirmNew: 8200, executionNew:    0, status: "진행중" },
    { afe: "AFE 3차", month: "7월", confirmNew: 6500, executionNew:    0, status: "예정"   },
    { afe: "AFE 4차", month: "10월", confirmNew: 5000, executionNew:   0, status: "예정"   },
  ],
  west: [
    { afe: "AFE 1차", month: "1월", confirmNew: 7880, executionNew: 2800, status: "진행중" },
    { afe: "AFE 2차", month: "5월", confirmNew: 6500, executionNew:    0, status: "진행중" },
    { afe: "AFE 3차", month: "7월", confirmNew: 5200, executionNew:    0, status: "예정"   },
    { afe: "AFE 4차", month: "10월", confirmNew: 3500, executionNew:   0, status: "예정"   },
  ],
};

// investName 표시 레이블 약어
const INVEST_LABEL: Record<string, string> = {
  "본원적 경쟁력 강화_5G":      "5G",
  "본원적 경쟁력 강화_LTE":     "LTE",
  "유선 유효 경쟁력 강화_유선": "유선",
  "MULTI-NW 효율화_WI-FI":     "Wi-Fi",
  "정보보호 수준 제고_NW센터":  "보안",
};

const INVEST_COLORS: Record<string, string> = {
  "본원적 경쟁력 강화_5G":      "#3b82f6",
  "본원적 경쟁력 강화_LTE":     "#06b6d4",
  "유선 유효 경쟁력 강화_유선": "#6366f1",
  "MULTI-NW 효율화_WI-FI":     "#f59e0b",
  "정보보호 수준 제고_NW센터":  "#ef4444",
};

// ─────────────────────────────────────────────────────────────────────────────
// 월별 집행 현황 모의 데이터 (1월~5월, 백만원)
// ─────────────────────────────────────────────────────────────────────────────
const MONTHLY_EXEC: Record<"central" | "west", { month: string; exec: number; isCurrent?: boolean }[]> = {
  central: [
    { month: "1월",  exec: 850 },
    { month: "2월",  exec: 720 },
    { month: "3월",  exec: 810 },
    { month: "4월",  exec: 680 },
    { month: "5월",  exec: 140, isCurrent: true },
  ],
  west: [
    { month: "1월",  exec: 740 },
    { month: "2월",  exec: 630 },
    { month: "3월",  exec: 720 },
    { month: "4월",  exec: 600 },
    { month: "5월",  exec: 110, isCurrent: true },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────────────────────────────────────
const fmtM = (v: number) => v.toLocaleString();
const fmtRate = (v: number) => `${v.toFixed(1)}%`;
const soakBadgeTone = (rate: number): "good" | "warn" | "danger" =>
  rate >= 35 ? "good" : rate >= 20 ? "warn" : "danger";
const completeBadgeTone = (rate: number): "good" | "warn" | "danger" =>
  rate >= 40 ? "good" : rate >= 25 ? "warn" : "danger";

// ─────────────────────────────────────────────────────────────────────────────
// 통합 차트 데이터 타입 (X축: 월)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const MONTH_IDX: Record<string, number> = {};
ALL_MONTHS.forEach((m, i) => { MONTH_IDX[m] = i; });

interface CombinedChartRow {
  month: string;              // X축 레이블
  cumExec: number | null;     // 누적 집행 (Area, Y축)
  cumConfirmApproved: number | null; // 누적 승인 확정 — 실선 (Y축)
  cumConfirmPending:  number | null; // 누적 승인 예정  — 점선 (Y축)
  afeLabel?: string;          // AFE 차수 레이블 (툴팁용)
}

const CUM_NAMES: Record<string, string> = {
  cumConfirmApproved: "누적 승인 (확정)",
  cumConfirmPending:  "누적 승인 (예정)",
  cumExec:            "누적 집행",
};

function CombinedAfeChart({
  data,
  annualTarget,
}: {
  data: CombinedChartRow[];
  annualTarget: number;
}) {
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 56, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#606059" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#606059" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}B`}
            width={48}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              `${v.toLocaleString()} 백만원`,
              CUM_NAMES[name] ?? name,
            ]}
            labelFormatter={(l, payload) => {
              const afeLabel = payload?.[0]?.payload?.afeLabel;
              return afeLabel ? `${l} (${afeLabel} 승인)` : String(l);
            }}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend
            formatter={(v) => CUM_NAMES[v] ?? v}
            iconSize={10}
            wrapperStyle={{ fontSize: 11 }}
          />
          {/* 연간 목표선 */}
          <ReferenceLine
            y={annualTarget}
            stroke="#9ca3af"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: "연간목표", position: "insideTopRight", fontSize: 10, fill: "#9ca3af" }}
          />
          {/* 누적 승인 확정 — 실선 */}
          <Line
            type="stepAfter"
            dataKey="cumConfirmApproved"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="cumConfirmApproved"
            connectNulls={false}
          />
          {/* 누적 승인 예정 — 점선 */}
          <Line
            type="stepAfter"
            dataKey="cumConfirmPending"
            stroke="#93c5fd"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: "#fff", stroke: "#93c5fd", strokeWidth: 1.5 }}
            activeDot={{ r: 5 }}
            name="cumConfirmPending"
            connectNulls={false}
          />
          {/* 누적 집행 — 라인 + 영역 */}
          <Area
            type="monotone"
            dataKey="cumExec"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.12}
            strokeWidth={2}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name="cumExec"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 당월 파이프라인 실적 (5월 기준 목업)
// ─────────────────────────────────────────────────────────────────────────────
const MONTHLY_PIPELINE: Record<"central" | "west", {
  nsheet: number; transwork: number; hwwork: number; subscription: number;
}> = {
  central: { nsheet: 14, transwork: 9, hwwork: 7, subscription: 4 },
  west:    { nsheet: 11, transwork: 7, hwwork: 5, subscription: 2 },
};

// ─────────────────────────────────────────────────────────────────────────────
// 투자 Process 파이프라인 — 도넛 1개
// ─────────────────────────────────────────────────────────────────────────────
interface StageDonutProps {
  label: string;
  count: number;
  total: number;
  color: string;
  subLabel: string;
  isBase?: boolean;  // 사업 목표: 건수 표시, 화살표 없음
  monthCount?: number; // 당월 실적 (사업목표 제외)
}

function StageDonut({ label, count, total, color, subLabel, isBase, monthCount }: StageDonutProps) {
  const pct = total > 0 ? (count / total) * 100 : 100;
  const data = isBase
    ? [{ name: "전체", value: 1 }]
    : [
        { name: "완료", value: count },
        { name: "대기", value: Math.max(0, total - count) },
      ];

  return (
    <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
      <span className="text-[14px] font-semibold text-gray-700 whitespace-nowrap">{label}</span>
      <div className="relative w-[168px] h-[168px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: number, name: string) =>
                isBase ? [`${count}건`, "전체"] : [`${value}건`, name]
              }
              contentStyle={{ fontSize: 11, padding: "4px 8px" }}
            />
            <Pie
              data={data}
              dataKey="value"
              innerRadius="56%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={isBase ? 0 : 2}
              strokeWidth={0}
            >
              {isBase ? (
                <Cell fill={color} />
              ) : (
                <>
                  <Cell fill={color} />
                  <Cell fill="#f3f4f6" />
                </>
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {isBase ? (
            <span className="text-[24px] font-bold leading-none text-gray-700">{count}</span>
          ) : (
            <span className="text-[24px] font-bold leading-none" style={{ color }}>
              {pct.toFixed(0)}
            </span>
          )}
        </div>
      </div>
      {/* 하단 텍스트: subLabel + 당월 실적 */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <span className="text-[12px] text-gray-400 text-center whitespace-nowrap">{subLabel}</span>
        {!isBase && monthCount !== undefined && (
          <span className="text-[11px] font-semibold text-amber-600 whitespace-nowrap">· 당월 {monthCount}건</span>
        )}
      </div>
    </div>
  );
}

// 단계 간 화살표 (사업목표 이후 4단계 사이에만 사용)
function StageArrow() {
  return (
    <div className="flex-shrink-0 self-center pb-6">
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
        <path
          d="M0 6 H18 M14 2 L20 6 L14 10"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AFE 테이블 (아코디언 드릴다운)
// ─────────────────────────────────────────────────────────────────────────────
interface InvestGroup {
  name: string;
  confirm: number;
  execution: number;
  remain: number;
  rate: number;
}
interface AfeTableRow {
  afe: string;
  month: string;
  confirm: number;
  execution: number;
  remain: number;
  rate: number;
  status: "진행중" | "승인완료" | "예정";
  groups: InvestGroup[];
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  "진행중":   { bg: "bg-blue-100 text-blue-700",   text: "진행중" },
  "승인완료": { bg: "bg-green-100 text-green-700",  text: "승인완료" },
  "예정":     { bg: "bg-gray-100 text-gray-500",    text: "승인예정" },
};

function AfeTableWithAccordion({ rows }: { rows: AfeTableRow[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (afe: string) =>
    setExpanded((prev) => ({ ...prev, [afe]: !prev[afe] }));

  const totals = rows.reduce(
    (acc, r) => ({
      confirm:   acc.confirm   + (r.status !== "예정" ? r.confirm   : 0),
      execution: acc.execution + r.execution,
      remain:    acc.remain    + (r.status !== "예정" ? r.remain    : 0),
    }),
    { confirm: 0, execution: 0, remain: 0 },
  );
  const totalRate = totals.confirm > 0 ? (totals.execution / totals.confirm) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-3 py-2 bg-gray-50 flex items-center gap-2">
        <span className="text-xl font-semibold text-gray-700">AFE 차수별 진행률</span>
        <span className="ml-1 text-[14px] text-gray-400">▶ 클릭하여 투자항목 상세 펼치기</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-semibold text-gray-600 w-6" />
              <th className="px-3 py-2 text-left font-semibold text-gray-600">구분</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-600">승인시기</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">승인금액 (M)</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">누적집행 (M)</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">잔여금액 (M)</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">집행률</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-600">상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isOpen = !!expanded[row.afe];
              const badge = STATUS_BADGE[row.status];
              const isPending = row.status === "예정";
              return (
                <>
                  <tr
                    key={row.afe}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50/80 ${isPending ? "opacity-55" : ""}`}
                    onClick={() => !isPending && toggle(row.afe)}
                  >
                    <td className="px-3 py-2 text-gray-400">
                      {!isPending && (
                        isOpen
                          ? <ChevronDown size={12} />
                          : <ChevronRight size={12} />
                      )}
                    </td>
                    <td className="px-3 py-2 font-semibold text-gray-700">{row.afe}</td>
                    <td className="px-3 py-2 text-center text-gray-400 text-[10px]">{row.month}</td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {isPending
                        ? <span className="italic text-gray-400">승인예정</span>
                        : fmtM(row.confirm)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">
                      {row.execution > 0 ? fmtM(row.execution) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {isPending ? "—" : fmtM(row.remain)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {isPending ? "—" : (
                        <span className={row.rate >= 30 ? "text-emerald-600" : row.rate >= 10 ? "text-orange-500" : "text-red-500"}>
                          {fmtRate(row.rate)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                  {/* 투자항목 드릴다운 */}
                  {isOpen && row.groups.map((g) => {
                    const shortName = INVEST_LABEL[g.name] ?? g.name;
                    const color = INVEST_COLORS[g.name] ?? "#9ca3af";
                    return (
                      <tr key={g.name} className="border-b border-gray-50 bg-blue-50/20 hover:bg-blue-50/40">
                        <td className="px-3 py-1.5" />
                        <td className="px-3 py-1.5 pl-6 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="text-[10px] font-semibold text-gray-500 mr-0.5">{shortName}</span>
                            <span className="text-gray-500 truncate max-w-[220px]">{g.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5" />
                        <td className="px-3 py-1.5 text-right text-gray-500">{fmtM(g.confirm)}</td>
                        <td className="px-3 py-1.5 text-right text-gray-800">{g.execution > 0 ? fmtM(g.execution) : "—"}</td>
                        <td className="px-3 py-1.5 text-right text-gray-500">{fmtM(g.remain)}</td>
                        <td className="px-3 py-1.5 text-right">
                          <span className={g.rate >= 30 ? "text-emerald-600" : g.rate >= 10 ? "text-orange-500" : "text-gray-400"}>
                            {fmtRate(g.rate)}
                          </span>
                        </td>
                        <td className="px-3 py-1.5" />
                      </tr>
                    );
                  })}
                </>
              );
            })}
            {/* 합계 행 */}
            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-gray-700">누적 합계</td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-right text-gray-700">{fmtM(totals.confirm)}</td>
              <td className="px-3 py-2 text-right text-gray-900">{fmtM(totals.execution)}</td>
              <td className="px-3 py-2 text-right text-gray-700">{fmtM(totals.remain)}</td>
              <td className="px-3 py-2 text-right">
                <span className={totalRate >= 30 ? "text-emerald-600" : totalRate >= 10 ? "text-orange-500" : "text-red-500"}>
                  {fmtRate(totalRate)}
                </span>
              </td>
              <td className="px-3 py-2" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────────────────────
interface CapexPageProps {
  region: HqDivision;
}

export function CapexPage({ region }: CapexPageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const regionStr = regionKey === "central" ? "중부" : "서부";

  const [yearFilter, setYearFilter] = useState<"2025" | "2026">("2026");

  // ── 원본 데이터 ─────────────────────────────────────────────────────────────
  const rawdata = useMemo(() => getCapexDataByRegionKey(regionKey), [regionKey]);

  // ── AFE 차트 / 테이블 / 월별 통합 데이터 ──────────────────────────────────
  const { combinedChartData, tableRows, kpi, annualTarget, currentMonth, curMonthExec } = useMemo(() => {
    const series = AFE_SERIES[regionKey];
    const totalAnnual = series.reduce((s, r) => s + r.confirmNew, 0);

    // 실데이터: AFE 1차 투자항목 그룹
    const confirmFiltered = capexConfirmData.filter((c) => c.region === regionStr);
    const constructFiltered = capexConstructionData.filter((c) => c.region === regionStr);

    const getGroups = (afeLabel: string): InvestGroup[] => {
      const ci  = confirmFiltered.filter((c) => c.afe === afeLabel);
      const con = constructFiltered.filter((c) => c.AFE === afeLabel);
      const map: Record<string, { confirm: number; execution: number }> = {};
      ci.forEach((item) => {
        const n = item.investName;
        if (!map[n]) map[n] = { confirm: 0, execution: 0 };
        map[n].confirm += item.confirm_amount / 1000;
      });
      con.forEach((item) => {
        const matchCi = ci.find((c) => c.childcode === item.childcode);
        if (matchCi) {
          const n = matchCi.investName;
          if (!map[n]) map[n] = { confirm: 0, execution: 0 };
          map[n].execution += item.execution;
        }
      });
      return Object.entries(map)
        .filter(([, d]) => d.confirm > 0)
        .map(([name, d]) => ({
          name,
          confirm:   Math.round(d.confirm),
          execution: d.execution,
          remain:    Math.round(d.confirm) - d.execution,
          rate:      d.confirm > 0 ? (d.execution / d.confirm) * 100 : 0,
        }));
    };

    const mockGroups = (confirmAmt: number): InvestGroup[] => {
      const splits = [0.40, 0.25, 0.20, 0.10, 0.05];
      return Object.keys(INVEST_LABEL).map((name, i) => {
        const c = Math.round(confirmAmt * splits[i]);
        return { name, confirm: c, execution: 0, remain: c, rate: 0 };
      });
    };

    // ── AFE 차수 월별 맵핑 ─────────────────────────────────────────────────
    // afeByMonth: 각 월에 승인되는 AFE 목록
    const afeByMonth: Record<string, AfeSeriesRow[]> = {};
    series.forEach((row) => {
      if (!afeByMonth[row.month]) afeByMonth[row.month] = [];
      afeByMonth[row.month].push(row);
    });

    // 마지막 승인(확정) 차수의 월
    const lastApprovedMonth = [...series]
      .filter((r) => r.status !== "예정")
      .at(-1)?.month ?? "";

    // ── 월별 집행 데이터 맵핑 ────────────────────────────────────────────────
    const execByMonth: Record<string, { exec: number; isCurrent?: boolean }> = {};
    MONTHLY_EXEC[regionKey].forEach((r) => { execByMonth[r.month] = r; });
    const curMonth = MONTHLY_EXEC[regionKey].find((r) => r.isCurrent)?.month ?? "5월";

    // ── 월별 통합 차트 데이터 빌드 ──────────────────────────────────────────
    let cumAll = 0, cumApproved = 0, cumExec = 0;
    const combinedChartData: CombinedChartRow[] = ALL_MONTHS.map((month) => {
      // 이 달에 승인되는 AFE 반영
      const afes = afeByMonth[month] ?? [];
      let afeLabel: string | undefined;
      afes.forEach((afe) => {
        cumAll += afe.confirmNew;
        if (afe.status !== "예정") cumApproved += afe.confirmNew;
        afeLabel = afe.afe; // 툴팁용 레이블
      });

      const isAfterApproved = MONTH_IDX[month] > MONTH_IDX[lastApprovedMonth];
      const isAtBridge = month === lastApprovedMonth;

      const execEntry = execByMonth[month];
      const exec = execEntry?.exec ?? null;
      if (exec !== null) cumExec += exec;

      return {
        month,
        cumExec: exec !== null ? cumExec : null,
        cumConfirmApproved: !isAfterApproved ? cumApproved : null,
        cumConfirmPending:  isAfterApproved || isAtBridge ? cumAll : null,
        afeLabel,
      };
    });

    // 당월 집행액
    const curMonthExec = execByMonth[curMonth]?.exec ?? 0;

    // ── 테이블 데이터 ───────────────────────────────────────────────────────
    const tableRows: AfeTableRow[] = series.map((row) => {
      const isApproved = row.status !== "예정";
      const groups = row.afe === "AFE 1차" && isApproved
        ? getGroups("AFE 1차")
        : mockGroups(row.confirmNew);
      const confirm   = isApproved ? row.confirmNew : 0;
      const execution = isApproved ? row.executionNew : 0;
      return {
        afe:       row.afe,
        month:     row.month,
        confirm,
        execution,
        remain:    isApproved ? confirm - execution : 0,
        rate:      confirm > 0 ? (execution / confirm) * 100 : 0,
        status:    row.status,
        groups,
      };
    });

    const totalConfirm   = tableRows.filter((r) => r.status !== "예정").reduce((s, r) => s + r.confirm, 0);
    const totalExecution = tableRows.reduce((s, r) => s + r.execution, 0);
    const soakRate       = totalConfirm > 0 ? (totalExecution / totalConfirm) * 100 : 0;

    return {
      combinedChartData,
      tableRows,
      kpi: { totalConfirm, totalExecution, soakRate },
      annualTarget: totalAnnual,
      currentMonth: curMonth,
      curMonthExec,
    };
  }, [regionKey, regionStr]);

  // ── 공사 단계 집계 ────────────────────────────────────────────────────────
  const pipeline = useMemo(() => {
    const filtered = rawdata.filter((r) => r.bizyear === yearFilter);
    const total        = filtered.length;
    const nsheet       = filtered.filter((r) => r.date_nsheet       !== null).length;
    const transwork    = filtered.filter((r) => r.date_transwork    !== null).length;
    const hwwork       = filtered.filter((r) => r.date_hwwork       !== null).length;
    const subscription = filtered.filter((r) => r.date_subscription !== null).length;
    return { total, nsheet, transwork, hwwork, subscription };
  }, [rawdata, yearFilter]);

  const completionRate = pipeline.total > 0
    ? (pipeline.subscription / pipeline.total) * 100
    : 0;

  const approvedAfeCount = tableRows.filter((r) => r.status !== "예정").length;

  return (
    <div className="flex flex-col gap-4 pb-4 min-h-full">
      {/* ── 페이지 헤더 ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-[29px] font-bold text-gray-900 leading-none">CapEx 현황</h2>
          <span className="text-[13px] text-gray-400">(2026년 5월 기준)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">사업년도</span>
          {(["2026", "2025"] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setYearFilter(yr)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                yearFilter === yr
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* ── Zone 1: KPI 카드 4개 ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <KpiCard
          label="AFE 승인예산 (계획)"
          value={fmtM(kpi.totalConfirm)}
          unit="백만원"
          sub={`AFE ${approvedAfeCount}차 기준`}
        />
        <KpiCard
          label="공사 집행금액 (실적)"
          value={fmtM(kpi.totalExecution)}
          unit="백만원"
          sub={`당월 ${fmtM(curMonthExec)}M · 잔여 ${fmtM(kpi.totalConfirm - kpi.totalExecution)}M`}
        />
        <KpiCard
          label="예산 소진율"
          value={kpi.soakRate.toFixed(1)}
          unit="%"
          badge={kpi.soakRate >= 35 ? "목표 달성" : "목표 미달"}
          badgeTone={soakBadgeTone(kpi.soakRate)}
          sub={`당월 ${fmtM(curMonthExec)}M`}
        />
        <KpiCard
          label="공사 완료율"
          value={completionRate.toFixed(1)}
          unit="%"
          badge={`${pipeline.subscription}건 / ${pipeline.total}건`}
          badgeTone={completeBadgeTone(completionRate)}
          sub={`당월 개통 ${MONTHLY_PIPELINE[regionKey].subscription}건 · ${yearFilter}년 기준`}
          variant={completionRate < 25 ? "warn" : "default"}
        />
      </div>

      {/* ── Zone 2: AFE 차수별 누적 승인 / 월별 집행 통합 차트 ─────── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex-shrink-0">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-gray-800">AFE 차수별 누적 승인 · 집행 추이</span>
          <span className="text-[15px] text-[#6b7280]">
            연간 목표 {fmtM(annualTarget)}M · 누적 집행 {fmtM(kpi.totalExecution)}M
          </span>
        </div>
        {/* 범례 보조 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-8 border-t-2 border-blue-500" />
            <span className="text-[11px] text-gray-500">누적 승인 확정 (실선)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 border-t-2 border-blue-300 border-dashed" />
            <span className="text-[11px] text-gray-500">누적 승인 예정 (점선)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-emerald-100 border border-emerald-400" />
            <span className="text-[11px] text-gray-500">누적 집행 (영역)</span>
          </div>
        </div>
        <div className="h-56">
          <CombinedAfeChart
            data={combinedChartData}
            annualTarget={annualTarget}
          />
        </div>
      </div>

      {/* ── Zone 3: 투자 Process 별 진행 현황 ────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex-shrink-0">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xl font-bold text-gray-800">투자 Process 별 진행 현황</span>
          <span className="text-[15px] text-[#6b7280]">
            {yearFilter}년 사업 · 전체 {pipeline.total}건 기준
          </span>
        </div>

        {/* 도넛 + 바를 grid-cols-5 한 묶음으로 정렬 */}
        <div className="grid grid-cols-5 gap-4">
          {[
            {
              key: "total",
              label: "사업 목표 (건)",
              count: pipeline.total,
              total: pipeline.total,
              color: "#6b7280",
              subLabel: "전체 사업 기준",
              monthCount: 0,
              pct: 100,
              isBase: true,
              arrow: false,   // 사업목표 → NSheet 사이 화살표 없음
            },
            {
              key: "nsheet",
              label: "NSheet 발행 (%)",
              count: pipeline.nsheet,
              total: pipeline.total,
              color: "#38bdf8",
              subLabel: `미발행 ${pipeline.total - pipeline.nsheet}건`,
              monthCount: MONTHLY_PIPELINE[regionKey].nsheet,
              pct: pipeline.total > 0 ? (pipeline.nsheet / pipeline.total) * 100 : 0,
              isBase: false,
              arrow: false,
            },
            {
              key: "transwork",
              label: "선로 개통 (%)",
              count: pipeline.transwork,
              total: pipeline.total,
              color: "#3b82f6",
              subLabel: `대기 ${pipeline.nsheet - pipeline.transwork}건`,
              monthCount: MONTHLY_PIPELINE[regionKey].transwork,
              pct: pipeline.total > 0 ? (pipeline.transwork / pipeline.total) * 100 : 0,
              isBase: false,
              arrow: true,    // 왼쪽 화살표 표시
            },
            {
              key: "hwwork",
              label: "장비 설치 (%)",
              count: pipeline.hwwork,
              total: pipeline.total,
              color: "#6366f1",
              subLabel: `대기 ${pipeline.transwork - pipeline.hwwork}건`,
              monthCount: MONTHLY_PIPELINE[regionKey].hwwork,
              pct: pipeline.total > 0 ? (pipeline.hwwork / pipeline.total) * 100 : 0,
              isBase: false,
              arrow: true,
            },
            {
              key: "subscription",
              label: "시험 / 개통 (%)",
              count: pipeline.subscription,
              total: pipeline.total,
              color: "#22c55e",
              subLabel: `대기 ${pipeline.hwwork - pipeline.subscription}건`,
              monthCount: MONTHLY_PIPELINE[regionKey].subscription,
              pct: pipeline.total > 0 ? (pipeline.subscription / pipeline.total) * 100 : 0,
              isBase: false,
              arrow: true,
            },
          ].map((s, idx) => (
            <div key={s.key} className="relative flex flex-col items-center gap-3">
              {/* 파이프라인 화살표 (NSheet→선로, 선로→장비, 장비→개통) */}
              {s.arrow && (
                <div className="absolute -left-3 top-[105px] z-10">
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path
                      d="M0 6 H18 M14 2 L20 6 L14 10"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              {/* 사업목표 / 파이프라인 구분 세로선 */}
              {idx === 1 && (
                <div className="absolute -left-2.5 top-0 h-full w-px bg-gray-200" />
              )}

              {/* 도넛 차트 */}
              <StageDonut
                label={s.label}
                count={s.count}
                total={s.total}
                color={s.color}
                subLabel={s.subLabel}
                isBase={s.isBase}
                monthCount={s.monthCount}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Zone 4: AFE 차수별 진행률 테이블 ─────────────────────────── */}
      <AfeTableWithAccordion rows={tableRows} />
    </div>
  );
}

