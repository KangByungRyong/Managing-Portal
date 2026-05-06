import { useState, useEffect } from "react";
import {
  navigationConfig,
  NavigationState,
  TabLevel1,
} from "../types/navigation";

interface NavigationProps {
  state: NavigationState;
  onChange: (state: NavigationState) => void;
  onNavExpand: (expanded: boolean) => void;
}

export function Navigation({
  state,
  onChange,
  onNavExpand,
}: NavigationProps) {
  const [isLevel2Visible, setIsLevel2Visible] = useState(false);
  const level1Tabs = Object.keys(
    navigationConfig,
  ) as TabLevel1[];
  const level1Config = navigationConfig[state.level1];
  const level2Tabs = level1Config.children
    ? Object.keys(level1Config.children)
    : [];

  useEffect(() => {
    onNavExpand(isLevel2Visible && level2Tabs.length > 0);
  }, [isLevel2Visible, level2Tabs.length, onNavExpand]);

  return (
    <div
      className="fixed top-[52px] w-full z-[199] bg-white"
      onMouseEnter={() => setIsLevel2Visible(true)}
      onMouseLeave={() => setIsLevel2Visible(false)}
    >
      {/* 1차 탭 - 항상 표시 */}
      <div className="flex bg-white px-6 border-b border-gray-300 shadow-sm">
        {level1Tabs.map((tab) => {
          const config = navigationConfig[tab];
          const isActive = state.level1 === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                const newState: NavigationState = {
                  level1: tab,
                };
                // 자동으로 첫 번째 하위 탭 선택
                if (config.children) {
                  const firstChild = Object.keys(
                    config.children,
                  )[0];
                  newState.level2 = firstChild;
                  const childConfig = (config.children as any)[
                    firstChild
                  ];
                  // 시설 현황인 경우 첫 번째 탭 선택
                  if (childConfig.tabs) {
                    newState.level3 = Object.keys(
                      childConfig.tabs,
                    )[0];
                  }
                }
                onChange(newState);
              }}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-[3px] ${
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
            const isActive = state.level2 === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  const newState: NavigationState = {
                    level1: state.level1,
                    level2: tab,
                  };
                  // 시설 현황인 경우 첫 번째 탭 선택
                  if (config.tabs) {
                    newState.level3 = Object.keys(
                      config.tabs,
                    )[0];
                  }
                  onChange(newState);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  isActive
                    ? "text-white font-bold"
                    : "border-transparent hover:bg-white"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor:
                          "var(--region-primary)",
                        borderColor: "var(--region-primary)",
                      }
                    : { color: "var(--region-primary)" }
                }
              >
                {config.icon && (
                  <span className="mr-1.5">{config.icon}</span>
                )}
                {config.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}