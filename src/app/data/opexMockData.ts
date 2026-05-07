// src/app/data/opexMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// OpEx 전용 Mock 데이터
// 중부 본부 / 서부 본부 분리
// 실제 계정과목코드·계정명 기반 (첨부 이미지 반영)
// 단위: 천원
// ─────────────────────────────────────────────────────────────────────────────

export type Region = "central" | "west";

// ═════════════════════════════════════════════════════════════════════════════
// 공통 타입 정의
// ═════════════════════════════════════════════════════════════════════════════

export type AccountCategory =
  | "임차료"
  | "전기료"
  | "수선비"
  | "회선료"
  | "기타"
  | "매출"
  | "EBITDA";

export interface AccountMaster {
  /** 계정과목코드 */
  code: string;
  /** 계정명 */
  name: string;
  /** 계정구분 */
  category: AccountCategory;
  /** 집계 포함 여부 (EBITDA는 파생값) */
  isLeaf: boolean;
}

// ── 월별 실적 레코드 ──────────────────────────────────────────────────────────

export interface MonthlyRecord {
  /** 월 (1~12) */
  month: number;
  /** 계획 (천원) */
  plan: number;
  /** 실적 (천원) */
  actual: number;
}

/** Gap = actual - plan (음수 = 초과 집행) */
export const calcGap = (r: MonthlyRecord): number => r.actual - r.plan;

/** 집행률 = actual / plan × 100 */
export const calcRate = (r: MonthlyRecord): number =>
  r.plan === 0 ? 0 : parseFloat(((r.actual / r.plan) * 100).toFixed(1));

// ── 계정별 전체 데이터 ────────────────────────────────────────────────────────

export interface AccountData {
  account: AccountMaster;
  /** 월별 실적 (1~4월) */
  monthly: MonthlyRecord[];
}

/** 누적 계획 합계 */
export const calcCumPlan = (data: AccountData, upToMonth: number): number =>
  data.monthly
    .filter((m) => m.month <= upToMonth)
    .reduce((s, m) => s + m.plan, 0);

/** 누적 실적 합계 */
export const calcCumActual = (data: AccountData, upToMonth: number): number =>
  data.monthly
    .filter((m) => m.month <= upToMonth)
    .reduce((s, m) => s + m.actual, 0);

// ── 요약 행 타입 ──────────────────────────────────────────────────────────────

export interface SummaryRow {
  category: AccountCategory;
  /** 당월 계획 */
  monthPlan: number;
  /** 당월 실적 */
  monthActual: number;
  /** 당월 Gap */
  monthGap: number;
  /** 당월 집행률 */
  monthRate: number;
  /** 누적 계획 */
  cumPlan: number;
  /** 누적 실적 */
  cumActual: number;
  /** 누적 Gap */
  cumGap: number;
  /** 누적 집행률 */
  cumRate: number;
}

// ═════════════════════════════════════════════════════════════════════════════
// 계정과목 마스터 (이미지 기반 — 중부/서부 공통)
// ═════════════════════════════════════════════════════════════════════════════

export const accountMasters: AccountMaster[] = [
  // ── 임차료 ──────────────────────────────────────────────────────────────────
  { code: "63510", name: "기지국임차료",      category: "임차료", isLeaf: true  },

  // ── 전기료 ──────────────────────────────────────────────────────────────────
  { code: "63810", name: "통신망수도광열비",  category: "전기료", isLeaf: true  },
  { code: "63820", name: "일반수도광열비",    category: "전기료", isLeaf: true  },

  // ── 수선비 ──────────────────────────────────────────────────────────────────
  { code: "63410", name: "통신시설수선비",    category: "수선비", isLeaf: true  },

  // ── 회선료 ──────────────────────────────────────────────────────────────────
  { code: "61030", name: "기지국회선료",      category: "회선료", isLeaf: true  },
  { code: "63540", name: "통신설비임차료",    category: "회선료", isLeaf: true  },

  // ── 기타 ────────────────────────────────────────────────────────────────────
  { code: "62530", name: "사옥관리용역비",    category: "기타",   isLeaf: true  },
  { code: "62590", name: "기타외주용역비",    category: "기타",   isLeaf: true  },
  { code: "62611", name: "기타수수료",        category: "기타",   isLeaf: true  },
  { code: "62612", name: "무선국검사수수료",  category: "기타",   isLeaf: true  },
  { code: "63010", name: "일반광고비",        category: "기타",   isLeaf: true  },
  { code: "63430", name: "사옥수리비",        category: "기타",   isLeaf: true  },
  { code: "63560", name: "사무집기임차료",    category: "기타",   isLeaf: true  },
  { code: "63690", name: "기타임차료",        category: "기타",   isLeaf: true  },
  { code: "63740", name: "일반통신비",        category: "기타",   isLeaf: true  },
  { code: "63910", name: "통신망소모품비",    category: "기타",   isLeaf: true  },
  { code: "63930", name: "일반소모품비",      category: "기타",   isLeaf: true  },
  { code: "64190", name: "기타세금과공과",    category: "기타",   isLeaf: true  },
  { code: "64310", name: "도서비",            category: "기타",   isLeaf: true  },
  { code: "64330", name: "영업용인쇄비",      category: "기타",   isLeaf: true  },
  { code: "64340", name: "사무용인쇄비",      category: "기타",   isLeaf: true  },
  { code: "64510", name: "피해보상비",        category: "기타",   isLeaf: true  },
  { code: "64690", name: "기타교육훈련비",    category: "기타",   isLeaf: true  },
  { code: "64810", name: "시내출장비",        category: "기타",   isLeaf: true  },
  { code: "64820", name: "시외출장비",        category: "기타",   isLeaf: true  },
  { code: "64990", name: "조사분석비",        category: "기타",   isLeaf: true  },

  // ── 매출 ────────────────────────────────────────────────────────────────────
  { code: "59910", name: "매출",              category: "매출",   isLeaf: true  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 서부 본부 데이터 (이미지 기준 — 4월 실적 직접 반영)
// ═════════════════════════════════════════════════════════════════════════════
//
// 이미지 수치 기준:
//   4월 당월: 계획 / 실적 / Gap
//   누적(4월): 계획 / 실적 / Gap
//
// 월별 계획은 연간 계획 ÷ 12 기준으로 균등 배분 후 미세 조정
// 실적은 4월 누적 실적에서 역산하여 1~3월 분산

// ── 서부 월별 데이터 생성 헬퍼 ───────────────────────────────────────────────
// [annualPlan, apr실적, cum4월실적] 기준으로 1~4월 데이터 구성

interface WestRawData {
  code: string;
  /** 연간 계획 (천원) — 누적 4월 계획 × 3 기준 역산 */
  annualPlan: number;
  /** 4월 당월 실적 */
  aprActual: number;
  /** 누적 4월 실적 */
  cum4Actual: number;
}

// 이미지에서 직접 추출한 서부 원본 수치
const westRawData: WestRawData[] = [
  // 임차료
  { code: "63510", annualPlan: 21_780_501, aprActual: -2_552_079, cum4Actual: 2_897_380 },

  // 전기료
  { code: "63810", annualPlan: 46_505_607, aprActual: -5_510_078, cum4Actual: 6_487_969 },
  { code: "63820", annualPlan:  2_670_840, aprActual:   -451_587, cum4Actual:   243_526 },

  // 수선비
  { code: "63410", annualPlan: 10_465_215, aprActual: -1_306_033, cum4Actual:   959_841 },

  // 회선료
  { code: "61030", annualPlan:  2_658_120, aprActual:   -306_835, cum4Actual:   363_487 },
  { code: "63540", annualPlan: 10_967_574, aprActual: -1_497_766, cum4Actual: 1_266_186 },

  // 기타
  { code: "62530", annualPlan:  4_417_824, aprActual:          0, cum4Actual: 1_104_453 },
  { code: "62590", annualPlan:     12_996, aprActual:          0, cum4Actual:         0 },
  { code: "62611", annualPlan:    157_842, aprActual:        278, cum4Actual:    43_056 },
  { code: "62612", annualPlan:  4_469_838, aprActual:          0, cum4Actual: 1_085_704 },
  { code: "63010", annualPlan:     18_996, aprActual:          0, cum4Actual:       260 },
  { code: "63430", annualPlan:    250_086, aprActual:          0, cum4Actual:    60_435 },
  { code: "63560", annualPlan:     20_832, aprActual:          0, cum4Actual:     4_398 },
  { code: "63690", annualPlan:    106_320, aprActual:          0, cum4Actual:    59_743 },
  { code: "63740", annualPlan:     15_696, aprActual:          0, cum4Actual:     3_184 },
  { code: "63910", annualPlan:     11_916, aprActual:          0, cum4Actual:       280 },
  { code: "63930", annualPlan:      5_628, aprActual:          0, cum4Actual:     1_638 },
  { code: "64190", annualPlan:          0, aprActual:          0, cum4Actual:       840 },
  { code: "64310", annualPlan:      2_712, aprActual:          0, cum4Actual:       135 },
  { code: "64330", annualPlan:          0, aprActual:          0, cum4Actual:         0 },
  { code: "64340", annualPlan:      2_520, aprActual:          0, cum4Actual:         0 },
  { code: "64510", annualPlan:     56_880, aprActual:          0, cum4Actual:     2_902 },
  { code: "64690", annualPlan:      2_928, aprActual:          0, cum4Actual:         0 },
  { code: "64810", annualPlan:     12_168, aprActual:        100, cum4Actual:     2_530 },
  { code: "64820", annualPlan:     95_928, aprActual:        348, cum4Actual:    21_266 },
  { code: "64990", annualPlan:      6_000, aprActual:          0, cum4Actual:       356 },

  // 매출
  { code: "59910", annualPlan:  6_000_573, aprActual:          0, cum4Actual: 1_512_884 },
];

/**
 * 누적 실적을 1~3월에 분산하는 헬퍼
 * cum4Actual = m1 + m2 + m3 + aprActual
 * 1~3월은 비율 [0.28, 0.35, 0.37] 로 분산 (실제 집행 패턴 반영)
 */
function distributeMonthly(
  annualPlan: number,
  aprActual: number,
  cum4Actual: number,
  seed: number,
): MonthlyRecord[] {
  const monthlyPlan = Math.round(annualPlan / 12);

  // 1~3월 실적 분산 (cum4 - apr)
  const cum3Actual = cum4Actual - Math.abs(aprActual);
  const ratios     = [0.28, 0.35, 0.37];
  // 미세 시드 변동
  const s = (seed % 10) / 100;
  const adj = [ratios[0] + s, ratios[1] - s * 0.5, ratios[2] - s * 0.5];

  return [
    { month: 1, plan: monthlyPlan, actual: Math.round(cum3Actual * adj[0]) },
    { month: 2, plan: monthlyPlan, actual: Math.round(cum3Actual * adj[1]) },
    { month: 3, plan: monthlyPlan, actual: Math.round(cum3Actual * adj[2]) },
    { month: 4, plan: Math.round(annualPlan / 12), actual: Math.abs(aprActual) },
  ];
}

// ── 서부 AccountData 생성 ─────────────────────────────────────────────────────

export const westAccountData: AccountData[] = westRawData.map((raw, idx) => {
  const master = accountMasters.find((a) => a.code === raw.code)!;
  return {
    account: master,
    monthly: distributeMonthly(
      raw.annualPlan,
      raw.aprActual,
      raw.cum4Actual,
      idx * 7.3,
    ),
  };
});

// ═════════════════════════════════════════════════════════════════════════════
// 중부 본부 데이터 (서부와 유사한 구조, 규모 차이 반영)
// ─────────────────────────────────────────────────────────────────────────────
// 중부 특성:
//   - 임차료: 서부 대비 약 85% 수준 (내륙 위주, 도서 지역 없음)
//   - 전기료: 서부 대비 약 90% (기지국 수 차이)
//   - 수선비: 서부 대비 약 110% (노후 장비 비중 높음)
//   - 회선료: 서부 대비 약 95%
//   - 기타:   서부 대비 약 92%
//   - 매출:   서부 대비 약 105%
// ═════════════════════════════════════════════════════════════════════════════

const CENTRAL_RATIO: Record<AccountCategory, number> = {
  임차료:  0.85,
  전기료:  0.90,
  수선비:  1.10,
  회선료:  0.95,
  기타:    0.92,
  매출:    1.05,
  EBITDA:  1.00,
};

// 중부 집행 패턴: 서부 대비 전반적으로 집행률 높음 (도심 중심 안정적 집행)
const CENTRAL_ACTUAL_RATIO: Record<AccountCategory, number> = {
  임차료:  0.88,
  전기료:  0.93,
  수선비:  1.08,
  회선료:  0.97,
  기타:    0.95,
  매출:    1.08,
  EBITDA:  1.00,
};

interface CentralRawData {
  code: string;
  annualPlan: number;
  aprActual: number;
  cum4Actual: number;
}

const centralRawData: CentralRawData[] = westRawData.map((raw) => {
  const master = accountMasters.find((a) => a.code === raw.code)!;
  const cat    = master.category;
  const pr     = CENTRAL_RATIO[cat];
  const ar     = CENTRAL_ACTUAL_RATIO[cat];

  return {
    code:       raw.code,
    annualPlan: Math.round(raw.annualPlan  * pr),
    aprActual:  Math.round(raw.aprActual   * ar),
    cum4Actual: Math.round(raw.cum4Actual  * ar),
  };
});

export const centralAccountData: AccountData[] = centralRawData.map((raw, idx) => {
  const master = accountMasters.find((a) => a.code === raw.code)!;
  return {
    account: master,
    monthly: distributeMonthly(
      raw.annualPlan,
      raw.aprActual,
      raw.cum4Actual,
      idx * 5.9 + 200,
    ),
  };
});

// ═════════════════════════════════════════════════════════════════════════════
// 집계 함수
// ═════════════════════════════════════════════════════════════════════════════

// ── 당월 요약 (카테고리별) ────────────────────────────────────────────────────

/**
 * 특정 월의 카테고리별 요약 행 생성
 * (이미지 상단 요약 테이블 — 임차료/전기료/수선비/회선료/기타/OpEx합계/매출/EBITDA)
 */
export const buildMonthlySummary = (
  data: AccountData[],
  month: number,
): SummaryRow[] => {
  const categories: AccountCategory[] = ["임차료","전기료","수선비","회선료","기타","매출"];

  const rows: SummaryRow[] = categories.map((cat) => {
    const items = data.filter(
      (d) => d.account.category === cat && d.account.isLeaf
    );

    const monthPlan   = items.reduce((s, d) => {
      const m = d.monthly.find((r) => r.month === month);
      return s + (m?.plan ?? 0);
    }, 0);
    const monthActual = items.reduce((s, d) => {
      const m = d.monthly.find((r) => r.month === month);
      return s + (m?.actual ?? 0);
    }, 0);
    const cumPlan   = items.reduce((s, d) => s + calcCumPlan(d, month), 0);
    const cumActual = items.reduce((s, d) => s + calcCumActual(d, month), 0);

    return {
      category:    cat,
      monthPlan,
      monthActual,
      monthGap:    monthActual - monthPlan,
      monthRate:   monthPlan === 0 ? 0 : parseFloat(((monthActual / monthPlan) * 100).toFixed(1)),
      cumPlan,
      cumActual,
      cumGap:      cumActual - cumPlan,
      cumRate:     cumPlan === 0 ? 0 : parseFloat(((cumActual / cumPlan) * 100).toFixed(1)),
    };
  });

  // OpEx 합계 (매출 제외)
  const opexRows = rows.filter((r) => r.category !== "매출");
  const opexRow: SummaryRow = {
    category:    "EBITDA", // 임시 키 — 표시 시 "OpEx 합계"로 처리
    monthPlan:   opexRows.reduce((s, r) => s + r.monthPlan,   0),
    monthActual: opexRows.reduce((s, r) => s + r.monthActual, 0),
    monthGap:    opexRows.reduce((s, r) => s + r.monthGap,    0),
    monthRate:   0,
    cumPlan:     opexRows.reduce((s, r) => s + r.cumPlan,     0),
    cumActual:   opexRows.reduce((s, r) => s + r.cumActual,   0),
    cumGap:      opexRows.reduce((s, r) => s + r.cumGap,      0),
    cumRate:     0,
  };
  opexRow.monthRate = opexRow.monthPlan === 0 ? 0
    : parseFloat(((opexRow.monthActual / opexRow.monthPlan) * 100).toFixed(1));
  opexRow.cumRate   = opexRow.cumPlan === 0 ? 0
    : parseFloat(((opexRow.cumActual   / opexRow.cumPlan)   * 100).toFixed(1));

  // EBITDA = 매출 - OpEx합계
  const salesRow  = rows.find((r) => r.category === "매출")!;
  const ebitdaRow: SummaryRow = {
    category:    "EBITDA",
    monthPlan:   salesRow.monthPlan   - opexRow.monthPlan,
    monthActual: salesRow.monthActual - opexRow.monthActual,
    monthGap:    0,
    monthRate:   0,
    cumPlan:     salesRow.cumPlan     - opexRow.cumPlan,
    cumActual:   salesRow.cumActual   - opexRow.cumActual,
    cumGap:      0,
    cumRate:     0,
  };
  ebitdaRow.monthGap  = ebitdaRow.monthActual - ebitdaRow.monthPlan;
  ebitdaRow.monthRate = ebitdaRow.monthPlan === 0 ? 0
    : parseFloat(((ebitdaRow.monthActual / ebitdaRow.monthPlan) * 100).toFixed(1));
  ebitdaRow.cumGap    = ebitdaRow.cumActual - ebitdaRow.cumPlan;
  ebitdaRow.cumRate   = ebitdaRow.cumPlan === 0 ? 0
    : parseFloat(((ebitdaRow.cumActual / ebitdaRow.cumPlan) * 100).toFixed(1));

  // 최종 순서: 임차료/전기료/수선비/회선료/기타/OpEx합계/매출/EBITDA
  return [
    ...rows.filter((r) => r.category !== "매출"),
    { ...opexRow, category: "EBITDA" as AccountCategory }, // OpEx합계 행
    salesRow,
    ebitdaRow,
  ];
};

// ── 상세 내역 (계정별) ────────────────────────────────────────────────────────

export interface DetailRow {
  /** 계정과목코드 */
  code: string;
  /** 계정명 */
  name: string;
  /** 계정구분 */
  category: AccountCategory;
  /** 당월 계획 */
  monthPlan: number;
  /** 당월 실적 */
  monthActual: number;
  /** 당월 Gap */
  monthGap: number;
  /** 누적 계획 */
  cumPlan: number;
  /** 누적 실적 */
  cumActual: number;
  /** 누적 Gap */
  cumGap: number;
}

/**
 * 특정 월의 계정별 상세 내역 행 생성
 * (이미지 하단 상세 테이블)
 */
export const buildDetailRows = (
  data: AccountData[],
  month: number,
): DetailRow[] =>
  data
    .filter((d) => d.account.isLeaf)
    .map((d) => {
      const m         = d.monthly.find((r) => r.month === month);
      const monthPlan   = m?.plan   ?? 0;
      const monthActual = m?.actual ?? 0;
      const cumPlan     = calcCumPlan(d, month);
      const cumActual   = calcCumActual(d, month);
      return {
        code:        d.account.code,
        name:        d.account.name,
        category:    d.account.category,
        monthPlan,
        monthActual,
        monthGap:    monthActual - monthPlan,
        cumPlan,
        cumActual,
        cumGap:      cumActual - cumPlan,
      };
    });

// ── 월별 트렌드 (차트용) ──────────────────────────────────────────────────────

export interface MonthlyTrendPoint {
  month: number;
  label: string;
  plan: number;
  actual: number;
  gap: number;
  rate: number;
}

/**
 * 카테고리별 월별 트렌드 데이터 (1~4월)
 */
export const buildMonthlyTrend = (
  data: AccountData[],
  category: AccountCategory | "OpEx합계",
): MonthlyTrendPoint[] => {
  const months = [1, 2, 3, 4];
  const labels = ["1월", "2월", "3월", "4월"];

  return months.map((month, i) => {
    const items =
      category === "OpEx합계"
        ? data.filter((d) => d.account.category !== "매출" && d.account.isLeaf)
        : data.filter((d) => d.account.category === category && d.account.isLeaf);

    const plan   = items.reduce((s, d) => {
      const m = d.monthly.find((r) => r.month === month);
      return s + (m?.plan ?? 0);
    }, 0);
    const actual = items.reduce((s, d) => {
      const m = d.monthly.find((r) => r.month === month);
      return s + (m?.actual ?? 0);
    }, 0);

    return {
      month,
      label:  labels[i],
      plan,
      actual,
      gap:    actual - plan,
      rate:   plan === 0 ? 0 : parseFloat(((actual / plan) * 100).toFixed(1)),
    };
  });
};

// ── 누적 트렌드 (월 누적 합계) ───────────────────────────────────────────────

export interface CumulativeTrendPoint {
  month: number;
  label: string;
  cumPlan: number;
  cumActual: number;
  cumRate: number;
}

export const buildCumulativeTrend = (
  data: AccountData[],
  category: AccountCategory | "OpEx합계",
): CumulativeTrendPoint[] => {
  const months = [1, 2, 3, 4];
  const labels = ["1월", "2월", "3월", "4월"];

  return months.map((month, i) => {
    const items =
      category === "OpEx합계"
        ? data.filter((d) => d.account.category !== "매출" && d.account.isLeaf)
        : data.filter((d) => d.account.category === category && d.account.isLeaf);

    const cumPlan   = items.reduce((s, d) => s + calcCumPlan(d, month), 0);
    const cumActual = items.reduce((s, d) => s + calcCumActual(d, month), 0);

    return {
      month,
      label:     labels[i],
      cumPlan,
      cumActual,
      cumRate:   cumPlan === 0 ? 0
                 : parseFloat(((cumActual / cumPlan) * 100).toFixed(1)),
    };
  });
};

// ═════════════════════════════════════════════════════════════════════════════
// 통합 조회
// ═════════════════════════════════════════════════════════════════════════════

export interface RegionalOpexData {
  region: Region;
  accountData: AccountData[];
  /** 기준 월 (현재 표시 월) */
  baseMonth: number;
  /** 당월/누적 요약 */
  summary: SummaryRow[];
  /** 계정별 상세 */
  detail: DetailRow[];
  /** OpEx 합계 월별 트렌드 */
  opexTrend: MonthlyTrendPoint[];
  /** OpEx 합계 누적 트렌드 */
  opexCumTrend: CumulativeTrendPoint[];
}

const buildRegionalOpex = (
  region: Region,
  data: AccountData[],
  baseMonth = 4,
): RegionalOpexData => ({
  region,
  accountData:  data,
  baseMonth,
  summary:      buildMonthlySummary(data, baseMonth),
  detail:       buildDetailRows(data, baseMonth),
  opexTrend:    buildMonthlyTrend(data, "OpEx합계"),
  opexCumTrend: buildCumulativeTrend(data, "OpEx합계"),
});

export const centralOpexData: RegionalOpexData =
  buildRegionalOpex("central", centralAccountData);

export const westOpexData: RegionalOpexData =
  buildRegionalOpex("west", westAccountData);

export const getOpexData = (region: Region): RegionalOpexData =>
  region === "central" ? centralOpexData : westOpexData;

// ── 동적 월 변경 (필터 연동용) ────────────────────────────────────────────────

/**
 * 기준 월을 변경하여 새로운 RegionalOpexData 반환
 * (페이지에서 월 필터 변경 시 호출)
 */
export const getOpexDataByMonth = (
  region: Region,
  month: number,
): RegionalOpexData => {
  const data = region === "central" ? centralAccountData : westAccountData;
  return buildRegionalOpex(region, data, month);
};

// ── 카테고리 레이블 (표시용) ──────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<AccountCategory | "OpEx합계", string> = {
  임차료:   "임차료",
  전기료:   "전기료",
  수선비:   "수선비",
  회선료:   "회선료",
  기타:     "기타",
  매출:     "매출",
  EBITDA:   "EBITDA",
  OpEx합계: "OpEx 합계",
};

export const CATEGORY_COLORS: Record<AccountCategory, string> = {
  임차료:  "#3b82f6",
  전기료:  "#f97316",
  수선비:  "#22c55e",
  회선료:  "#a855f7",
  기타:    "#6b7280",
  매출:    "#1a7a4a",
  EBITDA:  "#ef4444",
};
