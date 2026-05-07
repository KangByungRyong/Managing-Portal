import { useMemo, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Server, Cpu, PauseCircle, Wrench, Trash2 } from "lucide-react";
import { HqDivision } from "../data/facilityStatusData";
import { ColumnFilterDropdown } from "../components/ColumnFilterDropdown";
import {
  getSecurityData,
} from "../data/securityMockData";

interface SecurityPageProps {
  region: HqDivision;
}

const KPI_SINGLE_COLORS = {
  완료: "#2563eb",
  미완료: "#e5e7eb",
};

function SingleKpiDonut({
  title,
  total,
  completed,
  delta,
}: {
  title: string;
  total: number;
  completed: number;
  delta: number;
}) {
  const remaining = Math.max(total - completed, 0);
  const rate = total > 0 ? (completed / total) * 100 : 0;
  const chartData = [
    { name: "완료", value: completed, color: KPI_SINGLE_COLORS.완료 },
    { name: "미완료", value: remaining, color: KPI_SINGLE_COLORS.미완료 },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2.5">
      <p className="text-[11px] font-semibold text-gray-600 truncate mb-1.5">{title}</p>
      <div className="relative h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" innerRadius={30} outerRadius={48} strokeWidth={2}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value.toLocaleString(), "대수"]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-500">{total.toLocaleString()}대</span>
          <span className="text-sm font-bold text-gray-800 tabular-nums">{rate.toFixed(1)}%</span>
        </div>
      </div>
      <div className="text-[10px] text-gray-600 mt-1">
        전월 대비
        <span className={`ml-1 font-semibold ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
          {delta >= 0 ? "+" : ""}{delta.toLocaleString()}대
        </span>
      </div>
    </div>
  );
}

const EQUIPMENT_ICON = {
  "총 운용 장비 대수": Server,
  "운용 장비 대수": Cpu,
  "유휴 장비 대수": PauseCircle,
  "구축 장비 대수": Wrench,
  "폐기 장비 대수": Trash2,
} as const;

export function SecurityPage({ region }: SecurityPageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const data = getSecurityData(regionKey);

  const [filterTitles, setFilterTitles] = useState<string[]>([]);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deadlineSort, setDeadlineSort] = useState<"asc" | "desc">("asc");

  const allTasks = useMemo(() => data.tasks, [data.tasks]);

  const uniqueTaskTitles = useMemo(() => {
    return Array.from(new Set(allTasks.map((task) => task.title))).sort((a, b) => a.localeCompare(b, "ko-KR"));
  }, [allTasks]);

  const uniqueRequestTeams = useMemo(() => {
    return Array.from(new Set(allTasks.map((task) => task.requestTeam))).sort((a, b) => a.localeCompare(b, "ko-KR"));
  }, [allTasks]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(allTasks.map((task) => task.status))).sort((a, b) => a.localeCompare(b, "ko-KR"));
  }, [allTasks]);

  const toggleTitleFilter = (value: string) => {
    setFilterTitles((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleTeamFilter = (value: string) => {
    setFilterTeams((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleStatusFilter = (value: string) => {
    setFilterStatuses((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const parseDeadline = (deadline: string): number => {
    if (deadline.includes("즉시")) return new Date(2000, 0, 1).getTime();
    if (deadline.includes("미지정")) return Number.MAX_SAFE_INTEGER;

    const match = deadline.match(/'?(\d{2})\.(\d{2})\.(\d{2})/);
    if (!match) return Number.MAX_SAFE_INTEGER - 1;

    const year = Number(`20${match[1]}`);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, month, day).getTime();
  };

  const filteredTasks = useMemo(() => {
    const filtered = allTasks.filter((task) => {
      if (filterTitles.length > 0 && !filterTitles.includes(task.title)) return false;
      if (filterTeams.length > 0 && !filterTeams.includes(task.requestTeam)) return false;
      if (filterStatuses.length > 0 && !filterStatuses.includes(task.status)) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const compared = parseDeadline(a.deadline) - parseDeadline(b.deadline);
      return deadlineSort === "asc" ? compared : -compared;
    });

    return sorted;
  }, [allTasks, filterTitles, filterTeams, filterStatuses, deadlineSort]);

  const useStickyHeader = filteredTasks.length > 10;

  const serverKpiItems = useMemo(() => {
    const kpiTargets = [
      { sourceLabel: "저장 제한", displayLabel: "평문정보 저장제한", delta: regionKey === "central" ? 2 : 7 },
      { sourceLabel: "EOS 장비 교체 및 리빌딩", displayLabel: "EOS 장비 교체 및 리빌딩", delta: regionKey === "central" ? 3 : 9 },
      { sourceLabel: "EDR 설치", displayLabel: "EDR 설치", delta: regionKey === "central" ? 4 : 11 },
      { sourceLabel: "보안 진단 및 Solution 적용", displayLabel: "SolidStep 설치", delta: regionKey === "central" ? 1 : 5 },
    ] as const;

    return kpiTargets.map((target) => {
      const found = data.serverActions.find((item) => item.label === target.sourceLabel);
      return {
        label: target.displayLabel,
        total: data.serverTotal,
        completed: found?.completed ?? 0,
        delta: target.delta,
      };
    });
  }, [data.serverActions, data.serverTotal, regionKey]);

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
          <span className="text-sm font-bold text-gray-700">보안 현황 요약</span>
          <span className="text-[10px] text-gray-400">Security KPI</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {serverKpiItems.map((item) => (
            <SingleKpiDonut
              key={item.label}
              title={item.label}
              total={data.serverTotal}
              completed={item.completed}
              delta={item.delta}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
          <span className="text-sm font-bold text-gray-700">장비 현황</span>
          {(() => {
            const total = data.equipmentStatus.find(e => e.label === "총 운용 장비 대수")?.count ?? 0;
            const active = data.equipmentStatus.find(e => e.label === "운용 장비 대수")?.count ?? 0;
            const rate = total > 0 ? Math.round((active / total) * 100) : 0;
            return (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: "var(--region-primary)" }}>
                가동율 {rate}%
              </span>
            );
          })()}
        </div>        
        <div className="grid grid-cols-5 gap-2">
          {data.equipmentStatus.map((item) => {
            const Icon = EQUIPMENT_ICON[item.label];
            return (
              <div key={item.label} className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-600">{item.label}</p>
                    <p className="text-xl font-bold text-gray-800 font-mono leading-tight mt-1">{item.count.toLocaleString()}<span className="text-xs font-medium text-gray-500 ml-1">대</span></p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      전월 대비
                      <span className={`ml-1 font-semibold ${item.delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.delta >= 0 ? "+" : ""}{item.delta.toLocaleString()}대
                      </span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                    <Icon size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col min-h-0 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
          <span className="text-sm font-bold text-gray-700">주요 보안 과제 현황</span>
        </div>
        <p className="text-xs font-semibold text-gray-600 mb-2">총 {filteredTasks.length.toLocaleString()}건</p>
        <div className="overflow-auto border border-gray-200 rounded-md flex-1 min-h-0">
          <table className="w-full text-[11px]">
            <thead className={`bg-gray-50 text-gray-600 ${useStickyHeader ? "sticky top-0 z-10" : ""}`}>
              <tr>
                <th className="text-left p-2">
                  <div className="flex items-center gap-1">
                    <span>과제</span>
                    <ColumnFilterDropdown
                      column="task-title"
                      values={uniqueTaskTitles}
                      selectedValues={filterTitles}
                      onToggle={toggleTitleFilter}
                      onClear={() => {
                        setFilterTitles([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "task-title"}
                      onOpenChange={(open) => setOpenDropdown(open ? "task-title" : null)}
                    />
                  </div>
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-1">
                    <span>요청부서</span>
                    <ColumnFilterDropdown
                      column="request-team"
                      values={uniqueRequestTeams}
                      selectedValues={filterTeams}
                      onToggle={toggleTeamFilter}
                      onClear={() => {
                        setFilterTeams([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "request-team"}
                      onOpenChange={(open) => setOpenDropdown(open ? "request-team" : null)}
                    />
                  </div>
                </th>
                <th className="text-left p-2 cursor-pointer select-none" onClick={() => setDeadlineSort((prev) => (prev === "asc" ? "desc" : "asc"))}>
                  기한 {deadlineSort === "asc" ? "▲" : "▼"}
                </th>
                <th className="text-left p-2">
                  <div className="flex items-center gap-1">
                    <span>상태</span>
                    <ColumnFilterDropdown
                      column="task-status"
                      values={uniqueStatuses}
                      selectedValues={filterStatuses}
                      onToggle={toggleStatusFilter}
                      onClear={() => {
                        setFilterStatuses([]);
                        setOpenDropdown(null);
                      }}
                      isOpen={openDropdown === "task-status"}
                      onOpenChange={(open) => setOpenDropdown(open ? "task-status" : null)}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-t border-gray-100">
                  <td className="p-2 text-gray-700">{task.title}</td>
                  <td className="p-2 text-gray-600">{task.requestTeam}</td>
                  <td className="p-2 text-gray-600">{task.deadline}</td>
                  <td className="p-2">
                    <span
                      className={`px-1.5 py-0.5 rounded border font-medium ${
                        task.status === "완료"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : task.status === "진행 중"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : task.status === "연기"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">필터 조건에 맞는 과제가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
