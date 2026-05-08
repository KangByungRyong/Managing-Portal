// src/app/pages/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Home 대시보드 페이지
// homeMockData.ts의 데이터를 각 패널 컴포넌트에 주입합니다.
// 실제 API 연동 시 이 파일에서 fetch/useQuery 로 교체하세요.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import { HqDivision } from "../data/facilityStatusData";
import { DistrictQualityItem, getHomeData, getStationKpi, cqTrendMeta } from "../data/homeMockData";
import { getSecurityData } from "../data/securityMockData";
import { getRmList } from "../data/stabilityMockData";
import { NavigationState } from "../types/navigation";

import { HomeQualityPanel } from "../components/home/HomeQualityPanel";
import { QualityMapPanel } from "../components/home/QualityMapPanel";
import { HomeTrendChart } from "../components/home/HomeTrendChart";
import { HomeSafetyPanel } from "../components/home/HomeSafetyPanel";
import { HomeStabilityPanel } from "../components/home/HomeStabilityPanel";
import { BudgetPanel, HomeCapexKpiPanel } from "../components/home/HomeCapexOpexPanel";
import { HomeIssuePanel } from "../components/home/HomeIssuePanel";
import { StationKpiSidebar } from "../components/home/StationKpiSidebar";

interface HomePageProps {
  region: HqDivision;
  onNavigate?: (state: NavigationState) => void;
}

type HomeDrilldownSelection =
  | { type: "cq1st"; periodLabel: "전일" | "금일"; dateLabel: string }
  | { type: "cq4th"; periodLabel: "전일" | "금일"; dateLabel: string }
  | { type: "worst5"; district: DistrictQualityItem; rank: number };

export function HomePage({ region, onNavigate }: HomePageProps) {
  const regionKey = region === "central" ? "central" : "west";
  const d = getHomeData(regionKey);
  const securityData = getSecurityData(regionKey);
  const rmList = getRmList(regionKey);
  const [selection, setSelection] = useState<HomeDrilldownSelection | null>(null);

  const securityKpiItems = useMemo(() => {
    const kpiTargets = [
      { sourceLabel: "저장 제한", displayLabel: "평문정보 저장제한" },
      { sourceLabel: "EOS 장비 교체 및 리빌딩", displayLabel: "EOS 장비 교체 및 리빌딩" },
      { sourceLabel: "EDR 설치", displayLabel: "EDR 설치" },
      { sourceLabel: "보안 진단 및 Solution 적용", displayLabel: "SolidStep 설치" },
    ] as const;

    return kpiTargets.map((target) => {
      const found = securityData.serverActions.find((item) => item.label === target.sourceLabel);
      return {
        label: target.displayLabel,
        completed: found?.completed ?? 0,
        total: securityData.serverTotal,
      };
    });
  }, [securityData.serverActions, securityData.serverTotal]);

  const selectedTargetId =
    selection?.type === "cq1st"
      ? `${regionKey}-grade1`
      : selection?.type === "cq4th"
      ? `${regionKey}-grade4`
      : selection?.type === "worst5"
      ? selection.district.id
      : null;

  const selectedKpiData = selectedTargetId
    ? getStationKpi(regionKey, selectedTargetId)
    : null;

  return (
    <div className="h-full min-h-[1080px]">
      <div className="grid grid-cols-12 gap-2 p-2 h-full">
        {/* ───────────────────────────────────────────────────────────────────
            좌측 메인 영역 (8컬럼): 품질 정보 + 지도 + 트렌드
            ─────────────────────────────────────────────────────────────────── */}
        <div className="col-span-8 flex flex-col gap-2 h-full min-h-0">
          {/* 품질 등급 요약 (CQ KPI + ENDC 파이) */}
          <div className="shrink-0">
            <HomeQualityPanel
              qualityData={d.qualitySummary}
              onSelectCq1st={({ periodLabel, dateLabel }) =>
                setSelection({ type: "cq1st", periodLabel, dateLabel })
              }
              onSelectCq4th={({ periodLabel, dateLabel }) =>
                setSelection({ type: "cq4th", periodLabel, dateLabel })
              }
            />
          </div>

          {/* 시군구별 품질 현황 Map - 나머지 높이를 차지 */}
          <div className="flex-1 min-h-0">
            <QualityMapPanel
              region={regionKey}
              onSelectWorstDistrict={(district, rank) =>
                setSelection({ type: "worst5", district, rank })
              }
            />
          </div>

          {/* CQ 트렌드 차트 (일별/시간별) */}
          <div className="shrink-0">
            <HomeTrendChart
              trendData={d.cqTrend}
              dayRange={cqTrendMeta.dayRange}
              hourRange={cqTrendMeta.hourRange}
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            우측 요약 영역 (4컬럼): 주요 지표 타이틀 + 5개 요약 패널
            ─────────────────────────────────────────────────────────────────── */}
        <div className="col-span-4 flex flex-col gap-2 h-full min-h-0">
          {/* 주요 지표 타이틀 */}
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
            <span className="text-sm font-bold text-gray-700">주요 지표</span>
            <span className="text-[10px] text-gray-400 ml-1">Key Metrics</span>
          </div>

          {/* 안정 요약 */}
          <HomeStabilityPanel
            rmItems={rmList}
            onNavigate={onNavigate ? () => onNavigate({ level1: "status", level2: "stability" }) : undefined}
          />

          {/* 안전 작업 요약 */}
          <HomeSafetyPanel
            data={d.safetySummary}
            onNavigate={onNavigate ? () => onNavigate({ level1: "status", level2: "safety", level3: "work" }) : undefined}
            securityItems={securityKpiItems}
            onNavigateSecurity={onNavigate ? () => onNavigate({ level1: "status", level2: "safety", level3: "security" }) : undefined}
          />

          {/* CapEx 요약 — CapEx 페이지 KPI 4항목과 동일하게 표현 */}
          <HomeCapexKpiPanel
            data={d.capexKpi}
            onNavigate={onNavigate ? () => onNavigate({ level1: "metrics", level2: "capex" }) : undefined}
          />

          {/* OpEx 요약 */}
          <BudgetPanel
            title="OpEx 집행"
            subtitle="Operating Expenditure"
            items={d.opexSummary}
            totalBudget={d.opexMeta.totalBudget}
            totalActual={d.opexMeta.totalActual}
            totalRate={d.opexMeta.totalRate}
            baseDate={d.opexMeta.baseDate}
            accentColor="#7c3aed"
            onNavigate={onNavigate ? () => onNavigate({ level1: "metrics", level2: "opex" }) : undefined}
          />

          {/* 이슈사항 - flex-1로 남은 높이 모두 차지, 내부에서 스크롤 */}
          <div className="flex-1 min-h-0">
            <HomeIssuePanel issues={d.issueList} />
          </div>
        </div>
      </div>

      <StationKpiSidebar
        isOpen={Boolean(selection)}
        onClose={() => setSelection(null)}
        kpiData={selectedKpiData}
        region={regionKey}
      />
    </div>
  );
}
