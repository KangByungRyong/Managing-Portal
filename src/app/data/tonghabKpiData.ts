// 통합국 현황 KPI 정의
export interface TonghabKpiDefinition {
  id: string;
  label: string;
  description: string;
  unit: string;
}

export const tonghabKpiDefinitions: TonghabKpiDefinition[] = [
  {
    id: "operating",
    label: "운용 통합국 수",
    description: "현재 운용 중인 통합국의 수",
    unit: "개",
  },
  {
    id: "closing",
    label: "폐국 진행 중",
    description: "폐국 진행 중인 통합국의 수",
    unit: "개",
  },
  {
    id: "leaseOwn",
    label: "자가 통합국",
    description: "임차 형태가 자가인 통합국의 수",
    unit: "개",
  },
  {
    id: "leaseFree",
    label: "무상 통합국",
    description: "임차 형태가 무상인 통합국의 수",
    unit: "개",
  },
  {
    id: "leaseRent",
    label: "임차 통합국",
    description: "임차 형태가 임차인 통합국의 수",
    unit: "개",
  },
  {
    id: "batteryLithium",
    label: "리튬이온 축전지",
    description: "리튬이온 축전지를 사용하는 통합국의 수",
    unit: "개",
  },
  {
    id: "batteryLead",
    label: "납축 축전지",
    description: "납축 축전지를 사용하는 통합국의 수",
    unit: "개",
  },
  {
    id: "generatorInstalled",
    label: "발전기 설치",
    description: "고정형 발전기가 설치된 통합국의 수",
    unit: "개",
  },
  {
    id: "generatorNotInstalled",
    label: "발전기 미설치",
    description: "고정형 발전기가 미설치된 통합국의 수",
    unit: "개",
  },
  {
    id: "powerHigh",
    label: "1000kW급 이상",
    description: "수전 용량이 1000kW급 이상인 통합국의 수 (추후 확정)",
    unit: "개",
  },
  {
    id: "powerMid",
    label: "500-1000kW급",
    description: "수전 용량이 500-1000kW급인 통합국의 수 (추후 확정)",
    unit: "개",
  },
  {
    id: "gradeA",
    label: "A등급 국사",
    description: "국사 등급이 A등급인 통합국의 수 (추후 적용)",
    unit: "개",
  },
  {
    id: "gradeB",
    label: "B등급 국사",
    description: "국사 등급이 B등급인 통합국의 수 (추후 적용)",
    unit: "개",
  },
];
