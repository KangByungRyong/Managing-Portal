// src/app/data/inventoryMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// 자재 관리 전용 Mock 데이터
// 중부 본부 200건 / 서부 본부 200건
// 실제 자재수불부 Excel 기반 (자재코드·자재명·업체명 반영)
// ─────────────────────────────────────────────────────────────────────────────

export type Region = "central" | "west";

// ═════════════════════════════════════════════════════════════════════════════
// 공통 타입 정의
// ═════════════════════════════════════════════════════════════════════════════

export type InboundType =
  | "전년재고이월"
  | "밴더입고"
  | "본부내입고"
  | "지역간입고"
  | "철거입고"
  | "입고취소";

export type MaterialClass =
  | "광모듈/SFP"
  | "안테나"
  | "분배기/결합기"
  | "전원/케이블"
  | "중계기/증폭기"
  | "인프라/외함"
  | "커넥터/브라켓"
  | "기타";

export type MaterialCondition =
  | "신품(양호)"
  | "구품(양호)"
  | "구품(불량)";

export type MaterialType = "사급자재" | "지입자재";

// ── 자재 마스터 정의 ──────────────────────────────────────────────────────────

export interface MaterialMaster {
  code: string;
  name: string;
  class: MaterialClass;
  type: MaterialType;
  unit: string;
}

// ── 입고 레코드 ───────────────────────────────────────────────────────────────

export interface InventoryInboundItem {
  /** 입고번호 */
  inboundNo: string;
  /** 사업연도 */
  bizYear: number;
  /** 지역 구분 */
  region: Region;
  /** 업체명 */
  companyName: string;
  /** 자재코드 */
  materialCode: string;
  /** 자재명 */
  materialName: string;
  /** 자재 구분 (사급/지입) */
  materialType: MaterialType;
  /** 자재 분류 */
  materialClass: MaterialClass;
  /** 자재 상태 */
  condition: MaterialCondition;
  /** 수량 */
  quantity: number;
  /** 입고일 */
  inboundDate: string;
  /** 입고 구분 */
  inboundType: InboundType;
  /** 등록자 */
  registeredBy: string;
  /** 비고 */
  note?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// 자재 마스터 목록 (Excel 기반 실제 자재 정보)
// ═════════════════════════════════════════════════════════════════════════════

export const materialMasters: MaterialMaster[] = [
  // ── 광모듈/SFP ──────────────────────────────────────────────────────────────
  { code: "1000068462", name: "H-SFP 1350 (DU) Gen2",                          class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000064990", name: "광모듈 프론트홀(LMUX) 10G Duplex 20km",          class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067822", name: "6G HSFP_BIDI_1270(H)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067823", name: "6G HSFP_BIDI_1290(H)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067824", name: "6G HSFP_BIDI_1310(H)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067825", name: "6G HSFP_BIDI_1330(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067826", name: "6G HSFP_BIDI_1350(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067827", name: "6G HSFP_BIDI_1370(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067828", name: "6G HSFP_BIDI_1410(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067829", name: "6G HSFP_BIDI_1430(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067830", name: "6G HSFP_BIDI_1450(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067831", name: "6G HSFP_BIDI_1470(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067832", name: "6G HSFP_BIDI_1490(L)",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067338", name: "25G_광모듈_BIDI(H)",                              class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000067339", name: "25G_광모듈_BIDI(L)",                              class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000065304", name: "광모듈(백홀, 5G-PON용) 10G BIDI 1Km",            class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000064349", name: "TSP-C53AD-XGEAS_TSFP (Chemoptics)",              class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000068100", name: "H-SFP 1350 (RU) Gen2",                           class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000065100", name: "광모듈 프론트홀 10G Duplex 20km 1283.35nm",       class: "광모듈/SFP",    type: "사급자재", unit: "EA" },
  { code: "1000065101", name: "광모듈 프론트홀 10G Duplex 20km 1295.00nm",       class: "광모듈/SFP",    type: "사급자재", unit: "EA" },

  // ── 안테나 ──────────────────────────────────────────────────────────────────
  { code: "1000064629", name: "3.5/Patch-16-20/20-MIMO 5G 안테나",              class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000063552", name: "0.8/1.8/2.1/2.6/3.5/Omni-2/3 5G 안테나",        class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000066588", name: "3.5/14-65/11-TA+10-4P-Circle 5G 안테나",         class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000059567", name: "0.8/1.8/2.1/2.6-14/16-65 기지국용 안테나",       class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000059290", name: "LoRa OmPole-3-360/6 안테나",                     class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000064630", name: "5G Patch 안테나 (인빌딩용)",                      class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000064631", name: "5G Omni 안테나 (인빌딩용)",                       class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000066200", name: "환경친화형 5G 안테나 (위장형)",                   class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000066201", name: "5G Log 안테나 (터널용)",                          class: "안테나",        type: "사급자재", unit: "EA" },
  { code: "1000059568", name: "LTE 기지국용 안테나 0.8/1.8/2.1GHz",             class: "안테나",        type: "사급자재", unit: "EA" },

  // ── 분배기/결합기 ────────────────────────────────────────────────────────────
  { code: "1000063391", name: "5G 분배기 (인빌딩) 2N-150W(7:3)",                class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063392", name: "5G 분배기 (인빌딩) 2N-150W(8:2)",                class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063393", name: "5G 분배기 (인빌딩) 2N-150W(9:1)",                class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063394", name: "5G 분배기 (인빌딩) 3N-150W(1:1:1)",              class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063395", name: "5G 분배기 (인빌딩) 4N-150W",                     class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063396", name: "5G 분배기 3N-300W",                               class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000060968", name: "이통3사용 4X4 인빌딩 대역결합기",                 class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063345", name: "5G 대역결합기 2X2",                               class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063346", name: "5G 대역결합기 3X2_N",                             class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063347", name: "5G 대역결합기 4X2",                               class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000021903", name: "지하철용/광대역 BSPDC-2D-200",                    class: "분배기/결합기", type: "사급자재", unit: "EA" },
  { code: "1000063348", name: "QBC-2P-200 결합기",                               class: "분배기/결합기", type: "사급자재", unit: "EA" },

  // ── 전원/케이블 ─────────────────────────────────────────────────────────────
  { code: "1000067031", name: "리튬축전지 24V 전원케이블 MS3106A16S-01P",        class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "1000067032", name: "리튬축전지 48V 전원케이블 젠더",                  class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "1000067033", name: "5G DC 케이블 (삼성용)",                           class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "1000067034", name: "5G DC 케이블 (에릭슨용)",                         class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "1000067035", name: "알람 케이블 RJ45 Assy",                           class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "1000067036", name: "L9TU 전원케이블",                                 class: "전원/케이블",   type: "사급자재", unit: "EA" },
  { code: "10000063996", name: "HFAL-12D 1/2인치 주름관 케이블",                 class: "전원/케이블",   type: "지입자재", unit: "M"  },
  { code: "1000064000", name: "HFAL-10D 주름관 케이블",                          class: "전원/케이블",   type: "지입자재", unit: "M"  },
  { code: "1000064001", name: "HFAL-22D 7/8인치 주름관 케이블",                  class: "전원/케이블",   type: "지입자재", unit: "M"  },
  { code: "1000064002", name: "방수형 KIT (삼성용)",                             class: "전원/케이블",   type: "지입자재", unit: "EA" },

  // ── 중계기/증폭기 ────────────────────────────────────────────────────────────
  { code: "1000067702", name: "IRWK (850MHz ARRU) 삼성전자",                     class: "중계기/증폭기", type: "사급자재", unit: "EA" },
  { code: "1000067703", name: "IRO 800M Amp 모듈",                               class: "중계기/증폭기", type: "사급자재", unit: "EA" },
  { code: "1000067704", name: "IRO 2.1G Amp 모듈",                               class: "중계기/증폭기", type: "사급자재", unit: "EA" },
  { code: "1000067705", name: "SMHS-PSU Unit (전원공급장치)",                    class: "중계기/증폭기", type: "사급자재", unit: "EA" },

  // ── 인프라/외함 ─────────────────────────────────────────────────────────────
  { code: "1000060100", name: "외함체 WCDMA 확장형",                             class: "인프라/외함",   type: "사급자재", unit: "EA" },
  { code: "1000060101", name: "GPS 8Way Splitter",                               class: "인프라/외함",   type: "사급자재", unit: "EA" },
  { code: "1000060102", name: "GPS Receiver 04",                                 class: "인프라/외함",   type: "사급자재", unit: "EA" },

  // ── 커넥터/브라켓 ────────────────────────────────────────────────────────────
  { code: "1000064010", name: "5G 커넥터 N-MA (주름관용)",                       class: "커넥터/브라켓", type: "지입자재", unit: "EA" },
  { code: "1000064011", name: "5G 커넥터 DIN-MA (주름관용)",                     class: "커넥터/브라켓", unit: "EA", type: "지입자재" },
  { code: "10002315709", name: "5G 일반브라켓_공용 (AAU20/10/21)",               class: "커넥터/브라켓", type: "사급자재", unit: "EA" },
  { code: "1000064012", name: "5G 커넥터 N-FA (인빌딩용)",                       class: "커넥터/브라켓", type: "지입자재", unit: "EA" },
];

// ═════════════════════════════════════════════════════════════════════════════
// 업체 정보
// ═════════════════════════════════════════════════════════════════════════════

export interface CompanyInfo {
  code: string;
  name: string;
  region: Region;
  specialty: MaterialClass[];
}

export const companies: CompanyInfo[] = [
  // ── 중부 업체 ──────────────────────────────────────────────────────────────
  {
    code: "03",
    name: "블루엔이_1군",
    region: "central",
    specialty: ["광모듈/SFP", "안테나", "전원/케이블"],
  },
  {
    code: "05",
    name: "광진통신_1군",
    region: "central",
    specialty: ["분배기/결합기", "안테나", "광모듈/SFP", "전원/케이블"],
  },
  {
    code: "06",
    name: "대성네트웍_1군",
    region: "central",
    specialty: ["인프라/외함", "광모듈/SFP", "분배기/결합기", "전원/케이블"],
  },
  {
    code: "09",
    name: "영남스퀘어_1군",
    region: "central",
    specialty: ["안테나", "분배기/결합기", "중계기/증폭기"],
  },
  {
    code: "15",
    name: "동서텔레콤_인빌딩",
    region: "central",
    specialty: ["전원/케이블", "커넥터/브라켓", "중계기/증폭기", "분배기/결합기"],
  },

  // ── 서부 업체 ──────────────────────────────────────────────────────────────
  {
    code: "21",
    name: "한빛네트웍_서부1군",
    region: "west",
    specialty: ["광모듈/SFP", "안테나", "전원/케이블"],
  },
  {
    code: "22",
    name: "남해통신_서부1군",
    region: "west",
    specialty: ["안테나", "분배기/결합기", "인프라/외함"],
  },
  {
    code: "23",
    name: "제주네트웍_서부2군",
    region: "west",
    specialty: ["광모듈/SFP", "커넥터/브라켓", "전원/케이블"],
  },
  {
    code: "24",
    name: "호남텔레콤_인빌딩",
    region: "west",
    specialty: ["전원/케이블", "커넥터/브라켓", "중계기/증폭기", "분배기/결합기"],
  },
  {
    code: "25",
    name: "서해통신_서부2군",
    region: "west",
    specialty: ["안테나", "중계기/증폭기", "인프라/외함"],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 담당자 정보
// ═════════════════════════════════════════════════════════════════════════════

const CENTRAL_HANDLERS: Record<string, string[]> = {
  "블루엔이_1군":       ["이재일", "박영철", "김민혁"],
  "광진통신_1군":       ["김경직", "류재용"],
  "대성네트웍_1군":     ["김경직", "나원준"],
  "영남스퀘어_1군":     ["고상현", "김도경", "유봉우"],
  "동서텔레콤_인빌딩":  ["나원준", "류재용"],
};

const WEST_HANDLERS: Record<string, string[]> = {
  "한빛네트웍_서부1군": ["정민수", "이준혁"],
  "남해통신_서부1군":   ["박성호", "김태영"],
  "제주네트웍_서부2군": ["고은지", "현성민"],
  "호남텔레콤_인빌딩":  ["오지현", "최재원"],
  "서해통신_서부2군":   ["장민호", "임서연"],
};

// ═════════════════════════════════════════════════════════════════════════════
// 입고 데이터 생성 헬퍼
// ═════════════════════════════════════════════════════════════════════════════

/** 시드 기반 의사 난수 */
function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 99991;
  return x - Math.floor(x);
}

/** 날짜 생성 (2026-01-01 ~ 2026-05-07) */
function makeDate(seed: number): string {
  const r     = sr(seed);
  const month = Math.floor(r * 5) + 1;
  const maxDay = month === 1 ? 31 : month === 2 ? 28
               : month === 3 ? 31 : month === 4 ? 30 : 7;
  const day = Math.floor(sr(seed + 0.2) * maxDay) + 1;
  return `2026-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

/** 입고 구분 가중치 선택 */
const INBOUND_TYPE_WEIGHTS: [InboundType, number][] = [
  ["전년재고이월", 30],
  ["밴더입고",     35],
  ["본부내입고",   12],
  ["지역간입고",    8],
  ["철거입고",     12],
  ["입고취소",      3],
];

function pickInboundType(seed: number): InboundType {
  const total = INBOUND_TYPE_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = sr(seed) * total;
  for (const [type, weight] of INBOUND_TYPE_WEIGHTS) {
    r -= weight;
    if (r <= 0) return type;
  }
  return "밴더입고";
}

/** 자재 상태 결정 (입고 구분에 따라) */
function pickCondition(inboundType: InboundType, seed: number): MaterialCondition {
  if (inboundType === "철거입고") {
    const r = sr(seed);
    return r < 0.65 ? "구품(양호)" : "구품(불량)";
  }
  if (inboundType === "입고취소") return "신품(양호)";
  return "신품(양호)";
}

/** 수량 결정 (자재 분류 및 입고 구분에 따라) */
function pickQuantity(
  matClass: MaterialClass,
  inboundType: InboundType,
  seed: number,
): number {
  const r = sr(seed);

  // 케이블류는 미터 단위 대량
  if (matClass === "전원/케이블") {
    const bases: Record<InboundType, number> = {
      "전년재고이월": 5000, "밴더입고": 3000, "본부내입고": 1000,
      "지역간입고": 800, "철거입고": 200, "입고취소": 1000,
    };
    return Math.round((bases[inboundType] + r * bases[inboundType]) / 100) * 100;
  }

  // 커넥터류는 수백~수천 단위
  if (matClass === "커넥터/브라켓") {
    const base = inboundType === "전년재고이월" ? 500 : 200;
    return Math.round((base + r * base) / 10) * 10;
  }

  // 광모듈은 소량~중량
  if (matClass === "광모듈/SFP") {
    const base = inboundType === "전년재고이월" ? 80 : 40;
    return Math.round(base + r * base);
  }

  // 안테나/분배기/결합기
  if (matClass === "안테나" || matClass === "분배기/결합기") {
    const base = inboundType === "전년재고이월" ? 200 : 80;
    return Math.round(base + r * base);
  }

  // 중계기/증폭기/인프라는 소량
  const base = inboundType === "전년재고이월" ? 20 : 8;
  return Math.max(1, Math.round(base + r * base));
}

/** 입고번호 생성 */
function makeInboundNo(
  region: Region,
  companyCode: string,
  index: number,
  date: string,
): string {
  const regionCode = region === "central" ? "C" : "W";
  const ym = date.replace(/-/g, "").slice(0, 6);
  return `IB-${regionCode}${companyCode}-${ym}-${String(index).padStart(4, "0")}`;
}

/** 비고 생성 */
function makeNote(
  inboundType: InboundType,
  condition: MaterialCondition,
  companyName: string,
): string | undefined {
  if (inboundType === "입고취소") return `입고취소 처리 — ${companyName} 요청`;
  if (inboundType === "철거입고" && condition === "구품(불량)") return "불량 판정 — 폐기 검토 필요";
  if (inboundType === "철거입고") return "망 고도화 철거 자재";
  if (inboundType === "지역간입고") return "수도권 → 중부 지역 간 이동";
  if (inboundType === "전년재고이월") return "2025년 재고 이월 (이성제 일괄 등록)";
  return undefined;
}

// ═════════════════════════════════════════════════════════════════════════════
// 데이터 생성 함수
// ═════════════════════════════════════════════════════════════════════════════

function generateInventoryList(
  region: Region,
  count: number,
): InventoryInboundItem[] {
  const regionCompanies = companies.filter((c) => c.region === region);
  const handlers = region === "central" ? CENTRAL_HANDLERS : WEST_HANDLERS;
  const items: InventoryInboundItem[] = [];

  // 업체별 균등 배분 (count / 업체수)
  const perCompany = Math.floor(count / regionCompanies.length);
  let globalIdx = 1;

  for (const company of regionCompanies) {
    const companyCount =
      company === regionCompanies[regionCompanies.length - 1]
        ? count - perCompany * (regionCompanies.length - 1)
        : perCompany;

    // 해당 업체 전문 자재 위주로 선택
    const targetMaterials = materialMasters.filter((m) =>
      company.specialty.includes(m.class)
    );
    const fallbackMaterials = materialMasters;

    const handlerList = handlers[company.name] ?? ["담당자미지정"];

    for (let i = 0; i < companyCount; i++) {
      const seed        = globalIdx * 17.3 + (region === "central" ? 0 : 1000);
      const matPool     = targetMaterials.length > 0 ? targetMaterials : fallbackMaterials;
      const matIdx      = Math.floor(sr(seed + 0.1) * matPool.length);
      const mat         = matPool[matIdx];
      const inboundType = pickInboundType(seed + 0.3);
      const condition   = pickCondition(inboundType, seed + 0.4);
      const quantity    = pickQuantity(mat.class, inboundType, seed + 0.5);
      const date        = inboundType === "전년재고이월"
                            ? "2026-01-01"
                            : makeDate(seed + 0.6);
      const handlerIdx  = Math.floor(sr(seed + 0.7) * handlerList.length);

      items.push({
        inboundNo:    makeInboundNo(region, company.code, globalIdx, date),
        bizYear:      2026,
        region,
        companyName:  company.name,
        materialCode: mat.code,
        materialName: mat.name,
        materialType: mat.type,
        materialClass: mat.class,
        condition,
        quantity,
        inboundDate:  date,
        inboundType,
        registeredBy: handlerList[handlerIdx],
        note:         makeNote(inboundType, condition, company.name),
      });

      globalIdx++;
    }
  }

  // 날짜 오름차순 정렬
  items.sort((a, b) => a.inboundDate.localeCompare(b.inboundDate));

  return items;
}

// ═════════════════════════════════════════════════════════════════════════════
// 데이터 생성 (중부 200건 / 서부 200건)
// ═════════════════════════════════════════════════════════════════════════════

export const centralInventoryList: InventoryInboundItem[] =
  generateInventoryList("central", 200);

export const westInventoryList: InventoryInboundItem[] =
  generateInventoryList("west", 200);

// ═════════════════════════════════════════════════════════════════════════════
// 집계 헬퍼 함수
// ═════════════════════════════════════════════════════════════════════════════

/** 지역별 전체 목록 반환 */
export const getInventoryList = (region: Region): InventoryInboundItem[] =>
  region === "central" ? centralInventoryList : westInventoryList;

/** 입고 구분별 건수 집계 */
export const countByInboundType = (
  list: InventoryInboundItem[],
): Record<InboundType, number> => {
  const result = {} as Record<InboundType, number>;
  const types: InboundType[] = ["전년재고이월","밴더입고","본부내입고","지역간입고","철거입고","입고취소"];
  for (const t of types) result[t] = 0;
  for (const item of list) result[item.inboundType]++;
  return result;
};

/** 자재 분류별 건수 및 수량 집계 */
export const aggregateByMaterialClass = (
  list: InventoryInboundItem[],
): Record<MaterialClass, { count: number; totalQty: number }> => {
  const classes: MaterialClass[] = [
    "광모듈/SFP","안테나","분배기/결합기","전원/케이블",
    "중계기/증폭기","인프라/외함","커넥터/브라켓","기타",
  ];
  const result = {} as Record<MaterialClass, { count: number; totalQty: number }>;
  for (const c of classes) result[c] = { count: 0, totalQty: 0 };
  for (const item of list) {
    result[item.materialClass].count++;
    result[item.materialClass].totalQty += item.quantity;
  }
  return result;
};

/** 업체별 건수 및 수량 집계 */
export const aggregateByCompany = (
  list: InventoryInboundItem[],
): Record<string, { count: number; totalQty: number }> => {
  const result: Record<string, { count: number; totalQty: number }> = {};
  for (const item of list) {
    if (!result[item.companyName]) result[item.companyName] = { count: 0, totalQty: 0 };
    result[item.companyName].count++;
    result[item.companyName].totalQty += item.quantity;
  }
  return result;
};

/** 자재 상태별 건수 집계 */
export const countByCondition = (
  list: InventoryInboundItem[],
): Record<MaterialCondition, number> => ({
  "신품(양호)": list.filter((i) => i.condition === "신품(양호)").length,
  "구품(양호)": list.filter((i) => i.condition === "구품(양호)").length,
  "구품(불량)": list.filter((i) => i.condition === "구품(불량)").length,
});

/** 월별 입고 건수 집계 */
export const countByMonth = (
  list: InventoryInboundItem[],
): Record<number, number> => {
  const result: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  for (const item of list) {
    const month = parseInt(item.inboundDate.slice(5, 7), 10);
    result[month] = (result[month] ?? 0) + 1;
  }
  return result;
};

/** 사급/지입 구분별 집계 */
export const aggregateByMaterialType = (
  list: InventoryInboundItem[],
): Record<MaterialType, { count: number; totalQty: number }> => ({
  "사급자재": {
    count:    list.filter((i) => i.materialType === "사급자재").length,
    totalQty: list.filter((i) => i.materialType === "사급자재")
                  .reduce((s, i) => s + i.quantity, 0),
  },
  "지입자재": {
    count:    list.filter((i) => i.materialType === "지입자재").length,
    totalQty: list.filter((i) => i.materialType === "지입자재")
                  .reduce((s, i) => s + i.quantity, 0),
  },
});

/** 특정 자재코드 필터링 */
export const filterByMaterialCode = (
  list: InventoryInboundItem[],
  code: string,
): InventoryInboundItem[] => list.filter((i) => i.materialCode === code);

/** 특정 업체 필터링 */
export const filterByCompany = (
  list: InventoryInboundItem[],
  companyName: string,
): InventoryInboundItem[] => list.filter((i) => i.companyName === companyName);

/** 입고 구분 필터링 */
export const filterByInboundType = (
  list: InventoryInboundItem[],
  type: InboundType,
): InventoryInboundItem[] => list.filter((i) => i.inboundType === type);

/** 자재 상태 필터링 */
export const filterByCondition = (
  list: InventoryInboundItem[],
  condition: MaterialCondition,
): InventoryInboundItem[] => list.filter((i) => i.condition === condition);

/** 날짜 범위 필터링 */
export const filterByDateRange = (
  list: InventoryInboundItem[],
  from: string,
  to: string,
): InventoryInboundItem[] =>
  list.filter((i) => i.inboundDate >= from && i.inboundDate <= to);

// ═════════════════════════════════════════════════════════════════════════════
// 통합 조회
// ═════════════════════════════════════════════════════════════════════════════

export interface RegionalInventoryData {
  list: InventoryInboundItem[];
  summary: {
    totalCount:       number;
    totalQty:         number;
    byInboundType:    Record<InboundType, number>;
    byMaterialClass:  Record<MaterialClass, { count: number; totalQty: number }>;
    byCompany:        Record<string, { count: number; totalQty: number }>;
    byCondition:      Record<MaterialCondition, number>;
    byMonth:          Record<number, number>;
    byMaterialType:   Record<MaterialType, { count: number; totalQty: number }>;
  };
  monthlyData: Array<{ 
    month: number; 
    currentQty: number | null;      // 1-5월만 값, 6-12월은 null
    consumedQty: number | null;     // 1-5월만 값, 6-12월은 null
    goalQty: number;                // 목표 수량 (1-12월 모두)
    refHqGoalQty: number;           // 본사 목표 수량 (1-12월 모두)
    refHqCurrentQty: number | null; // 본사 현재 수량 (1-5월만 값)
  }>
}

const buildMonthlyData = (region: Region): RegionalInventoryData['monthlyData'] => {
  const data: RegionalInventoryData['monthlyData'] = [];
  
  // 지역별 기본 수량
  const baseGoalCentral = 10000;
  const baseCurrentCentral = 8500;
  const baseGoalWest = 15000;
  const baseCurrentWest = 12000;
  
  // 본사(HQ) 기본 수량 (참고용)
  const baseGoalHq = 20000;
  const baseCurrentHq = 18000;
  
  const baseGoal = region === 'central' ? baseGoalCentral : baseGoalWest;
  const baseCurrent = region === 'central' ? baseCurrentCentral : baseCurrentWest;
  
  // 12개월 모두 생성, 하지만 1-5월만 실제 데이터 (current, consumed)
  for (let month = 1; month <= 12; month++) {
    // 목표 수량: 월별 150개씩 감소 (1-12월 모두)
    const goal = Math.floor(baseGoal - (month - 1) * 150);
    
    // 현재 수량: 1-5월만 값, 6-12월은 null
    let currentQty: number | null = null;
    if (month <= 5) {
      const variance = Math.sin((month - 1) * Math.PI / 6) * 300 + (Math.random() * 200 - 100);
      currentQty = Math.max(Math.floor(baseCurrent - (month - 1) * 140 + variance), 4000);
    }
    
    // 소비량: 1-5월만 값, 6-12월은 null
    let consumedQty: number | null = null;
    if (month <= 5) {
      consumedQty = Math.max(Math.floor(500 + Math.random() * 400), 300);
    }
    
    // 본사(HQ) Reference 데이터
    const hqGoal = Math.floor(baseGoalHq - (month - 1) * 300);
    
    // 본사 현재 수량: 1-5월만 값, 6-12월은 null
    let refHqCurrentQty: number | null = null;
    if (month <= 5) {
      const hqVariance = Math.sin((month - 1) * Math.PI / 6) * 500 + (Math.random() * 300 - 150);
      refHqCurrentQty = Math.max(Math.floor(baseCurrentHq - (month - 1) * 250 + hqVariance), 8000);
    }
    
    data.push({
      month,
      currentQty,
      consumedQty,
      goalQty: Math.max(goal, 6000),
      refHqGoalQty: Math.max(hqGoal, 10000),
      refHqCurrentQty,
    });
  }
  return data;
};

const buildRegionalInventory = (region: Region): RegionalInventoryData => {
  const list = getInventoryList(region);
  return {
    list,
    summary: {
      totalCount:      list.length,
      totalQty:        list.reduce((s, i) => s + i.quantity, 0),
      byInboundType:   countByInboundType(list),
      byMaterialClass: aggregateByMaterialClass(list),
      byCompany:       aggregateByCompany(list),
      byCondition:     countByCondition(list),
      byMonth:         countByMonth(list),
      byMaterialType:  aggregateByMaterialType(list),
    },
    monthlyData: buildMonthlyData(region),
  };
};

export const centralInventoryData: RegionalInventoryData =
  buildRegionalInventory("central");

export const westInventoryData: RegionalInventoryData =
  buildRegionalInventory("west");

export const getInventoryData = (region: Region): RegionalInventoryData =>
  region === "central" ? centralInventoryData : westInventoryData;
