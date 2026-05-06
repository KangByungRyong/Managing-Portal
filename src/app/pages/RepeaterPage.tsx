import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import { ColumnFilterDropdown } from "../components/ColumnFilterDropdown";
import { RepeaterStateMapCard } from "../components/RepeaterStateMapCard";
import { RepeaterKpiSidebar } from "../components/RepeaterKpiSidebar";
import { RepeaterEquipDrilldownSidebar } from "../components/RepeaterEquipDrilldownSidebar";
import { RepeaterCityDetailSidebar } from "../components/RepeaterCityDetailSidebar";
import { IssueDetailSidebar } from "../components/IssueDetailSidebar";
import {
  AccessTeam,
  HqDivision,
  HQ_TEAMS,
  REPEATER_5G_EQUIP,
  REPEATER_IDONG_EQUIP,
  REPEATER_LTE_EQUIP,
  REPEATER_WCDMA_EQUIP,
  REPEATER_WIBRO_EQUIP,
  RepeaterCityStats,
  RepeaterAbnormalSiteStatus,
  filterRepeater,
  getRepeaterAbnormalSiteStatus,
  getRepeaterCityStats,
  getRepeaterKpi,
} from "../data/facilityStatusData";

interface RepeaterPageProps {
  region: HqDivision;
}

function Num({ v, className = "" }: { v: number; className?: string }) {
  return <span className={className}>{v > 0 ? v.toLocaleString() : <span className="text-gray-300">-</span>}</span>;
}

export function RepeaterPage({ region }: RepeaterPageProps) {
  const [selectedTeam, setSelectedTeam] = useState<AccessTeam | null>(null);
  const [isSiteKpiOpen, setIsSiteKpiOpen] = useState(false);
  const [isFiveGOpen, setIsFiveGOpen] = useState(false);
  const [isLteOpen, setIsLteOpen] = useState(false);
  const [isWcdmaOpen, setIsWcdmaOpen] = useState(false);
  const [isWibroOpen, setIsWibroOpen] = useState(false);
  const [isIdongOpen, setIsIdongOpen] = useState(false);

  const [isCityDetailOpen, setIsCityDetailOpen] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState<RepeaterCityStats | null>(null);
  const [isIssueDetailOpen, setIsIssueDetailOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<RepeaterAbnormalSiteStatus | null>(null);

  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterCities, setFilterCities] = useState<string[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof RepeaterCityStats | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const teamList = HQ_TEAMS[region];
  const kpi = getRepeaterKpi(region, selectedTeam);
  const cityStats = getRepeaterCityStats(region, selectedTeam);
  const allRows = filterRepeater(region, selectedTeam);
  const visibleAbnormalSites = getRepeaterAbnormalSiteStatus(region, selectedTeam);

  const hqLabel = region === "central" ? "중부" : "서부";
  const accentColor = region === "central" ? "#1E40AF" : "#065F46";
  const badgeClass =
    region === "central"
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

  const fiveGCities = allRows.filter((row) => Object.keys(row.fiveG).length > 0).length;
  const lteCities = allRows.filter((row) => Object.keys(row.lte).length > 0).length;
  const wcdmaCities = allRows.filter((row) => Object.keys(row.wcdma).length > 0).length;
  const wibroCities = allRows.filter((row) => Object.keys(row.wibro).length > 0).length;
  const idongCities = allRows.filter((row) => Object.keys(row.idong).length > 0).length;

  const filteredAndSortedCityStats = useMemo(() => {
    const filtered = cityStats.filter((row) => {
      const matchState = filterStates.length === 0 || filterStates.includes(row.state);
      const matchCity = filterCities.length === 0 || filterCities.includes(row.city);
      const matchTeam = filterTeams.length === 0 || filterTeams.includes(row.team);
      return matchState && matchCity && matchTeam;
    });

    if (!sortBy) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [cityStats, filterStates, filterCities, filterTeams, sortBy, sortOrder]);

  const uniqueStates = useMemo(() => [...new Set(cityStats.map((row) => row.state))].sort(), [cityStats]);
  const uniqueCities = useMemo(() => [...new Set(cityStats.map((row) => row.city))].sort(), [cityStats]);
  const uniqueTeams = useMemo(() => [...new Set(cityStats.map((row) => row.team))].sort(), [cityStats]);

  const handleSortClick = (column: keyof RepeaterCityStats) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const toggleStateFilter = (state: string) => {
    setFilterStates((prev) => (prev.includes(state) ? prev.filter((item) => item !== state) : [...prev, state]));
  };

  const toggleCityFilter = (city: string) => {
    setFilterCities((prev) => (prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]));
  };

  const toggleTeamFilter = (team: string) => {
    setFilterTeams((prev) => (prev.includes(team) ? prev.filter((item) => item !== team) : [...prev, team]));
  };

  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];

    filterStates.forEach((state) => chips.push({ label: `광역시도: ${state}`, onRemove: () => toggleStateFilter(state) }));
    filterCities.forEach((city) => chips.push({ label: `시군구: ${city}`, onRemove: () => toggleCityFilter(city) }));
    filterTeams.forEach((team) => chips.push({ label: `담당팀: ${team}`, onRemove: () => toggleTeamFilter(team) }));

    return chips;
  };

  const hasActiveFilters = filterStates.length > 0 || filterCities.length > 0 || filterTeams.length > 0;

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-1 h-5 rounded" style={{ backgroundColor: accentColor }} />
        <h2 className="text-lg font-bold text-gray-800">중계기 현황</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${badgeClass}`}>{hqLabel} 본부</span>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <button onClick={() => setSelectedTeam(null)} className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-150 ${getAllBtnClass()}`}>
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
      </div>

      <div className="grid grid-cols-6 gap-2.5">
        <KpiCard label="전체 중계기 사이트" value={kpi.totalSite} unit="개소" yoy={null} onClick={() => setIsSiteKpiOpen(true)} />
        <KpiCard label={`5G 장비 (${fiveGCities}개 시군구)`} value={kpi.fiveG} unit="대" yoy={null} onClick={() => setIsFiveGOpen(true)} />
        <KpiCard label={`LTE 장비 (${lteCities}개 시군구)`} value={kpi.lte} unit="대" yoy={null} onClick={() => setIsLteOpen(true)} />
        <KpiCard label={`WCDMA 장비 (${wcdmaCities}개 시군구)`} value={kpi.wcdma} unit="대" yoy={null} onClick={() => setIsWcdmaOpen(true)} />
        <KpiCard label={`WiBro 장비 (${wibroCities}개 시군구)`} value={kpi.wibro} unit="대" yoy={null} onClick={() => setIsWibroOpen(true)} />
        <KpiCard label={`이동형 장비 (${idongCities}개 시군구)`} value={kpi.idong} unit="대" yoy={null} onClick={() => setIsIdongOpen(true)} />
      </div>

      <div className="grid grid-cols-12 gap-2.5 items-stretch">
        <div className="col-span-7">
          <RepeaterStateMapCard region={region} rows={allRows} />
        </div>

        <div className="col-span-5 bg-white rounded-lg shadow-sm">
          <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">중계기 현황</h3>
          </div>
          <div className="px-3.5 pt-3 pb-3.5 space-y-2.5">
            {visibleAbnormalSites.length === 0 && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-4 text-xs text-gray-400 text-center">
                선택한 팀 기준으로 표시할 중계기 이상 항목이 없습니다.
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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${levelClass}`}>{item.severity}</span>
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

      <div className="bg-white rounded-lg shadow-sm flex flex-col">
        <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">중계기 세부현황</h3>
        </div>

        <div className="px-3.5 pt-3 pb-1.5 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-[11px] text-gray-500 font-mono">
              총 <b style={{ color: accentColor }}>{cityStats.length}</b>개 중 <b style={{ color: accentColor }}>{filteredAndSortedCityStats.length}</b>개 표시
            </div>
            <button
              onClick={() => {
                setFilterStates([]);
                setFilterCities([]);
                setFilterTeams([]);
              }}
              className={`px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1 transition-all ml-auto ${
                hasActiveFilters ? "border-gray-700 text-gray-700 bg-gray-50" : "border-gray-300 text-gray-500 bg-white hover:border-gray-400"
              }`}
              style={hasActiveFilters ? { borderColor: accentColor, color: accentColor, backgroundColor: accentColor + "11" } : {}}
            >
              ↺ 전체 초기화
            </button>
          </div>
        </div>

        {getActiveFilterChips().length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap px-3.5 pb-1.5 flex-shrink-0">
            {getActiveFilterChips().map((chip, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                style={{ backgroundColor: accentColor + "11", borderColor: accentColor + "44", color: accentColor }}
              >
                <span>{chip.label}</span>
                <button onClick={chip.onRemove} className="font-bold opacity-60 hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="px-3.5 pt-1.5 pb-5 overflow-x-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: accentColor + "11" }}>
              <tr>
                <th className="sticky left-0 z-20 text-left py-2 px-3 font-bold whitespace-nowrap border-r" style={{ backgroundColor: accentColor + "11", color: accentColor }}>
                  <div className="flex items-center gap-1">
                    <span>광역시도</span>
                    <ColumnFilterDropdown
                      column="state"
                      values={uniqueStates}
                      selectedValues={filterStates}
                      onToggle={toggleStateFilter}
                      onClear={() => {
                        setFilterStates([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "state"}
                      onOpenChange={(open) => setOpenDropdown(open ? "state" : null)}
                    />
                  </div>
                </th>
                <th className="text-left py-2 px-3 font-bold whitespace-nowrap" style={{ backgroundColor: accentColor + "11", color: accentColor }}>
                  <div className="flex items-center gap-1">
                    <span>시·군·구</span>
                    <ColumnFilterDropdown
                      column="city"
                      values={uniqueCities}
                      selectedValues={filterCities}
                      onToggle={toggleCityFilter}
                      onClear={() => {
                        setFilterCities([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "city"}
                      onOpenChange={(open) => setOpenDropdown(open ? "city" : null)}
                    />
                  </div>
                </th>
                {!selectedTeam && (
                  <th className="text-left py-2 px-3 font-bold whitespace-nowrap" style={{ backgroundColor: accentColor + "11", color: accentColor }}>
                    <div className="flex items-center gap-1">
                      <span>담당 팀</span>
                      <ColumnFilterDropdown
                        column="team"
                        values={uniqueTeams}
                        selectedValues={filterTeams}
                        onToggle={toggleTeamFilter}
                        onClear={() => {
                          setFilterTeams([]);
                          setOpenDropdown(null);
                        }}
                        isOpen={openDropdown === "team"}
                        onOpenChange={(open) => setOpenDropdown(open ? "team" : null)}
                      />
                    </div>
                  </th>
                )}

                {[
                  ["siteCount", "사이트", "text-gray-700"],
                  ["fiveGTotal", "5G", "text-purple-600"],
                  ["lteTotal", "LTE", "text-blue-600"],
                  ["wcdmaTotal", "WCDMA", "text-green-600"],
                  ["wibroTotal", "WiBro", "text-cyan-600"],
                  ["idongTotal", "이동형", "text-orange-500"],
                ].map(([key, label, colorClass]) => (
                  <th
                    key={key}
                    className={`text-right py-2 px-3 font-bold whitespace-nowrap cursor-pointer ${colorClass}`}
                    style={{ backgroundColor: accentColor + "11" }}
                    onClick={() => handleSortClick(key as keyof RepeaterCityStats)}
                  >
                    <div className="flex items-center justify-end gap-1 hover:opacity-70">
                      <span>{label}</span>
                      {sortBy === key && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCityStats.map((row, index) => (
                <tr
                  key={`${row.state}-${row.city}-${index}`}
                  className="group border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCityDetail(row);
                    setIsCityDetailOpen(true);
                  }}
                >
                  <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 border-r bg-white group-hover:bg-gray-50">{row.state}</td>
                  <td className="py-2 px-3 text-gray-800 font-semibold">{row.city}</td>
                  {!selectedTeam && <td className="py-2 px-3 text-gray-600 text-[11px]">{row.team}</td>}
                  <td className="py-2 px-3 text-right text-gray-700 font-bold">{row.siteCount.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right"><Num v={row.fiveGTotal} className="text-purple-600 font-medium" /></td>
                  <td className="py-2 px-3 text-right"><Num v={row.lteTotal} className="text-blue-600 font-medium" /></td>
                  <td className="py-2 px-3 text-right"><Num v={row.wcdmaTotal} className="text-green-600 font-medium" /></td>
                  <td className="py-2 px-3 text-right"><Num v={row.wibroTotal} className="text-cyan-600 font-medium" /></td>
                  <td className="py-2 px-3 text-right"><Num v={row.idongTotal} className="text-orange-500 font-medium" /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
                <td className="py-2 px-3" colSpan={!selectedTeam ? 3 : 2}>합계</td>
                <td className="py-2 px-3 text-right font-bold">{filteredAndSortedCityStats.reduce((a, r) => a + r.siteCount, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-purple-600">{filteredAndSortedCityStats.reduce((a, r) => a + r.fiveGTotal, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-blue-600">{filteredAndSortedCityStats.reduce((a, r) => a + r.lteTotal, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-green-600">{filteredAndSortedCityStats.reduce((a, r) => a + r.wcdmaTotal, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-cyan-600">{filteredAndSortedCityStats.reduce((a, r) => a + r.wibroTotal, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-orange-500">{filteredAndSortedCityStats.reduce((a, r) => a + r.idongTotal, 0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <RepeaterKpiSidebar isOpen={isSiteKpiOpen} onClose={() => setIsSiteKpiOpen(false)} rows={allRows} />

      <RepeaterEquipDrilldownSidebar isOpen={isFiveGOpen} onClose={() => setIsFiveGOpen(false)} rows={allRows} equipLabel="5G" equipKeys={REPEATER_5G_EQUIP} recordKey="fiveG" />
      <RepeaterEquipDrilldownSidebar isOpen={isLteOpen} onClose={() => setIsLteOpen(false)} rows={allRows} equipLabel="LTE" equipKeys={REPEATER_LTE_EQUIP} recordKey="lte" />
      <RepeaterEquipDrilldownSidebar isOpen={isWcdmaOpen} onClose={() => setIsWcdmaOpen(false)} rows={allRows} equipLabel="WCDMA" equipKeys={REPEATER_WCDMA_EQUIP} recordKey="wcdma" />
      <RepeaterEquipDrilldownSidebar isOpen={isWibroOpen} onClose={() => setIsWibroOpen(false)} rows={allRows} equipLabel="WiBro" equipKeys={REPEATER_WIBRO_EQUIP} recordKey="wibro" />
      <RepeaterEquipDrilldownSidebar isOpen={isIdongOpen} onClose={() => setIsIdongOpen(false)} rows={allRows} equipLabel="이동형" equipKeys={REPEATER_IDONG_EQUIP} recordKey="idong" />

      <RepeaterCityDetailSidebar
        isOpen={isCityDetailOpen}
        onClose={() => setIsCityDetailOpen(false)}
        rows={allRows}
        selectedCityStat={selectedCityDetail}
      />

      <IssueDetailSidebar
        isOpen={isIssueDetailOpen}
        onClose={() => setIsIssueDetailOpen(false)}
        title="중계기 현황 상세"
        item={selectedIssueDetail}
      />
    </div>
  );
}
