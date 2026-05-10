// src/app/router.tsx
// ─────────────────────────────────────────────────────────────────────────────
// React Router v7 라우트 정의
// URL 구조: /{level1}/{level2?}/{level3?}
//   예) /home
//       /status/facility/tonghab
//       /status/safety/work
//       /metrics/opex
// ─────────────────────────────────────────────────────────────────────────────
import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { FacilityLayout } from "./layouts/FacilityLayout";
import { SafetyLayout } from "./layouts/SafetyLayout";
import { BlankPage } from "./components/BlankPage";
import { HomePage } from "./pages/HomePage";
import { TonghabPage } from "./pages/TonghabPage";
import { GijigukPage } from "./pages/GijigukPage";
import { RepeaterPage } from "./pages/RepeaterPage";
import { InventoryPage } from "./pages/InventoryPage";
import { SafetyWorkPage } from "./pages/SafetyWorkPage";
import { SecurityPage } from "./pages/SecurityPage";
import { StabilityPage } from "./pages/StabilityPage";
import { OpexPage } from "./pages/OpexPage";
import { CapexPage } from "./pages/CapexPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // 기본 경로 → 홈으로 리다이렉트
      { index: true, element: <Navigate to="/home" replace /> },

      // 홈
      { path: "home", element: <HomePage /> },

      // 현황 > 시설 현황 (level3 탭 포함)
      {
        path: "status/facility",
        element: <FacilityLayout />,
        children: [
          { index: true, element: <Navigate to="tonghab" replace /> },
          { path: "tonghab", element: <TonghabPage /> },
          { path: "giji", element: <GijigukPage /> },
          { path: "junggye", element: <RepeaterPage /> },
          {
            path: "lora",
            element: (
              <BlankPage
                title="LoRa / WiFi / Femto 현황"
                description="추후 구성 예정"
                plannedFeatures={[
                  "LoRa 현황 (항목 미정)",
                  "WiFi 현황 (항목 미정)",
                  "Femto 현황 (항목 미정)",
                ]}
              />
            ),
          },
        ],
      },

      // 현황 > 재고 현황
      { path: "status/inventory", element: <InventoryPage /> },

      // 현황 > 특화 지표
      {
        path: "status/specialized",
        element: (
          <BlankPage
            title="특화 지표"
            description="추후 구성 예정"
            plannedFeatures={[
              "특화 항목 1 (TBD)",
              "특화 항목 2 (TBD)",
              "특화 항목 3 (TBD)",
            ]}
          />
        ),
      },

      // 현황 > 안전 (level3 탭 포함)
      {
        path: "status/safety",
        element: <SafetyLayout />,
        children: [
          { index: true, element: <Navigate to="work" replace /> },
          { path: "work", element: <SafetyWorkPage /> },
          { path: "security", element: <SecurityPage /> },
        ],
      },

      // 현황 > 안정
      { path: "status/stability", element: <StabilityPage /> },

      // 지표 > CapEx / OpEx
      { path: "metrics/capex", element: <CapexPage /> },
      { path: "metrics/opex", element: <OpexPage /> },

      // 그 외 미구현 페이지
      {
        path: "*",
        element: <BlankPage title="준비 중인 페이지입니다" />,
      },
    ],
  },
]);
