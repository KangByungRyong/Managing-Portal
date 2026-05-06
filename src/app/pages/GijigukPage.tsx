// src/app/pages/GijigukPage.tsx
import { useState } from "react";
import {
  HQ_TEAMS,
  HqDivision,
  AccessTeam,
  getGijigukKpi,
  getGijigukCityStats,
  filterGijiguk,
  GIJIGUK_5G_EQUIP,
  GIJIGUK_LTE_EQUIP,
  GIJIGUK_WCDMA_EQUIP,
  GIJIGUK_LORA_EQUIP,
} from "../data/facilityStatusData";

interface GijigukPageProps {
  region: HqDivision;
}

// ─── 숫자 포맷 (0이면 — 표시) ────────────────────────────────
function Num({ v, className = "" }: { v: number; className?: string }) {
  return (
    <span className={className}>
      {v > 0 ? v.toLocaleString() : <span className="text-gray-300">—</span>}
    </span>
  );
}

// ─── 탭 타입 ─────────────────────────────────────────────────
type DetailTab = "summary" | "5g" | "lte" | "wcdma" | "lora";

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export function GijigukPage({ region }: GijigukPageProps) {

  const [selectedTeam, setSelectedTeam] = useState<AccessTeam | null>(null);
  const [activeTab,    setActiveTab]    = useState<DetailTab>("summary");

  const teamList  = HQ_TEAMS[region];
  const kpi       = getGijigukKpi(region, selectedTeam);
  const cityStats = getGijigukCityStats(region, selectedTeam);
  const allRows   = filterGijiguk(region, selectedTeam);

  const hqLabel     = region === "central" ? "중부" : "서부";
  const accentColor = region === "central" ? "#1E40AF" : "#065F46";
  const badgeClass  = region === "central"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  // ── 팀 버튼 스타일 ──
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

  // ── 탭 버튼 스타일 ──
  const getTabClass = (tab: DetailTab) =>
    activeTab === tab
      ? "border-b-2 border-blue-500 text-blue-600 font-semibold pb-1.5"
      : "text-gray-400 hover:text-gray-600 pb-1.5";

  // ── 합계 행 ──
  const total = {
    siteCount:  cityStats.reduce((a, r) => a + r.siteCount,  0),
    fiveGTotal: cityStats.reduce((a, r) => a + r.fiveGTotal, 0),
    lteTotal:   cityStats.reduce((a, r) => a + r.lteTotal,   0),
    wcdmaTotal: cityStats.reduce((a, r) => a + r.wcdmaTotal, 0),
    loraTotal:  cityStats.reduce((a, r) => a + r.loraTotal,  0),
  };

  // ── KPI 카드 구성 ──
  const kpiCards = [
    {
      label: "5G 장비",
      value: kpi.fiveG,
      color: "text-purple-600",
      sub: `${allRows.filter(r => Object.keys(r.fiveG).length > 0).length}개 시군구`,
    },
    {
      label: "LTE 장비",
      value: kpi.lte,
      color: "text-blue-600",
      sub: `${allRows.filter(r => Object.keys(r.lte).length > 0).length}개 시군구`,
    },
    {
      label: "WCDMA 장비",
      value: kpi.wcdma,
      color: "text-green-600",
      sub: `${allRows.filter(r => Object.keys(r.wcdma).length > 0).length}개 시군구`,
    },
    {
      label: "LoRa 장비",
      value: kpi.lora,
      color: "text-orange-500",
      sub: `${allRows.filter(r => Object.keys(r.lora).length > 0).length}개 시군구`,
    },
  ];

  // ── 장비별 상세 집계 (탭용) ──
  function sumEquipByCity<T extends string>(
    equipList: readonly T[],
    getMap: (row: ReturnType<typeof filterGijiguk>[number]) => Partial<Record<T, number>>
  ) {
    return cityStats.map((cs) => {
      const row = allRows.find(r => r.state === cs.state && r.city === cs.city);
      const equipMap = row ? getMap(row) : {};
      const equipCounts = equipList.map((eq) => ({
        name: eq,
        count: equipMap[eq] ?? 0,
      }));
      return { ...cs, equipCounts };
    });
  }

  const fiveGDetail  = sumEquipByCity(GIJIGUK_5G_EQUIP,    r => r.fiveG);
  const lteDetail    = sumEquipByCity(GIJIGUK_LTE_EQUIP,   r => r.lte);
  const wcdmaDetail  = sumEquipByCity(GIJIGUK_WCDMA_EQUIP, r => r.wcdma);
  const loraDetail   = sumEquipByCity(GIJIGUK_LORA_EQUIP,  r => r.lora);

  // ── 장비별 합계 (tfoot용) ──
  function equipTotals<T extends string>(
    equipList: readonly T[],
    getMap: (row: ReturnType<typeof filterGijiguk>[number]) => Partial<Record<T, number>>
  ): Record<T, number> {
    return Object.fromEntries(
      equipList.map((eq) => [
        eq,
        allRows.reduce((a, r) => a + (getMap(r)[eq] ?? 0), 0),
      ])
    ) as Record<T, number>;
  }

  const fiveGTotals  = equipTotals(GIJIGUK_5G_EQUIP,    r => r.fiveG);
  const lteTotals    = equipTotals(GIJIGUK_LTE_EQUIP,   r => r.lte);
  const wcdmaTotals  = equipTotals(GIJIGUK_WCDMA_EQUIP, r => r.wcdma);
  const loraTotals   = equipTotals(GIJIGUK_LORA_EQUIP,  r => r.lora);

  // ── 장비 상세 테이블 렌더 ──
  function renderEquipTable<T extends string>(
    equipList: readonly T[],
    detail: ReturnType<typeof sumEquipByCity>,
    totals: Record<T, number>,
    color: string,
  ) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left py-2 px-3 rounded-l-lg font-medium sticky left-0 bg-gray-50 z-10">
                광역시도
              </th>
              <th className="text-left py-2 px-3 font-medium sticky left-[72px] bg-gray-50 z-10">
                시·군·구
              </th>
              {!selectedTeam && (
                <th className="text-left py-2 px-3 font-medium">담당 팀</th>
              )}
              <th className={`text-right py-2 px-3 font-bold ${color}`}>합계</th>
              {equipList.map((eq) => (
                <th key={eq} className={`text-right py-2 px-3 font-medium whitespace-nowrap ${color} opacity-80`}>
                  {eq}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.map((row, idx) => {
              const rowTotal = row.equipCounts.reduce((a, e) => a + e.count, 0);
              return (
                <tr
                  key={`${row.state}-${row.city}-${idx}`}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-gray-500 sticky left-0 bg-white z-10">
                    {row.state}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-800 sticky left-[72px] bg-white z-10">
                    {row.city}
                  </td>
                  {!selectedTeam && (
                    <td className="py-2.5 px-3 text-gray-400 text-[11px]">{row.team}</td>
                  )}
                  <td className={`py-2.5 px-3 text-right font-bold ${color}`}>
                    <Num v={rowTotal} />
                  </td>
                  {row.equipCounts.map((eq) => (
                    <td key={eq.name} className="py-2.5 px-3 text-right text-gray-600">
                      <Num v={eq.count} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold text-gray-700 text-xs">
              <td
                className="py-2.5 px-3 rounded-l-lg sticky left-0 bg-gray-50 z-10"
                colSpan={!selectedTeam ? 3 : 2}
              >
                합계
              </td>
              <td className={`py-2.5 px-3 text-right font-bold ${color}`}>
                {Object.values(totals).reduce((a: number, v) => a + (v as number), 0).toLocaleString()}
              </td>
              {equipList.map((eq) => (
                <td key={eq} className={`py-2.5 px-3 text-right font-semibold ${color}`}>
                  {totals[eq] > 0 ? totals[eq].toLocaleString() : <span className="text-gray-300">—</span>}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full">

      {/* ── 헤더 + 팀 선택 버튼 ── */}
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

      {/* ── KPI 카드 (5개) ── */}
      <div className="grid grid-cols-5 gap-3">

        {/* 전체 사이트 수 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">전체 사이트</p>
          <p className="text-2xl font-bold text-gray-800">
            {kpi.totalSite.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">개소</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">{kpi.rowCount}개 시군구 운용</p>
        </div>

        {kpiCards.map(({ label, value, color, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {value.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">대</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── 탭 + 상세 테이블 ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">

        {/* 탭 헤더 */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: accentColor }} />
          <h3 className="text-sm font-bold text-gray-700">행정구역별 현황</h3>
          <span className="text-xs text-gray-400 ml-1">(시·군·구 단위)</span>
          {selectedTeam && (
            <span
              className="ml-2 text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{
                color: accentColor,
                borderColor: accentColor + "44",
                background: accentColor + "11",
              }}
            >
              {selectedTeam}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">{cityStats.length}개 시군구</span>
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-5 border-b border-gray-100 mb-3 text-xs mt-2">
          {(
            [
              { key: "summary", label: "전체 요약"  },
              { key: "5g",      label: "5G 장비"    },
              { key: "lte",     label: "LTE 장비"   },
              { key: "wcdma",   label: "WCDMA 장비" },
              { key: "lora",    label: "LoRa 장비"  },
            ] as { key: DetailTab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`transition-all duration-150 ${getTabClass(key)}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── 전체 요약 탭 ── */}
        {activeTab === "summary" && (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="text-left   py-2 px-3 rounded-l-lg font-medium">광역시도</th>
                <th className="text-left   py-2 px-3 font-medium">시·군·구</th>
                {!selectedTeam && (
                  <th className="text-left py-2 px-3 font-medium">담당 팀</th>
                )}
                <th className="text-right  py-2 px-3 font-medium">사이트</th>
                <th className="text-right  py-2 px-3 text-purple-600 font-medium">5G</th>
                <th className="text-right  py-2 px-3 text-blue-600 font-medium">LTE</th>
                <th className="text-right  py-2 px-3 text-green-600 font-medium">WCDMA</th>
                <th className="text-right  py-2 px-3 rounded-r-lg text-orange-500 font-medium">LoRa</th>
              </tr>
            </thead>
            <tbody>
              {cityStats.map((row, idx) => (
                <tr
                  key={`${row.state}-${row.city}-${idx}`}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-gray-500">{row.state}</td>
                  <td className="py-2.5 px-3 font-semibold text-gray-800">{row.city}</td>
                  {!selectedTeam && (
                    <td className="py-2.5 px-3 text-gray-400 text-[11px]">{row.team}</td>
                  )}
                  <td className="py-2.5 px-3 text-right font-bold text-gray-700">
                    {row.siteCount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Num v={row.fiveGTotal} className="text-purple-600 font-medium" />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Num v={row.lteTotal} className="text-blue-600 font-medium" />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Num v={row.wcdmaTotal} className="text-green-600 font-medium" />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Num v={row.loraTotal} className="text-orange-500 font-medium" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold text-gray-700 text-xs">
                <td className="py-2.5 px-3 rounded-l-lg" colSpan={!selectedTeam ? 3 : 2}>
                  합계
                </td>
                <td className="py-2.5 px-3 text-right font-bold">
                  {total.siteCount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-purple-600">
                  {total.fiveGTotal.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-blue-600">
                  {total.lteTotal.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-green-600">
                  {total.wcdmaTotal.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-orange-500 rounded-r-lg">
                  {total.loraTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* ── 5G 장비 탭 ── */}
        {activeTab === "5g" && renderEquipTable(
          GIJIGUK_5G_EQUIP, fiveGDetail, fiveGTotals, "text-purple-600"
        )}

        {/* ── LTE 장비 탭 ── */}
        {activeTab === "lte" && renderEquipTable(
          GIJIGUK_LTE_EQUIP, lteDetail, lteTotals, "text-blue-600"
        )}

        {/* ── WCDMA 장비 탭 ── */}
        {activeTab === "wcdma" && renderEquipTable(
          GIJIGUK_WCDMA_EQUIP, wcdmaDetail, wcdmaTotals, "text-green-600"
        )}

        {/* ── LoRa 장비 탭 ── */}
        {activeTab === "lora" && renderEquipTable(
          GIJIGUK_LORA_EQUIP, loraDetail, loraTotals, "text-orange-500"
        )}
      </div>

      {/* ── 담당 팀별 집계 카드 ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: accentColor }} />
          <h3 className="text-sm font-bold text-gray-700">담당 팀별 집계</h3>
        </div>
        <div className={`grid gap-3 ${teamList.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {teamList.map((team) => {
            const tk = getGijigukKpi(region, team);
            const isSelected = selectedTeam === team;
            return (
              <button
                key={team}
                onClick={() => setSelectedTeam(isSelected ? null : team)}
                className={`text-left rounded-xl border p-4 transition-all duration-150 ${
                  isSelected
                    ? region === "central"
                      ? "border-blue-300 bg-blue-50"
                      : "border-emerald-300 bg-emerald-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <p className="text-xs font-bold text-gray-700 mb-2">{team}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">사이트</span>
                    <span className="font-bold text-gray-700">{tk.totalSite.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">5G</span>
                    <span className="font-medium text-purple-600">{tk.fiveG.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">LTE</span>
                    <span className="font-medium text-blue-600">{tk.lte.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">WCDMA</span>
                    <span className="font-medium text-green-600">{tk.wcdma.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-400">LoRa</span>
                    <span className="font-medium text-orange-500">{tk.lora.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">시군구</span>
                    <span className="font-medium text-gray-600">{tk.rowCount}개</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
