// ─────────────────────────────────────────────────────────────────────────────
// capexMockData.ts  —  중부/서부 capex_rawdata 목업 (각 300건)
// ─────────────────────────────────────────────────────────────────────────────

import type { CapexRawItem, CapexRegionKey, Region } from "./capexTypes";

// ════════════════════════════════════════════════════════════════════════════
// 공통 상수 풀
// ════════════════════════════════════════════════════════════════════════════
const OPEN_CLAUSES = [
  "개통완료", "개통완료", "개통완료",          // 가중치: 완료 비율 높게
  "구축_공사진행중", "구축_공사진행중",
  "구축_시험예정",
  "KT_시설지연",
  "선로_선로미개통",
  "치국_시트미발행",
] as const;

const HW_5G_AAU  = ["AAU20-3.5G-32T(SS)", "AAU21-3.5G-64T(NK)", "AAU10-3.5G-32T(NK)", "AAU11-3.5G-32T(NK)"];
const HW_5G_PRU  = ["RO-PRU-3.5G-2T", "RO-PRU-3.5G-4T", "PRU11-3.5G-8T(SS)"];
const HW_5G_GIRO = ["RO-GIRO-SS(8000)-2T", "RO-GIRO-DS(8100)-2T", "RO-GIRO-TS(8106)"];
const HW_LTE_RRU = ["RRH_L(NSN)", "RRU_1.8G_FHEA(NSN)", "RRU_FHEB(NSN)", "RRU_2.6G_ARRU(SS)", "RRU_L(NSN)"];
const HW_LTE_IRO = ["RO-IRO-SS(8000)", "RO-GIRO-DS(8100)-2T", "RRU_L(SS)"];
const HW_LEGACY  = ["SF-W20", "SF-W15", "OR-DUON5", "RHU-DUON5-MHU", "LRGW"];

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pad  = (n: number, len = 4) => String(n).padStart(len, "0");

/** YYYY-MM-DD 형식 날짜 생성 */
const fmtDate = (d: Date) => d.toISOString().split("T")[0];

/** 기준일로부터 ±days 범위 랜덤 날짜 */
const randDate = (base: Date, minDays: number, maxDays: number): string => {
  const ms = base.getTime() + (minDays + Math.random() * (maxDays - minDays)) * 86400000;
  return fmtDate(new Date(ms));
};

// ════════════════════════════════════════════════════════════════════════════
// 중부 전용 상수
// ════════════════════════════════════════════════════════════════════════════
const CENTRAL_BP   = ["블루", "대성", "영남", "광진"];
const CENTRAL_MTSO = [
  "S-청주흥덕", "S-대전둔산", "S-세종나성", "S-청주율량", "S-충주교현",
  "S-천안불당", "S-대전유성", "S-공주금학", "S-청주오창", "S-음성금왕",
];
const CENTRAL_SITES_5G = [
  "청주SK하이닉스M11 Sub-fab 1F", "청주SK하이닉스M11 Sub-fab 4F",
  "청주SK하이닉스M15 Sub-fab 5F", "유성도안우미린트리쉐이드101동",
  "유성도안우미린트리쉐이드102동", "청주월명파크한라비발디",
  "세종새나루마을 3단지", "세종새나루마을 4단지",
  "청주흥덕심텍공장1", "청주흥덕심텍공장2",
  "서원보건소", "충주기상과학관", "대전엑스포과학공원",
  "청주오창과학산업단지", "세종정부청사 북측",
  "대전유성온천역", "청주청원구청", "충남대학교 공대동",
  "한국교원대학교 본관", "청주공항 국내선터미널",
];
const CENTRAL_SITES_LTE = [
  "오창그랜드CC 기숙사", "청주야구장", "남면대련리",
  "복대LK트리플렉스", "부여점리2", "괴산사리노송",
  "충주 워락휴게소", "회덕초등학교", "대전동구 가오동",
  "세종 한솔동 주민센터", "청주 상당구 용암동",
  "공주 신관동 아파트", "태안 원북면", "아산 배방읍",
  "천안 불당동 상가", "대전 서구 둔산동 오피스텔",
  "청주 흥덕구 복대동", "보은 보은읍", "영동 황간면",
  "진천 진천읍 신축아파트",
];
const CENTRAL_ADDRS = [
  "충북 청주시 흥덕구 옥산면", "대전광역시 유성구 도안동",
  "세종특별자치시 나성동", "충북 충주시 교현동",
  "충남 천안시 서북구 불당동", "대전광역시 서구 둔산동",
  "충북 청주시 청원구 율량동", "충남 공주시 금학동",
  "충북 음성군 금왕읍", "충남 태안군 원북면",
  "대전광역시 동구 가오동", "충북 보은군 보은읍",
  "충북 영동군 황간면", "충남 아산시 배방읍",
  "세종특별자치시 한솔동",
];

// ════════════════════════════════════════════════════════════════════════════
// 서부 전용 상수
// ════════════════════════════════════════════════════════════════════════════
const WEST_BP   = ["남양", "미주", "전통", "국민"];
const WEST_MTSO = [
  "S-전주산단", "S-광주전송", "S-광주쌍촌", "S-광주북구",
  "S-순천연향", "S-익산영등", "S-군산나운", "S-제주연동",
  "S-목포상동", "S-여수돌산",
];
const WEST_SITES_5G = [
  "신동씨앗퍼스트102(익산)", "순천대학교 70주년기념관",
  "호텔레오(제주)", "라펜트힐(광주)", "원광대학교 프라임홀",
  "광주북구 신축아파트 A동", "광주북구 신축아파트 B동",
  "전주 에코시티 더샵 1단지", "전주 에코시티 더샵 2단지",
  "군산 나운 롯데마트", "익산 부송동 오피스텔",
  "제주 연동 드림타워", "목포 상동 신축빌딩",
  "여수 돌산도 리조트", "순천 조례동 주상복합",
  "광주 광산구 수완지구 상가", "전남 나주 혁신도시 공공기관",
  "광주 서구 화정동 아파트", "전주 완산구 효자동 주민센터",
  "제주 서귀포 중문관광단지",
];
const WEST_SITES_LTE = [
  "군산내흥우미린센텀", "남전주서희103",
  "광주우남엘가트리뷰", "곡성군청",
  "송지송호2", "묘량금계", "추자군부대(제주)", "홍도(신안)",
  "광주 동구 충장로 상가", "전남 순천 해룡면",
  "익산 영등동 신축아파트", "군산 소룡동 공장",
  "전주 덕진구 금암동", "제주 애월읍 주택",
  "광주 남구 봉선동 오피스텔", "전남 담양 담양읍",
  "전북 정읍 시기동", "전남 고흥 고흥읍",
  "전북 남원 도통동", "전남 해남 해남읍",
];
const WEST_ADDRS = [
  "전북 익산시 영등동", "전남 순천시 연향동",
  "광주광역시 북구 운암동", "전북 전주시 완산구 효자동",
  "전북 군산시 나운동", "제주특별자치도 제주시 연동",
  "전남 목포시 상동", "전남 여수시 돌산읍",
  "광주광역시 광산구 수완동", "전남 나주시 빛가람동",
  "전북 정읍시 시기동", "전남 담양군 담양읍",
  "전북 남원시 도통동", "전남 고흥군 고흥읍",
  "전남 해남군 해남읍",
];

// ════════════════════════════════════════════════════════════════════════════
// 공통 생성 헬퍼
// ════════════════════════════════════════════════════════════════════════════

interface SitePool {
  region: "중부" | "서부";
  bpList: string[];
  mtsoList: string[];
  sites5g: string[];
  sitesLte: string[];
  addrList: string[];
  regionCode: string;   // comcode prefix
  childBase: number;    // projcode 숫자 base
}

const CENTRAL_POOL: SitePool = {
  region: "중부",
  bpList: CENTRAL_BP,
  mtsoList: CENTRAL_MTSO,
  sites5g: CENTRAL_SITES_5G,
  sitesLte: CENTRAL_SITES_LTE,
  addrList: CENTRAL_ADDRS,
  regionCode: "2640C",
  childBase: 6320,
};

const WEST_POOL: SitePool = {
  region: "서부",
  bpList: WEST_BP,
  mtsoList: WEST_MTSO,
  sites5g: WEST_SITES_5G,
  sitesLte: WEST_SITES_LTE,
  addrList: WEST_ADDRS,
  regionCode: "2550C",
  childBase: 6310,
};

// ────────────────────────────────────────────────────────────────────────────
// 망 종류별 장비 풀 반환
// ────────────────────────────────────────────────────────────────────────────
const getHwPool = (network: "5G" | "LTE" | "Legacy", method: string) => {
  if (network === "5G") {
    if (method.includes("인빌딩")) return HW_5G_GIRO;
    if (method.includes("광중계기")) return HW_5G_AAU;
    return HW_5G_PRU;
  }
  if (network === "LTE") {
    if (method.includes("인빌딩")) return HW_LTE_IRO;
    return HW_LTE_RRU;
  }
  return HW_LEGACY;
};

// ────────────────────────────────────────────────────────────────────────────
// 사업분류 / 소분류 / 통신방식 조합 풀
// ────────────────────────────────────────────────────────────────────────────
type BizCombo = {
  biz_category: string;
  biz_subcategory: string;
  commethod: string;
  hqmanage: string;
};

const BIZ_COMBOS_5G: BizCombo[] = [
  { biz_category: "신설",   biz_subcategory: "인빌딩_신설",     commethod: "인빌딩",   hqmanage: "본원적경쟁력강화_5G" },
  { biz_category: "신설",   biz_subcategory: "신규커버리지",     commethod: "광중계기", hqmanage: "본원적경쟁력강화_5G" },
  { biz_category: "대개체", biz_subcategory: "광중계기_대개체",  commethod: "광중계기", hqmanage: "본원적경쟁력강화_5G" },
  { biz_category: "이설",   biz_subcategory: "E-Project이설",   commethod: "기지국",   hqmanage: "본원적경쟁력강화_5G" },
  { biz_category: "이설",   biz_subcategory: "NW슬림화이설",     commethod: "기지국",   hqmanage: "본원적경쟁력강화_5G" },
  { biz_category: "신설",   biz_subcategory: "B2B_인빌딩",      commethod: "인빌딩",   hqmanage: "B2B특화" },
  { biz_category: "신설",   biz_subcategory: "SA기지국",         commethod: "기지국",   hqmanage: "본원적경쟁력강화_5G" },
];

const BIZ_COMBOS_LTE: BizCombo[] = [
  { biz_category: "신설",   biz_subcategory: "인빌딩_신설",     commethod: "인빌딩",   hqmanage: "본원적경쟁력강화_LTE" },
  { biz_category: "이설",   biz_subcategory: "800M이설",        commethod: "기지국",   hqmanage: "본원적경쟁력강화_LTE" },
  { biz_category: "이설",   biz_subcategory: "1.8G이설",        commethod: "기지국",   hqmanage: "본원적경쟁력강화_LTE" },
  { biz_category: "이설",   biz_subcategory: "2.1G이설",        commethod: "기지국",   hqmanage: "본원적경쟁력강화_LTE" },
  { biz_category: "이설",   biz_subcategory: "2.6G이설",        commethod: "기지국",   hqmanage: "본원적경쟁력강화_LTE" },
  { biz_category: "신설",   biz_subcategory: "RF중계기_신설",   commethod: "RF중계기", hqmanage: "본원적경쟁력강화_LTE" },
];

const BIZ_COMBOS_LEGACY: BizCombo[] = [
  { biz_category: "철거",   biz_subcategory: "WMC철거",         commethod: "WMC",      hqmanage: "NW슬림화" },
  { biz_category: "이설",   biz_subcategory: "Legacy이설",      commethod: "RF중계기", hqmanage: "NW슬림화" },
  { biz_category: "철거",   biz_subcategory: "OR철거",          commethod: "광중계기", hqmanage: "NW슬림화" },
];

// ────────────────────────────────────────────────────────────────────────────
// CapEx 단가 추정 (천원 단위)
// ────────────────────────────────────────────────────────────────────────────
const estimateCapex = (network: "5G" | "LTE" | "Legacy", biz_category: string, commethod: string): number => {
  const base: Record<string, number> = {
    "5G_인빌딩_신설":    15000,
    "5G_광중계기_대개체": 8000,
    "5G_기지국_신설":    25000,
    "5G_기지국_이설":     5000,
    "5G_인빌딩_B2B":    35000,
    "LTE_인빌딩_신설":   12000,
    "LTE_기지국_이설":    4500,
    "LTE_RF중계기_신설":  3500,
    "Legacy_WMC_철거":    1200,
    "Legacy_광중계기_이설": 2000,
  };
  const key = `${network}_${commethod}_${biz_category}`;
  const found = Object.entries(base).find(([k]) => key.includes(k.split("_")[1]));
  const baseVal = found ? found[1] : 5000;
  // ±30% 랜덤 편차
  return Math.round(baseVal * (0.7 + Math.random() * 0.6) / 100) * 100;
};

// ────────────────────────────────────────────────────────────────────────────
// 날짜 체인 생성 (nsheet → transwork → hwwork → test → subscription)
// open_clause에 따라 중간에서 null 처리
// ────────────────────────────────────────────────────────────────────────────
interface DateChain {
  date_nsheet: string | null;
  date_transwork: string | null;
  date_hwwork: string | null;
  date_test: string | null;
  date_subscription: string | null;
  open_clause: CapexRawItem["open_clause"];
}

const buildDateChain = (bizyear: "2025" | "2026", forceComplete = false): DateChain => {
  const clause = forceComplete
    ? "개통완료"
    : (pick(OPEN_CLAUSES) as CapexRawItem["open_clause"]);

  // 사업년도별 기준 시작일
  const baseStart = bizyear === "2025"
    ? new Date("2025-01-15")
    : new Date("2026-01-20");

  if (clause === "치국_시트미발행") {
    return { date_nsheet: null, date_transwork: null, date_hwwork: null, date_test: null, date_subscription: null, open_clause: clause };
  }

  const nsheet    = randDate(baseStart, 0, 90);
  const nsheetDt  = new Date(nsheet);

  if (clause === "선로_선로미개통") {
    return { date_nsheet: nsheet, date_transwork: null, date_hwwork: null, date_test: null, date_subscription: null, open_clause: clause };
  }

  const transwork = randDate(nsheetDt, 5, 20);
  const transworkDt = new Date(transwork);

  if (clause === "KT_시설지연") {
    return { date_nsheet: nsheet, date_transwork: transwork, date_hwwork: null, date_test: null, date_subscription: null, open_clause: clause };
  }

  const hwwork    = randDate(transworkDt, 3, 15);
  const hwworkDt  = new Date(hwwork);

  if (clause === "구축_공사진행중") {
    return { date_nsheet: nsheet, date_transwork: transwork, date_hwwork: hwwork, date_test: null, date_subscription: null, open_clause: clause };
  }

  const test      = randDate(hwworkDt, 2, 10);
  const testDt    = new Date(test);

  if (clause === "구축_시험예정") {
    return { date_nsheet: nsheet, date_transwork: transwork, date_hwwork: hwwork, date_test: test, date_subscription: null, open_clause: clause };
  }

  // 개통완료
  const subscription = randDate(testDt, 1, 7);
  return { date_nsheet: nsheet, date_transwork: transwork, date_hwwork: hwwork, date_test: test, date_subscription: subscription, open_clause: "개통완료" };
};

// ════════════════════════════════════════════════════════════════════════════
// 핵심 생성 함수
// ════════════════════════════════════════════════════════════════════════════
const generateCapexItems = (
  pool: SitePool,
  count: number,
  idOffset: number,
): CapexRawItem[] => {
  const items: CapexRawItem[] = [];

  // 망 종류 비율: 5G 50% / LTE 35% / Legacy 15%
  const networkDist: Array<"5G" | "LTE" | "Legacy"> = [
    ...Array(15).fill("5G"),
    ...Array(10).fill("LTE"),
    ...Array(5).fill("Legacy"),
  ];

  // 사업년도 비율 결정 함수
  const pickBizYear = (region: "중부" | "서부"): "2025" | "2026" => {
    if (region === "중부") {
      // 중부: 26년 우선, 25년은 미진행(개통완료 아닌 것)만
      return Math.random() < 0.85 ? "2026" : "2025";
    }
    // 서부: 25년 중심
    return Math.random() < 0.75 ? "2025" : "2026";
  };

  for (let i = 0; i < count; i++) {
    const id      = idOffset + i + 1;
    const network = pick(networkDist);
    const bizyear = pickBizYear(pool.region);

    // 사업 조합 선택
    const combos = network === "5G" ? BIZ_COMBOS_5G
                 : network === "LTE" ? BIZ_COMBOS_LTE
                 : BIZ_COMBOS_LEGACY;
    const combo = pick(combos);

    // 중부 25년은 미진행 항목만 (개통완료 제외)
    const forceDone = pool.region === "서부" && bizyear === "2025"
      ? Math.random() < 0.7   // 서부 25년은 70% 완료
      : false;
    const dates = pool.region === "중부" && bizyear === "2025"
      ? buildDateChain("2025", false)   // 중부 25년: 미진행만
      : buildDateChain(bizyear, forceDone);

    // 중부 25년 완료건 필터: 개통완료면 재생성
    const finalDates = (pool.region === "중부" && bizyear === "2025" && dates.open_clause === "개통완료")
      ? { ...dates, open_clause: "구축_공사진행중" as const, date_subscription: null, date_test: null }
      : dates;

    // 사이트 선택
    const siteNm = network === "Legacy"
      ? pick([...pool.sites5g, ...pool.sitesLte])
      : network === "5G"
        ? pick(pool.sites5g)
        : pick(pool.sitesLte);

    // 장비 선택
    const hwPool    = getHwPool(network, combo.commethod);
    const plannedHW = pick(hwPool);
    const confirmHW = finalDates.open_clause === "개통완료"
      ? (Math.random() < 0.15 ? pick(hwPool) : plannedHW)  // 15% 확률로 다른 장비 실장
      : null;

    // 코드 생성
    const projSuffix = pad(i, 4);
    const comcode    = `${pool.regionCode}${pad(41900 + (i % 6), 5)}`;
    const projcode   = `${network === "5G" ? "E" : network === "LTE" ? "L" : "W"}.${pool.regionCode.slice(0, 1)}26${projSuffix}`;
    const afenumber  = `AFE ${Math.ceil((i + 1) / 150)}차`;  // 150건당 차수 변경

    items.push({
      id,
      region:           pool.region,
      network,
      bizyear,
      comcode,
      projcode,
      hqmanage:         combo.hqmanage,
      afenumber,
      commethod:        combo.commethod,
      biz_category:     combo.biz_category,
      biz_subcategory:  combo.biz_subcategory,
      bpnm:             pick(pool.bpList),
      station_nm:       siteNm,
      statoin_nm:       siteNm,
      mtso_nm:          pick(pool.mtsoList),
      work_addr:        pick(pool.addrList),
      date_nsheet:      finalDates.date_nsheet,
      date_transwork:   finalDates.date_transwork,
      date_hwwork:      finalDates.date_hwwork,
      date_test:        finalDates.date_test,
      date_subscription: finalDates.date_subscription,
      open_clause:      finalDates.open_clause,
      plannedHW,
      confirmHW,
      capex_amount:     estimateCapex(network, combo.biz_category, combo.commethod),
      updatedate:       `2026-04-15 02:38:47`,
    });
  }

  return items;
};

// ════════════════════════════════════════════════════════════════════════════
// 최종 데이터셋 export
// ════════════════════════════════════════════════════════════════════════════

/** 중부 300건 */
export const centralCapexData: CapexRawItem[] = generateCapexItems(CENTRAL_POOL, 300, 0);

/** 서부 300건 */
export const westCapexData: CapexRawItem[] = generateCapexItems(WEST_POOL, 300, 300);

/** 본부 코드로 데이터 조회 */
export const getCapexData = (region: Region): CapexRawItem[] =>
  region === "중부" ? centralCapexData : westCapexData;

/** 앱 공통 region key(central/west)로 데이터 조회 */
export const getCapexDataByRegionKey = (regionKey: CapexRegionKey): CapexRawItem[] =>
  regionKey === "central" ? centralCapexData : westCapexData;

/** 전체 합산 */
export const allCapexData: CapexRawItem[] = [...centralCapexData, ...westCapexData];

