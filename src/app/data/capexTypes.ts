// ─────────────────────────────────────────────────────────────────────────────
// capexTypes.ts  —  CapEx 관련 공통 타입 정의
// ─────────────────────────────────────────────────────────────────────────────

export type Region = "중부" | "서부";
export type CapexRegionKey = "central" | "west";
export type Network = "5G" | "LTE" | "Legacy";
export type BizYear = "2025" | "2026";
export type OpenClause =
  | "개통완료"
  | "구축_공사진행중"
  | "구축_시험예정"
  | "KT_시설지연"
  | "선로_선로미개통"
  | "치국_시트미발행";

// ── capex_rawdata ─────────────────────────────────────────────────────────────
export interface CapexRawItem {
  id: number;
  region: Region;
  network: Network;
  bizyear: BizYear;
  comcode: string;
  projcode: string;
  hqmanage: string;
  afenumber: string;
  commethod: string;
  biz_category: string;
  biz_subcategory: string;
  bpnm: string;
  station_nm: string;
  /** @deprecated Use station_nm. Kept for backward compatibility. */
  statoin_nm?: string;
  mtso_nm: string;
  work_addr: string;
  date_nsheet: string | null;
  date_transwork: string | null;
  date_hwwork: string | null;
  date_test: string | null;
  date_subscription: string | null;
  open_clause: OpenClause;
  plannedHW: string;
  confirmHW: string | null;
  capex_amount: number; // 단위: 천원
  updatedate: string;
}

// ── capex_confirm (AFE 승인 & 비목별) ─────────────────────────────────────────
export interface CapexConfirmItem {
  id: number;
  region: Region;
  afe: string;
  comcode: string;
  investName: string;
  projcode: string;
  childcode_num: string;
  biz_detail: string;
  region_code: string;
  full_childcode: string;
  childcode: string;
  childcode_nm: string;
  confirm_amount: number; // 단위: 천원
  updatedate: string;
}

// ── capex_construction (비목별 집계) ─────────────────────────────────────────
export interface CapexConstructionItem {
  id: number;
  region: Region;
  AFE: string;
  childcode: string;
  investName: string;
  confirm: number;   // 단위: 백만원
  execution: number;
  remain: number;
  progress: number;
  updatedate: string;
}
