import { useMemo, useState } from "react";
import { ComposedChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { HqDivision } from "../data/facilityStatusData";
import {
  getStabilityData,
  VocConsultType,
  VocLocationCode,
  VOC_CONSULT_TYPES,
  VOC_LOCATION_CODES,
} from "../data/stabilityMockData";

interface StabilityPageProps {
  region: HqDivision;
}

type PeriodType = "weekly" | "monthly";
type RmStatusFilter = "all" | "처리" | "진행중";
type RmSortKey = "category" | "title" | "occurredAt" | "status";
type SortOrder = "asc" | "desc";

const STATUS_STYLE: Record<"처리" | "진행중", string> = {
  처리: "bg-blue-50 text-blue-700 border-blue-200",
  진행중: "bg-amber-50 text-amber-700 border-amber-200",
};

function toKstDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00+09:00`);
}

function dateLabel(dateStr: string): string {
  const d = toKstDate(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

function inRange(dateStr: string, start: Date, end: Date): boolean {
  const d = toKstDate(dateStr);
  return d >= start && d <= end;
}

export function StabilityPage({ region }: StabilityPageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const data = getStabilityData(regionKey);

  const [consultFilter, setConsultFilter] = useState<VocConsultType | "all">("all");
  const [locationFilter, setLocationFilter] = useState<VocLocationCode | "all">("all");
  const [metroFilter, setMetroFilter] = useState<string>("all");
  const [period, setPeriod] = useState<PeriodType>("weekly");
  const [rmCategoryFilter, setRmCategoryFilter] = useState<string>("all");
  const [rmStatusFilter, setRmStatusFilter] = useState<RmStatusFilter>("all");
  const [rmTitleFilter, setRmTitleFilter] = useState<string>("");
  const [rmSortKey, setRmSortKey] = useState<RmSortKey>("occurredAt");
  const [rmSortOrder, setRmSortOrder] = useState<SortOrder>("desc");

  const rmCategoryOptions = useMemo(() => {
    return ["all", ...new Set(data.rmList.map((item) => item.category))];
  }, [data.rmList]);

  const metroOptions = useMemo(() => {
    return ["all", ...Object.keys(data.vocSummary.byMetro).sort((a, b) => a.localeCompare(b, "ko-KR"))];
  }, [data.vocSummary.byMetro]);

  const latestVocDate = useMemo(() => {
    return data.vocList.reduce((max, item) => (item.date > max ? item.date : max), data.vocList[0]?.date ?? "2026-05-01");
  }, [data.vocList]);

  const filteredVoc = useMemo(() => {
    const end = toKstDate(latestVocDate);
    const start = new Date(end);
    start.setDate(end.getDate() - (period === "weekly" ? 6 : 29));

    return data.vocList.filter((item) => {
      if (!inRange(item.date, start, end)) return false;
      if (consultFilter !== "all" && item.consultType !== consultFilter) return false;
      if (locationFilter !== "all" && item.locationCode !== locationFilter) return false;
      if (metroFilter !== "all" && item.metropolitan !== metroFilter) return false;
      return true;
    });
  }, [data.vocList, latestVocDate, period, consultFilter, locationFilter, metroFilter]);

  const vocChartData = useMemo(() => {
    const dailyCount = new Map<string, number>();
    for (const item of filteredVoc) {
      dailyCount.set(item.date, (dailyCount.get(item.date) ?? 0) + 1);
    }

    return [...dailyCount.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        label: dateLabel(date),
        count,
      }));
  }, [filteredVoc]);

  const latestDailyVocTotal = useMemo(() => {
    const target = latestVocDate;
    return filteredVoc.filter((v) => v.date === target).length;
  }, [filteredVoc, latestVocDate]);

  const ongoingRmCount = useMemo(() => {
    return data.rmList.filter((item) => item.status === "처리중").length;
  }, [data.rmList]);

  const rmRows = useMemo(() => {
    const filtered = data.rmList.filter((item) => {
      const statusLabel = item.status === "처리완료" ? "처리" : "진행중";
      if (rmCategoryFilter !== "all" && item.category !== rmCategoryFilter) return false;
      if (rmStatusFilter !== "all" && statusLabel !== rmStatusFilter) return false;
      if (rmTitleFilter.trim() && !item.title.toLowerCase().includes(rmTitleFilter.trim().toLowerCase())) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aStatus = a.status === "처리완료" ? "처리" : "진행중";
      const bStatus = b.status === "처리완료" ? "처리" : "진행중";

      const aValue =
        rmSortKey === "status"
          ? aStatus
          : rmSortKey === "occurredAt"
          ? a.occurredAt
          : a[rmSortKey];
      const bValue =
        rmSortKey === "status"
          ? bStatus
          : rmSortKey === "occurredAt"
          ? b.occurredAt
          : b[rmSortKey];

      const compared = String(aValue).localeCompare(String(bValue), "ko-KR");
      return rmSortOrder === "asc" ? compared : -compared;
    });

    return sorted;
  }, [data.rmList, rmCategoryFilter, rmStatusFilter, rmTitleFilter, rmSortKey, rmSortOrder]);

  const handleRmSort = (key: RmSortKey) => {
    if (rmSortKey === key) {
      setRmSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setRmSortKey(key);
    setRmSortOrder("asc");
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-[3px]" style={{ borderTopColor: "var(--region-primary)" }}>
          <div className="text-xs text-gray-500">RM 현황</div>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-[28px] leading-none font-bold font-mono text-gray-900">{ongoingRmCount.toLocaleString()}</span>
            <span className="text-xs text-gray-500 mb-0.5">건</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">발생 RM 중 진행중 항목</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-t-[3px]" style={{ borderTopColor: "#0ea5e9" }}>
          <div className="text-xs text-gray-500">VoC 현황</div>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-[28px] leading-none font-bold font-mono text-gray-900">{latestDailyVocTotal.toLocaleString()}</span>
            <span className="text-xs text-gray-500 mb-0.5">건</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">일간 총 VoC 현황 ({dateLabel(latestVocDate)})</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col min-h-0">
          <div className="mb-2">
            <div className="text-sm font-bold text-gray-800">RM 현황</div>
            <div className="text-[11px] text-gray-500">분류, 내용, 일시, 현황</div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={rmCategoryFilter}
              onChange={(e) => setRmCategoryFilter(e.target.value)}
            >
              <option value="all">분류: 전체</option>
              {rmCategoryOptions.filter((item) => item !== "all").map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={rmStatusFilter}
              onChange={(e) => setRmStatusFilter(e.target.value as RmStatusFilter)}
            >
              <option value="all">현황: 전체</option>
              <option value="처리">처리</option>
              <option value="진행중">진행중</option>
            </select>

            <input
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              placeholder="내용 검색"
              value={rmTitleFilter}
              onChange={(e) => setRmTitleFilter(e.target.value)}
            />
          </div>

          <div className="mb-2 text-[11px] text-gray-500">
            필터 결과 <span className="font-mono font-semibold text-gray-700">{rmRows.length}</span>건
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-xs border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                  <th className="text-left px-2 py-2 font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleRmSort("category")}>분류 {rmSortKey === "category" ? (rmSortOrder === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="text-left px-2 py-2 font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleRmSort("title")}>내용 {rmSortKey === "title" ? (rmSortOrder === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="text-left px-2 py-2 font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleRmSort("occurredAt")}>일시 {rmSortKey === "occurredAt" ? (rmSortOrder === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="text-center px-2 py-2 font-semibold text-gray-700 border-b cursor-pointer" onClick={() => handleRmSort("status")}>현황 {rmSortKey === "status" ? (rmSortOrder === "asc" ? "▲" : "▼") : ""}</th>
                </tr>
              </thead>
              <tbody>
                {rmRows.map((item, idx) => {
                  const statusLabel = item.status === "처리완료" ? "처리" : "진행중";
                  return (
                    <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-2 py-2 border-b text-gray-700 whitespace-nowrap">{item.category}</td>
                      <td className="px-2 py-2 border-b text-gray-700 max-w-[380px] truncate">{item.title}</td>
                      <td className="px-2 py-2 border-b text-gray-600 whitespace-nowrap">{item.occurredAt}</td>
                      <td className="px-2 py-2 border-b text-center">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[statusLabel]}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-bold text-gray-800">VoC 현황</div>
              <div className="text-[11px] text-gray-500">일별 VoC 건수</div>
            </div>
            <div className="text-[11px] text-gray-500">총 {filteredVoc.length.toLocaleString()}건</div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={consultFilter}
              onChange={(e) => setConsultFilter(e.target.value as VocConsultType | "all")}
            >
              <option value="all">세부 상담명: 전체</option>
              {VOC_CONSULT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value as VocLocationCode | "all")}
            >
              <option value="all">품질발생지역 코드: 전체</option>
              {VOC_LOCATION_CODES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={metroFilter}
              onChange={(e) => setMetroFilter(e.target.value)}
            >
              <option value="all">지역 구분(광역시): 전체</option>
              {metroOptions.filter((item) => item !== "all").map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-700"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
            >
              <option value="weekly">주간</option>
              <option value="monthly">월간</option>
            </select>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={vocChartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, (dataMax: number) => Math.max(10, dataMax)]}
                />
                <Tooltip formatter={(value: number) => [value.toLocaleString(), "VoC 건수"]} />
                <Bar dataKey="count" fill="#7dc3c5" radius={[4, 4, 0, 0]} maxBarSize={34} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
