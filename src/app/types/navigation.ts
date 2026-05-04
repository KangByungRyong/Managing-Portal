export type TabLevel1 = "home" | "status" | "metrics" | "focus" | "task";
export type TabLevel2Status = "facility" | "inventory" | "specialized";
export type TabLevel2Facility = "tonghab" | "giji" | "junggye" | "lora";

export type TabLevel2Metrics =
  | "capex"
  | "opex"
  | "quality"
  | "inventory"
  | "security"
  | "autonomous"
  | "modernization"
  | "esg"
  | "she";

export type TabLevel2Focus = "slim" | "maintenance";
export type TabLevel2Task = "meeting" | "todo";

export interface NavigationState {
  level1: TabLevel1;
  level2?: string;
  level3?: string;
}

export const navigationConfig = {
  home: {
    label: "홈",
    icon: "🏠",
  },
  status: {
    label: "현황",
    icon: "📊",
    children: {
      facility: {
        label: "시설 현황",
        icon: "🏢",
        tabs: {
          tonghab: { label: "통합국 현황", status: "complete" },
          giji: { label: "기지국 현황", status: "structure" },
          junggye: { label: "중계기 현황", status: "structure" },
          lora: { label: "LoRa / WiFi / Femto 현황", status: "blank" },
        },
      },
      inventory: {
        label: "재고 현황",
        icon: "📦",
        status: "blank",
      },
      specialized: {
        label: "특화 지표",
        icon: "⭐",
        status: "blank",
      },
    },
  },
  metrics: {
    label: "지표",
    icon: "📈",
    children: {
      capex: { label: "CapEx", status: "blank" },
      opex: { label: "OpEx", status: "blank" },
      quality: { label: "품질 (CQ)", status: "blank" },
      inventory: { label: "재고", status: "blank" },
      security: { label: "보안", status: "blank" },
      autonomous: { label: "Autonomous Network", status: "blank" },
      modernization: { label: "5대 현행화", status: "blank" },
      esg: { label: "ESG", status: "blank" },
      she: { label: "SHE", status: "blank" },
    },
  },
  focus: {
    label: "본부 중점",
    icon: "🎯",
    children: {
      slim: { label: "Network Slim화", status: "blank" },
      maintenance: { label: "설비 유지보수 및 최적화", status: "blank" },
    },
  },
  task: {
    label: "Task",
    icon: "✅",
    children: {
      meeting: { label: "주요 회의 내용 / F/U 현황", status: "blank" },
      todo: { label: "To-Do List", status: "blank" },
    },
  },
};
