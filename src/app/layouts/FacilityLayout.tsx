// src/app/layouts/FacilityLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 현황 > 시설 현황 레이아웃
// Level3 탭(통합국/기지국/중계기/LoRa)을 렌더링하고 Outlet으로 하위 페이지 표시
// ─────────────────────────────────────────────────────────────────────────────
import { Outlet, useNavigate, useLocation } from "react-router";
import { Level3Tabs } from "../components/Level3Tabs";
import { useAppStore } from "../stores/appStore";
import { navigationConfig } from "../types/navigation";

const TABS = Object.entries(
  navigationConfig.status.children.facility.tabs,
).map(([key, value]) => ({
  id: key,
  label: value.label,
  status: value.status as "complete" | "structure" | "blank" | undefined,
}));

export function FacilityLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dbLastUpdated } = useAppStore();

  // 현재 활성 탭: URL 마지막 세그먼트에서 추출
  const activeTab = location.pathname.split("/").pop() ?? "tonghab";

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3.5 flex-shrink-0">
        <Level3Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tabId) => navigate(`/status/facility/${tabId}`)}
        />
        <div className="text-xs text-gray-500 font-mono">
          DB 업데이트: {dbLastUpdated}
        </div>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
