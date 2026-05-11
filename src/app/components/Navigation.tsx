import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronDown, Workflow } from "lucide-react";
import { navigationConfig, NavigationState, TabLevel1 } from "../types/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAppStore } from "../stores/appStore";

// level1 키를 URL 첫 세그먼트로 변환
const LEVEL1_TO_PATH: Record<string, string> = {
  home: "/home",
  status: "/status/facility/tonghab",
  metrics: "/metrics/capex",
  focus: "/focus",
  task: "/task",
};

// URL로부터 활성 level1 / level2 키를 추론
function parseActiveKeys(pathname: string): { level1: string; level2: string } {
  const segs = pathname.replace(/^\//, "").split("/");
  const level1 = segs[0] ?? "home";
  const level2 = segs[1] ?? "";
  return { level1, level2 };
}

// level2 탭 클릭 시 이동할 경로 계산
function buildLevel2Path(level1: string, level2: string): string {
  const l1Config = (navigationConfig as any)[level1];
  const l2Config = l1Config?.children?.[level2];
  if (l2Config?.tabs) {
    const firstTab = Object.keys(l2Config.tabs)[0];
    return `/${level1}/${level2}/${firstTab}`;
  }
  return `/${level1}/${level2}`;
}

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsNavExpanded } = useAppStore();

  const [isLevel2Visible, setIsLevel2Visible] = useState(false);
  const networkTools = ["NSR", "LM 대시보드", "중부ATDT포털"] as const;

  const { level1: activeLevel1, level2: activeLevel2 } = parseActiveKeys(location.pathname);

  const level1Tabs = Object.keys(navigationConfig) as TabLevel1[];
  const level1Config = (navigationConfig as any)[activeLevel1] ?? navigationConfig.home;
  const level2Tabs: string[] = level1Config.children ? Object.keys(level1Config.children) : [];

  useEffect(() => {
    setIsNavExpanded(isLevel2Visible && level2Tabs.length > 0);
  }, [isLevel2Visible, level2Tabs.length, setIsNavExpanded]);

  return (
    <div
      className="fixed top-[52px] w-full z-[199] bg-white"
      onMouseEnter={() => setIsLevel2Visible(true)}
      onMouseLeave={() => setIsLevel2Visible(false)}
    >
      {/* 1차 탭 - 항상 표시 */}
      <div className="flex items-center bg-white px-6 border-b border-gray-300 shadow-sm gap-1">
        {level1Tabs.map((tab) => {
          const config = navigationConfig[tab];
          const isActive = activeLevel1 === tab;
          return (
            <button
              key={tab}
              onClick={() => navigate(LEVEL1_TO_PATH[tab] ?? `/${tab}`)}
              className={`px-5 py-3 text-base font-medium transition-all border-b-[3px] ${
                isActive
                  ? "text-[var(--region-primary)] font-bold border-[var(--region-primary)]"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="mr-2">{config.icon}</span>
              {config.label}
            </button>
          );
        })}

        <div className="ml-auto py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-base font-medium text-slate-700 transition-colors hover:border-[var(--region-primary)] hover:bg-[var(--region-light)] hover:text-[var(--region-primary)]"
              >
                <Workflow className="size-4" />
                <span>Network 도구</span>
                <ChevronDown className="size-4 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px] border-slate-200 z-[300]">
              {networkTools.map((tool) => (
                <DropdownMenuItem
                  key={tool}
                  className="cursor-pointer px-3 py-2 text-base font-medium text-slate-700"
                >
                  {tool}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2차 탭 - 호버 시에만 표시 */}
      {level2Tabs.length > 0 && isLevel2Visible && (
        <div
          className="flex items-center px-6 py-2 gap-1.5 border-b"
          style={{
            backgroundColor: "var(--region-light)",
            borderColor: "var(--region-border)",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          {level2Tabs.map((tab) => {
            const config = (level1Config.children as any)[tab];
            const isActive = activeLevel2 === tab;
            return (
              <button
                key={tab}
                onClick={() => navigate(buildLevel2Path(activeLevel1, tab))}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full border transition-all ${
                  isActive ? "text-white font-bold" : "border-transparent hover:bg-white"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--region-primary)",
                        borderColor: "var(--region-primary)",
                      }
                    : { color: "var(--region-primary)" }
                }
              >
                {config.icon && <span className="mr-1.5">{config.icon}</span>}
                {config.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
