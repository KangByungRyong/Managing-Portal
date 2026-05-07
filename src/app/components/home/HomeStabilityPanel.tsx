// src/app/components/home/HomeStabilityPanel.tsx
import { RmItem } from "../../data/stabilityMockData";

const CATEGORY_COLORS: Record<string, string> = {
  고장: "text-red-600 bg-red-50",
  언론: "text-orange-600 bg-orange-50",
  장애: "text-amber-600 bg-amber-50",
  예방: "text-blue-600 bg-blue-50",
};

interface HomeStabilityPanelProps {
  rmItems: RmItem[];
  onNavigate?: () => void;
}

export function HomeStabilityPanel({ rmItems, onNavigate }: HomeStabilityPanelProps) {
  // 진행중인 항목만 필터, occurredAt 기준 최신 3건
  const inProgressItems = rmItems
    .filter((item) => item.status !== "처리완료")
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 3);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1.5 ${onNavigate ? "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-200 transition-shadow" : ""}`}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-3.5 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-[11px] font-bold text-gray-700">안정</span>
        <span className="text-[9px] text-gray-400 ml-1">진행중 RM</span>
        {onNavigate && <span className="ml-auto text-[8px] text-gray-300">▶</span>}
      </div>
      <div className="flex flex-col gap-1">
        {inProgressItems.length === 0 ? (
          <div className="px-2 py-2 text-[10px] text-gray-400 text-center">진행중인 RM이 없습니다</div>
        ) : (
          inProgressItems.map((item) => (
            <div key={item.id} className="flex items-start gap-1.5 px-2 py-1 rounded-md bg-gray-50">
              <span className={`shrink-0 mt-0.5 text-[8px] font-semibold px-1 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "text-gray-600 bg-gray-100"}`}>
                {item.category}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-700 font-medium truncate">{item.title}</p>
                <p className="text-[9px] text-gray-400">{item.occurredAt.slice(0, 16)} · {item.area}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
