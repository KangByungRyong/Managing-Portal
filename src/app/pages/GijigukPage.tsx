// src/app/pages/GijigukPage.tsx
import {
  getGijigukKpi,
  getTeamSummary,
  gijigukSites,
  HQ_TEAMS,
  EquipStatus,
} from "../data/gijigukMockData";

interface GijigukPageProps {
  region: "central" | "west";
}

// 상태 배지 스타일
const statusStyle: Record<EquipStatus, string> = {
  정상: "bg-green-100 text-green-700",
  점검필요: "bg-orange-100 text-orange-700",
  긴급: "bg-red-100 text-red-700",
};

// 가동률 바
function UptimeBar({ value }: { value: number }) {
  const color =
    value >= 98
      ? "bg-green-500"
      : value >= 95
        ? "bg-yellow-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{value}%</span>
    </div>
  );
}

export function GijigukPage({ region }: GijigukPageProps) {
  const kpi = getGijigukKpi(region);
  const teams = getTeamSummary(region);
  const teamList = HQ_TEAMS[region];

  const hqLabel = region === "central" ? "중부" : "서부";
  const accentColor =
    region === "central" ? "#1E40AF" : "#065F46";
  const badgeClass =
    region === "central"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  // 전체 이상 사이트 수
  const totalIssues = teams.reduce(
    (a, t) => a + t.needCheck + t.urgent,
    0,
  );

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full">
      {/* ── 헤더 ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className="text-lg font-bold text-gray-800">
          기지국 현황
        </h2>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${badgeClass}`}
        >
          {hqLabel} 본부
        </span>
        {/* 담당 팀 뱃지 */}
        <div className="flex gap-1.5 ml-2">
          {teamList.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── KPI 카드 (5개) ── */}
      <div className="grid grid-cols-5 gap-3">
        {/* 전체 사이트 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">
            전체 사이트
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {kpi.totalSites}
            <span className="text-sm font-normal text-gray-400 ml-1">
              개소
            </span>
          </p>
          {totalIssues > 0 && (
            <p className="text-xs text-orange-500 mt-1 font-medium">
              ⚠ 이상 {totalIssues}개소 확인 필요
            </p>
          )}
        </div>

        {/* 5G */}
        {[
          {
            label: "5G 장비",
            data: kpi.fiveG,
            color: "purple",
          },
          { label: "LTE 장비", data: kpi.lte, color: "blue" },
          {
            label: "3G 장비",
            data: kpi.threeG,
            color: "green",
          },
          {
            label: "LoRa 장비",
            data: kpi.lora,
            color: "orange",
          },
        ].map(({ label, data, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
          >
            <p className="text-xs text-gray-500 mb-1">
              {label}
            </p>
            <p
              className={`text-2xl font-bold text-${color}-600`}
            >
              {data.equip}
              <span className="text-sm font-normal text-gray-400 ml-1">
                대
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {data.sites}개소 · {data.ratio}%
            </p>
            <p
              className={`text-xs mt-0.5 font-medium ${data.change >= 0 ? "text-red-500" : "text-blue-500"}`}
            >
              전월 {data.change >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(data.change)}%
            </p>
          </div>
        ))}
      </div>

      {/* ── 사이트 상태 요약 + 팀별 현황 ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* 사이트 상태 요약 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <div
              className="w-0.5 h-3.5 rounded"
              style={{ backgroundColor: accentColor }}
            />
            <h3 className="text-sm font-bold text-gray-700">
              사이트 운용 상태 요약
            </h3>
          </div>
          {/* 상태별 집계 카드 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              {
                label: "정상",
                count: gijigukSites.filter(
                  (s) => s.hq === region && s.siteStatus === "정상"
                ).length,
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                dot: "bg-green-500",
              },
              {
                label: "점검필요",
                count: gijigukSites.filter(
                  (s) => s.hq === region && s.siteStatus === "점검필요"
                ).length,
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
                dot: "bg-orange-500",
              },
              {
                label: "긴급",
                count: gijigukSites.filter(
                  (s) => s.hq === region && s.siteStatus === "긴급"
                ).length,
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                dot: "bg-red-500",
              },
            ].map(({ label, count, bg, text, border, dot }) => (
              <div
                key={label}
                className={`rounded-lg border ${bg} ${border} px-3 py-3 flex flex-col items-center`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className={`text-xs font-medium ${text}`}>
                    {label}
                  </span>
                </div>
                <span className={`text-2xl font-bold ${text}`}>
                  {count}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">개소</span>
              </div>
            ))}
          </div>
          {/* 전체 가동률 */}
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">전체 평균 가동률</span>
              <span className="text-sm font-bold text-gray-800">
                {(
                  gijigukSites
                    .filter((s) => s.hq === region)
                    .reduce((a, s) => a + s.uptime, 0) /
                  Math.max(
                    gijigukSites.filter((s) => s.hq === region).length,
                    1
                  )
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${(
                    gijigukSites
                      .filter((s) => s.hq === region)
                      .reduce((a, s) => a + s.uptime, 0) /
                    Math.max(
                      gijigukSites.filter((s) => s.hq === region).length,
                      1
                    )
                  ).toFixed(1)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 팀별 현황 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <div
              className="w-0.5 h-3.5 rounded"
              style={{ backgroundColor: accentColor }}
            />
            <h3 className="text-sm font-bold text-gray-700">
              담당 팀별 현황
            </h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="text-left   py-2 px-3 rounded-l-lg font-medium">
                  담당 팀
                </th>
                <th className="text-right  py-2 px-2 font-medium">
                  사이트
                </th>
                <th className="text-right  py-2 px-2 text-purple-600 font-medium">
                  5G
                </th>
                <th className="text-right  py-2 px-2 text-blue-600 font-medium">
                  LTE
                </th>
                <th className="text-right  py-2 px-2 text-green-600 font-medium">
                  3G
                </th>
                <th className="text-right  py-2 px-2 text-orange-500 font-medium">
                  LoRa
                </th>
                <th className="text-center py-2 px-2 font-medium">
                  상태
                </th>
                <th className="text-left   py-2 px-3 rounded-r-lg font-medium">
                  가동률
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((row) => (
                <tr
                  key={row.team}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-gray-800">
                      {row.team}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {row.adminRegion}
                    </p>
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-gray-700">
                    {row.totalSites}
                  </td>
                  <td className="py-2.5 px-2 text-right text-purple-600">
                    {row.fiveG}
                  </td>
                  <td className="py-2.5 px-2 text-right text-blue-600">
                    {row.lte}
                  </td>
                  <td className="py-2.5 px-2 text-right text-green-600">
                    {row.threeG}
                  </td>
                  <td className="py-2.5 px-2 text-right text-orange-500">
                    {row.lora}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      {row.urgent > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                          긴급 {row.urgent}
                        </span>
                      )}
                      {row.needCheck > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">
                          점검 {row.needCheck}
                        </span>
                      )}
                      {row.urgent === 0 &&
                        row.needCheck === 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
                            정상
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <UptimeBar value={row.avgUptime} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 사이트 상세 목록 ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <div
            className="w-0.5 h-3.5 rounded"
            style={{ backgroundColor: accentColor }}
          />
          <h3 className="text-sm font-bold text-gray-700">
            사이트 상세 현황
          </h3>
          <span className="text-xs text-gray-400 ml-auto">
            장비 구성 및 운용 상태
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left   py-2 px-3 rounded-l-lg font-medium">
                사이트 ID
              </th>
              <th className="text-left   py-2 px-3 font-medium">
                사이트명
              </th>
              <th className="text-left   py-2 px-3 font-medium">
                담당 팀
              </th>
              <th className="text-left   py-2 px-3 font-medium">
                행정구역
              </th>
              <th className="text-center py-2 px-2 text-purple-600 font-medium">
                5G
              </th>
              <th className="text-center py-2 px-2 text-blue-600 font-medium">
                LTE
              </th>
              <th className="text-center py-2 px-2 text-green-600 font-medium">
                3G
              </th>
              <th className="text-center py-2 px-2 text-orange-500 font-medium">
                LoRa
              </th>
              <th className="text-center py-2 px-2 font-medium">
                상태
              </th>
              <th className="text-left   py-2 px-3 font-medium">
                가동률
              </th>
              <th className="text-center py-2 px-3 rounded-r-lg font-medium">
                최종점검
              </th>
            </tr>
          </thead>
          <tbody>
            {gijigukSites
              .filter((s) => s.hq === region)
              .map((site) => (
                <tr
                  key={site.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-2.5 px-3 font-mono text-gray-500">
                    {site.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {site.name}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    {site.team}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">
                    {site.adminRegion}
                  </td>
                  {/* 장비 셀 — 미설치는 회색 대시 */}
                  {(
                    ["fiveG", "lte", "threeG", "lora"] as const
                  ).map((tech) => (
                    <td
                      key={tech}
                      className="py-2.5 px-2 text-center"
                    >
                      {site.equip[tech].installed ? (
                        <span
                          className={`px-1.5 py-0.5 rounded font-medium ${statusStyle[site.equip[tech].status]}`}
                        >
                          {site.equip[tech].count}대
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${statusStyle[site.siteStatus]}`}
                    >
                      {site.siteStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <UptimeBar value={site.uptime} />
                  </td>
                  <td className="py-2.5 px-3 text-center text-gray-400">
                    {site.lastChecked}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}