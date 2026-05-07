// src/app/data/homeMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Home 대시보드 전용 Mock 데이터 (중부/서부 분리)
// 실제 API 연동 시 이 파일의 상수들을 API 응답 타입으로 교체하세요.
// ─────────────────────────────────────────────────────────────────────────────

// ── 공통 타입 ─────────────────────────────────────────────────────────────────

export type NetworkType = "공동망-SKT 제공망" | "공동망-SKT 이용망" | "단독망";
export type IssueLevel = "critical" | "warning" | "info";

// ── CQ 품질 등급 ──────────────────────────────────────────────────────────────

export interface CqBarItem {
  label: NetworkType;
  value: number; // 0~100 (%)
}

export interface CqKpiSnapshot {
  dateLabel: string;
  grade1st: CqBarItem[];
  grade4th: CqBarItem[];
}

// ▶ 중부 본부 (충남/충북/대전/세종) — 전반적으로 높은 1등급 비율, 낮은 4등급
const centralCqPrev: CqKpiSnapshot = {
  dateLabel: "전일 2026.05.05",
  grade1st: [
    { label: "공동망-SKT 제공망", value: 82.41 },
    { label: "공동망-SKT 이용망", value: 89.15 },
    { label: "단독망",            value: 84.22 },
  ],
  grade4th: [
    { label: "공동망-SKT 제공망", value: 5.63 },
    { label: "공동망-SKT 이용망", value: 3.84 },
    { label: "단독망",            value: 4.51 },
  ],
};

const centralCqToday: CqKpiSnapshot = {
  dateLabel: "금일 2026.05.06",
  grade1st: [
    { label: "공동망-SKT 제공망", value: 84.73 },
    { label: "공동망-SKT 이용망", value: 90.28 },
    { label: "단독망",            value: 85.91 },
  ],
  grade4th: [
    { label: "공동망-SKT 제공망", value: 4.87 },
    { label: "공동망-SKT 이용망", value: 3.21 },
    { label: "단독망",            value: 4.03 },
  ],
};

// ▶ 서부 본부 (전남/전북/제주) — 도서/원격 지역 특성상 상대적으로 낮은 품질
const westCqPrev: CqKpiSnapshot = {
  dateLabel: "전일 2026.05.05",
  grade1st: [
    { label: "공동망-SKT 제공망", value: 75.38 },
    { label: "공동망-SKT 이용망", value: 84.67 },
    { label: "단독망",            value: 77.94 },
  ],
  grade4th: [
    { label: "공동망-SKT 제공망", value: 9.42 },
    { label: "공동망-SKT 이용망", value: 6.18 },
    { label: "단독망",            value: 7.83 },
  ],
};

const westCqToday: CqKpiSnapshot = {
  dateLabel: "금일 2026.05.06",
  grade1st: [
    { label: "공동망-SKT 제공망", value: 76.82 },
    { label: "공동망-SKT 이용망", value: 85.93 },
    { label: "단독망",            value: 79.15 },
  ],
  grade4th: [
    { label: "공동망-SKT 제공망", value: 8.75 },
    { label: "공동망-SKT 이용망", value: 5.94 },
    { label: "단독망",            value: 7.21 },
  ],
};

// ── ENDC 시도호 비율 ──────────────────────────────────────────────────────────

export interface EndcSlice {
  name: string;
  value: number;
  color: string;
}

export interface EndcSnapshot {
  dateLabel: string;
  sktProvide: EndcSlice[];
  sktUse: EndcSlice[];
}

export interface QualitySummaryBundle {
  targets: CqTrendTargetOption[];
  defaultTarget: string;
  cqPrev: Record<string, CqKpiSnapshot>;
  cqToday: Record<string, CqKpiSnapshot>;
  endcPrev: Record<string, EndcSnapshot>;
  endcToday: Record<string, EndcSnapshot>;
}

// ▶ 중부: SKT 장비 비중이 높은 편 (내륙 밀도 높은 망 구성)
const centralEndcPrev: EndcSnapshot = {
  dateLabel: "전일 2026.05.05",
  sktProvide: [
    { name: "SKT 장비",  value: 58.3, color: "#f97316" },
    { name: "KT 장비",   value: 0,    color: "#22c55e" },
    { name: "LGU+ 장비", value: 41.7, color: "#a855f7" },
  ],
  sktUse: [
    { name: "SKT 장비",  value: 52.7, color: "#f97316" },
    { name: "KT 장비",   value: 47.3, color: "#22c55e" },
    { name: "LGU+ 장비", value: 0,    color: "#a855f7" },
  ],
};

const centralEndcToday: EndcSnapshot = {
  dateLabel: "금일 2026.05.06",
  sktProvide: [
    { name: "SKT 장비",  value: 59.1, color: "#f97316" },
    { name: "KT 장비",   value: 0,    color: "#22c55e" },
    { name: "LGU+ 장비", value: 40.9, color: "#a855f7" },
  ],
  sktUse: [
    { name: "SKT 장비",  value: 53.4, color: "#f97316" },
    { name: "KT 장비",   value: 46.6, color: "#22c55e" },
    { name: "LGU+ 장비", value: 0,    color: "#a855f7" },
  ],
};

// ▶ 서부: LGU+ 장비 비중 높음, KT 이용망 비중도 상이
const westEndcPrev: EndcSnapshot = {
  dateLabel: "전일 2026.05.05",
  sktProvide: [
    { name: "SKT 장비",  value: 38.2, color: "#f97316" },
    { name: "KT 장비",   value: 0,    color: "#22c55e" },
    { name: "LGU+ 장비", value: 61.8, color: "#a855f7" },
  ],
  sktUse: [
    { name: "SKT 장비",  value: 36.9, color: "#f97316" },
    { name: "KT 장비",   value: 63.1, color: "#22c55e" },
    { name: "LGU+ 장비", value: 0,    color: "#a855f7" },
  ],
};

const westEndcToday: EndcSnapshot = {
  dateLabel: "금일 2026.05.06",
  sktProvide: [
    { name: "SKT 장비",  value: 39.4, color: "#f97316" },
    { name: "KT 장비",   value: 0,    color: "#22c55e" },
    { name: "LGU+ 장비", value: 60.6, color: "#a855f7" },
  ],
  sktUse: [
    { name: "SKT 장비",  value: 37.8, color: "#f97316" },
    { name: "KT 장비",   value: 62.2, color: "#22c55e" },
    { name: "LGU+ 장비", value: 0,    color: "#a855f7" },
  ],
};

const clampPercent = (value: number) => parseFloat(Math.max(0, Math.min(100, value)).toFixed(2));

const shiftCqSnapshot = (
  snapshot: CqKpiSnapshot,
  adjustment: {
    grade1st: { provide: number; use: number; dedicated: number };
    grade4th: { provide: number; use: number; dedicated: number };
  },
): CqKpiSnapshot => ({
  dateLabel: snapshot.dateLabel,
  grade1st: snapshot.grade1st.map((item, index) => ({
    ...item,
    value: clampPercent(
      item.value + [adjustment.grade1st.provide, adjustment.grade1st.use, adjustment.grade1st.dedicated][index],
    ),
  })),
  grade4th: snapshot.grade4th.map((item, index) => ({
    ...item,
    value: clampPercent(
      item.value + [adjustment.grade4th.provide, adjustment.grade4th.use, adjustment.grade4th.dedicated][index],
    ),
  })),
});

const rebalanceEndcSlices = (slices: EndcSlice[]): EndcSlice[] => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (total === 0) return slices;
  const normalized = slices.map((slice) => ({
    ...slice,
    value: parseFloat(((slice.value / total) * 100).toFixed(1)),
  }));
  const normalizedTotal = normalized.reduce((sum, slice) => sum + slice.value, 0);
  const delta = parseFloat((100 - normalizedTotal).toFixed(1));
  if (!delta) return normalized;
  const maxIndex = normalized.reduce((best, slice, index, arr) =>
    slice.value > arr[best].value ? index : best, 0,
  );
  return normalized.map((slice, index) =>
    index === maxIndex ? { ...slice, value: parseFloat((slice.value + delta).toFixed(1)) } : slice,
  );
};

const shiftEndcSnapshot = (
  snapshot: EndcSnapshot,
  adjustment: {
    provide: [number, number, number];
    use: [number, number, number];
  },
): EndcSnapshot => ({
  dateLabel: snapshot.dateLabel,
  sktProvide: rebalanceEndcSlices(
    snapshot.sktProvide.map((slice, index) => ({
      ...slice,
      value: clampPercent(slice.value + adjustment.provide[index]),
    })),
  ),
  sktUse: rebalanceEndcSlices(
    snapshot.sktUse.map((slice, index) => ({
      ...slice,
      value: clampPercent(slice.value + adjustment.use[index]),
    })),
  ),
});

// ── CQ 트렌드 (일별 / 시간별) ─────────────────────────────────────────────────

export interface TrendPoint {
  date: string;
  전국: number;
  공동망: number;
  단독망: number;
}

export interface CqTrendTargetOption {
  id: string;
  label: string;
}

export interface CqTrendBundle {
  targets: CqTrendTargetOption[];
  defaultTarget: string;
  dayData1st: Record<string, TrendPoint[]>;
  dayData4th: Record<string, TrendPoint[]>;
  hourData1st: Record<string, TrendPoint[]>;
  hourData4th: Record<string, TrendPoint[]>;
}

const DAY_LABELS = [
  "04.23","04.24","04.25","04.26","04.27","04.28","04.29",
  "04.30","05.01","05.02","05.03","05.04","05.05","05.06",
];

const buildHourLabels = (): string[] => {
  const labels: string[] = [];
  for (let day = 0; day < 8; day++) {
    const totalDay = 29 + day;
    const m = totalDay > 30 ? 5 : 4;
    const d = totalDay > 30 ? totalDay - 30 : totalDay;
    for (let h = 0; h < 8; h++) {
      labels.push(
        `${String(m).padStart(2,"0")}.${String(d).padStart(2,"0")} ${String(h * 3).padStart(2,"0")}시`
      );
    }
  }
  return labels;
};
const HOUR_LABELS = buildHourLabels();

// ▶ 중부 트렌드 — 높고 안정적인 품질 곡선
const clampTrendValue = (value: number) => parseFloat(Math.max(0, Math.min(100, value)).toFixed(2));

const addReferenceSeries = (
  points: Array<{ date: string; 공동망: number; 단독망: number }>,
  referenceOffset: number,
): TrendPoint[] =>
  points.map((point, index) => ({
    ...point,
    전국: clampTrendValue(((point.공동망 + point.단독망) / 2) + referenceOffset + Math.sin(index * 0.21) * 0.35),
  }));

const shiftTrendSeries = (
  points: TrendPoint[],
  adjustment: { nationwide: number; shared: number; dedicated: number; wobble?: number },
): TrendPoint[] =>
  points.map((point, index) => ({
    date: point.date,
    전국: clampTrendValue(point.전국 + adjustment.nationwide + Math.sin(index * 0.33) * (adjustment.wobble ?? 0)),
    공동망: clampTrendValue(point.공동망 + adjustment.shared + Math.cos(index * 0.41) * (adjustment.wobble ?? 0)),
    단독망: clampTrendValue(point.단독망 + adjustment.dedicated + Math.sin(index * 0.29 + 0.5) * (adjustment.wobble ?? 0)),
  }));

const centralDayTrend1stBase = addReferenceSeries(
  DAY_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(83.5 + Math.sin(i * 0.55) * 2.1),
    단독망: clampTrendValue(80.2 + Math.sin(i * 0.48 + 1) * 1.8),
  })),
  0.8,
);
const centralDayTrend4thBase = addReferenceSeries(
  DAY_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(5.2 + Math.sin(i * 0.65) * 0.9),
    단독망: clampTrendValue(4.1 + Math.sin(i * 0.58 + 0.4) * 0.7),
  })),
  -0.4,
);
const centralHourTrend1stBase = addReferenceSeries(
  HOUR_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(85.2 + Math.sin(i * 0.38) * 3.5 + Math.sin(i * 1.15) * 1.8),
    단독망: clampTrendValue(81.7 + Math.sin(i * 0.38 + 1) * 3.0 + Math.sin(i * 1.05) * 1.4),
  })),
  0.9,
);
const centralHourTrend4thBase = addReferenceSeries(
  HOUR_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(4.8 + Math.sin(i * 0.48) * 1.6 + Math.abs(Math.sin(i * 1.25)) * 1.2),
    단독망: clampTrendValue(3.6 + Math.sin(i * 0.42 + 0.7) * 1.2 + Math.abs(Math.sin(i * 1.15)) * 0.9),
  })),
  -0.35,
);

const centralTrendTargets: CqTrendTargetOption[] = [
  { id: "all", label: "전체" },
  { id: "daejeon", label: "대전" },
  { id: "sejong", label: "세종" },
  { id: "chungnam", label: "충남" },
  { id: "chungbuk", label: "충북" },
  { id: "ktx", label: "KTX" },
  { id: "island", label: "도서지역" },
];

const centralCqTrend: CqTrendBundle = {
  targets: centralTrendTargets,
  defaultTarget: "all",
  dayData1st: {
    all: centralDayTrend1stBase,
    daejeon: shiftTrendSeries(centralDayTrend1stBase, { nationwide: 0.1, shared: 0.9, dedicated: 0.6, wobble: 0.18 }),
    sejong: shiftTrendSeries(centralDayTrend1stBase, { nationwide: 0.15, shared: 1.4, dedicated: 1.1, wobble: 0.14 }),
    chungnam: shiftTrendSeries(centralDayTrend1stBase, { nationwide: -0.2, shared: -1.2, dedicated: -0.9, wobble: 0.22 }),
    chungbuk: shiftTrendSeries(centralDayTrend1stBase, { nationwide: -0.1, shared: -0.4, dedicated: -0.2, wobble: 0.16 }),
    ktx: shiftTrendSeries(centralDayTrend1stBase, { nationwide: 0.04, shared: 0.35, dedicated: 0.25, wobble: 0.2 }),
    island: shiftTrendSeries(centralDayTrend1stBase, { nationwide: -0.28, shared: -2.1, dedicated: -1.7, wobble: 0.35 }),
  },
  dayData4th: {
    all: centralDayTrend4thBase,
    daejeon: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.05, shared: -0.45, dedicated: -0.3, wobble: 0.08 }),
    sejong: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.02, shared: -0.6, dedicated: -0.5, wobble: 0.06 }),
    chungnam: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.1, shared: 0.85, dedicated: 0.7, wobble: 0.1 }),
    chungbuk: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.08, shared: 0.3, dedicated: 0.25, wobble: 0.07 }),
    ktx: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.05, shared: -0.22, dedicated: -0.16, wobble: 0.09 }),
    island: shiftTrendSeries(centralDayTrend4thBase, { nationwide: 0.22, shared: 1.65, dedicated: 1.35, wobble: 0.18 }),
  },
  hourData1st: {
    all: centralHourTrend1stBase,
    daejeon: shiftTrendSeries(centralHourTrend1stBase, { nationwide: 0.15, shared: 1.1, dedicated: 0.9, wobble: 0.45 }),
    sejong: shiftTrendSeries(centralHourTrend1stBase, { nationwide: 0.2, shared: 1.7, dedicated: 1.3, wobble: 0.4 }),
    chungnam: shiftTrendSeries(centralHourTrend1stBase, { nationwide: -0.2, shared: -1.5, dedicated: -1.1, wobble: 0.5 }),
    chungbuk: shiftTrendSeries(centralHourTrend1stBase, { nationwide: -0.05, shared: -0.6, dedicated: -0.3, wobble: 0.36 }),
    ktx: shiftTrendSeries(centralHourTrend1stBase, { nationwide: 0.08, shared: 0.55, dedicated: 0.4, wobble: 0.42 }),
    island: shiftTrendSeries(centralHourTrend1stBase, { nationwide: -0.32, shared: -2.6, dedicated: -2.1, wobble: 0.78 }),
  },
  hourData4th: {
    all: centralHourTrend4thBase,
    daejeon: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.06, shared: -0.7, dedicated: -0.5, wobble: 0.18 }),
    sejong: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.04, shared: -0.9, dedicated: -0.7, wobble: 0.16 }),
    chungnam: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.12, shared: 1.1, dedicated: 0.9, wobble: 0.22 }),
    chungbuk: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.08, shared: 0.35, dedicated: 0.3, wobble: 0.18 }),
    ktx: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.05, shared: -0.3, dedicated: -0.2, wobble: 0.2 }),
    island: shiftTrendSeries(centralHourTrend4thBase, { nationwide: 0.21, shared: 1.95, dedicated: 1.55, wobble: 0.32 }),
  },
};

const centralQualitySummary: QualitySummaryBundle = {
  targets: centralTrendTargets,
  defaultTarget: "all",
  cqPrev: {
    all: centralCqPrev,
    daejeon: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: 1.0, use: 0.8, dedicated: 0.6 }, grade4th: { provide: -0.5, use: -0.3, dedicated: -0.2 } }),
    sejong: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: 1.5, use: 1.2, dedicated: 0.9 }, grade4th: { provide: -0.7, use: -0.4, dedicated: -0.3 } }),
    chungnam: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: -1.4, use: -0.9, dedicated: -0.8 }, grade4th: { provide: 0.9, use: 0.5, dedicated: 0.4 } }),
    chungbuk: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: -0.4, use: -0.2, dedicated: -0.1 }, grade4th: { provide: 0.3, use: 0.2, dedicated: 0.1 } }),
    ktx: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: 0.4, use: 0.3, dedicated: 0.2 }, grade4th: { provide: -0.2, use: -0.1, dedicated: -0.1 } }),
    island: shiftCqSnapshot(centralCqPrev, { grade1st: { provide: -1.8, use: -1.3, dedicated: -1.0 }, grade4th: { provide: 1.2, use: 0.8, dedicated: 0.6 } }),
  },
  cqToday: {
    all: centralCqToday,
    daejeon: shiftCqSnapshot(centralCqToday, { grade1st: { provide: 1.1, use: 0.9, dedicated: 0.7 }, grade4th: { provide: -0.5, use: -0.3, dedicated: -0.2 } }),
    sejong: shiftCqSnapshot(centralCqToday, { grade1st: { provide: 1.7, use: 1.3, dedicated: 1.0 }, grade4th: { provide: -0.8, use: -0.4, dedicated: -0.3 } }),
    chungnam: shiftCqSnapshot(centralCqToday, { grade1st: { provide: -1.6, use: -1.1, dedicated: -0.9 }, grade4th: { provide: 0.9, use: 0.5, dedicated: 0.4 } }),
    chungbuk: shiftCqSnapshot(centralCqToday, { grade1st: { provide: -0.5, use: -0.2, dedicated: -0.1 }, grade4th: { provide: 0.3, use: 0.2, dedicated: 0.1 } }),
    ktx: shiftCqSnapshot(centralCqToday, { grade1st: { provide: 0.5, use: 0.3, dedicated: 0.2 }, grade4th: { provide: -0.2, use: -0.1, dedicated: -0.1 } }),
    island: shiftCqSnapshot(centralCqToday, { grade1st: { provide: -1.9, use: -1.4, dedicated: -1.1 }, grade4th: { provide: 1.2, use: 0.8, dedicated: 0.6 } }),
  },
  endcPrev: {
    all: centralEndcPrev,
    daejeon: shiftEndcSnapshot(centralEndcPrev, { provide: [2.1, 0, -2.1], use: [1.5, -1.5, 0] }),
    sejong: shiftEndcSnapshot(centralEndcPrev, { provide: [2.8, 0, -2.8], use: [1.8, -1.8, 0] }),
    chungnam: shiftEndcSnapshot(centralEndcPrev, { provide: [-2.6, 0, 2.6], use: [-1.6, 1.6, 0] }),
    chungbuk: shiftEndcSnapshot(centralEndcPrev, { provide: [-0.8, 0, 0.8], use: [-0.6, 0.6, 0] }),
    ktx: shiftEndcSnapshot(centralEndcPrev, { provide: [0.9, 0, -0.9], use: [0.7, -0.7, 0] }),
    island: shiftEndcSnapshot(centralEndcPrev, { provide: [-3.0, 0, 3.0], use: [-2.0, 2.0, 0] }),
  },
  endcToday: {
    all: centralEndcToday,
    daejeon: shiftEndcSnapshot(centralEndcToday, { provide: [2.3, 0, -2.3], use: [1.6, -1.6, 0] }),
    sejong: shiftEndcSnapshot(centralEndcToday, { provide: [3.0, 0, -3.0], use: [1.9, -1.9, 0] }),
    chungnam: shiftEndcSnapshot(centralEndcToday, { provide: [-2.7, 0, 2.7], use: [-1.7, 1.7, 0] }),
    chungbuk: shiftEndcSnapshot(centralEndcToday, { provide: [-0.9, 0, 0.9], use: [-0.7, 0.7, 0] }),
    ktx: shiftEndcSnapshot(centralEndcToday, { provide: [1.0, 0, -1.0], use: [0.8, -0.8, 0] }),
    island: shiftEndcSnapshot(centralEndcToday, { provide: [-3.1, 0, 3.1], use: [-2.1, 2.1, 0] }),
  },
};

// ▶ 서부 트렌드 — 낮고 변동 폭이 큰 곡선 (도서/원격 지역 영향)
const westDayTrend1stBase = addReferenceSeries(
  DAY_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(76.8 + Math.sin(i * 0.72) * 3.8),
    단독망: clampTrendValue(73.5 + Math.sin(i * 0.61 + 1.2) * 3.2),
  })),
  1.15,
);
const westDayTrend4thBase = addReferenceSeries(
  DAY_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(8.9 + Math.sin(i * 0.78) * 1.8),
    단독망: clampTrendValue(7.4 + Math.sin(i * 0.69 + 0.6) * 1.4),
  })),
  -0.7,
);
const westHourTrend1stBase = addReferenceSeries(
  HOUR_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(78.3 + Math.sin(i * 0.45) * 5.2 + Math.sin(i * 1.3) * 2.5),
    단독망: clampTrendValue(74.9 + Math.sin(i * 0.45 + 1.1) * 4.8 + Math.sin(i * 1.2) * 2.0),
  })),
  1.25,
);
const westHourTrend4thBase = addReferenceSeries(
  HOUR_LABELS.map((date, i) => ({
    date,
    공동망: clampTrendValue(8.1 + Math.sin(i * 0.55) * 2.8 + Math.abs(Math.sin(i * 1.4)) * 2.0),
    단독망: clampTrendValue(6.5 + Math.sin(i * 0.50 + 0.9) * 2.2 + Math.abs(Math.sin(i * 1.3)) * 1.5),
  })),
  -0.55,
);

const westTrendTargets: CqTrendTargetOption[] = [
  { id: "all", label: "전체" },
  { id: "jeonnam", label: "전남" },
  { id: "jeonbuk", label: "전북" },
  { id: "jeju", label: "제주" },
  { id: "ktx", label: "KTX" },
  { id: "island", label: "도서지역" },
];

const westCqTrend: CqTrendBundle = {
  targets: westTrendTargets,
  defaultTarget: "all",
  dayData1st: {
    all: westDayTrend1stBase,
    jeonnam: shiftTrendSeries(westDayTrend1stBase, { nationwide: -0.1, shared: 0.6, dedicated: 0.4, wobble: 0.25 }),
    jeonbuk: shiftTrendSeries(westDayTrend1stBase, { nationwide: -0.15, shared: -0.4, dedicated: -0.1, wobble: 0.22 }),
    jeju: shiftTrendSeries(westDayTrend1stBase, { nationwide: -0.2, shared: 0.9, dedicated: 0.7, wobble: 0.3 }),
    ktx: shiftTrendSeries(westDayTrend1stBase, { nationwide: -0.18, shared: -1.15, dedicated: -0.95, wobble: 0.28 }),
    island: shiftTrendSeries(westDayTrend1stBase, { nationwide: -0.34, shared: -2.45, dedicated: -2.05, wobble: 0.38 }),
  },
  dayData4th: {
    all: westDayTrend4thBase,
    jeonnam: shiftTrendSeries(westDayTrend4thBase, { nationwide: 0.1, shared: -0.25, dedicated: -0.15, wobble: 0.12 }),
    jeonbuk: shiftTrendSeries(westDayTrend4thBase, { nationwide: 0.12, shared: 0.35, dedicated: 0.2, wobble: 0.1 }),
    jeju: shiftTrendSeries(westDayTrend4thBase, { nationwide: 0.08, shared: -0.4, dedicated: -0.25, wobble: 0.14 }),
    ktx: shiftTrendSeries(westDayTrend4thBase, { nationwide: 0.14, shared: 0.95, dedicated: 0.8, wobble: 0.14 }),
    island: shiftTrendSeries(westDayTrend4thBase, { nationwide: 0.24, shared: 1.85, dedicated: 1.5, wobble: 0.2 }),
  },
  hourData1st: {
    all: westHourTrend1stBase,
    jeonnam: shiftTrendSeries(westHourTrend1stBase, { nationwide: -0.1, shared: 0.8, dedicated: 0.5, wobble: 0.55 }),
    jeonbuk: shiftTrendSeries(westHourTrend1stBase, { nationwide: -0.15, shared: -0.7, dedicated: -0.3, wobble: 0.46 }),
    jeju: shiftTrendSeries(westHourTrend1stBase, { nationwide: -0.2, shared: 1.1, dedicated: 0.8, wobble: 0.6 }),
    ktx: shiftTrendSeries(westHourTrend1stBase, { nationwide: -0.22, shared: -1.45, dedicated: -1.15, wobble: 0.6 }),
    island: shiftTrendSeries(westHourTrend1stBase, { nationwide: -0.38, shared: -2.95, dedicated: -2.45, wobble: 0.82 }),
  },
  hourData4th: {
    all: westHourTrend4thBase,
    jeonnam: shiftTrendSeries(westHourTrend4thBase, { nationwide: 0.1, shared: -0.45, dedicated: -0.25, wobble: 0.2 }),
    jeonbuk: shiftTrendSeries(westHourTrend4thBase, { nationwide: 0.12, shared: 0.55, dedicated: 0.35, wobble: 0.18 }),
    jeju: shiftTrendSeries(westHourTrend4thBase, { nationwide: 0.08, shared: -0.6, dedicated: -0.45, wobble: 0.22 }),
    ktx: shiftTrendSeries(westHourTrend4thBase, { nationwide: 0.15, shared: 1.15, dedicated: 0.95, wobble: 0.24 }),
    island: shiftTrendSeries(westHourTrend4thBase, { nationwide: 0.25, shared: 2.25, dedicated: 1.8, wobble: 0.34 }),
  },
};

const westQualitySummary: QualitySummaryBundle = {
  targets: westTrendTargets,
  defaultTarget: "all",
  cqPrev: {
    all: westCqPrev,
    jeonnam: shiftCqSnapshot(westCqPrev, { grade1st: { provide: 0.7, use: 0.5, dedicated: 0.4 }, grade4th: { provide: -0.3, use: -0.2, dedicated: -0.1 } }),
    jeonbuk: shiftCqSnapshot(westCqPrev, { grade1st: { provide: -0.5, use: -0.2, dedicated: -0.1 }, grade4th: { provide: 0.4, use: 0.2, dedicated: 0.1 } }),
    jeju: shiftCqSnapshot(westCqPrev, { grade1st: { provide: 0.9, use: 0.7, dedicated: 0.5 }, grade4th: { provide: -0.5, use: -0.3, dedicated: -0.2 } }),
    ktx: shiftCqSnapshot(westCqPrev, { grade1st: { provide: -1.1, use: -0.8, dedicated: -0.6 }, grade4th: { provide: 0.7, use: 0.4, dedicated: 0.3 } }),
    island: shiftCqSnapshot(westCqPrev, { grade1st: { provide: -2.1, use: -1.5, dedicated: -1.2 }, grade4th: { provide: 1.4, use: 0.9, dedicated: 0.7 } }),
  },
  cqToday: {
    all: westCqToday,
    jeonnam: shiftCqSnapshot(westCqToday, { grade1st: { provide: 0.8, use: 0.5, dedicated: 0.4 }, grade4th: { provide: -0.3, use: -0.2, dedicated: -0.1 } }),
    jeonbuk: shiftCqSnapshot(westCqToday, { grade1st: { provide: -0.6, use: -0.3, dedicated: -0.2 }, grade4th: { provide: 0.4, use: 0.2, dedicated: 0.1 } }),
    jeju: shiftCqSnapshot(westCqToday, { grade1st: { provide: 1.0, use: 0.8, dedicated: 0.6 }, grade4th: { provide: -0.5, use: -0.3, dedicated: -0.2 } }),
    ktx: shiftCqSnapshot(westCqToday, { grade1st: { provide: -1.2, use: -0.9, dedicated: -0.7 }, grade4th: { provide: 0.7, use: 0.4, dedicated: 0.3 } }),
    island: shiftCqSnapshot(westCqToday, { grade1st: { provide: -2.2, use: -1.6, dedicated: -1.3 }, grade4th: { provide: 1.4, use: 0.9, dedicated: 0.7 } }),
  },
  endcPrev: {
    all: westEndcPrev,
    jeonnam: shiftEndcSnapshot(westEndcPrev, { provide: [1.4, 0, -1.4], use: [1.2, -1.2, 0] }),
    jeonbuk: shiftEndcSnapshot(westEndcPrev, { provide: [-1.1, 0, 1.1], use: [-0.8, 0.8, 0] }),
    jeju: shiftEndcSnapshot(westEndcPrev, { provide: [2.2, 0, -2.2], use: [1.7, -1.7, 0] }),
    ktx: shiftEndcSnapshot(westEndcPrev, { provide: [-2.2, 0, 2.2], use: [-1.5, 1.5, 0] }),
    island: shiftEndcSnapshot(westEndcPrev, { provide: [-3.4, 0, 3.4], use: [-2.3, 2.3, 0] }),
  },
  endcToday: {
    all: westEndcToday,
    jeonnam: shiftEndcSnapshot(westEndcToday, { provide: [1.5, 0, -1.5], use: [1.3, -1.3, 0] }),
    jeonbuk: shiftEndcSnapshot(westEndcToday, { provide: [-1.2, 0, 1.2], use: [-0.9, 0.9, 0] }),
    jeju: shiftEndcSnapshot(westEndcToday, { provide: [2.3, 0, -2.3], use: [1.8, -1.8, 0] }),
    ktx: shiftEndcSnapshot(westEndcToday, { provide: [-2.3, 0, 2.3], use: [-1.6, 1.6, 0] }),
    island: shiftEndcSnapshot(westEndcToday, { provide: [-3.5, 0, 3.5], use: [-2.4, 2.4, 0] }),
  },
};

export const cqTrendMeta = {
  dayRange:  "2026.04.23 ~ 2026.05.06",
  hourRange: "2026.04.29 ~ 2026.05.06",
};

// ── 안전 요약 ─────────────────────────────────────────────────────────────────

export interface SafetySummaryItem {
  label: string;
  today: number;
  week: number;
  variant: "default" | "warn" | "danger";
}

// ▶ 중부: 충남/충북/대전/세종 — 주로 대전 광역 작업, 원거리는 충남 외곽
const centralSafetySummary: SafetySummaryItem[] = [
  { label: "고위험 작업",  today: 2,  week: 10, variant: "danger"  },
  { label: "야간 작업",    today: 5,  week: 24, variant: "warn"    },
  { label: "원거리 작업",  today: 3,  week: 15, variant: "warn"    },
  { label: "사옥 작업",    today: 2,  week: 8,  variant: "default" },
];

// ▶ 서부: 전남/전북/제주 — 도서 지역 원거리 많고 야간 작업 빈도 높음
const westSafetySummary: SafetySummaryItem[] = [
  { label: "고위험 작업",  today: 4,  week: 19, variant: "danger"  },
  { label: "야간 작업",    today: 9,  week: 41, variant: "warn"    },
  { label: "원거리 작업",  today: 8,  week: 35, variant: "danger"  },
  { label: "사옥 작업",    today: 1,  week: 5,  variant: "default" },
];

// ── 안정 요약 ─────────────────────────────────────────────────────────────────

export interface StabilitySummaryItem {
  label: string;
  count: number;
  status: "정상" | "주의" | "위험";
}

// ▶ 중부: 대전/세종 일부 사옥 전원 이슈
const centralStabilitySummary: StabilitySummaryItem[] = [
  { label: "산불/이벤트 영향 국사", count: 1,  status: "주의" },
  { label: "도서 지역 장애",        count: 0,  status: "정상" },
  { label: "사옥 전원 이상",        count: 1,  status: "위험" },
];

// ▶ 서부: 도서 지역 장애 빈발, 태풍 영향권
const westStabilitySummary: StabilitySummaryItem[] = [
  { label: "산불/이벤트 영향 국사", count: 3,  status: "위험" },
  { label: "도서 지역 장애",        count: 4,  status: "위험" },
  { label: "사옥 전원 이상",        count: 0,  status: "정상" },
];

// ── CapEx 요약 ────────────────────────────────────────────────────────────────

export interface CapexSummaryItem {
  label: string;
  budget: number;
  actual: number;
  rate: number;
}

export interface CapexMeta {
  totalBudget: number;
  totalActual: number;
  totalRate: number;
  baseDate: string;
}

// ▶ 중부 CapEx: 5G 투자 집행률 높음
const centralCapexSummary: CapexSummaryItem[] = [
  { label: "5G 장비 투자",  budget: 280, actual: 134, rate: 47.9 },
  { label: "LTE 장비 투자", budget:  75, actual:  41, rate: 54.7 },
  { label: "인프라 투자",   budget:  50, actual:  20, rate: 40.0 },
  { label: "기타",          budget:  20, actual:   7, rate: 35.0 },
];
const centralCapexMeta: CapexMeta = {
  totalBudget: 425,
  totalActual: 202,
  totalRate: 47.5,
  baseDate: "2026.05.06 기준",
};

// ▶ 서부 CapEx: 전체 예산 적고 집행률 낮음
const westCapexSummary: CapexSummaryItem[] = [
  { label: "5G 장비 투자",  budget: 170, actual:  53, rate: 31.2 },
  { label: "LTE 장비 투자", budget:  45, actual:  22, rate: 48.9 },
  { label: "인프라 투자",   budget:  30, actual:   8, rate: 26.7 },
  { label: "기타",          budget:  10, actual:   2, rate: 20.0 },
];
const westCapexMeta: CapexMeta = {
  totalBudget: 255,
  totalActual:  85,
  totalRate: 33.3,
  baseDate: "2026.05.06 기준",
};

// ── OpEx 요약 ─────────────────────────────────────────────────────────────────

export interface OpexSummaryItem {
  label: string;
  budget: number;
  actual: number;
  rate: number;
}

export interface OpexMeta {
  totalBudget: number;
  totalActual: number;
  totalRate: number;
  baseDate: string;
}

// ▶ 중부 OpEx: 대전/세종 임차료 비중 큼
const centralOpexSummary: OpexSummaryItem[] = [
  { label: "임차료",      budget: 195, actual: 96, rate: 49.2 },
  { label: "유지보수",    budget:  58, actual: 27, rate: 46.6 },
  { label: "전력비",      budget:  68, actual: 33, rate: 48.5 },
  { label: "기타 운용비", budget:  29, actual: 13, rate: 44.8 },
];
const centralOpexMeta: OpexMeta = {
  totalBudget: 350,
  totalActual: 169,
  totalRate: 48.3,
  baseDate: "2026.05.06 기준",
};

// ▶ 서부 OpEx: 도서지역 유지보수/전력비 높음, 임차료 낮음
const westOpexSummary: OpexSummaryItem[] = [
  { label: "임차료",      budget: 125, actual: 52, rate: 41.6 },
  { label: "유지보수",    budget:  37, actual: 14, rate: 37.8 },
  { label: "전력비",      budget:  42, actual: 19, rate: 45.2 },
  { label: "기타 운용비", budget:  16, actual:  5, rate: 31.3 },
];
const westOpexMeta: OpexMeta = {
  totalBudget: 220,
  totalActual:  90,
  totalRate: 40.9,
  baseDate: "2026.05.06 기준",
};

// ── 이슈사항 ──────────────────────────────────────────────────────────────────

export interface IssueItem {
  id: string;
  level: IssueLevel;
  title: string;
  team: string;
  date: string;
  description: string;
}

// ▶ 중부 이슈: 대전/세종/충남/충북 관련
const centralIssueList: IssueItem[] = [
  {
    id: "C-ISS-001",
    level: "critical",
    title: "둔산사옥 UPS 배터리 방전 경보",
    team: "충남Access운용팀",
    date: "2026.05.07 06:12",
    description: "대전 둔산사옥 UPS 배터리 잔량 12%. 즉시 점검 필요.",
  },
  {
    id: "C-ISS-002",
    level: "critical",
    title: "충남 공주시 기지국 전원 단절",
    team: "충남Access운용팀",
    date: "2026.05.07 04:35",
    description: "공주시 3개 기지국 전원 공급 중단. 한전 협조 요청 중.",
  },
  {
    id: "C-ISS-003",
    level: "warning",
    title: "세종시 5G 기지국 CQ 4등급 급증",
    team: "충남Access운용팀",
    date: "2026.05.07 03:20",
    description: "세종시 행정구역 내 CQ 4등급 비율 전일 대비 2.3%p 상승.",
  },
  {
    id: "C-ISS-004",
    level: "warning",
    title: "충북 청주사옥 냉각 시스템 이상",
    team: "충북Access운용팀",
    date: "2026.05.06 21:45",
    description: "청주사옥 IDC 냉각기 2호기 온도 경보. 백업 냉각 가동 중.",
  },
  {
    id: "C-ISS-005",
    level: "info",
    title: "대전 북구 LTE 최적화 작업 예정",
    team: "충남Access운용팀",
    date: "2026.05.08 10:00",
    description: "LTE 파라미터 최적화 작업. 예상 소요: 2시간.",
  },
  {
    id: "C-ISS-006",
    level: "info",
    title: "충북 충주시 WCDMA 노후 장비 교체",
    team: "충북Access운용팀",
    date: "2026.05.09 09:00",
    description: "충주시 구형 WCDMA 장비 교체 일정 확정. 현장 인력 배정 완료.",
  },
];

// ▶ 서부 이슈: 광주/전남/전북/제주 관련
const westIssueList: IssueItem[] = [
  {
    id: "W-ISS-001",
    level: "critical",
    title: "전남 완도군 도서 기지국 전체 장애",
    team: "전남Access운용팀",
    date: "2026.05.07 05:58",
    description: "해저케이블 절단으로 완도군 도서 5개 기지국 전체 서비스 중단.",
  },
  {
    id: "W-ISS-002",
    level: "critical",
    title: "제주 서귀포시 산불 인접 기지국 경보",
    team: "제주Access운용팀",
    date: "2026.05.07 02:11",
    description: "서귀포시 한라산 인근 기지국 3기 산불 인접 경보. 원격 모니터링 강화.",
  },
  {
    id: "W-ISS-003",
    level: "warning",
    title: "전북 군산시 중계기 전원 불안정",
    team: "전북Access운용팀",
    date: "2026.05.06 23:30",
    description: "군산시 항만 인근 중계기 전원 불안정으로 간헐적 재부팅 발생.",
  },
  {
    id: "W-ISS-004",
    level: "warning",
    title: "광주광역시 5G 장비 온도 이상",
    team: "전남Access운용팀",
    date: "2026.05.06 20:15",
    description: "광주 북구 5G CDU 장비 내부 온도 81°C. 냉각 팬 점검 요망.",
  },
  {
    id: "W-ISS-005",
    level: "warning",
    title: "전남 목포시 CQ 품질 급락",
    team: "전남Access운용팀",
    date: "2026.05.06 18:40",
    description: "목포 원도심 1등급 비율 72%→65%로 감소. 원인 분석 중.",
  },
  {
    id: "W-ISS-006",
    level: "info",
    title: "제주 제주시 LTE 최적화 작업 완료",
    team: "제주Access운용팀",
    date: "2026.05.06 17:00",
    description: "제주시 LTE 파라미터 최적화 완료. 품질 모니터링 진행 중.",
  },
  {
    id: "W-ISS-007",
    level: "info",
    title: "전북 남원시 LoRa 게이트웨이 추가 설치",
    team: "전북Access운용팀",
    date: "2026.05.09 10:00",
    description: "남원시 농촌 지역 LoRa GW 5기 추가 설치 예정.",
  },
];

// ── 지역별 MockData 묶음 ──────────────────────────────────────────────────────

export interface RegionalHomeData {
  qualitySummary: QualitySummaryBundle;
  cqPrev: CqKpiSnapshot;
  cqToday: CqKpiSnapshot;
  endcPrev: EndcSnapshot;
  endcToday: EndcSnapshot;
  cqTrend: CqTrendBundle;
  cqDayTrend1st: TrendPoint[];
  cqDayTrend4th: TrendPoint[];
  cqHourTrend1st: TrendPoint[];
  cqHourTrend4th: TrendPoint[];
  safetySummary: SafetySummaryItem[];
  stabilitySummary: StabilitySummaryItem[];
  capexSummary: CapexSummaryItem[];
  capexMeta: CapexMeta;
  opexSummary: OpexSummaryItem[];
  opexMeta: OpexMeta;
  issueList: IssueItem[];
}

export const centralHomeData: RegionalHomeData = {
  qualitySummary: centralQualitySummary,
  cqPrev: centralCqPrev,
  cqToday: centralCqToday,
  endcPrev: centralEndcPrev,
  endcToday: centralEndcToday,
  cqTrend: centralCqTrend,
  cqDayTrend1st: centralCqTrend.dayData1st.all,
  cqDayTrend4th: centralCqTrend.dayData4th.all,
  cqHourTrend1st: centralCqTrend.hourData1st.all,
  cqHourTrend4th: centralCqTrend.hourData4th.all,
  safetySummary: centralSafetySummary,
  stabilitySummary: centralStabilitySummary,
  capexSummary: centralCapexSummary,
  capexMeta: centralCapexMeta,
  opexSummary: centralOpexSummary,
  opexMeta: centralOpexMeta,
  issueList: centralIssueList,
};

export const westHomeData: RegionalHomeData = {
  qualitySummary: westQualitySummary,
  cqPrev: westCqPrev,
  cqToday: westCqToday,
  endcPrev: westEndcPrev,
  endcToday: westEndcToday,
  cqTrend: westCqTrend,
  cqDayTrend1st: westCqTrend.dayData1st.all,
  cqDayTrend4th: westCqTrend.dayData4th.all,
  cqHourTrend1st: westCqTrend.hourData1st.all,
  cqHourTrend4th: westCqTrend.hourData4th.all,
  safetySummary: westSafetySummary,
  stabilitySummary: westStabilitySummary,
  capexSummary: westCapexSummary,
  capexMeta: westCapexMeta,
  opexSummary: westOpexSummary,
  opexMeta: westOpexMeta,
  issueList: westIssueList,
};

export const getHomeData = (region: "central" | "west"): RegionalHomeData =>
  region === "central" ? centralHomeData : westHomeData;

// ── 지역별 품질 현황 (시군구 기준) ────────────────────────────────────────────

export interface DistrictQualityItem {
  id: string;
  name: string;
  grade1stRate: number;    // 1등급 비율 (%)
  grade4thRate: number;    // 4등급 이하 비율 (%)
  color: string;
  lat: number;
  lng: number;
}

// 중부 본부: 대전, 세종, 충남, 충북
export const centralDistricts: DistrictQualityItem[] = [
  { id: "dj-dong",   name: "대전 동구",      grade1stRate: 84.2, grade4thRate: 4.1, color: "#1a7a4a", lat: 36.305, lng: 127.4194 },
  { id: "dj-seo",    name: "대전 서구",      grade1stRate: 81.5, grade4thRate: 5.2, color: "#16a34a", lat: 36.3504, lng: 127.3845 },
  { id: "dj-jung",   name: "대전 중구",      grade1stRate: 82.1, grade4thRate: 4.8, color: "#16a34a", lat: 36.3216, lng: 127.4256 },
  { id: "dj-nam",    name: "대전 남구",      grade1stRate: 80.3, grade4thRate: 5.9, color: "#22c55e", lat: 36.3215, lng: 127.4338 },
  { id: "dj-buk",    name: "대전 북구",      grade1stRate: 83.7, grade4thRate: 3.9, color: "#16a34a", lat: 36.3762, lng: 127.4297 },
  { id: "sj-sejong", name: "세종시",        grade1stRate: 85.6, grade4thRate: 3.2, color: "#1a7a4a", lat: 36.4801, lng: 127.2890 },
  { id: "cn-cheonan", name: "충남 천안시",   grade1stRate: 79.8, grade4thRate: 6.5, color: "#22c55e", lat: 36.8159, lng: 127.1142 },
  { id: "cn-gongju", name: "충남 공주시",   grade1stRate: 78.2, grade4thRate: 7.3, color: "#84cc16", lat: 36.4533, lng: 127.1219 },
  { id: "cn-buyeo", name: "충남 부여군",   grade1stRate: 76.5, grade4thRate: 8.1, color: "#facc15", lat: 36.2803, lng: 126.9095 },
  { id: "cn-yeonsan", name: "충남 연산면",  grade1stRate: 74.1, grade4thRate: 9.4, color: "#fbbf24", lat: 36.3078, lng: 127.1361 },
  { id: "cb-cheongju", name: "충북 청주시",  grade1stRate: 82.3, grade4thRate: 4.6, color: "#16a34a", lat: 36.6424, lng: 127.4890 },
  { id: "cb-chungup", name: "충북 충주시",  grade1stRate: 80.9, grade4thRate: 5.5, color: "#22c55e", lat: 36.9929, lng: 127.3118 },
];

// 서부 본부: 전남, 전북, 제주
export const westDistricts: DistrictQualityItem[] = [
  { id: "jn-gwangju", name: "광주광역시",   grade1stRate: 81.4, grade4thRate: 5.3, color: "#16a34a", lat: 35.1595, lng: 126.8526 },
  { id: "jn-jeonju", name: "전북 전주시",   grade1stRate: 80.7, grade4thRate: 5.8, color: "#22c55e", lat: 35.8243, lng: 127.1480 },
  { id: "jn-gunsan", name: "전북 군산시",   grade1stRate: 78.9, grade4thRate: 7.1, color: "#84cc16", lat: 35.9695, lng: 126.5741 },
  { id: "jn-namwon", name: "전북 남원시",   grade1stRate: 77.3, grade4thRate: 8.4, color: "#fbbf24", lat: 35.4082, lng: 127.3933 },
  { id: "jn-wanju", name: "전북 완주군",   grade1stRate: 79.2, grade4thRate: 6.9, color: "#84cc16", lat: 35.7906, lng: 127.2001 },
  { id: "jn-jeonju-nam", name: "전남 여수시",   grade1stRate: 76.1, grade4thRate: 9.2, color: "#fbbf24", lat: 34.7604, lng: 127.6622 },
  { id: "jn-gwangyang", name: "전남 광양시",  grade1stRate: 75.8, grade4thRate: 9.5, color: "#fbbf24", lat: 34.9425, lng: 127.6828 },
  { id: "jn-mokpo", name: "전남 목포시",   grade1stRate: 74.2, grade4thRate: 10.3, color: "#f97316", lat: 34.8135, lng: 126.3919 },
  { id: "jn-naju", name: "전남 나주시",    grade1stRate: 77.6, grade4thRate: 8.2, color: "#84cc16", lat: 35.0179, lng: 126.7094 },
  { id: "jn-damyang", name: "전남 담양군",  grade1stRate: 76.9, grade4thRate: 8.6, color: "#fbbf24", lat: 35.3469, lng: 126.9920 },
  { id: "jj-jeju", name: "제주 제주시",    grade1stRate: 82.1, grade4thRate: 4.7, color: "#16a34a", lat: 33.4996, lng: 126.5312 },
  { id: "jj-seogwipo", name: "제주 서귀포시", grade1stRate: 83.5, grade4thRate: 4.0, color: "#1a7a4a", lat: 33.2545, lng: 126.5597 },
];

export const getRegionalDistricts = (region: "central" | "west") => {
  return region === "central" ? centralDistricts : westDistricts;
};

// ─────────────────────────────────────────────────────────────────────────────
// ── 기지국 성능 통계 (KPI) — IssueDetailSidebar 연계용
// ─────────────────────────────────────────────────────────────────────────────

// ── KPI 트렌드 공통 타입 ──────────────────────────────────────────────────────

/** 일별/시간별 공통 포인트 (공동망 + 단독망) */
export interface KpiTrendPoint {
  date: string;
  공동망: number;
  단독망: number;
}

/** 단일 KPI 지표 (일별 + 시간별 세트) */
export interface KpiMetric {
  dayData: KpiTrendPoint[];
  hourData: KpiTrendPoint[];
  /** Y축 도메인 [min, max] */
  yDomain: [number, number];
  /** 단위 표시 (%, 명 등) */
  unit: string;
}

/** 기지국 성능 통계 전체 묶음 */
export interface StationKpiStats {
  /** 대상 시군구 또는 기지국 식별자 */
  targetId: string;
  targetName: string;
  /** 조회 기간 메타 */
  meta: {
    dayRange: string;
    hourRange: string;
  };
  endc: KpiMetric;       // ENDC 성공률
  erab: KpiMetric;       // ERAB 성공률
  callDrop: KpiMetric;   // Call Drop률
  rach: KpiMetric;       // RACH 성공률
  concurrentMax: KpiMetric; // 동시접속자 MAX
}

// ── 레이블 공통 정의 ──────────────────────────────────────────────────────────

const DAY_LABELS_KPI = [
  "04.23","04.24","04.25","04.26","04.27","04.28","04.29",
  "04.30","05.01","05.02","05.03","05.04","05.05","05.06",
];

const buildKpiHourLabels = (): string[] => {
  const labels: string[] = [];
  for (let day = 0; day < 8; day++) {
    const totalDay = 29 + day;
    const m = totalDay > 30 ? 5 : 4;
    const d = totalDay > 30 ? totalDay - 30 : totalDay;
    for (let h = 0; h < 8; h++) {
      labels.push(
        `${String(m).padStart(2,"0")}.${String(d).padStart(2,"0")} ${String(h * 3).padStart(2,"0")}시`
      );
    }
  }
  return labels;
};

const HOUR_LABELS_KPI = buildKpiHourLabels();

// ── KPI 생성 헬퍼 ─────────────────────────────────────────────────────────────

/**
 * 사인파 기반 트렌드 포인트 생성기
 * @param labels     날짜 레이블 배열
 * @param baseA      공동망 기준값
 * @param baseB      단독망 기준값
 * @param ampA       공동망 진폭
 * @param ampB       단독망 진폭
 * @param freqA      공동망 주파수
 * @param freqB      단독망 주파수
 * @param phaseB     단독망 위상 오프셋
 * @param clampMin   최솟값 클램프
 * @param clampMax   최댓값 클램프
 */
function makeTrend(
  labels: string[],
  baseA: number, baseB: number,
  ampA: number,  ampB: number,
  freqA = 0.55,  freqB = 0.48,
  phaseB = 1.0,
  clampMin = 0,  clampMax = 100,
): KpiTrendPoint[] {
  return labels.map((date, i) => ({
    date,
    공동망: parseFloat(
      Math.min(clampMax, Math.max(clampMin,
        baseA + Math.sin(i * freqA) * ampA
      )).toFixed(2)
    ),
    단독망: parseFloat(
      Math.min(clampMax, Math.max(clampMin,
        baseB + Math.sin(i * freqB + phaseB) * ampB
      )).toFixed(2)
    ),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// ── 중부 본부 KPI 데이터 (대전/세종/충남/충북)
// ── 특성: 높은 ENDC/ERAB 성공률, 낮은 Call Drop, 안정적 RACH
// ─────────────────────────────────────────────────────────────────────────────

/** 중부 — 공통 고품질 기준 KPI 빌더 */
function buildCentralKpi(
  targetId: string,
  targetName: string,
  /** 품질 오프셋: 지역별 미세 차이 반영 (-3 ~ +2 범위 권장) */
  qualityOffset = 0,
): StationKpiStats {
  const qo = qualityOffset; // 양수=좋음, 음수=나쁨

  return {
    targetId,
    targetName,
    meta: {
      dayRange:  "2026.04.23 ~ 2026.05.06 (일별, 06시 이후)",
      hourRange: "2026.04.29 ~ 2026.05.06 (시간별)",
    },

    // ENDC 성공률: 중부 98~100% 수준
    endc: {
      yDomain: [97.5, 100.5],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        99.2 + qo * 0.1, 99.5 + qo * 0.1,
        0.4, 0.3, 0.52, 0.45, 0.9, 97.5, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        98.9 + qo * 0.1, 99.3 + qo * 0.1,
        0.7, 0.5, 0.38, 0.32, 1.1, 97.5, 100),
    },

    // ERAB 성공률: 중부 98.5~100% 수준
    erab: {
      yDomain: [97.5, 100.5],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        99.1 + qo * 0.1, 99.4 + qo * 0.1,
        0.5, 0.35, 0.48, 0.42, 0.8, 97.5, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        98.7 + qo * 0.1, 99.1 + qo * 0.1,
        0.9, 0.65, 0.41, 0.35, 1.2, 97.5, 100),
    },

    // Call Drop률: 중부 낮음 (0.4~4.6%)
    callDrop: {
      yDomain: [0, 8],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        2.8 - qo * 0.2, 1.5 - qo * 0.15,
        0.9, 0.5, 0.62, 0.55, 0.7, 0, 8),
      hourData: makeTrend(HOUR_LABELS_KPI,
        3.2 - qo * 0.2, 1.8 - qo * 0.15,
        2.5, 1.2, 0.45, 0.38, 1.0, 0, 20),
    },

    // RACH 성공률: 중부 60~80% 수준 (단독망 높음)
    rach: {
      yDomain: [0, 100],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        62.5 + qo * 0.5, 78.3 + qo * 0.4,
        8.2, 3.1, 0.70, 0.55, 1.1, 0, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        65.1 + qo * 0.5, 76.8 + qo * 0.4,
        14.5, 6.2, 0.42, 0.36, 0.9, 0, 100),
    },

    // 동시접속자 MAX: 중부 도심 기준 (단위: 명)
    concurrentMax: {
      yDomain: [0, 150],
      unit: "명",
      dayData:  makeTrend(DAY_LABELS_KPI,
        95 + qo * 2, 72 + qo * 1.5,
        18, 12, 0.58, 0.50, 0.8, 0, 150),
      hourData: makeTrend(HOUR_LABELS_KPI,
        98 + qo * 2, 75 + qo * 1.5,
        35, 22, 0.40, 0.35, 1.0, 0, 170),
    },
  };
}

// ── 중부 시군구별 KPI ─────────────────────────────────────────────────────────

export const centralKpiMap: Record<string, StationKpiStats> = {
  // CQ 1등급 클릭 시 (중부 전체 대표)
  "central-grade1": buildCentralKpi("central-grade1", "중부 본부 CQ 1등급 현황", 2),

  // CQ 4등급 이하 클릭 시 (중부 전체 대표)
  "central-grade4": buildCentralKpi("central-grade4", "중부 본부 CQ 4등급 이하 현황", -3),

  // 시군구 Worst 5 개별
  "dj-dong":       buildCentralKpi("dj-dong",       "대전 동구",    1),
  "dj-seo":        buildCentralKpi("dj-seo",         "대전 서구",   -1),
  "dj-jung":       buildCentralKpi("dj-jung",        "대전 중구",    0),
  "dj-nam":        buildCentralKpi("dj-nam",         "대전 남구",   -2),
  "dj-buk":        buildCentralKpi("dj-buk",         "대전 북구",    1),
  "sj-sejong":     buildCentralKpi("sj-sejong",      "세종시",       2),
  "cn-cheonan":    buildCentralKpi("cn-cheonan",     "충남 천안시", -1),
  "cn-gongju":     buildCentralKpi("cn-gongju",      "충남 공주시", -2),
  "cn-buyeo":      buildCentralKpi("cn-buyeo",       "충남 부여군", -3),
  "cn-yeonsan":    buildCentralKpi("cn-yeonsan",     "충남 연산면", -4),
  "cb-cheongju":   buildCentralKpi("cb-cheongju",    "충북 청주시",  0),
  "cb-chungup":    buildCentralKpi("cb-chungup",     "충북 충주시", -1),
};

// ─────────────────────────────────────────────────────────────────────────────
// ── 서부 본부 KPI 데이터 (광주/전남/전북/제주)
// ── 특성: 도서 지역 영향으로 변동 폭 크고 Call Drop 높음, RACH 불안정
// ─────────────────────────────────────────────────────────────────────────────

/** 서부 — 도서/원격 지역 특성 반영 KPI 빌더 */
function buildWestKpi(
  targetId: string,
  targetName: string,
  qualityOffset = 0,
): StationKpiStats {
  const qo = qualityOffset;

  return {
    targetId,
    targetName,
    meta: {
      dayRange:  "2026.04.23 ~ 2026.05.06 (일별, 06시 이후)",
      hourRange: "2026.04.29 ~ 2026.05.06 (시간별)",
    },

    // ENDC 성공률: 서부 97~99.5% (변동 폭 더 큼)
    endc: {
      yDomain: [96.5, 100.5],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        98.5 + qo * 0.15, 98.9 + qo * 0.15,
        0.8, 0.6, 0.65, 0.58, 1.2, 96.5, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        98.1 + qo * 0.15, 98.6 + qo * 0.15,
        1.4, 1.0, 0.45, 0.40, 1.3, 96.5, 100),
    },

    // ERAB 성공률: 서부 97~99.5%
    erab: {
      yDomain: [96.5, 100.5],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        98.3 + qo * 0.15, 98.7 + qo * 0.15,
        0.9, 0.7, 0.60, 0.52, 1.0, 96.5, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        97.9 + qo * 0.15, 98.4 + qo * 0.15,
        1.6, 1.2, 0.48, 0.42, 1.1, 96.5, 100),
    },

    // Call Drop률: 서부 높음 (1~10%), 시간별 스파이크 있음
    callDrop: {
      yDomain: [0, 20],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        4.5 - qo * 0.3, 2.1 - qo * 0.2,
        1.5, 0.8, 0.72, 0.65, 0.8, 0, 15),
      hourData: makeTrend(HOUR_LABELS_KPI,
        5.2 - qo * 0.3, 2.5 - qo * 0.2,
        4.8, 2.2, 0.50, 0.44, 1.1, 0, 25),
    },

    // RACH 성공률: 서부 불안정 (40~80%, 큰 진폭)
    rach: {
      yDomain: [0, 100],
      unit: "%",
      dayData:  makeTrend(DAY_LABELS_KPI,
        58.2 + qo * 0.6, 72.5 + qo * 0.5,
        12.5, 5.8, 0.78, 0.62, 1.3, 0, 100),
      hourData: makeTrend(HOUR_LABELS_KPI,
        60.8 + qo * 0.6, 71.2 + qo * 0.5,
        20.5, 9.8, 0.48, 0.42, 1.0, 0, 100),
    },

    // 동시접속자 MAX: 서부 도심 낮고 제주 관광지 피크 있음
    concurrentMax: {
      yDomain: [0, 130],
      unit: "명",
      dayData:  makeTrend(DAY_LABELS_KPI,
        78 + qo * 2, 58 + qo * 1.5,
        22, 15, 0.62, 0.55, 0.9, 0, 130),
      hourData: makeTrend(HOUR_LABELS_KPI,
        82 + qo * 2, 61 + qo * 1.5,
        42, 28, 0.44, 0.38, 1.1, 0, 150),
    },
  };
}

// ── 서부 시군구별 KPI ─────────────────────────────────────────────────────────

export const westKpiMap: Record<string, StationKpiStats> = {
  // CQ 1등급 클릭 시
  "west-grade1": buildWestKpi("west-grade1", "서부 본부 CQ 1등급 현황", 2),

  // CQ 4등급 이하 클릭 시
  "west-grade4": buildWestKpi("west-grade4", "서부 본부 CQ 4등급 이하 현황", -4),

  // 시군구 Worst 5 개별
  "jn-gwangju":    buildWestKpi("jn-gwangju",    "광주광역시",     1),
  "jn-jeonju":     buildWestKpi("jn-jeonju",     "전북 전주시",    0),
  "jn-gunsan":     buildWestKpi("jn-gunsan",     "전북 군산시",   -2),
  "jn-namwon":     buildWestKpi("jn-namwon",     "전북 남원시",   -3),
  "jn-wanju":      buildWestKpi("jn-wanju",      "전북 완주군",   -1),
  "jn-jeonju-nam": buildWestKpi("jn-jeonju-nam", "전남 여수시",   -2),
  "jn-gwangyang":  buildWestKpi("jn-gwangyang",  "전남 광양시",   -3),
  "jn-mokpo":      buildWestKpi("jn-mokpo",      "전남 목포시",   -5),
  "jn-naju":       buildWestKpi("jn-naju",       "전남 나주시",   -2),
  "jn-damyang":    buildWestKpi("jn-damyang",    "전남 담양군",   -3),
  "jj-jeju":       buildWestKpi("jj-jeju",       "제주 제주시",    1),
  "jj-seogwipo":   buildWestKpi("jj-seogwipo",   "제주 서귀포시",  2),
};

// ── 통합 조회 함수 ────────────────────────────────────────────────────────────

/**
 * 지역 + targetId 로 KPI 데이터 조회
 * @param region   "central" | "west"
 * @param targetId centralKpiMap / westKpiMap 의 키
 */
export const getStationKpi = (
  region: "central" | "west",
  targetId: string,
): StationKpiStats | null => {
  const map = region === "central" ? centralKpiMap : westKpiMap;
  return map[targetId] ?? null;
};

/**
 * 시군구 Worst 5 목록 반환 (grade4thRate 기준 내림차순)
 */
export const getWorst5Districts = (region: "central" | "west") => {
  const districts = region === "central" ? centralDistricts : westDistricts;
  return [...districts]
    .sort((a, b) => b.grade4thRate - a.grade4thRate)
    .slice(0, 5);
};
