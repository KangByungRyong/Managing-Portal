import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { BlankPage } from "./components/BlankPage";
import { KpiCard } from "./components/KpiCard";
import { Level3Tabs } from "./components/Level3Tabs";
import {
  NavigationState,
  navigationConfig,
} from "./types/navigation";
import { TonghabPage } from "./pages/TonghabPage";
import { GijigukPage } from "./pages/GijigukPage";
import { RepeaterPage } from "./pages/RepeaterPage";

export default function App() {
  const [region, setRegion] = useState<"central" | "west">(
    "central",
  );
  const [navState, setNavState] = useState<NavigationState>({
    level1: "status",
    level2: "facility",
    level3: "tonghab",
  });
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [dbLastUpdated, setDbLastUpdated] = useState("");

  // 초기 시간 설정
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastUpdated(formatted);

    // DB 업데이트 시간은 YYYY-MM-DD 형식
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setDbLastUpdated(`${year}-${month}-${day}`);

    // 1초마다 현재 시간 업데이트
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastUpdated(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 담당 변경 시 테마 업데이트
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-region",
      region === "central" ? "central" : "west",
    );
  }, [region]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    // 실제 API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setDbLastUpdated(`${year}-${month}-${day}`);
    setIsUpdating(false);
  };

  const renderContent = () => {
    const { level1, level2, level3 } = navState;

    // 홈 페이지
    if (level1 === "home") {
      return (
        <div className="flex-1 overflow-y-auto">
          <BlankPage title="준비 중인 페이지입니다" />
        </div>
      );
    }

    // 현황 > 시설 현황
    if (level1 === "status" && level2 === "facility") {
      const level2Config =
        navigationConfig.status.children?.facility;
      const level3Tabs = level2Config?.tabs
        ? Object.entries(level2Config.tabs).map(
            ([key, value]) => ({
              id: key,
              label: value.label,
              status: value.status as "complete" | "structure" | "blank" | undefined,
            }),
          )
        : [];

      return (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* 3차 탭 버튼 */}
          {level3Tabs.length > 0 && (
            <div className="flex items-center justify-between mb-3.5 flex-shrink-0">
              <Level3Tabs
                tabs={level3Tabs}
                activeTab={level3 || "tonghab"}
                onChange={(tabId) =>
                  setNavState({ ...navState, level3: tabId })
                }
              />
              <div className="text-xs text-gray-500 font-mono">
                DB 업데이트: {dbLastUpdated}
              </div>
            </div>
          )}

          {/* 통합국 현황 — 페이지 수직 스크롤 */}
          {level3 === "tonghab" && (
            <div className="flex-1 overflow-y-auto">
              <TonghabPage region={region} />
            </div>
          )}

          {/* 기지국 현황 — 페이지 수직 스크롤 */}
          {level3 === "giji" && (
            <div className="flex-1 overflow-y-auto">
              <GijigukPage region={region} />
            </div>
          )}

          {level3 === "junggye" && (
            <div className="flex-1 overflow-y-auto">
              <RepeaterPage region={region} />
            </div>
          )}
          {level3 === "lora" && (
            <div className="flex-1 overflow-y-auto">
              <BlankPage
                title="LoRa / WiFi / Femto 현황"
                description="추후 구성 예정"
                plannedFeatures={[
                  "LoRa 현황 (항목 미정)",
                  "WiFi 현황 (항목 미정)",
                  "Femto 현황 (항목 미정)",
                ]}
              />
            </div>
          )}
          {!["tonghab", "giji", "junggye", "lora"].includes(
            level3 || "",
          ) && (
            <div className="flex-1 overflow-y-auto">
              <BlankPage title="준비 중인 페이지입니다" />
            </div>
          )}
        </div>
      );
    }

    // 현황 > 재고 현황
    if (level1 === "status" && level2 === "inventory") {
      return (
        <div className="flex-1 overflow-y-auto">
          <BlankPage
            title="재고 현황"
            description="추후 구성 예정"
            plannedFeatures={[
              "재고 관리 현황",
              "입출고 현황",
              "재고 분석 지표",
            ]}
          />
        </div>
      );
    }

    // 현황 > 특화 지표
    if (level1 === "status" && level2 === "specialized") {
      return (
        <div className="flex-1 overflow-y-auto">
          <BlankPage
            title="특화 지표"
            description="추후 구성 예정"
            plannedFeatures={[
              "특화 항목 1 (TBD)",
              "특화 항목 2 (TBD)",
              "특화 항목 3 (TBD)",
            ]}
          />
        </div>
      );
    }

    // 기타 모든 페이지는 빈 페이지로
    return (
      <div className="flex-1 overflow-y-auto">
        <BlankPage title="준비 중인 페이지입니다" />
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-hidden">
      <Header
        region={region}
        onRegionChange={setRegion}
        lastUpdated={lastUpdated}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
      <Navigation
        state={navState}
        onChange={setNavState}
        onNavExpand={setIsNavExpanded}
      />
      <main
        className="p-4 overflow-hidden flex flex-col transition-all duration-300"
        style={{
          marginTop: isNavExpanded ? "140px" : "100px",
          height: isNavExpanded
            ? "calc(100vh - 140px)"
            : "calc(100vh - 100px)",
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}