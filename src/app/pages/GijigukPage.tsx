// src/app/pages/GijigukPage.tsx
import { useState, useMemo } from "react";
import { useAppStore } from "../stores/appStore";
import { ChevronUp, ChevronDown } from "lucide-react";
import { KpiCard } from "../components/KpiCard";  // ← 추가
import { GijigukKpiSidebar } from "../components/GijigukKpiSidebar";
import { Gijiguk5GSidebar } from "../components/Gijiguk5GSidebar";
import { GijigukEquipDrilldownSidebar } from "../components/GijigukEquipDrilldownSidebar";
import { GijigukCityDetailSidebar } from "../components/GijigukCityDetailSidebar";
import { IssueDetailSidebar } from "../components/IssueDetailSidebar";
import { GijigukStateMapCard } from "../components/GijigukStateMapCard";
import { ColumnFilterDropdown } from "../components/ColumnFilterDropdown";

import {
  HQ_TEAMS,
  HqDivision,
  AccessTeam,
  GIJIGUK_LTE_EQUIP,
  GIJIGUK_WCDMA_EQUIP,
  GIJIGUK_LORA_EQUIP,
  getGijigukKpi,
  getGijigukCityStats,
  getGijigukAbnormalSiteStatus,
  filterGijiguk,
  GijigukCityStats,
  GijigukAbnormalSiteStatus,
} from "../data/facilityStatusData";

function Num({ v, className = "" }: { v: number; className?: string }) {
  return (
    <span className={className}>
      {v > 0 ? v.toLocaleString() : <span className="text-gray-300">—</span>}
    </span>
  );
}

export function GijigukPage() {
  const { region } = useAppStore();
  const [selectedTeam, setSelectedTeam] = useState<AccessTeam | null>(null);
  const [isSiteKpiOpen, setIsSiteKpiOpen] = useState(false);
  const [isFiveGKpiOpen, setIsFiveGKpiOpen] = useState(false);
  const [isLteKpiOpen, setIsLteKpiOpen] = useState(false);
  const [isWcdmaKpiOpen, setIsWcdmaKpiOpen] = useState(false);
  const [isLoraKpiOpen, setIsLoraKpiOpen] = useState(false);
  const [isCityDetailOpen, setIsCityDetailOpen] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState<GijigukCityStats | null>(null);
  const [isIssueDetailOpen, setIsIssueDetailOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<GijigukAbnormalSiteStatus | null>(null);

  // ── 테이블 필터 상태 (다중선택) ──
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterCities, setFilterCities] = useState<string[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);

  // ── 테이블 정렬 상태 ──
  const [sortBy, setSortBy] = useState<keyof GijigukCityStats | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ── 필터 드롭다운 상태 ──
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const teamList  = HQ_TEAMS[region];
  const kpi       = getGijigukKpi(region, selectedTeam);
  const cityStats = getGijigukCityStats(region, selectedTeam);
  const allRows   = filterGijiguk(region, selectedTeam);

  const hqLabel     = region === "central" ? "중부" : "서부";
  const accentColor = region === "central" ? "#1E40AF" : "#065F46";
  const badgeClass  = region === "central"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const getTeamBtnClass = (team: AccessTeam) => {
    const active = selectedTeam === team;
    return region === "central"
      ? active
        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      : active
        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600";
  };

  const getAllBtnClass = () => {
    const active = selectedTeam === null;
    return region === "central"
      ? active
        ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
        : "bg-white text-gray-400 border-gray-200 hover:border-blue-200 hover:text-blue-500"
      : active
        ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
        : "bg-white text-gray-400 border-gray-200 hover:border-emerald-200 hover:text-emerald-500";
  };

  const total = {
    siteCount:  cityStats.reduce((a, r) => a + r.siteCount,  0),
    fiveGTotal: cityStats.reduce((a, r) => a + r.fiveGTotal, 0),
    lteTotal:   cityStats.reduce((a, r) => a + r.lteTotal,   0),
    wcdmaTotal: cityStats.reduce((a, r) => a + r.wcdmaTotal, 0),
    loraTotal:  cityStats.reduce((a, r) => a + r.loraTotal,  0),
  };

  // ── 시군구 수 (장비 존재하는 행 기준) ──
  const fiveGCities  = allRows.filter(r => Object.keys(r.fiveG).length  > 0).length;
  const lteCities    = allRows.filter(r => Object.keys(r.lte).length    > 0).length;
  const wcdmaCities  = allRows.filter(r => Object.keys(r.wcdma).length  > 0).length;
  const loraCities   = allRows.filter(r => Object.keys(r.lora).length   > 0).length;

  const visibleAbnormalSites = getGijigukAbnormalSiteStatus(region, selectedTeam);

  // ── 테이블 필터링 및 정렬 ──
  const filteredAndSortedCityStats = useMemo(() => {
    let result = cityStats.filter((row) => {
      // 필터가 비어있으면 전체 표시 (OR 조건)
      const matchState = filterStates.length === 0 || filterStates.includes(row.state);
      const matchCity = filterCities.length === 0 || filterCities.includes(row.city);
      const matchTeam = filterTeams.length === 0 || filterTeams.includes(row.team);
      return matchState && matchCity && matchTeam;
    });

    // 정렬 적용
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        return 0;
      });
    }

    return result;
  }, [cityStats, filterStates, filterCities, filterTeams, sortBy, sortOrder]);

  // ── 필터 드롭다운용 유니크 값 ──
  const uniqueStates = useMemo(() => {
    return [...new Set(cityStats.map((r) => r.state))].sort();
  }, [cityStats]);

  const uniqueCities = useMemo(() => {
    return [...new Set(cityStats.map((r) => r.city))].sort();
  }, [cityStats]);

  const uniqueTeams = useMemo(() => {
    return [...new Set(cityStats.map((r) => r.team))].sort();
  }, [cityStats]);

  // ── 정렬 토글 함수 ──
  const handleSortClick = (column: keyof GijigukCityStats) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // ── 필터 토글 함수 ──
  const toggleStateFilter = (state: string) => {
    setFilterStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    );
  };

  const toggleCityFilter = (city: string) => {
    setFilterCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  const toggleTeamFilter = (team: string) => {
    setFilterTeams((prev) =>
      prev.includes(team)
        ? prev.filter((t) => t !== team)
        : [...prev, team]
    );
  };

  const clearStateFilter = () => {
    setFilterStates([]);
    setOpenDropdown(null);
  };

  const clearCityFilter = () => {
    setFilterCities([]);
    setOpenDropdown(null);
  };

  const clearTeamFilter = () => {
    setFilterTeams([]);
    setOpenDropdown(null);
  };

  // ── 활성 필터 칩 생성 ──
  const getActiveFilterChips = () => {
    const chips: Array<{
      type: string;
      label: string;
      onRemove: () => void;
    }> = [];

    filterStates.forEach((state) => {
      chips.push({
        type: "state",
        label: `광역시도: ${state}`,
        onRemove: () => toggleStateFilter(state),
      });
    });

    filterCities.forEach((city) => {
      chips.push({
        type: "city",
        label: `시군구: ${city}`,
        onRemove: () => toggleCityFilter(city),
      });
    });

    filterTeams.forEach((team) => {
      chips.push({
        type: "team",
        label: `담당팀: ${team}`,
        onRemove: () => toggleTeamFilter(team),
      });
    });

    return chips;
  };

  const hasActiveFilters = () => {
    return filterStates.length > 0 || filterCities.length > 0 || filterTeams.length > 0;
  };

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full">

      {/* ━━━ ① 헤더 + 팀 선택 버튼 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-1 h-5 rounded" style={{ backgroundColor: accentColor }} />
        <h2 className="text-lg font-bold text-gray-800">기지국 현황</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
          {hqLabel} 본부
        </span>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <button
          onClick={() => setSelectedTeam(null)}
          className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-150 ${getAllBtnClass()}`}
        >
          전체
        </button>

        {teamList.map((team) => (
          <button
            key={team}
            onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
            className={`text-xs px-4 py-1.5 rounded-xl border transition-all duration-150 ${getTeamBtnClass(team)}`}
          >
            {team}
          </button>
        ))}

        {selectedTeam && (
          <span className="text-xs text-gray-400 ml-1">
            → <span className="font-medium text-gray-600">{selectedTeam}</span> 필터 적용 중
          </span>
        )}
      </div>

      {/* ━━━ ② KPI 카드 5개 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-5 gap-2.5">

        {/* 전체 사이트 */}
        <KpiCard
          label="전체 사이트"
          value={kpi.totalSite}
          unit="개소"
          yoy={null}
          onClick={() => setIsSiteKpiOpen(true)}
        />

        {/* 5G 장비 */}
        <KpiCard
          label={`5G 장비 (${fiveGCities}개 시군구)`}
          value={kpi.fiveG}
          unit="대"
          yoy={null}
          onClick={() => setIsFiveGKpiOpen(true)}
        />

        {/* LTE 장비 */}
        <KpiCard
          label={`LTE 장비 (${lteCities}개 시군구)`}
          value={kpi.lte}
          unit="대"
          yoy={null}
          onClick={() => setIsLteKpiOpen(true)}
        />

        {/* WCDMA 장비 */}
        <KpiCard
          label={`WCDMA 장비 (${wcdmaCities}개 시군구)`}
          value={kpi.wcdma}
          unit="대"
          yoy={null}
          onClick={() => setIsWcdmaKpiOpen(true)}
        />

        {/* LoRa 장비 */}
        <KpiCard
          label={`LoRa 장비 (${loraCities}개 시군구)`}
          value={kpi.lora}
          unit="대"
          yoy={null}
          onClick={() => setIsLoraKpiOpen(true)}
        />
      </div>

      {/* ━━━ ③ 광역시도 분포 + 기지국 현황(더미) ━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-12 gap-2.5 items-stretch">
        <div className="col-span-6">
          <GijigukStateMapCard region={region} rows={allRows} />
        </div>

        <div className="col-span-6 bg-white rounded-lg shadow-sm">
          {/* 제목 */}
          <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">기지국 현황</h3>
          </div>

          {/* 더미 데이터 콘텐츠 */}
          <div className="px-3.5 pt-3 pb-3.5 space-y-2.5">
            {visibleAbnormalSites.length === 0 && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-4 text-xs text-gray-400 text-center">
                선택한 팀 기준으로 표시할 더미 이상 항목이 없습니다.
              </div>
            )}

            {visibleAbnormalSites.map((item) => {
              const levelClass =
                item.severity === "심각"
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : item.severity === "경계"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-blue-50 text-blue-600 border-blue-200";

              return (
                <div
                  key={item.eventId}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3 cursor-pointer hover:border-gray-200 transition-colors"
                  onClick={() => {
                    setSelectedIssueDetail(item);
                    setIsIssueDetailOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">{item.siteName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${levelClass}`}>
                      {item.severity}
                    </span>
                    <span className="ml-auto text-[11px] text-gray-400">{item.team}</span>
                  </div>

                  <div className="mt-1.5 text-[11px] text-gray-500">{item.state} {item.city} · {item.siteCode}</div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.abnormalCategories.map((category) => (
                      <span
                        key={category}
                        className="text-[10px] px-2 py-0.5 rounded-md border border-gray-200 bg-white text-gray-600"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ━━━ ④ 행정구역별 현황 테이블 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white rounded-lg shadow-sm flex flex-col">
        {/* 테이블 제목 */}
        <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">기지국 세부현황</h3>
        </div>

        {/* 필터 영역 */}
        <div className="px-3.5 pt-3 pb-1.5 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              {/* 필터 표시 */}
              <div className="text-[11px] text-gray-500 font-mono">
                총{" "}
                <b style={{ color: accentColor }}>
                  {cityStats.length}
                </b>
                개 중{" "}
                <b style={{ color: accentColor }}>
                  {filteredAndSortedCityStats.length}
                </b>
                개 표시
              </div>
            </div>

            {/* 초기화 버튼 */}
            <button
              onClick={() => {
                setFilterStates([]);
                setFilterCities([]);
                setFilterTeams([]);
              }}
              className={`px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1 transition-all ml-auto ${
                hasActiveFilters()
                  ? "border-gray-700 text-gray-700 bg-gray-50"
                  : "border-gray-300 text-gray-500 bg-white hover:border-gray-400"
              }`}
              style={
                hasActiveFilters()
                  ? { borderColor: accentColor, color: accentColor, backgroundColor: accentColor + "11" }
                  : {}
              }
            >
              ↺ 전체 초기화
            </button>
          </div>
        </div>

        {/* 활성 필터 칩 */}
        {getActiveFilterChips().length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap px-3.5 pb-1.5 flex-shrink-0">
            {getActiveFilterChips().map((chip, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                style={{
                  backgroundColor: accentColor + "11",
                  borderColor: accentColor + "44",
                  color: accentColor,
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.onRemove}
                  className="font-bold opacity-60 hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            {getActiveFilterChips().length > 1 && (
              <button
                onClick={() => {
                  setFilterStates([]);
                  setFilterCities([]);
                  setFilterTeams([]);
                }}
                className="text-[10px] text-gray-400 hover:text-red-400 font-semibold ml-1 transition-colors"
              >
                모두 지우기
              </button>
            )}
          </div>
        )}

        {/* 테이블 */}
        <div className="px-3.5 pt-1.5 pb-5 overflow-x-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-xs">
            <thead
              className="sticky top-0 z-10"
              style={{ backgroundColor: accentColor + "11" }}
            >
              <tr>
                {/* 광역시도 - 필터 포함 */}
                <th
                  className="sticky left-0 z-20 text-left py-2 px-3 font-bold whitespace-nowrap border-r"
                  style={{ backgroundColor: accentColor + "11", color: accentColor }}
                >
                  <div className="flex items-center gap-1">
                    <span>광역시도</span>
                    <ColumnFilterDropdown
                      column="state"
                      values={uniqueStates}
                      selectedValues={filterStates}
                      onToggle={toggleStateFilter}
                      onClear={clearStateFilter}
                      isOpen={openDropdown === "state"}
                      onOpenChange={(open) => setOpenDropdown(open ? "state" : null)}
                    />
                  </div>
                </th>

                {/* 시·군·구 - 필터 포함 */}
                <th
                  className="text-left py-2 px-3 font-bold whitespace-nowrap"
                  style={{ backgroundColor: accentColor + "11", color: accentColor }}
                >
                  <div className="flex items-center gap-1">
                    <span>시·군·구</span>
                    <ColumnFilterDropdown
                      column="city"
                      values={uniqueCities}
                      selectedValues={filterCities}
                      onToggle={toggleCityFilter}
                      onClear={clearCityFilter}
                      isOpen={openDropdown === "city"}
                      onOpenChange={(open) => setOpenDropdown(open ? "city" : null)}
                    />
                  </div>
                </th>

                {/* 담당팀 - 필터 포함 (selectedTeam이 null일 때만) */}
                {!selectedTeam && (
                  <th
                    className="text-left py-2 px-3 font-bold whitespace-nowrap"
                    style={{ backgroundColor: accentColor + "11", color: accentColor }}
                  >
                    <div className="flex items-center gap-1">
                      <span>담당 팀</span>
                      <ColumnFilterDropdown
                        column="team"
                        values={uniqueTeams}
                        selectedValues={filterTeams}
                        onToggle={toggleTeamFilter}
                        onClear={clearTeamFilter}
                        isOpen={openDropdown === "team"}
                        onOpenChange={(open) => setOpenDropdown(open ? "team" : null)}
                      />
                    </div>
                  </th>
                )}

                {/* 정렬 가능 컬럼들 */}
                <th
                  className="text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer"
                  style={{ 
                    backgroundColor: accentColor + "11", 
                    color: accentColor,
                  }}
                  onClick={() => handleSortClick("siteCount")}
                >
                  <div className="flex items-center justify-end gap-1 hover:opacity-70">
                    <span>사이트</span>
                    {sortBy === "siteCount" && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </th>
                <th
                  className="text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer text-purple-600"
                  style={{ backgroundColor: accentColor + "11" }}
                  onClick={() => handleSortClick("fiveGTotal")}
                >
                  <div className="flex items-center justify-end gap-1 hover:opacity-70">
                    <span>5G</span>
                    {sortBy === "fiveGTotal" && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </th>
                <th
                  className="text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer text-blue-600"
                  style={{ backgroundColor: accentColor + "11" }}
                  onClick={() => handleSortClick("lteTotal")}
                >
                  <div className="flex items-center justify-end gap-1 hover:opacity-70">
                    <span>LTE</span>
                    {sortBy === "lteTotal" && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </th>
                <th
                  className="text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer text-green-600"
                  style={{ backgroundColor: accentColor + "11" }}
                  onClick={() => handleSortClick("wcdmaTotal")}
                >
                  <div className="flex items-center justify-end gap-1 hover:opacity-70">
                    <span>WCDMA</span>
                    {sortBy === "wcdmaTotal" && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </th>
                <th
                  className="text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer text-orange-500"
                  style={{ backgroundColor: accentColor + "11" }}
                  onClick={() => handleSortClick("loraTotal")}
                >
                  <div className="flex items-center justify-end gap-1 hover:opacity-70">
                    <span>LoRa</span>
                    {sortBy === "loraTotal" && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCityStats.map((row, idx) => (
                <tr
                  key={`${row.state}-${row.city}-${idx}`}
                  className="group border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCityDetail(row);
                    setIsCityDetailOpen(true);
                  }}
                >
                  <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 border-r bg-white group-hover:bg-gray-50">{row.state}</td>
                  <td className="py-2 px-3 text-gray-800 font-semibold">{row.city}</td>
                  {!selectedTeam && (
                    <td className="py-2 px-3 text-gray-600 text-[11px]">{row.team}</td>
                  )}
                  <td className="py-2 px-3 text-right text-gray-700 font-bold">
                    {row.siteCount.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Num v={row.fiveGTotal} className="text-purple-600 font-medium" />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Num v={row.lteTotal} className="text-blue-600 font-medium" />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Num v={row.wcdmaTotal} className="text-green-600 font-medium" />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Num v={row.loraTotal} className="text-orange-500 font-medium" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
                <td className="py-2 px-3" colSpan={!selectedTeam ? 3 : 2}>
                  합계
                </td>
                <td className="py-2 px-3 text-right font-bold">
                  {filteredAndSortedCityStats.reduce((a, r) => a + r.siteCount, 0).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-purple-600">
                  {filteredAndSortedCityStats.reduce((a, r) => a + r.fiveGTotal, 0).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-blue-600">
                  {filteredAndSortedCityStats.reduce((a, r) => a + r.lteTotal, 0).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-green-600">
                  {filteredAndSortedCityStats.reduce((a, r) => a + r.wcdmaTotal, 0).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-orange-500">
                  {filteredAndSortedCityStats.reduce((a, r) => a + r.loraTotal, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* 데이터 없을 때 */}
          {filteredAndSortedCityStats.length === 0 && (
            <div className="flex items-center justify-center h-24 text-gray-400 text-xs">
              조건에 맞는 데이터가 없습니다.
            </div>
          )}
        </div>

      </div>

      <GijigukKpiSidebar
        isOpen={isSiteKpiOpen}
        onClose={() => setIsSiteKpiOpen(false)}
        rows={allRows}
      />

      <Gijiguk5GSidebar
        isOpen={isFiveGKpiOpen}
        onClose={() => setIsFiveGKpiOpen(false)}
        rows={allRows}
      />

      <GijigukEquipDrilldownSidebar
        isOpen={isLteKpiOpen}
        onClose={() => setIsLteKpiOpen(false)}
        rows={allRows}
        equipLabel="LTE"
        equipKeys={GIJIGUK_LTE_EQUIP}
        recordKey="lte"
      />

      <GijigukEquipDrilldownSidebar
        isOpen={isWcdmaKpiOpen}
        onClose={() => setIsWcdmaKpiOpen(false)}
        rows={allRows}
        equipLabel="WCDMA"
        equipKeys={GIJIGUK_WCDMA_EQUIP}
        recordKey="wcdma"
      />

      <GijigukEquipDrilldownSidebar
        isOpen={isLoraKpiOpen}
        onClose={() => setIsLoraKpiOpen(false)}
        rows={allRows}
        equipLabel="LoRa"
        equipKeys={GIJIGUK_LORA_EQUIP}
        recordKey="lora"
      />

      <GijigukCityDetailSidebar
        isOpen={isCityDetailOpen}
        onClose={() => setIsCityDetailOpen(false)}
        rows={allRows}
        selectedCityStat={selectedCityDetail}
      />

      <IssueDetailSidebar
        isOpen={isIssueDetailOpen}
        onClose={() => setIsIssueDetailOpen(false)}
        title="기지국 현황 상세"
        item={selectedIssueDetail}
      />

    </div>    
  );
}
