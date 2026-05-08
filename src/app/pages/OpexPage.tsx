// src/app/pages/OpexPage.tsx
import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HqDivision } from "../data/facilityStatusData";
import {
  getOpexDataByTeam,
  CATEGORY_COLORS,
  AccountCategory,
  SummaryRow,
} from "../data/opexMockData";
import { getHomeData } from "../data/homeMockData";
import { KpiCard } from "../components/KpiCard";

// ─────────────────────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────────────────────

const BASE_MONTH = 4;

/** 당월/누적 집행률 색상 */
const rateColor = (rate: number): string => {
  if (rate < 90) return "text-red-500";
  if (rate > 110) return "text-orange-500";
  return "text-emerald-600";
};

const rateBadgeTone = (rate: number): "good" | "warn" | "danger" => {
  if (rate < 90) return "danger";
  if (rate > 110) return "warn";
  return "good";
};

/** 차트 단위: 천원 → 백만원 */
const toMil = (v: number) => Math.round(v / 1_000);

/** KPI 표시 단위: 천원 → 억원 */
const toOk = (v: number) => (v / 100_000).toFixed(1);

// ─────────────────────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────

interface OpexPageProps {
  region: HqDivision;
}

/** 월간 막대 + 누적 라인 복합 차트 */
function ComboTrendChart({
  data,
}: {
  data: { label: string; plan: number; actual: number; cumPlan: number; cumActual: number }[];
}) {
  const NAMES: Record<string, string> = {
    plan: "월간계획", actual: "월간실적",
    cumPlan: "누적계획", cumActual: "누적실적",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            barGap={3}
            barCategoryGap="32%"
            margin={{ top: 4, right: 52, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#606059" }}
              axisLine={false}
              tickLine={false}
            />
            {/* 좌축: 월간 막대 */}
            <YAxis
              yAxisId="bar"
              tick={{ fontSize: 12, fill: "#606059" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
              width={52}
            />
            {/* 우축: 누적 라인 */}
            <YAxis
              yAxisId="line"
              orientation="right"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
              width={52}
            />
            <Tooltip
              formatter={(v: number, name: string) => [
                `${v.toLocaleString()} 백만원`,
                NAMES[name] ?? name,
              ]}
              labelFormatter={(l) => String(l)}
              contentStyle={{ fontSize: 11 }}
            />
            <Legend
              formatter={(v) => NAMES[v] ?? v}
              iconSize={10}
              wrapperStyle={{ fontSize: 11 }}
            />
            {/* 월간계획 막대 — 가독성 강화된 슬레이트 */}
            <Bar yAxisId="bar" dataKey="plan" fill="#94a3b8" radius={[3, 3, 0, 0]} name="plan" />
            {/* 월간실적 막대 — 연한 파랑 */}
            <Bar yAxisId="bar" dataKey="actual" fill="#93c5fd" radius={[3, 3, 0, 0]} name="actual" />
            {/* 누적계획 라인 — 가독성 강화된 슬레이트 점선 */}
            <Line
              yAxisId="line"
              type="monotone"
              dataKey="cumPlan"
              stroke="#475569"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: "#475569", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="cumPlan"
            />
            {/* 누적실적 라인 — 파란 실선 */}
            <Line
              yAxisId="line"
              type="monotone"
              dataKey="cumActual"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="cumActual"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** 카테고리 도넛 차트 */
function CategoryDonutChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex gap-2 min-h-0">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                strokeWidth={1}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [`${toMil(v).toLocaleString()} 백만원`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 범례 */}
        <div className="flex flex-col justify-center gap-1.5 pr-2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <div
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: d.color }}
                />
                <span className="whitespace-nowrap">{d.name}</span>
                <span className="font-semibold text-gray-800">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** 카테고리 요약 + 계정과목 상세 통합 아코디언 테이블 */
function MergedAccordionTable({
  summary,
  detail,
}: {
  summary: SummaryRow[];
  detail: ReturnType<typeof getOpexDataByTeam>["detail"];
}) {
  const OPEX_CATS: AccountCategory[] = ["임차료", "전기료", "수선비", "회선료", "기타"];
  const [expanded, setExpanded] = useState<Record<AccountCategory, boolean>>({
    임차료: false,
    전기료: false,
    수선비: false,
    회선료: false,
    기타:   false,
    매출:   false,
    EBITDA: false,
  });

  const toggle = (cat: AccountCategory) =>
    setExpanded((prev: Record<AccountCategory, boolean>) => ({ ...prev, [cat]: !prev[cat] }));

  const fmt    = (v: number) => (v / 100_000).toFixed(1);
  const fmtGap = (v: number) => {
    const abs = (Math.abs(v) / 100_000).toFixed(1);
    return v >= 0 ? `+${abs}` : `-${abs}`;
  };
  const fmtRate = (v: number) => `${v.toFixed(1)}%`;

  const gapCls = (v: number, invert = false) => {
    const positive = invert ? v > 0 : v < 0;
    const negative = invert ? v < 0 : v > 0;
    return positive ? "text-red-500" : negative ? "text-emerald-600" : "";
  };

  // 카테고리 행: summary[0..4], 상세: detail per category
  // 하단 고정 행: OpEx합계(summary[5]), 매출(summary[6]), EBITDA(summary[7])
  const FOOTER_ROWS = [
    { label: "OpEx 합계", row: summary[5], bold: true,  isEbitda: false },
    { label: "매출",     row: summary[6], bold: false, isEbitda: false },
    { label: "EBITDA",  row: summary[7], bold: true,  isEbitda: true  },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-3 py-2 bg-gray-50">
        <span className="text-xl font-semibold text-gray-700">카테고리별 요약 / 계정과목 상세 (억원)</span>
        <span className="ml-2 text-[14px] text-gray-400">▶ 클릭하여 계정 상세 펼치기</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-semibold text-gray-600 w-8" />
              <th className="px-3 py-2 text-left font-semibold text-gray-600">구분</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">당월계획</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">당월실적</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">당월Gap</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">집행률</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">누적계획</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">누적실적</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">누적Gap</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">누적집행률</th>
            </tr>
          </thead>
          <tbody>
            {/* ── 카테고리별 아코디언 행 ── */}
            {OPEX_CATS.map((cat, catIdx) => {
              const sumRow = summary[catIdx];
              const detailRows = detail.filter((d) => d.category === cat);
              const isOpen = expanded[cat];
              const color = CATEGORY_COLORS[cat];
              return (
                <>
                  {/* 카테고리 헤더 행 */}
                  <tr
                    key={`cat-${cat}`}
                    className="cursor-pointer hover:bg-gray-50/80 border-b border-gray-100"
                    onClick={() => toggle(cat)}
                  >
                    <td className="px-3 py-2 text-gray-400">
                      {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </td>
                    <td className="px-3 py-2 font-semibold text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        {cat}
                        <span className="text-gray-400 font-normal text-[10px]">({detailRows.length}개)</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{sumRow ? fmt(sumRow.monthPlan) : "-"}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">{sumRow ? fmt(sumRow.monthActual) : "-"}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${sumRow ? gapCls(sumRow.monthGap) : ""}`}>
                      {sumRow ? fmtGap(sumRow.monthGap) : "-"}
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold ${sumRow ? rateColor(sumRow.monthRate) : ""}`}>
                      {sumRow ? fmtRate(sumRow.monthRate) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{sumRow ? fmt(sumRow.cumPlan) : "-"}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">{sumRow ? fmt(sumRow.cumActual) : "-"}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${sumRow ? gapCls(sumRow.cumGap) : ""}`}>
                      {sumRow ? fmtGap(sumRow.cumGap) : "-"}
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold ${sumRow ? rateColor(sumRow.cumRate) : ""}`}>
                      {sumRow ? fmtRate(sumRow.cumRate) : "-"}
                    </td>
                  </tr>
                  {/* 계정 상세 행 */}
                  {isOpen && detailRows.map((r) => {
                    const mRate = r.monthPlan > 0 ? (r.monthActual / r.monthPlan) * 100 : 0;
                    const cRate = r.cumPlan   > 0 ? (r.cumActual   / r.cumPlan)   * 100 : 0;
                    return (
                      <tr key={r.code} className="border-b border-gray-50 bg-blue-50/20 hover:bg-blue-50/40">
                        <td className="px-3 py-1.5" />
                        <td className="px-3 py-1.5 pl-6 text-gray-500">
                          <span className="font-mono text-[10px] text-gray-400 mr-1">{r.code}</span>
                          {r.name}
                        </td>
                        <td className="px-3 py-1.5 text-right text-gray-500">{fmt(r.monthPlan)}</td>
                        <td className="px-3 py-1.5 text-right text-gray-800">{fmt(r.monthActual)}</td>
                        <td className={`px-3 py-1.5 text-right ${gapCls(r.monthGap)}`}>{fmtGap(r.monthGap)}</td>
                        <td className={`px-3 py-1.5 text-right ${rateColor(mRate)}`}>{fmtRate(mRate)}</td>
                        <td className="px-3 py-1.5 text-right text-gray-500">{fmt(r.cumPlan)}</td>
                        <td className="px-3 py-1.5 text-right text-gray-800">{fmt(r.cumActual)}</td>
                        <td className={`px-3 py-1.5 text-right ${gapCls(r.cumGap)}`}>{fmtGap(r.cumGap)}</td>
                        <td className={`px-3 py-1.5 text-right ${rateColor(cRate)}`}>{fmtRate(cRate)}</td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
            {/* ── 하단 합계 / EBITDA 행 ── */}
            {FOOTER_ROWS.map(({ label, row, bold, isEbitda }) => row ? (
              <tr
                key={label}
                className={`border-b border-gray-200 ${
                  bold ? "bg-gray-100 font-semibold" : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className="px-3 py-2" />
                <td className="px-3 py-2 text-gray-700">{label}</td>
                <td className="px-3 py-2 text-right text-gray-600">{fmt(row.monthPlan)}</td>
                <td className="px-3 py-2 text-right text-gray-900">{fmt(row.monthActual)}</td>
                <td className={`px-3 py-2 text-right ${gapCls(row.monthGap, isEbitda)}`}>{fmtGap(row.monthGap)}</td>
                <td className={`px-3 py-2 text-right ${isEbitda ? "" : rateColor(row.monthRate)}`}>
                  {isEbitda ? "-" : fmtRate(row.monthRate)}
                </td>
                <td className="px-3 py-2 text-right text-gray-600">{fmt(row.cumPlan)}</td>
                <td className="px-3 py-2 text-right text-gray-900">{fmt(row.cumActual)}</td>
                <td className={`px-3 py-2 text-right ${gapCls(row.cumGap, isEbitda)}`}>{fmtGap(row.cumGap)}</td>
                <td className={`px-3 py-2 text-right ${isEbitda ? "" : rateColor(row.cumRate)}`}>
                  {isEbitda ? "-" : fmtRate(row.cumRate)}
                </td>
              </tr>
            ) : null)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────────────────────

export function OpexPage({ region }: OpexPageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const homeData  = getHomeData(regionKey);
  const { opexMeta } = homeData;

  const data = useMemo(
    () => getOpexDataByTeam(region, null, BASE_MONTH),
    [region],
  );

  const { summary, detail, opexTrend, opexCumTrend } = data;

  // 요약 행 인덱스 기반 접근
  const opexTotalRow  = summary[5]; // OpEx 합계 (category:"EBITDA"로 저장된 opexRow)
  const salesRow      = summary[6]; // 매출
  const ebitdaRow     = summary[7]; // EBITDA

  // 도넛 차트 데이터: 카테고리별 당월 실적
  const donutData = useMemo(() => {
    const cats: AccountCategory[] = ["임차료", "전기료", "수선비", "회선료", "기타"];
    return (summary as SummaryRow[])
      .slice(0, 5)
      .map((row: SummaryRow, i: number) => ({
        name:  cats[i],
        value: row.monthActual,
        color: CATEGORY_COLORS[cats[i]],
      }))
      .filter((d: { value: number }) => d.value > 0);
  }, [summary]);

  // 복합 차트 데이터: 월간(막대) + 누적(라인) 병합
  const comboChartData = useMemo(() => {
    const trend = opexTrend    as { label: string; plan: number; actual: number }[];
    const cum   = opexCumTrend as { label: string; cumPlan: number; cumActual: number }[];
    return trend.map((t, i) => ({
      label:     t.label,
      plan:      toMil(t.plan),
      actual:    toMil(t.actual),
      cumPlan:   toMil(cum[i]?.cumPlan   ?? 0),
      cumActual: toMil(cum[i]?.cumActual ?? 0),
    }));
  }, [opexTrend, opexCumTrend]);

  return (
    <div className="flex flex-col gap-4 min-h-full p-4 bg-gray-50">

      {/* ── 페이지 헤더 ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-[28px] font-bold text-gray-800 leading-none">OpEx 집행현황</h2>
          <span className="text-[14px] text-gray-600">(2026년 {BASE_MONTH}월 기준)</span>
        </div>
        <span className="text-[11px] text-gray-400 bg-white border border-gray-200 rounded px-2 py-1">
          {opexMeta.baseDate}
        </span>
      </div>

      {/* ── KPI 카드 4개 ── */}
      <div className="flex gap-3">
        {/* 당월 집행금액 — opexMockData 월별 실적 */}
        <KpiCard
          label={`당월 집행금액 (${BASE_MONTH}월)`}
          value={opexTotalRow ? toOk(opexTotalRow.monthActual) : "-"}
          unit="억원"
          sub={`계획 ${opexTotalRow ? toOk(opexTotalRow.monthPlan) : "-"}억원`}
          badge={opexTotalRow ? `${opexTotalRow.monthRate.toFixed(1)}%` : undefined}
          badgeTone={opexTotalRow ? rateBadgeTone(opexTotalRow.monthRate) : "good"}
          className="flex-1 min-w-0"
        />
        {/* 누적 집행금액 — home 대시보드와 동일 수치 (opexMeta) */}
        <KpiCard
          label="누적 집행금액"
          value={opexMeta.totalActual}
          unit="억원"
          sub={`연간예산 ${opexMeta.totalBudget}억원`}
          badge={`${opexMeta.totalRate.toFixed(1)}%`}
          badgeTone={rateBadgeTone(opexMeta.totalRate)}
          className="flex-1 min-w-0"
        />
        {/* 당월 매출 — opexMockData 월별 */}
        <KpiCard
          label={`당월 매출 (${BASE_MONTH}월)`}
          value={salesRow ? toOk(salesRow.monthActual) : "-"}
          unit="억원"
          sub={`계획 ${salesRow ? toOk(salesRow.monthPlan) : "-"}억원`}
          badge={salesRow ? `${salesRow.monthRate.toFixed(1)}%` : undefined}
          badgeTone={salesRow ? rateBadgeTone(salesRow.monthRate) : "good"}
          className="flex-1 min-w-0"
        />
        {/* 당월 EBITDA */}
        <KpiCard
          label={`당월 EBITDA (${BASE_MONTH}월)`}
          value={ebitdaRow ? toOk(ebitdaRow.monthActual) : "-"}
          unit="억원"
          sub={`계획 ${ebitdaRow ? toOk(ebitdaRow.monthPlan) : "-"}억원`}
          variant={
            ebitdaRow
              ? parseFloat(toOk(ebitdaRow.monthActual)) >=
                parseFloat(toOk(ebitdaRow.monthPlan))
                ? "default"
                : "warn"
              : "default"
          }
          className="flex-1 min-w-0"
        />
      </div>

      {/* ── 차트 섹션 ── */}
      <div className="grid grid-cols-5 gap-3" style={{ height: 256 }}>
        {/* 복합 차트 (3/5) */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 pt-3 pb-0 border-b border-gray-100">
            <div className="flex items-end justify-between gap-3 mb-2">
              <p className="text-xl font-bold text-gray-700 leading-none">계획대비 실적</p>
              <p className="text-[15px] text-[#6b7280] text-right leading-tight">
                막대(좌축): 월간 · 라인(우축): 누적 / 단위 백만원
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-3">
            <ComboTrendChart data={comboChartData} />
          </div>
        </div>
        {/* 도넛 차트 (2/5) */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 pt-3 pb-0 border-b border-gray-100">
            <div className="flex items-end justify-between gap-3 mb-2">
              <p className="text-xl font-bold text-gray-700 leading-none">집행 비율</p>
              <p className="text-[15px] text-[#6b7280] text-right leading-tight">
                당월 {BASE_MONTH}월 실적 기준
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-3">
            <CategoryDonutChart data={donutData} />
          </div>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <MergedAccordionTable summary={summary as SummaryRow[]} detail={detail} />
    </div>
  );
}
