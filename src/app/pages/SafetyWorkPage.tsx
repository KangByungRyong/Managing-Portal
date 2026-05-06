// src/app/pages/SafetyWorkPage.tsx
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Moon, Shield } from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import { ColumnFilterDropdown } from "../components/ColumnFilterDropdown";
import {
  HqDivision,
  getSafetyKpi,
  safetyWorks,
  SafetyWork,
  WorkStatus,
  WorkCategory,
  WorkTeam,
  SafetyCode,
} from "../data/safetyWorkData";

interface SafetyWorkPageProps {
  region: HqDivision;
}

// ── 안전코드 뱃지 색상 ──
const SAFETY_CODE_STYLE: Record<SafetyCode, string> = {
  C1: "bg-green-50 text-green-700 border-green-300",
  C2: "bg-yellow-50 text-yellow-700 border-yellow-300",
  C3: "bg-orange-50 text-orange-700 border-orange-300",
  C4: "bg-red-50 text-red-700 border-red-300",
};

// ── 상태 뱃지 색상 ──
const STATUS_STYLE: Record<WorkStatus, string> = {
  완료: "bg-blue-50 text-blue-700 border-blue-300",
  진행중: "bg-green-50 text-green-700 border-green-300",
  예정: "bg-gray-50 text-gray-600 border-gray-300",
  지연: "bg-red-50 text-red-700 border-red-300",
  취소: "bg-gray-100 text-gray-400 border-gray-200 line-through",
};

// ── 분류 뱃지 색상 ──
const CATEGORY_STYLE: Record<WorkCategory, string> = {
  지장이설: "bg-purple-50 text-purple-700 border-purple-300",
  구축: "bg-sky-50 text-sky-700 border-sky-300",
  유지보수: "bg-teal-50 text-teal-700 border-teal-300",
  장애복구: "bg-red-50 text-red-700 border-red-300",
  파라미터변경: "bg-amber-50 text-amber-700 border-amber-300",
  B2B: "bg-indigo-50 text-indigo-700 border-indigo-300",
};

// ── 팀 목록 (hq별) ──
const HQ_TEAMS: Record<HqDivision, WorkTeam[]> = {
  central: [
    "중부안전/구축팀",
    "중부유선/설비팀",
    "충남Access운용팀",
    "충북Access운용팀",
  ],
  west: [
    "서부안전/구축팀",
    "서부유선/설비팀",
    "전남Access운용팀",
    "전북Access운용팀",
    "제주Access운용팀",
  ],
};

const ALL_CATEGORIES: WorkCategory[] = [
  "지장이설",
  "구축",
  "유지보수",
  "장애복구",
  "파라미터변경",
  "B2B",
];

const ALL_STATUSES: WorkStatus[] = [
  "진행중",
  "예정",
  "완료",
  "지연",
  "취소",
];

const CENTRAL_NEAR_CITIES = [
  "대전",
  "세종",
  "계룡",
  "공주",
  "금산",
  "논산",
];

const CENTRAL_CHUNGBUK_ACCESS_NEAR_CITIES = [
  "보은",
  "영동",
  "옥천",
  "음성",
  "증평",
  "진천",
  "청주",
];

const WEST_JEONBUK_ACCESS_NEAR_CITIES = ["전주시", "완주군", "전주", "완주"];

const WEST_DEFAULT_NEAR_CITIES = [
  "광주",
  "나주",
  "담양",
  "영광",
  "장성",
  "함평",
  "화순",
];

const OFFICE_NAME_KEYWORDS = [
  "둔산사옥",
  "둔산구사옥",
  "청주사옥",
  "부암사옥",
  "우산사옥",
  "송정사옥",
  "제주사옥",
  "전주사옥",
];

type SortKey = keyof Pick<
  SafetyWork,
  "workName" | "team" | "category" | "status" | "safetyCode" | "startAt" | "endAt" | "city"
>;

type KpiDrillType = "highRisk" | "night" | "remote" | "office";

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}

function DonutSplitCard({
  title,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftColor,
  rightColor,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  leftColor: string;
  rightColor: string;
}) {
  const total = leftValue + rightValue;
  const leftDeg = total > 0 ? (leftValue / total) * 360 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-3.5 pt-3.5 pb-2 border-b">
        <span className="text-xs font-bold text-gray-700">{title}</span>
      </div>
      <div className="p-3 flex items-center gap-3">
        <div
          className="w-[76px] h-[76px] rounded-full relative shrink-0"
          style={{
            background: `conic-gradient(${leftColor} 0deg ${leftDeg}deg, ${rightColor} ${leftDeg}deg 360deg)`,
          }}
        >
          <div className="absolute inset-[13px] bg-white rounded-full flex items-center justify-center">
            <span className="text-[11px] font-mono font-bold text-gray-700">{total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: leftColor }} />
              <span className="text-gray-600">{leftLabel}</span>
            </div>
            <span className="font-mono font-semibold text-gray-800">{leftValue}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rightColor }} />
              <span className="text-gray-600">{rightLabel}</span>
            </div>
            <span className="font-mono font-semibold text-gray-800">{rightValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiDrilldownSidebar({
  isOpen,
  onClose,
  title,
  rows,
  showDayNight,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rows: SafetyWork[];
  showDayNight: boolean;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[350] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.25)" }}
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 h-full bg-white z-[351] shadow-2xl transition-transform duration-300 flex flex-col"
        style={{
          width: "620px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ background: "var(--region-primary)" }}
        >
          <div className="text-white font-bold text-sm">{title} - 금일 작업</div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-3 border-b bg-gray-50 text-xs text-gray-500">
          총 <b style={{ color: "var(--region-primary)" }}>{rows.length}</b>건
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--region-light)" }}>
              <tr className="border-b" style={{ borderColor: "var(--region-border)" }}>
                <th className="px-2 py-2 text-left font-bold" style={{ color: "var(--region-primary)" }}>작업명</th>
                <th className="px-2 py-2 text-left font-bold" style={{ color: "var(--region-primary)" }}>지역</th>
                <th className="px-2 py-2 text-center font-bold" style={{ color: "var(--region-primary)" }}>분류</th>
                <th className="px-2 py-2 text-left font-bold" style={{ color: "var(--region-primary)" }}>담당팀</th>
                {showDayNight && (
                  <th className="px-2 py-2 text-center font-bold" style={{ color: "var(--region-primary)" }}>주/야간</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={showDayNight ? 5 : 4}
                    className="px-2 py-10 text-center text-gray-400"
                  >
                    금일 해당 작업이 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr
                    key={row.workId}
                    className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                  >
                    <td className="px-2 py-2 max-w-[260px]">
                      <div className="truncate text-gray-800 font-medium">{row.workName}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{row.workId}</div>
                    </td>
                    <td className="px-2 py-2 text-gray-600 whitespace-nowrap">{row.state} {row.city}</td>
                    <td className="px-2 py-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-semibold ${CATEGORY_STYLE[row.category]}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{row.team}</td>
                    {showDayNight && (
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
                            row.isNightWork
                              ? "bg-slate-800 text-yellow-300 border-slate-700"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                          }`}
                        >
                          {row.isNightWork ? "야간" : "주간"}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── 작업 상세 사이드바 ──
function WorkDetailSidebar({
  isOpen,
  onClose,
  work,
}: {
  isOpen: boolean;
  onClose: () => void;
  work: SafetyWork | null;
}) {
  if (!work) return null;

  const formatDt = (dt: string) =>
    dt.replace("T", " ").substring(0, 16);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-[330] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.25)" }}
        onClick={onClose}
      />
      {/* 패널 */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-[331] shadow-2xl transition-transform duration-300 flex flex-col`}
        style={{
          width: "400px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ background: "var(--region-primary)" }}
        >
          <div className="text-white font-bold text-sm flex items-center gap-2">
            <Shield size={15} />
            작업 상세
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {/* 작업명 */}
          <div>
            <div className="text-xs text-gray-400 mb-0.5 font-medium">작업명</div>
            <div className="font-semibold text-gray-900 leading-snug">
              {work.workName}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-mono">
              {work.workId}
            </div>
          </div>

          {/* 상태 / 분류 / 안전코드 */}
          <div className="flex flex-wrap gap-1.5">
            <Badge label={work.status} className={STATUS_STYLE[work.status]} />
            <Badge label={work.category} className={CATEGORY_STYLE[work.category]} />
            <Badge
              label={work.safetyCode}
              className={SAFETY_CODE_STYLE[work.safetyCode]}
            />
            {work.isNightWork && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-semibold bg-slate-800 text-yellow-300 border-slate-700">
                <Moon size={10} />
                야간
              </span>
            )}
          </div>

          {/* 일정 */}
          <div className="bg-gray-50 rounded p-3 space-y-1">
            <div className="text-xs text-gray-400 font-medium mb-1">일정</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">시작</span>
              <span className="font-mono">{formatDt(work.startAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">종료</span>
              <span className="font-mono">{formatDt(work.endAt)}</span>
            </div>
          </div>

          {/* 위치 */}
          <div className="bg-gray-50 rounded p-3 space-y-1">
            <div className="text-xs text-gray-400 font-medium mb-1">위치</div>
            <div className="text-xs">{work.state} {work.city}</div>
            <div className="text-xs text-gray-600">{work.location}</div>
          </div>

          {/* 팀 / 협력사 */}
          <div className="bg-gray-50 rounded p-3 space-y-1">
            <div className="text-xs text-gray-400 font-medium mb-1">담당</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">팀</span>
              <span>{work.team}</span>
            </div>
            {work.contractor && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">협력사</span>
                <span>{work.contractor}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">영향도</span>
              <span
                className={
                  work.impactLevel === 2
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                }
              >
                Level {work.impactLevel}
                {work.impactLevel === 2 ? " (고)" : " (저)"}
              </span>
            </div>
          </div>

          {/* 장비 */}
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1.5">관련 장비</div>
            <div className="flex flex-wrap gap-1">
              {work.equipment.map((eq) => (
                <span
                  key={eq}
                  className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700 border border-gray-200"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>

          {/* 비고 */}
          {work.remark && (
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">비고</div>
              <div className="text-xs text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                {work.remark}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function SafetyWorkPage({ region }: SafetyWorkPageProps) {
  const [selectedTeam, setSelectedTeam] = useState<WorkTeam | null>(null);
  const [filterStatuses, setFilterStatuses] = useState<WorkStatus[]>([]);
  const [filterCategories, setFilterCategories] = useState<WorkCategory[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [filterSafetyCodes, setFilterSafetyCodes] = useState<SafetyCode[]>([]);
  const [filterNightTypes, setFilterNightTypes] = useState<string[]>([]);
  const [filterDistanceTypes, setFilterDistanceTypes] = useState<string[]>([]);
  const [isTodayOnly, setIsTodayOnly] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("startAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedWork, setSelectedWork] = useState<SafetyWork | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isKpiDrillOpen, setIsKpiDrillOpen] = useState(false);
  const [activeKpiDrill, setActiveKpiDrill] = useState<KpiDrillType>("highRisk");

  const teams = HQ_TEAMS[region];
  const kpi = getSafetyKpi(region, selectedTeam ?? undefined);

  const scopeRows = useMemo(() => {
    return safetyWorks.filter(
      (w) => w.hq === region && (!selectedTeam || w.team === selectedTeam),
    );
  }, [region, selectedTeam]);

  const now = new Date();
  const todayDateString = now.toISOString().slice(0, 10);
  const weekStart = new Date(now);
  const diffFromMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - diffFromMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekRows = useMemo(() => {
    return scopeRows.filter((work) => {
      const workDate = new Date(work.startAt);
      return workDate >= weekStart && workDate < weekEnd;
    });
  }, [scopeRows, weekStart, weekEnd]);

  const isNearCity = (work: SafetyWork): boolean => {
    const cityText = `${work.state} ${work.city} ${work.location}`;

    if (work.hq === "central") {
      if (work.team === "충북Access운용팀") {
        return CENTRAL_CHUNGBUK_ACCESS_NEAR_CITIES.some((keyword) =>
          cityText.includes(keyword),
        );
      }
      return CENTRAL_NEAR_CITIES.some((keyword) => cityText.includes(keyword));
    }

    // 서부 제주권은 모두 근거리
    if (cityText.includes("제주")) return true;

    if (work.team === "전북Access운용팀") {
      return WEST_JEONBUK_ACCESS_NEAR_CITIES.some((keyword) =>
        cityText.includes(keyword),
      );
    }

    return WEST_DEFAULT_NEAR_CITIES.some((keyword) => cityText.includes(keyword));
  };

  const isRemoteWork = (work: SafetyWork): boolean => {
    // 애매한 정보는 근거리로 처리
    return !isNearCity(work);
  };

  const isOfficeWork = (work: SafetyWork): boolean => {
    return OFFICE_NAME_KEYWORDS.some((keyword) => work.workName.includes(keyword));
  };

  const getDayWeekCount = (predicate: (work: SafetyWork) => boolean) => {
    let day = 0;
    let week = 0;

    scopeRows.forEach((work) => {
      if (!predicate(work)) return;
      const workDateString = work.startAt.slice(0, 10);
      if (workDateString === todayDateString) day += 1;

      const workDate = new Date(work.startAt);
      if (workDate >= weekStart && workDate < weekEnd) week += 1;
    });

    return { day, week };
  };

  const highRiskKpi = getDayWeekCount((w) => w.safetyCode === "C3" || w.safetyCode === "C4");
  const nightWorkKpi = getDayWeekCount((w) => w.isNightWork);
  const remoteWorkKpi = getDayWeekCount((w) => isRemoteWork(w));
  const officeWorkKpi = getDayWeekCount((w) => isOfficeWork(w));

  const todayRows = useMemo(
    () => scopeRows.filter((w) => w.startAt.slice(0, 10) === todayDateString),
    [scopeRows, todayDateString],
  );

  const kpiDrillRows = useMemo(() => {
    if (activeKpiDrill === "highRisk") {
      return todayRows.filter((w) => w.safetyCode === "C3" || w.safetyCode === "C4");
    }
    if (activeKpiDrill === "night") {
      return todayRows.filter((w) => w.isNightWork);
    }
    if (activeKpiDrill === "remote") {
      return todayRows.filter((w) => isRemoteWork(w));
    }
    return todayRows.filter((w) => isOfficeWork(w));
  }, [activeKpiDrill, todayRows]);

  const kpiDrillTitle =
    activeKpiDrill === "highRisk"
      ? "고위험 작업 현황"
      : activeKpiDrill === "night"
      ? "야간 작업 현황"
      : activeKpiDrill === "remote"
      ? "원거리 작업 현황"
      : "사옥 작업 현황";

  const kpiDrillShowDayNight = activeKpiDrill !== "night";

  const weeklyHighRiskCount = weekRows.filter(
    (w) => w.safetyCode === "C3" || w.safetyCode === "C4",
  ).length;
  const weeklyNormalCount = weekRows.length - weeklyHighRiskCount;
  const weeklyNightCount = weekRows.filter((w) => w.isNightWork).length;
  const weeklyDayCount = weekRows.length - weeklyNightCount;
  const weeklyRemoteCount = weekRows.filter((w) => isRemoteWork(w)).length;
  const weeklyNearCount = weekRows.length - weeklyRemoteCount;

  const weeklyTeamSummaries = useMemo(() => {
    const targetTeams = selectedTeam ? [selectedTeam] : HQ_TEAMS[region];

    return targetTeams.map((team) => {
      const rows = weekRows.filter((w) => w.team === team);
      return {
        team,
        total: rows.length,
        completed: rows.filter((w) => w.status === "완료").length,
        inProgress: rows.filter((w) => w.status === "진행중").length,
        scheduled: rows.filter((w) => w.status === "예정").length,
        delayed: rows.filter((w) => w.status === "지연").length,
        highRisk: rows.filter((w) => w.safetyCode === "C3" || w.safetyCode === "C4").length,
      };
    });
  }, [region, selectedTeam, weekRows]);

  const tableBaseRows = useMemo(() => {
    return safetyWorks.filter(
      (w) => w.hq === region && (!selectedTeam || w.team === selectedTeam),
    );
  }, [region, selectedTeam]);

  const uniqueTableTeams = useMemo(
    () => Array.from(new Set(tableBaseRows.map((w) => w.team))),
    [tableBaseRows],
  );
  const uniqueTableCategories = useMemo(
    () => Array.from(new Set(tableBaseRows.map((w) => w.category))),
    [tableBaseRows],
  );
  const uniqueTableStatuses = useMemo(
    () => Array.from(new Set(tableBaseRows.map((w) => w.status))),
    [tableBaseRows],
  );
  const uniqueTableSafetyCodes = useMemo(
    () => Array.from(new Set(tableBaseRows.map((w) => w.safetyCode))),
    [tableBaseRows],
  );

  // ── 필터링 + 정렬 ──
  const filteredRows = useMemo(() => {
    let rows = safetyWorks.filter((w) => w.hq === region);
    if (selectedTeam) rows = rows.filter((w) => w.team === selectedTeam);
    if (filterTeams.length > 0)
      rows = rows.filter((w) => filterTeams.includes(w.team));
    if (filterStatuses.length > 0)
      rows = rows.filter((w) => filterStatuses.includes(w.status));
    if (filterCategories.length > 0)
      rows = rows.filter((w) => filterCategories.includes(w.category));
    if (filterSafetyCodes.length > 0)
      rows = rows.filter((w) => filterSafetyCodes.includes(w.safetyCode));
    if (filterNightTypes.length > 0)
      rows = rows.filter((w) => {
        const nightType = w.isNightWork ? "야간" : "주간";
        return filterNightTypes.includes(nightType);
      });
    if (filterDistanceTypes.length > 0)
      rows = rows.filter((w) => {
        const distanceType = isRemoteWork(w) ? "원거리" : "근거리";
        return filterDistanceTypes.includes(distanceType);
      });
    if (isTodayOnly)
      rows = rows.filter((w) => w.startAt.slice(0, 10) === todayDateString);
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      rows = rows.filter(
        (w) =>
          w.workName.toLowerCase().includes(q) ||
          w.workId.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q),
      );
    }
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey] as string;
      const vb = b[sortKey] as string;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [
    region,
    selectedTeam,
    filterTeams,
    filterStatuses,
    filterCategories,
    filterSafetyCodes,
    filterNightTypes,
    filterDistanceTypes,
    isTodayOnly,
    searchText,
    sortKey,
    sortOrder,
    todayDateString,
  ]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortOrder === "asc" ? (
        <ChevronUp size={11} className="inline-block ml-0.5" />
      ) : (
        <ChevronDown size={11} className="inline-block ml-0.5" />
      )
    ) : (
      <span className="inline-block ml-0.5 w-[11px]" />
    );

  const toggleStatus = (s: WorkStatus) =>
    setFilterStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleCategory = (c: WorkCategory) =>
    setFilterCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const toggleTeam = (team: string) =>
    setFilterTeams((prev) =>
      prev.includes(team) ? prev.filter((x) => x !== team) : [...prev, team],
    );

  const toggleSafetyCode = (code: string) =>
    setFilterSafetyCodes((prev) =>
      prev.includes(code as SafetyCode)
        ? prev.filter((x) => x !== code)
        : [...prev, code as SafetyCode],
    );

  const toggleNightType = (nightType: string) =>
    setFilterNightTypes((prev) =>
      prev.includes(nightType)
        ? prev.filter((x) => x !== nightType)
        : [...prev, nightType],
    );

  const toggleDistanceType = (distanceType: string) =>
    setFilterDistanceTypes((prev) =>
      prev.includes(distanceType)
        ? prev.filter((x) => x !== distanceType)
        : [...prev, distanceType],
    );

  const clearAllTableFilters = () => {
    setFilterTeams([]);
    setFilterCategories([]);
    setFilterStatuses([]);
    setFilterSafetyCodes([]);
    setFilterNightTypes([]);
    setFilterDistanceTypes([]);
    setIsTodayOnly(false);
    setSearchText("");
    setOpenDropdown(null);
  };

  const hqLabel = region === "central" ? "중부" : "서부";
  // 요구사항: 화면에 표시되는 작업목록 데이터가 10개 이상이면 제목열 고정
  const shouldFixTitleColumn = filteredRows.length >= 10;

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* ── 헤더 필터 행 ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">팀 선택</span>
        <button
          onClick={() => setSelectedTeam(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            selectedTeam === null
              ? "text-white border-transparent shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
          style={
            selectedTeam === null
              ? { background: "var(--region-primary)", borderColor: "var(--region-primary)" }
              : {}
          }
        >
          전체
        </button>
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => setSelectedTeam(team)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              selectedTeam === team
                ? "text-white border-transparent shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
            style={
              selectedTeam === team
                ? {
                    background: "var(--region-primary)",
                    borderColor: "var(--region-primary)",
                  }
                : {}
            }
          >
            {team}
          </button>
        ))}
      </div>

      {/* ── KPI 카드 ── */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          label="고위험 작업 현황 (C3 이상)"
          value={`${highRiskKpi.day} / ${highRiskKpi.week}`}
          unit="당일 / 주간(건)"
          variant={highRiskKpi.day > 0 ? "danger" : "warn"}
          onClick={() => {
            setActiveKpiDrill("highRisk");
            setIsKpiDrillOpen(true);
          }}
        />
        <KpiCard
          label="야간 작업 현황"
          value={`${nightWorkKpi.day} / ${nightWorkKpi.week}`}
          unit="당일 / 주간(건)"
          variant={nightWorkKpi.day > 0 ? "warn" : "default"}
          onClick={() => {
            setActiveKpiDrill("night");
            setIsKpiDrillOpen(true);
          }}
        />
        <KpiCard
          label="원거리 작업 현황"
          value={`${remoteWorkKpi.day} / ${remoteWorkKpi.week}`}
          unit="당일 / 주간(건)"
          variant={remoteWorkKpi.day > 0 ? "warn" : "default"}
          onClick={() => {
            setActiveKpiDrill("remote");
            setIsKpiDrillOpen(true);
          }}
        />
        <KpiCard
          label="사옥작업 현황"
          value={`${officeWorkKpi.day} / ${officeWorkKpi.week}`}
          unit="당일 / 주간(건)"
          variant="default"
          onClick={() => {
            setActiveKpiDrill("office");
            setIsKpiDrillOpen(true);
          }}
        />
      </div>

      {/* ── 주간 작업 현황 + 분류/안전코드 ── */}
      <div className="grid grid-cols-3 gap-3.5">
        {/* 주간 작업 현황 (도넛 3종) */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-3.5 pt-3.5 pb-2 border-b">
            <span className="text-xs font-bold text-gray-700">
              {hqLabel} 주간 작업 현황
            </span>
          </div>
          <div className="p-3 grid grid-cols-3 gap-3">
            <DonutSplitCard
              title="고위험 / 일반"
              leftLabel="고위험"
              rightLabel="일반"
              leftValue={weeklyHighRiskCount}
              rightValue={weeklyNormalCount}
              leftColor="#F97316"
              rightColor="#94A3B8"
            />
            <DonutSplitCard
              title="주간 / 야간"
              leftLabel="주간"
              rightLabel="야간"
              leftValue={weeklyDayCount}
              rightValue={weeklyNightCount}
              leftColor="#0EA5E9"
              rightColor="#334155"
            />
            <DonutSplitCard
              title="근거리 / 원거리"
              leftLabel="근거리"
              rightLabel="원거리"
              leftValue={weeklyNearCount}
              rightValue={weeklyRemoteCount}
              leftColor="#22C55E"
              rightColor="#EF4444"
            />
          </div>

          <div className="px-3.5 pt-2 pb-1 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700">팀별 주간 현황</span>
          </div>
          <div className="px-3.5 pb-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-2 py-1.5 text-left font-semibold text-gray-600">팀</th>
                    <th className="px-2 py-1.5 text-right font-semibold text-gray-600">전체</th>
                    <th className="px-2 py-1.5 text-right font-semibold text-green-600">진행중</th>
                    <th className="px-2 py-1.5 text-right font-semibold text-blue-600">완료</th>
                    <th className="px-2 py-1.5 text-right font-semibold text-red-600">지연</th>
                    <th className="px-2 py-1.5 text-right font-semibold text-orange-600">고위험</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyTeamSummaries.map((ts, idx) => (
                    <tr
                      key={ts.team}
                      className={`border-b last:border-0 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-2 py-1.5 text-gray-700">{ts.team}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{ts.total}</td>
                      <td className="px-2 py-1.5 text-right font-mono text-green-700">
                        {ts.inProgress || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-blue-700">
                        {ts.completed || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-red-600">
                        {ts.delayed || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-orange-600">
                        {ts.highRisk || <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 분류별 + 안전코드별(팀별 주간 표 포함) */}
        <div className="flex flex-col gap-3.5">
          {/* 분류별 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1">
            <div className="px-3.5 pt-3.5 pb-2 border-b">
              <span className="text-xs font-bold text-gray-700">분류별 현황</span>
            </div>
            <div className="p-3 space-y-2">
              {ALL_CATEGORIES.map((cat) => {
                const count = kpi.byCategory[cat];
                const pct = kpi.total > 0 ? (count / kpi.total) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600">{cat}</span>
                      <span className="font-mono font-semibold text-gray-800">
                        {count}건
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: "var(--region-primary)",
                          opacity: 0.75,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 안전코드별 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-3.5 pt-3.5 pb-2 border-b">
              <span className="text-xs font-bold text-gray-700">안전코드별 현황</span>
            </div>
            <div className="p-3 grid grid-cols-4 gap-2 border-b border-gray-100">
              {(["C1", "C2", "C3", "C4"] as SafetyCode[]).map((code) => (
                <div
                  key={code}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${SAFETY_CODE_STYLE[code]}`}
                  >
                    {code}
                  </span>
                  <span className="text-sm font-bold font-mono text-gray-800">
                    {kpi.bySafetyCode[code]}
                  </span>
                  <span className="text-[9px] text-gray-400">건</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 작업 목록 테이블 ── */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="px-3.5 pt-3.5 pb-2 border-b flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs font-bold text-gray-700">
            작업 목록
            <span className="ml-2 text-gray-400 font-normal">
              {filteredRows.length}건
            </span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {/* 검색 */}
            <input
              type="text"
              placeholder="작업명·위치 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1 w-36 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={() => setIsTodayOnly((prev) => !prev)}
              className={`px-2.5 py-1 rounded border text-[10px] font-semibold transition-all ${
                isTodayOnly
                  ? "text-white"
                  : "text-gray-500 border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={
                isTodayOnly
                  ? {
                      backgroundColor: "var(--region-primary)",
                      borderColor: "var(--region-primary)",
                    }
                  : {}
              }
            >
              당일 작업만
            </button>
            {(filterTeams.length > 0 ||
              filterStatuses.length > 0 ||
              filterCategories.length > 0 ||
              filterSafetyCodes.length > 0 ||
              filterNightTypes.length > 0 ||
              filterDistanceTypes.length > 0 ||
              isTodayOnly ||
              searchText) && (
              <button
                onClick={clearAllTableFilters}
                className="text-[10px] text-gray-400 hover:text-gray-700 underline"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        <div
          className={`overflow-x-auto ${
            shouldFixTitleColumn ? "max-h-[420px] overflow-y-auto" : ""
          }`}
        >
          <table className="w-full text-xs">
            <thead
              className="z-10"
              style={{ backgroundColor: "var(--region-light)" }}
            >
              <tr className="border-b" style={{ borderColor: "var(--region-border)" }}>
                <th
                  className={`px-3 py-2 text-left text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 left-0 z-20 border-r" : ""
                  }`}
                  style={
                    shouldFixTitleColumn
                      ? {
                          backgroundColor: "var(--region-light)",
                          color: "var(--region-primary)",
                          borderRightColor: "var(--region-border)",
                        }
                      : {
                          backgroundColor: "var(--region-light)",
                          color: "var(--region-primary)",
                        }
                  }
                  onClick={() => handleSort("workName")}
                >
                  작업명 <SortIcon k="workName" />
                </th>
                <th
                  className={`px-3 py-2 text-left text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <button
                      className="flex items-center text-xs font-bold"
                      onClick={() => handleSort("team")}
                    >
                      팀 <SortIcon k="team" />
                    </button>
                    <ColumnFilterDropdown
                      column="team"
                      values={uniqueTableTeams}
                      selectedValues={filterTeams}
                      onToggle={toggleTeam}
                      onClear={() => {
                        setFilterTeams([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "team"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "team" : null)
                      }
                    />
                  </div>
                </th>
                <th
                  className={`px-3 py-2 text-center text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="flex items-center text-xs font-bold"
                      onClick={() => handleSort("category")}
                    >
                      분류 <SortIcon k="category" />
                    </button>
                    <ColumnFilterDropdown
                      column="category"
                      values={uniqueTableCategories}
                      selectedValues={filterCategories}
                      onToggle={(value) => toggleCategory(value as WorkCategory)}
                      onClear={() => {
                        setFilterCategories([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "category"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "category" : null)
                      }
                    />
                  </div>
                </th>
                <th
                  className={`px-3 py-2 text-center text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="flex items-center text-xs font-bold"
                      onClick={() => handleSort("status")}
                    >
                      상태 <SortIcon k="status" />
                    </button>
                    <ColumnFilterDropdown
                      column="status"
                      values={uniqueTableStatuses}
                      selectedValues={filterStatuses}
                      onToggle={(value) => toggleStatus(value as WorkStatus)}
                      onClear={() => {
                        setFilterStatuses([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "status"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "status" : null)
                      }
                    />
                  </div>
                </th>
                <th
                  className={`px-3 py-2 text-center text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="flex items-center text-xs font-bold"
                      onClick={() => handleSort("safetyCode")}
                    >
                      안전코드 <SortIcon k="safetyCode" />
                    </button>
                    <ColumnFilterDropdown
                      column="safetyCode"
                      values={uniqueTableSafetyCodes}
                      selectedValues={filterSafetyCodes}
                      onToggle={toggleSafetyCode}
                      onClear={() => {
                        setFilterSafetyCodes([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "safetyCode"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "safetyCode" : null)
                      }
                    />
                  </div>
                </th>
                <th
                  className={`px-3 py-2 text-center text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>야간</span>
                    <ColumnFilterDropdown
                      column="night"
                      values={["야간", "주간"]}
                      selectedValues={filterNightTypes}
                      onToggle={toggleNightType}
                      onClear={() => {
                        setFilterNightTypes([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "night"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "night" : null)
                      }
                    />
                  </div>
                </th>
                <th
                  className={`px-3 py-2 text-left text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                  onClick={() => handleSort("startAt")}
                >
                  시작 <SortIcon k="startAt" />
                </th>
                <th
                  className={`px-3 py-2 text-left text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                  onClick={() => handleSort("endAt")}
                >
                  종료 <SortIcon k="endAt" />
                </th>
                <th
                  className={`px-3 py-2 text-left text-xs font-bold whitespace-nowrap ${
                    shouldFixTitleColumn ? "sticky top-0 z-10" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                  onClick={() => handleSort("city")}
                >
                  <div className="flex items-center gap-1">
                    <button
                      className="flex items-center text-xs font-bold"
                      onClick={() => handleSort("city")}
                    >
                      지역 <SortIcon k="city" />
                    </button>
                    <ColumnFilterDropdown
                      column="distance"
                      values={["근거리", "원거리"]}
                      selectedValues={filterDistanceTypes}
                      onToggle={toggleDistanceType}
                      onClear={() => {
                        setFilterDistanceTypes([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "distance"}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? "distance" : null)
                      }
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    해당 조건에 맞는 작업이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr
                    key={row.workId}
                    className={`border-b last:border-0 cursor-pointer transition-colors ${
                      idx % 2 === 0
                        ? "bg-white hover:bg-blue-50"
                        : "bg-gray-50/40 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      setSelectedWork(row);
                      setIsDetailOpen(true);
                    }}
                  >
                    {/* 작업명 */}
                    <td
                      className={`px-3 py-2 max-w-[260px] ${
                        shouldFixTitleColumn ? "sticky left-0 z-10 border-r" : ""
                      }`}
                      style={
                        shouldFixTitleColumn
                          ? { backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa" }
                          : {}
                      }
                    >
                      <div className="truncate font-medium text-gray-800">
                        {row.workName}
                      </div>
                      <div className="text-[9px] text-gray-400 font-mono truncate">
                        {row.workId}
                      </div>
                    </td>
                    {/* 팀 */}
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                      {row.team}
                    </td>
                    {/* 분류 */}
                    <td className="px-3 py-2 text-center">
                      <Badge
                        label={row.category}
                        className={CATEGORY_STYLE[row.category]}
                      />
                    </td>
                    {/* 상태 */}
                    <td className="px-3 py-2 text-center">
                      <Badge
                        label={row.status}
                        className={STATUS_STYLE[row.status]}
                      />
                    </td>
                    {/* 안전코드 */}
                    <td className="px-3 py-2 text-center">
                      <Badge
                        label={row.safetyCode}
                        className={SAFETY_CODE_STYLE[row.safetyCode]}
                      />
                    </td>
                    {/* 야간 */}
                    <td className="px-3 py-2 text-center">
                      {row.isNightWork ? (
                        <Moon
                          size={12}
                          className="inline-block text-slate-600"
                        />
                      ) : (
                        <span className="text-gray-200">—</span>
                      )}
                    </td>
                    {/* 시작 */}
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                      {row.startAt.replace("T", " ").substring(0, 16)}
                    </td>
                    {/* 종료 */}
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                      {row.endAt.replace("T", " ").substring(0, 16)}
                    </td>
                    {/* 지역 */}
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                      {row.state} {row.city}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 작업 상세 사이드바 ── */}
      <WorkDetailSidebar
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        work={selectedWork}
      />

      <KpiDrilldownSidebar
        isOpen={isKpiDrillOpen}
        onClose={() => setIsKpiDrillOpen(false)}
        title={kpiDrillTitle}
        rows={kpiDrillRows}
        showDayNight={kpiDrillShowDayNight}
      />
    </div>
  );
}
