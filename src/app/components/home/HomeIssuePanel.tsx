// src/app/components/home/HomeIssuePanel.tsx
import { IssueItem, IssueLevel } from "../../data/homeMockData";

const LEVEL_CONFIG: Record<IssueLevel, { dot: string; badge: string; label: string }> = {
  critical: { dot: "bg-red-500",    badge: "bg-red-50 text-red-700",    label: "긴급" },
  warning:  { dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700", label: "주의" },
  info:     { dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700",   label: "정보" },
};

interface HomeIssuePanelProps {
  issues: IssueItem[];
}

export function HomeIssuePanel({ issues }: HomeIssuePanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5">
      <div className="shrink-0 flex items-center gap-1.5">
        <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-[15px] font-bold text-gray-700">이슈사항</span>
        <span className="text-[10px] text-gray-400 ml-1">Issues</span>
        <span className="ml-auto text-[10px] text-gray-400">
          {issues.length}건
        </span>
        {issues.filter((i) => i.level === "critical").length > 0 && (
          <span className="text-[10px] font-semibold text-red-500">
            긴급 {issues.filter((i) => i.level === "critical").length}건
          </span>
        )}
      </div>
      <div className="max-h-[160px] overflow-y-auto pr-0.5 flex flex-col gap-1">
        {issues.map((issue) => {
          const cfg = LEVEL_CONFIG[issue.level];
          return (
            <div key={issue.id}
              className="shrink-0 flex items-start gap-1.5 p-1.5 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className={`text-[13px] font-semibold px-1 py-0.5 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <p className="text-[13px] font-semibold text-gray-700 truncate">{issue.title}</p>
                  <span className="text-[10px] text-gray-300 ml-auto shrink-0">{issue.date}</span>
                </div>
                <p className="text-[11px] text-gray-400 truncate">
                  {issue.team}, {issue.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
