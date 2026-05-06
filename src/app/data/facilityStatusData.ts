// src/app/data/facilityStatusData.ts

// ════════════════════════════════════════════════════════════════
// 공통 타입
// ════════════════════════════════════════════════════════════════

export type HqDivision = "central" | "west";

export type AccessTeam =
  | "충남Access운용팀"
  | "충북Access운용팀"
  | "전남Access운용팀"
  | "전북Access운용팀"
  | "제주Access운용팀";

export const HQ_TEAMS: Record<HqDivision, AccessTeam[]> = {
  central: ["충남Access운용팀", "충북Access운용팀"],
  west:    ["전남Access운용팀", "전북Access운용팀", "제주Access운용팀"],
};

export const TEAM_STATE_MAP: Record<AccessTeam, string[]> = {
  "충남Access운용팀": ["충남", "대전", "세종"],
  "충북Access운용팀": ["충북"],
  "전남Access운용팀": ["전남", "광주"],
  "전북Access운용팀": ["전북"],
  "제주Access운용팀": ["제주"],
};

// ════════════════════════════════════════════════════════════════
// 기지국 장비 상수
// ════════════════════════════════════════════════════════════════

export const GIJIGUK_5G_EQUIP = [
  "CDU10", "CDU20_EL", "CDU10외", "CDU20_NK",
  "CDU20_NK외", "DUH10", "DUH20", "DUH20외",
] as const;

export const GIJIGUK_LTE_EQUIP = [
  "DU20내", "DU20외", "DU20내WL", "DU25",
  "DU30내", "DU30내WL", "DU3외", "DU35",
  "ENB내", "ENB외",
] as const;

export const GIJIGUK_WCDMA_EQUIP = [
  "E3내", "E3내T", "E3외", "E3외T",
  "E3R내", "E3R내T", "E3R외", "E3R외T",
  "ENB-ELG", "FX", "IPNB3S", "IPNB6S", "DBTS외",
] as const;

export const GIJIGUK_LORA_EQUIP = [
  "LRGW", "LRGWIB", "LRGWREV",
] as const;

export type Gijiguk5gEquip   = typeof GIJIGUK_5G_EQUIP[number];
export type GijigukLteEquip  = typeof GIJIGUK_LTE_EQUIP[number];
export type GijigukWcdmaEquip= typeof GIJIGUK_WCDMA_EQUIP[number];
export type GijigukLoraEquip = typeof GIJIGUK_LORA_EQUIP[number];

// ════════════════════════════════════════════════════════════════
// 기지국 행 인터페이스
// ════════════════════════════════════════════════════════════════

export interface GijigukRow {
  region:    HqDivision;
  team:      AccessTeam;
  state:     string;
  city:      string;
  siteCount: number;
  fiveG:     Partial<Record<Gijiguk5gEquip,    number>>;
  lte:       Partial<Record<GijigukLteEquip,   number>>;
  wcdma:     Partial<Record<GijigukWcdmaEquip, number>>;
  lora:      Partial<Record<GijigukLoraEquip,  number>>;
}

// ════════════════════════════════════════════════════════════════
// 광중계기 장비 상수
// ════════════════════════════════════════════════════════════════

export const REPEATER_5G_EQUIP = [
  "AAU10-3.5G-32T(NK)", "AAU10-3.5G-32T(SS)", "AAU11-3.5G-32T(NK)",
  "AAU20-3.5G-32T(EL)", "AAU20-3.5G-32T(NK)", "AAU20-3.5G-32T(SS)",
  "AAU20-3.5G-64T(EL)", "AAU20-3.5G-64T(NK)", "AAU20-3.5G-64T(SS)",
  "AAU21-3.5G-32T(SS)", "AAU21-3.5G-64T(NK)",
  "OPRU10-3.5G-4T(NK)", "PRU10-3.5G-4T(SS)",
  "PRU10-3.5G-8T(NK)", "PRU10-3.5G-8T(SS)",
  "PRU11-3.5G-8T(NK)", "PRU11-3.5G-8T(SS)",
  "RO-AAU(C)-3.5G-4T", "RO-AAU(C)-3.5G-4T-LSH310(NK)",
  "RO-AAU(W)-3.5G-4T", "RO-AAU(W)-3.5G-4T-LSH310(NK)",
  "RO-AAU-3.5G(B13)-4T-4475(ELG)",
  "RO-GIRO-D(0120)", "RO-GIRO-D(8020)", "RO-GIRO-D(8100)",
  "RO-GIRO-D(8100)-LSH310(NK)", "RO-GIRO-D(8100)-SLSH310(NK)",
  "RO-GIRO-D(8100)-SMHS(1C)",
  "RO-GIRO-DS(0120)", "RO-GIRO-DS(0120)-ILSH310(SS)",
  "RO-GIRO-DS(0120)-IMHS", "RO-GIRO-DS(0120)-LSH310(NK)",
  "RO-GIRO-DS(0120)-SMHS(1C)", "RO-GIRO-DS(01W0)",
  "RO-GIRO-DS(01W0)-LSH310(NK)", "RO-GIRO-DS(01W0)-LSH310(SS)",
  "RO-GIRO-DS(01W0)-SLSH310(NK)", "RO-GIRO-DS(01W0)-SMHS(1C)",
  "RO-GIRO-DS(8020)", "RO-GIRO-DS(8020)-IMHS",
  "RO-GIRO-DS(8020)-LSH310(SS)", "RO-GIRO-DS(80W0)",
  "RO-GIRO-DS(80W0)-2T", "RO-GIRO-DS(80W0)-2T-SMHS(1C)",
  "RO-GIRO-DS(80W0)-LSH310(SS)", "RO-GIRO-DS(80W0)-SMHS(1C)",
  "RO-GIRO-DS(8100)", "RO-GIRO-DS(8100)-2T",
  "RO-GIRO-DS(8100)-2T-LSH310(NK)", "RO-GIRO-DS(8100)-2T-SL310(NK)",
  "RO-GIRO-DS(8100)-2T-SMHS(1C)", "RO-GIRO-DS(8100)-ILSH310(NK)",
  "RO-GIRO-DS(8100)-IMHS", "RO-GIRO-DS(8100)-LSH310(NK)",
  "RO-GIRO-DS(8100)-LSH310(SS)", "RO-GIRO-DS(8100)-QMHS",
  "RO-GIRO-DS(8100)-SLSH310(NK)", "RO-GIRO-DS(8100)-SMHS(1C)",
  "RO-GIRO-DS(8120)-2T-SMHS(1C)", "RO-GIRO-DS(81W0)-2T-SMHS(1C)",
  "RO-GIRO-QS(8126)", "RO-GIRO-QS(8126)-2T",
  "RO-GIRO-QS(8126)-2T-SMHS(1C)", "RO-GIRO-QS(8126)-LSH310(NK)",
  "RO-GIRO-QS(8126)-LSH310(SS)", "RO-GIRO-QS(8126)-QMHS",
  "RO-GIRO-QS(8126)-SMHS(1C)", "RO-GIRO-QS(81W6)",
  "RO-GIRO-QS(81W6)-LSH310(NK)", "RO-GIRO-QS(81W6)-LSH310(SS)",
  "RO-GIRO-QS(81W6)-SMHS(1C)",
  "RO-GIRO-SS(0100)", "RO-GIRO-SS(0100)-2T",
  "RO-GIRO-SS(0100)-2T-SMHS(1C)", "RO-GIRO-SS(0100)-QMHS",
  "RO-GIRO-SS(0100)-SMHS(1C)", "RO-GIRO-SS(8000)",
  "RO-GIRO-SS(8000)-2T", "RO-GIRO-SS(8000)-2T-LSH310(NK)",
  "RO-GIRO-SS(8000)-2T-LSH310(SS)", "RO-GIRO-SS(8000)-2T-SMHS(1C)",
  "RO-GIRO-SS(8000)-LSH310(NK)", "RO-GIRO-SS(8000)-QMHS",
  "RO-GIRO-SS(8000)-SLSH310(NK)", "RO-GIRO-SS(8000)-SMHS(1C)",
  "RO-GIRO-T(8120)", "RO-GIRO-T(8120)-LSH310(SS)",
  "RO-GIRO-T(8120)-SMHS(1C)", "RO-GIRO-T(81W0)",
  "RO-GIRO-T(81W0)-IMHS", "RO-GIRO-T(81W0)-QMHS",
  "RO-GIRO-T(81W0)-SLSH310(NK)", "RO-GIRO-T(81W0)-SMHS(1C)",
  "RO-GIRO-TS(8106)", "RO-GIRO-TS(8106)-2T",
  "RO-GIRO-TS(8106)-LSH310(NK)", "RO-GIRO-TS(8106)-LSH310(SS)",
  "RO-GIRO-TS(8106)-SMHS(1C)", "RO-GIRO-TS(8120)",
  "RO-GIRO-TS(8120)-LSH310(NK)", "RO-GIRO-TS(8120)-SMHS(1C)",
  "RO-GIRO-TS(81W0)", "RO-GIRO-TS(81W0)-2T",
  "RO-GIRO-TS(81W0)-2T-LSH310(SS)", "RO-GIRO-TS(81W0)-LSH310(NK)",
  "RO-GIRO-TS(81W0)-LSH310(SS)", "RO-GIRO-TS(81W0)-QMHS",
  "RO-GIRO-TS(81W0)-SLSH310(NK)", "RO-GIRO-TS(81W0)-SMHS(1C)",
  "RO-GIRS-DS(8100)-2T", "RO-GIRS-DS(8100)-2T-SMHS(1C)",
  "RO-PRU-3.5G-2T", "RO-PRU-3.5G-2T-LSH310(NK)",
  "RO-PRU-3.5G-4T", "RO-PRU-3.5G-4T-LSH310(NK)",
  "RO-PRU-3.5G-4T-LSH310(SS)", "T_RO-PRU-3.5G-4T-LSH310(NK)",
] as const;

export const REPEATER_LTE_EQUIP = [
  "ARRU_L(SS)", "ARRU_WL(SS)", "CRU_L10(NSN)", "CRU_L10(SS)",
  "DBRRU(SS)", "DBRRU(SS)-WL", "ICS-L1.8-20", "MIBOS-D-L60_TNL",
  "MIMO-1CA", "RF정합장치_FRGX(NSN)",
  "RO-GIRO-QS(8126)-SMHS(1C)", "RO-GIRO-SS(8000)-2T",
  "RO-GIRO-SS(8000)-2T-SMHS(1C)",
  "RO-IRO-D(0120)", "RO-IRO-D(0120)-IMHS", "RO-IRO-D(0120)-QMHS",
  "RO-IRO-D(0120)-SMHS(1C)", "RO-IRO-D(0120)-SMHS(2C)",
  "RO-IRO-D(0120)-SMHS(3C)", "RO-IRO-D(01W0)",
  "RO-IRO-D(80W0)", "RO-IRO-D(80W0)-IMHS",
  "RO-IRO-D(8100)", "RO-IRO-D(8100)-IMHS",
  "RO-IRO-D(8100)-QMHS", "RO-IRO-D(8100)-SMHS(1C)",
  "RO-IRO-DS(0120)", "RO-IRO-DS(0120)-IMHS",
  "RO-IRO-DS(0120)-QMHS", "RO-IRO-DS(0120)-SMHS(1C)",
  "RO-IRO-DS(0120)-SMHS(3C)", "RO-IRO-DS(01W0)",
  "RO-IRO-DS(01W0)-QMHS", "RO-IRO-DS(01W0)-SMHS(1C)",
  "RO-IRO-DS(8020)", "RO-IRO-DS(8020)-IMHS",
  "RO-IRO-DS(8020)-QMHS", "RO-IRO-DS(8020)-SMHS(1C)",
  "RO-IRO-DS(80W0)", "RO-IRO-DS(80W0)-IMHS",
  "RO-IRO-DS(80W0)-SMHS(1C)",
  "RO-IRO-DS(8100)", "RO-IRO-DS(8100)-IMHS",
  "RO-IRO-DS(8100)-QMHS", "RO-IRO-DS(8100)-SMHS(1C)",
  "RO-IRO-Q(8126)", "RO-IRO-Q(8126)-IMHS",
  "RO-IRO-Q(8126)-SMHS(1C)", "RO-IRO-Q(8126)-SMHS(2C)",
  "RO-IRO-Q(8126)-SMHS(3C)", "RO-IRO-Q(81W6)",
  "RO-IRO-Q(81W6)-IMHS", "RO-IRO-Q(81W6)-SMHS(1C)",
  "RO-IRO-Q(81W6)-SMHS(2C)", "RO-IRO-Q(81W6)-SMHS(3C)",
  "RO-IRO-QS(8126)", "RO-IRO-QS(8126)-IMHS",
  "RO-IRO-QS(8126)-SMHS(2C)", "RO-IRO-QS(81W6)",
  "RO-IRO-QS(81W6)-IMHS", "RO-IRO-QS(81W6)-SMHS(1C)",
  "RO-IRO-QS(81W6)-SMHS(2C)", "RO-IRO-QS(81W6)-SMHS(3C)",
  "RO-IRO-S(0100)", "RO-IRO-S(0100)-IMHS",
  "RO-IRO-S(0100)-QMHS", "RO-IRO-S(0100)-SMHS(1C)",
  "RO-IRO-S(0100)-SMHS(2C)", "RO-IRO-S(8000)",
  "RO-IRO-S(8000)-QMHS", "RO-IRO-S(8000)-SMHS(1C)",
  "RO-IRO-SLIM-Q(81W6)-SMHS(1C)",
  "RO-IRO-SS(0020)", "RO-IRO-SS(0020)-QMHS",
  "RO-IRO-SS(0020)-SMHS(1C)", "RO-IRO-SS(0100)",
  "RO-IRO-SS(0100)-QMHS", "RO-IRO-SS(0100)-SMHS(1C)",
  "RO-IRO-SS(8000)", "RO-IRO-SS(8000)-QMHS",
  "RO-IRO-SS(8000)-SMHS(1C)",
  "RO-IRO-T(01W6)", "RO-IRO-T(01W6)-IMHS",
  "RO-IRO-T(01W6)-SMHS(1C)", "RO-IRO-T(01W6)-SMHS(2C)",
  "RO-IRO-T(8026)", "RO-IRO-T(80W6)",
  "RO-IRO-T(80W6)-IMHS", "RO-IRO-T(80W6)-SMHS(1C)",
  "RO-IRO-T(80W6)-SMHS(3C)", "RO-IRO-T(8106)",
  "RO-IRO-T(8106)-IMHS", "RO-IRO-T(8106)-SMHS(1C)",
  "RO-IRO-T(8120)", "RO-IRO-T(8120)-IMHS",
  "RO-IRO-T(8120)-QMHS", "RO-IRO-T(8120)-SMHS(1C)",
  "RO-IRO-T(8120)-SMHS(2C)", "RO-IRO-T(8120)-SMHS(3C)",
  "RO-IRO-T(8126)-SMHS(1C)", "RO-IRO-T(8126)-SMHS(3C)",
  "RO-IRO-T(81W0)", "RO-IRO-T(81W0)-IMHS",
  "RO-IRO-T(81W0)-QMHS", "RO-IRO-T(81W0)-SMHS(1C)",
  "RO-IRO-T(81W0)-SMHS(2C)", "RO-IRO-T(81W0)-SMHS(3C)",
  "RO-IRO-T(81W6)-SMHS(1C)",
  "RO-IRO-TS(01W6)", "RO-IRO-TS(01W6)-IMHS",
  "RO-IRO-TS(8026)", "RO-IRO-TS(80W6)",
  "RO-IRO-TS(80W6)-IMHS", "RO-IRO-TS(80W6)-SMHS(3C)",
  "RO-IRO-TS(8106)", "RO-IRO-TS(8106)-IMHS",
  "RO-IRO-TS(8120)", "RO-IRO-TS(8120)-IMHS",
  "RO-IRO-TS(8120)-SMHS(1C)", "RO-IRO-TS(8120)-SMHS(2C)",
  "RO-IRO-TS(8120)-SMHS(3C)", "RO-IRO-TS(81W0)",
  "RO-IRO-TS(81W0)-IMHS", "RO-IRO-TS(81W0)-SMHS(1C)",
  "RO-IRO_SLIM-Q(81W6)", "RO-IRO_SLIM-Q(81W6)-IMHS",
  "RO-MBS-CL-L60-SMHS-1C", "RO-MBS-L-L20-SMHS-1C",
  "RO-MBS-Q-L60-SMHS-3C", "RO-MBS-T-L60-SMHS-1C",
  "RO-MBS-T-L60-SMHS-2C", "RO-MBS-T-L60/AD-L60-SMHS-1C",
  "RO-MBS-T-L60/AD-L60-SMHS-2C", "RO-MBS-TS-L60-SMHS-1C",
  "RO-MBS-TS-L60-SMHS-3C",
  "RO-MIBOS-AD-L0", "RO-MIBOS-AD-L0(2.6)",
  "RO-MIBOS-AD-L0(2.6)-AMHS", "RO-MIBOS-AD-L0(2.6)-SMHS(1C)",
  "RO-MIBOS-AD-L60", "RO-MIBOS-AD-L60-AMHS",
  "RO-MIBOS-AD-L60-SMHS(1C)", "RO-MIBOS-AD-L60-SMHS(2C)",
  "RO-MIBOS-AD-L60-SMHS(3C)",
  "RO-MIBOS-CL-L0", "RO-MIBOS-CL-L0-QMHS",
  "RO-MIBOS-CL-L60", "RO-MIBOS-CL-L60-QMHS",
  "RO-MIBOS-D-L0", "RO-MIBOS-D-L0-QMHS",
  "RO-MIBOS-D-L60", "RO-MIBOS-D-L60-QMHS",
  "RO-MIBOS-D-L60-SMHS(1C)", "RO-MIBOS-D-L60-SMHS(2C)",
  "RO-MIBOS-DS(1.8/W)", "RO-MIBOS-DS(1.8/W)-QMHS",
  "RO-MIBOS-L-L20", "RO-MIBOS-L-L20-QMHS",
  "RO-MIBOS-L60", "RO-MIBOS-Q-L60", "RO-MIBOS-Q-L60-QMHS",
  "RO-MIBOS-T(C)-L60", "RO-MIBOS-T(C)-L60-QMHS",
  "RO-MIBOS-T-L0", "RO-MIBOS-T-L0-QMHS",
  "RO-MIBOS-T-L60", "RO-MIBOS-T-L60-QMHS",
  "RO-MIBOS-T-SMHS(1C)", "RO-MIBOS-T-SMHS(3C)",
  "RO-MIBOS-TS-L60", "RO-MIBOS-TS-L60-QMHS",
  "RO-MIBOS-TSR(2.6)-L60", "RO-MIBOS-TSR(2.6)-L60-QMHS",
  "RO-MIBOS-WL(ME)-L05", "RO-MIBOS-WL(ME)-L05-QMHS",
  "RO-MIBOS-WL-L0", "RO-MIBOS-WL-L0-QMHS",
  "RO-MIBOS-WL-L10", "RO-MIBOS-WL-L10-QMHS",
  "RRH_L(LGE)", "RRH_L(NSN)",
  "RRU(0100)_R4471(ELG)", "RRU(0120)_AHEGA(NSN)",
  "RRU(0120)_AHEGA(NSN)-WL", "RRU(0126)_R4466(ELG)",
  "RRU(SS)", "RRUS13(ELG)",
  "RRU_1.8G_FHEA(NSN)", "RRU_2.6G_ARRU(SS)",
  "RRU_2.6G_FRHG(NSN)", "RRU_2.6G_R2212(ELG)",
  "RRU_800M_AHCA(NSN)", "RRU_800M_AHCG(NSN)",
  "RRU_800M_R2212(ELG)", "RRU_800M_R2271(ELG)",
  "RRU_800M_RF2235(SS)", "RRU_FHEB(NSN)",
  "RRU_FRGT(NSN)", "RRU_FRGT(NSN)-WL",
  "RRU_L(SS)", "RU(NSN)", "RU_FXEB(NSN)",
  "SRRU(SS)", "SRRU_D(SS)",
] as const;

export const REPEATER_WCDMA_EQUIP = [
  "A8+", "CMW-DUO", "CMW-DUO20",
  "DDR-DUON5_IBS", "DDR-W-D60_IBS",
  "DUO-IBS", "DUO-IBS_U", "DUO-METRO",
  "ERRHS", "ERRUP", "ERRUS",
  "ICS-DUO", "ICS-DUOC", "ICS-W20", "ICS-W5",
  "ICS-WN20", "ICS-WN5",
  "LR-DUO", "LR-DUO2", "LR-DUO5", "LR-DUON5",
  "LR-DUONC5", "LR-DUOR2", "LR-DUOR5",
  "MMW-DUO2/5", "MPR-DUO", "MPR-DUON20",
  "MPR-DUON20_IBS", "MPR-DUON5",
  "MPR-WN20", "MPR-WN5",
  "MW-DUO", "OMW-DUO", "OMW-DUO20",
  "OR-DUO2", "OR-DUO5", "OR-DUON5",
  "OR-DUOR2", "OR-DUOR5", "OR-DUORC6",
  "OR-W6", "OTTA-W20", "OTTA-W30", "OTTA-WN20",
  "RAU-DUO5", "RAU-DUON5", "RAU-DUON6",
  "RAU-DUONC5", "RAU-W2",
  "RHU-DUO0520", "RHU-DUO0520-CMHU",
  "RHU-DUO0520-MHU", "RHU-DUO0520-OMHU",
  "RHU-DUO0530", "RHU-DUO0530-OMHU",
  "RHU-DUO20", "RHU-DUO20-MHU", "RHU-DUO20-OMHU",
  "RHU-DUO5", "RHU-DUO5-MHU", "RHU-DUO5-OMHU",
  "RHU-DUOC0520", "RHU-DUOC0520-CMHU",
  "RHU-DUOC0520-MHU", "RHU-DUOC0520-OMHU",
  "RHU-DUOC0530", "RHU-DUOC0530-OMHU",
  "RHU-DUOC20-OMHU", "RHU-DUOC5-OMHU",
  "RHU-DUOFC30-OMHU", "RHU-DUOFC6-OMHU",
  "RHU-DUON20", "RHU-DUON20-CMHU",
  "RHU-DUON20-MHU", "RHU-DUON20-OMHU",
  "RHU-DUON5", "RHU-DUON5-CMHU",
  "RHU-DUON5-MHU", "RHU-DUON5-OMHU",
  "RHU-DUONC20", "RHU-DUONC20-CMHU",
  "RHU-DUONC20-MHU", "RHU-DUONC20-OMHU",
  "RHU-DUONC5", "RHU-DUONC5-CMHU",
  "RHU-DUONC5-MHU", "RHU-DUONC5-OMHU",
  "RHU-DUONC6", "RHU-DUONC6-OMHU",
  "RHU-W2", "RHU-W2-MHU",
  "RHU-WF30", "RHU-WF30-MHU", "RHU-WF30-OMHU",
  "RHU-WF6", "RHU-WF6-MHU",
  "RHU-WN20", "RHU-WN20-MHU", "RHU-WN20-OMHU",
  "RHU-WN30", "RHU-WN30-OMHU",
  "RHU-WN5", "RHU-WN5-MHU", "RHU-WN5-OMHU",
  "RMW-DUO", "RMW-DUO20", "RMW-DUO_L",
  "RO-DUO-AA020", "RO-DUO-AA020-CMHU",
  "RO-DUO-AA2020", "RO-DUO-AA2020-CMHU",
  "RO-DUO-AA2030", "RO-DUO-AA2030-CMHU",
  "RO-DUOC-AA2020-CMHU",
  "RO-DUON5", "RO-DUON5-MHU",
  "RO-DUON5-MOU", "RO-DUON5-OMHU",
  "RO-DUONC5", "RO-DUONC5-MOU",
  "RO-IRO-Q(8126)", "RO-IRO-Q(8126)-IMHS",
  "RO-IRO-Q(8126)-SMHS(1C)", "RO-IRO-Q(81W6)",
  "RO-IRO-QS(8126)", "RO-IRO-QS(8126)-IMHS",
  "RO-IRO-T(8106)", "RO-IRO-TS(8106)",
  "RO-IRO-TS(8106)-IMHS", "RO-IRO_SLIM-Q(81W6)",
  "RO-MBS-Q-L60-SMHS-3C", "RO-MBS-T-L60-SMHS-1C",
  "RO-MBS-T-L60-SMHS-2C", "RO-MBS-T-L60-SMHS-3C",
  "RO-MIBOS-Q-L60", "RO-MIBOS-Q-L60-QMHS",
  "RO-MIBOS-T-L0", "RO-MIBOS-T-L0-QMHS",
  "RO-MIBOS-T-L60", "RO-MIBOS-T-L60-QMHS",
  "RO-MIBOS-TS-L60", "RO-MIBOS-TS-L60-QMHS",
  "RO-MIBOS-WL(ME)-L05", "RO-MIBOS-WL(ME)-L05-QMHS",
  "RO-MIBOS-WL-L0", "RO-MIBOS-WL-L0-QMHS",
  "RO-MIBOS-WL-L10", "RO-MIBOS-WL-L10-QMHS",
  "RO-STORM-000-H2-SMHS#2", "RO-STORM-230-H2-SMHS#2",
  "RO-STORM-232-H2-SMHS#2",
  "RO-TM-DAA063-CMHU", "RO-TM-DAA460-CMHU",
  "RO-TM-DAA463", "RO-TM-DAA463-CMHU",
  "RO-W-D60", "RO-W-D60-CMHU",
  "RRH", "RRU",
  "SF-DUO", "SF-DUO20", "SF-DUOR", "SF-DUOR20",
  "SF-T", "SF-T023", "SF-T423",
  "SF-TM023", "SF-TM423", "SF-TMN423",
  "SF-W15", "SF-W20", "SF-WIM23", "SF-WIM43",
  "SF-WN20", "SF-WR15", "SF-WR20",
  "SRF-C20", "SRF-W15", "SRF-W20",
  "TOS-W15", "TTA-W20", "TTA-W30", "TTA-W40",
  "WAFMCA", "WAFMCB", "WINS(+)", "지하철광분산",
] as const;

export const REPEATER_WIBRO_EQUIP = [
  "RO-MIBOS-Q-L60", "RO-TM-DAA463",
  "SF-T", "SF-TM023", "SF-WIM23",
] as const;

export const REPEATER_IDONG_EQUIP = [
  "DUO-IBS", "ICS-W1", "LR-DUO", "LR-DUO2",
  "OMW-DUO20", "OR-DUO2", "OR-DUOR2",
  "RAU-DUOC5", "RHU-DUON20", "RHU-DUON20-MHU",
  "RHU-DUON20-OMHU", "RHU-DUON5", "RHU-DUON5-OMHU",
  "RHU-DUONC5-MHU", "RHU-DUONC5-OMHU",
  "RO-DUO-AA2020", "RO-DUO-AA2020-CMHU",
  "RO-DUON5-MOU", "RO-W-D60-CMHU",
  "SF-DUO", "SF-DUO20",
] as const;

// 편의 타입
export type Repeater5gEquip    = typeof REPEATER_5G_EQUIP[number];
export type RepeaterLteEquip   = typeof REPEATER_LTE_EQUIP[number];
export type RepeaterWcdmaEquip = typeof REPEATER_WCDMA_EQUIP[number];
export type RepeaterWibroEquip = typeof REPEATER_WIBRO_EQUIP[number];
export type RepeaterIdongEquip = typeof REPEATER_IDONG_EQUIP[number];

// ════════════════════════════════════════════════════════════════
// 광중계기 행 인터페이스
// ════════════════════════════════════════════════════════════════

export interface RepeaterRow {
  region:    HqDivision;
  team:      AccessTeam;
  state:     string;
  city:      string;
  siteCount: number;
  fiveG:     Partial<Record<Repeater5gEquip,    number>>;
  lte:       Partial<Record<RepeaterLteEquip,   number>>;
  wcdma:     Partial<Record<RepeaterWcdmaEquip, number>>;
  wibro:     Partial<Record<RepeaterWibroEquip, number>>;
  idong:     Partial<Record<RepeaterIdongEquip, number>>;
}

// ════════════════════════════════════════════════════════════════
// 기지국 Mock 데이터
// ════════════════════════════════════════════════════════════════

export const gijigukData: GijigukRow[] = [

  // ── 서부 / 전남Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"광산구", siteCount:173,
    fiveG:  { CDU10: 42, CDU20_EL: 38, CDU20_NK: 31, DUH20: 28, DUH10: 21, CDU10외: 12, DUH20외: 8 },
    lte:    { DU20내: 68, DU20외: 52, ENB내: 44, ENB외: 38, DU25: 32, DU30내: 28, DU20내WL: 22, DU35: 18, DU3외: 15 },
    wcdma:  { E3내: 38, E3외: 32, E3R내: 28, E3R외: 24, E3내T: 18, E3외T: 14, "ENB-ELG": 12, FX: 8, IPNB3S: 6, IPNB6S: 4 },
    lora:   { LRGW: 52, LRGWIB: 28, LRGWREV: 18 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"남구", siteCount:98,
    fiveG:  { CDU10: 22, CDU20_EL: 18, CDU20_NK: 14, DUH20: 12, DUH10: 8 },
    lte:    { DU20내: 38, DU20외: 28, ENB내: 22, ENB외: 18, DU25: 14, DU30내: 10, DU20내WL: 8 },
    wcdma:  { E3내: 22, E3외: 18, E3R내: 14, E3R외: 10, E3내T: 8, "ENB-ELG": 6, FX: 4 },
    lora:   { LRGW: 28, LRGWIB: 14, LRGWREV: 8 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"북구", siteCount:176,
    fiveG:  { CDU10: 38, CDU20_EL: 32, CDU20_NK: 28, DUH20: 24, DUH10: 18, CDU10외: 10, DUH20외: 6 },
    lte:    { DU20내: 62, DU20외: 48, ENB내: 38, ENB외: 32, DU25: 28, DU30내: 22, DU20내WL: 18, DU35: 14 },
    wcdma:  { E3내: 34, E3외: 28, E3R내: 24, E3R외: 18, E3내T: 14, E3외T: 10, "ENB-ELG": 8, FX: 6, IPNB3S: 4 },
    lora:   { LRGW: 48, LRGWIB: 24, LRGWREV: 14 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"서구", siteCount:141,
    fiveG:  { CDU10: 32, CDU20_EL: 26, CDU20_NK: 22, DUH20: 18, DUH10: 14, CDU10외: 8 },
    lte:    { DU20내: 52, DU20외: 40, ENB내: 32, ENB외: 26, DU25: 22, DU30내: 18, DU20내WL: 14, DU35: 10 },
    wcdma:  { E3내: 28, E3외: 22, E3R내: 18, E3R외: 14, E3내T: 10, "ENB-ELG": 8, FX: 6, IPNB3S: 4 },
    lora:   { LRGW: 38, LRGWIB: 20, LRGWREV: 12 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"순천시", siteCount:257,
    fiveG:  { CDU10: 28, CDU20_EL: 22, CDU20_NK: 18, DUH20: 14, DUH10: 10, CDU10외: 6, DUH20외: 4 },
    lte:    { DU20내: 82, DU20외: 68, ENB내: 52, ENB외: 44, DU25: 36, DU30내: 28, DU20내WL: 22, DU35: 18, DU3외: 14, DU30내WL: 10 },
    wcdma:  { E3내: 52, E3외: 44, E3R내: 36, E3R외: 28, E3내T: 22, E3외T: 16, "ENB-ELG": 12, FX: 8, IPNB3S: 6, IPNB6S: 4, DBTS외: 3 },
    lora:   { LRGW: 68, LRGWIB: 34, LRGWREV: 22 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"여수시", siteCount:234,
    fiveG:  { CDU10: 24, CDU20_EL: 20, CDU20_NK: 16, DUH20: 12, DUH10: 8, CDU10외: 5 },
    lte:    { DU20내: 78, DU20외: 62, ENB내: 48, ENB외: 40, DU25: 32, DU30내: 26, DU20내WL: 20, DU35: 16, DU3외: 12 },
    wcdma:  { E3내: 48, E3외: 40, E3R내: 32, E3R외: 24, E3내T: 18, E3외T: 12, "ENB-ELG": 10, FX: 6, IPNB3S: 5, IPNB6S: 3 },
    lora:   { LRGW: 62, LRGWIB: 30, LRGWREV: 18 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"나주시", siteCount:192,
    fiveG:  { CDU10: 12, CDU20_EL: 10, CDU20_NK: 8, DUH20: 6, DUH10: 5 },
    lte:    { DU20내: 48, DU20외: 38, ENB내: 28, ENB외: 22, DU25: 18, DU30내: 14, DU20내WL: 10, DU35: 8 },
    wcdma:  { E3내: 32, E3외: 26, E3R내: 20, E3R외: 16, E3내T: 12, E3외T: 8, "ENB-ELG": 6, FX: 4 },
    lora:   { LRGW: 52, LRGWIB: 26, LRGWREV: 14 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"목포시", siteCount:100,
    fiveG:  { CDU10: 22, CDU20_EL: 18, CDU20_NK: 14, DUH20: 10, DUH10: 8, CDU10외: 5 },
    lte:    { DU20내: 38, DU20외: 30, ENB내: 24, ENB외: 18, DU25: 14, DU30내: 10, DU20내WL: 8 },
    wcdma:  { E3내: 20, E3외: 16, E3R내: 12, E3R외: 8, E3내T: 6, "ENB-ELG": 4, FX: 3 },
    lora:   { LRGW: 28, LRGWIB: 14, LRGWREV: 8 },
  },

  // ── 서부 / 전북Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"전주시 완산구", siteCount:154,
    fiveG:  { CDU10: 36, CDU20_EL: 30, CDU20_NK: 24, DUH20: 20, DUH10: 14, CDU10외: 8, DUH20외: 5 },
    lte:    { DU20내: 58, DU20외: 46, ENB내: 36, ENB외: 28, DU25: 22, DU30내: 18, DU20내WL: 14, DU35: 10, DU3외: 8 },
    wcdma:  { E3내: 32, E3외: 26, E3R내: 20, E3R외: 16, E3내T: 12, E3외T: 8, "ENB-ELG": 6, FX: 5, IPNB3S: 4 },
    lora:   { LRGW: 42, LRGWIB: 20, LRGWREV: 12 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"전주시 덕진구", siteCount:145,
    fiveG:  { CDU10: 32, CDU20_EL: 26, CDU20_NK: 20, DUH20: 16, DUH10: 12, CDU10외: 6 },
    lte:    { DU20내: 52, DU20외: 40, ENB내: 32, ENB외: 24, DU25: 18, DU30내: 14, DU20내WL: 10, DU35: 8 },
    wcdma:  { E3내: 28, E3외: 22, E3R내: 18, E3R외: 12, E3내T: 10, E3외T: 6, "ENB-ELG": 5, FX: 4 },
    lora:   { LRGW: 38, LRGWIB: 18, LRGWREV: 10 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"익산시", siteCount:185,
    fiveG:  { CDU10: 18, CDU20_EL: 14, CDU20_NK: 12, DUH20: 8, DUH10: 6, CDU10외: 4 },
    lte:    { DU20내: 52, DU20외: 42, ENB내: 32, ENB외: 26, DU25: 20, DU30내: 16, DU20내WL: 12, DU35: 8, DU3외: 6 },
    wcdma:  { E3내: 36, E3외: 28, E3R내: 22, E3R외: 16, E3내T: 12, E3외T: 8, "ENB-ELG": 6, FX: 4, IPNB3S: 3 },
    lora:   { LRGW: 48, LRGWIB: 24, LRGWREV: 14 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"군산시", siteCount:190,
    fiveG:  { CDU10: 20, CDU20_EL: 16, CDU20_NK: 12, DUH20: 10, DUH10: 8, CDU10외: 5 },
    lte:    { DU20내: 58, DU20외: 46, ENB내: 36, ENB외: 28, DU25: 22, DU30내: 18, DU20내WL: 14, DU35: 10, DU3외: 8 },
    wcdma:  { E3내: 38, E3외: 30, E3R내: 24, E3R외: 18, E3내T: 14, E3외T: 10, "ENB-ELG": 8, FX: 5, IPNB3S: 4 },
    lora:   { LRGW: 52, LRGWIB: 26, LRGWREV: 16 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"정읍시", siteCount:154,
    fiveG:  { CDU10: 10, CDU20_EL: 8, CDU20_NK: 6, DUH20: 5, DUH10: 4 },
    lte:    { DU20내: 38, DU20외: 30, ENB내: 22, ENB외: 16, DU25: 12, DU30내: 10, DU20내WL: 8, DU35: 6 },
    wcdma:  { E3내: 28, E3외: 22, E3R내: 18, E3R외: 12, E3내T: 10, E3외T: 6, "ENB-ELG": 5, FX: 4 },
    lora:   { LRGW: 38, LRGWIB: 18, LRGWREV: 10 },
  },

  // ── 서부 / 제주Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"제주Access운용팀", state:"제주", city:"제주시", siteCount:370,
    fiveG:  { CDU10: 58, CDU20_EL: 48, CDU20_NK: 38, DUH20: 32, DUH10: 22, CDU10외: 14, DUH20외: 10, CDU20_NK외: 6 },
    lte:    { DU20내: 98, DU20외: 82, ENB내: 64, ENB외: 52, DU25: 42, DU30내: 34, DU20내WL: 28, DU35: 22, DU3외: 16, DU30내WL: 12 },
    wcdma:  { E3내: 62, E3외: 52, E3R내: 42, E3R외: 32, E3내T: 24, E3외T: 18, "ENB-ELG": 14, FX: 10, IPNB3S: 8, IPNB6S: 6, DBTS외: 4 },
    lora:   { LRGW: 88, LRGWIB: 44, LRGWREV: 28 },
  },
  {
    region:"west", team:"제주Access운용팀", state:"제주", city:"서귀포시", siteCount:254,
    fiveG:  { CDU10: 38, CDU20_EL: 32, CDU20_NK: 26, DUH20: 20, DUH10: 14, CDU10외: 10, DUH20외: 6 },
    lte:    { DU20내: 72, DU20외: 58, ENB내: 46, ENB외: 36, DU25: 28, DU30내: 22, DU20내WL: 18, DU35: 14, DU3외: 10, DU30내WL: 8 },
    wcdma:  { E3내: 44, E3외: 36, E3R내: 28, E3R외: 22, E3내T: 16, E3외T: 12, "ENB-ELG": 10, FX: 6, IPNB3S: 5, IPNB6S: 4 },
    lora:   { LRGW: 62, LRGWIB: 30, LRGWREV: 18 },
  },

  // ── 중부 / 충남Access운용팀 ──────────────────────────────────
  {
    region:"central", team:"충남Access운용팀", state:"대전", city:"서구", siteCount:151,
    fiveG:  { CDU10: 24, CDU20_EL: 20, CDU20_NK: 16, DUH20: 12, DUH10: 8, CDU10외: 5 },
    lte:    { DU20내: 48, DU20외: 38, ENB내: 30, ENB외: 24, DU25: 18, DU30내: 14, DU20내WL: 10, DU35: 8, DU3외: 6 },
    wcdma:  { E3내: 26, E3외: 20, E3R내: 16, E3R외: 12, E3내T: 10, E3외T: 6, "ENB-ELG": 5, FX: 4, IPNB3S: 3 },
    lora:   { LRGW: 42, LRGWIB: 20, LRGWREV: 12 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"대전", city:"유성구", siteCount:170,
    fiveG:  { CDU10: 28, CDU20_EL: 22, CDU20_NK: 18, DUH20: 14, DUH10: 10, CDU10외: 6 },
    lte:    { DU20내: 54, DU20외: 42, ENB내: 34, ENB외: 26, DU25: 20, DU30내: 16, DU20내WL: 12, DU35: 8, DU3외: 6 },
    wcdma:  { E3내: 28, E3외: 22, E3R내: 18, E3R외: 14, E3내T: 10, E3외T: 8, "ENB-ELG": 6, FX: 4, IPNB3S: 3 },
    lora:   { LRGW: 48, LRGWIB: 24, LRGWREV: 14 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"세종", city:"세종시", siteCount:222,
    fiveG:  { CDU10: 38, CDU20_EL: 32, CDU20_NK: 26, DUH20: 20, DUH10: 14, CDU10외: 8, DUH20외: 5 },
    lte:    { DU20내: 68, DU20외: 54, ENB내: 42, ENB외: 34, DU25: 26, DU30내: 20, DU20내WL: 16, DU35: 12, DU3외: 8, DU30내WL: 6 },
    wcdma:  { E3내: 36, E3외: 28, E3R내: 22, E3R외: 16, E3내T: 12, E3외T: 8, "ENB-ELG": 6, FX: 5, IPNB3S: 4, IPNB6S: 3 },
    lora:   { LRGW: 58, LRGWIB: 28, LRGWREV: 18 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"천안시 서북구", siteCount:150,
    fiveG:  { CDU10: 22, CDU20_EL: 18, CDU20_NK: 14, DUH20: 10, DUH10: 8, CDU10외: 5 },
    lte:    { DU20내: 48, DU20외: 38, ENB내: 30, ENB외: 22, DU25: 18, DU30내: 14, DU20내WL: 10, DU35: 8, DU3외: 6 },
    wcdma:  { E3내: 26, E3외: 20, E3R내: 16, E3R외: 12, E3내T: 8, E3외T: 6, "ENB-ELG": 5, FX: 4 },
    lora:   { LRGW: 38, LRGWIB: 18, LRGWREV: 10 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"천안시 동남구", siteCount:169,
    fiveG:  { CDU10: 18, CDU20_EL: 14, CDU20_NK: 12, DUH20: 8, DUH10: 6, CDU10외: 4 },
    lte:    { DU20내: 44, DU20외: 34, ENB내: 26, ENB외: 20, DU25: 16, DU30내: 12, DU20내WL: 8, DU35: 6 },
    wcdma:  { E3내: 24, E3외: 18, E3R내: 14, E3R외: 10, E3내T: 8, E3외T: 5, "ENB-ELG": 4, FX: 3 },
    lora:   { LRGW: 44, LRGWIB: 22, LRGWREV: 12 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"아산시", siteCount:211,
    fiveG:  { CDU10: 26, CDU20_EL: 20, CDU20_NK: 16, DUH20: 12, DUH10: 8, CDU10외: 6, DUH20외: 4 },
    lte:    { DU20내: 62, DU20외: 50, ENB내: 38, ENB외: 30, DU25: 24, DU30내: 18, DU20내WL: 14, DU35: 10, DU3외: 8, DU30내WL: 5 },
    wcdma:  { E3내: 32, E3외: 26, E3R내: 20, E3R외: 14, E3내T: 10, E3외T: 6, "ENB-ELG": 5, FX: 4, IPNB3S: 3 },
    lora:   { LRGW: 54, LRGWIB: 26, LRGWREV: 16 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"공주시", siteCount:237,
    fiveG:  { CDU10: 20, CDU20_EL: 16, CDU20_NK: 12, DUH20: 8, DUH10: 6, CDU10외: 4 },
    lte:    { DU20내: 42, DU20외: 34, ENB내: 26, ENB외: 20, DU25: 16, DU30내: 12, DU20내WL: 8, DU35: 6, DU3외: 4 },
    wcdma:  { E3내: 22, E3외: 18, E3R내: 14, E3R외: 10, E3내T: 8, E3외T: 5, "ENB-ELG": 4, FX: 3 },
    lora:   { LRGW: 46, LRGWIB: 22, LRGWREV: 14 },
  },

  // ── 중부 / 충북Access운용팀 ──────────────────────────────────
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"청주시 흥덕구", siteCount:131,
    fiveG:  { CDU10: 20, CDU20_EL: 16, CDU20_NK: 12, DUH20: 10, DUH10: 6, CDU10외: 4 },
    lte:    { DU20내: 42, DU20외: 34, ENB내: 26, ENB외: 20, DU25: 16, DU30내: 12, DU20내WL: 8, DU35: 6 },
    wcdma:  { E3내: 24, E3외: 18, E3R내: 14, E3R외: 10, E3내T: 8, E3외T: 5, "ENB-ELG": 4, FX: 3 },
    lora:   { LRGW: 34, LRGWIB: 16, LRGWREV: 10 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"청주시 상당구", siteCount:117,
    fiveG:  { CDU10: 16, CDU20_EL: 12, CDU20_NK: 10, DUH20: 8, DUH10: 5, CDU10외: 3 },
    lte:    { DU20내: 36, DU20외: 28, ENB내: 22, ENB외: 16, DU25: 12, DU30내: 10, DU20내WL: 6, DU35: 5 },
    wcdma:  { E3내: 20, E3외: 16, E3R내: 12, E3R외: 8, E3내T: 6, E3외T: 4, "ENB-ELG": 3, FX: 3 },
    lora:   { LRGW: 28, LRGWIB: 14, LRGWREV: 8 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"청주시 서원구", siteCount:109,
    fiveG:  { CDU10: 14, CDU20_EL: 12, CDU20_NK: 8, DUH20: 6, DUH10: 5, CDU10외: 3 },
    lte:    { DU20내: 32, DU20외: 26, ENB내: 20, ENB외: 14, DU25: 10, DU30내: 8, DU20내WL: 6, DU35: 4 },
    wcdma:  { E3내: 18, E3외: 14, E3R내: 10, E3R외: 8, E3내T: 5, E3외T: 4, "ENB-ELG": 3, FX: 2 },
    lora:   { LRGW: 24, LRGWIB: 12, LRGWREV: 6 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"충주시", siteCount:217,
    fiveG:  { CDU10: 10, CDU20_EL: 8, CDU20_NK: 6, DUH20: 5, DUH10: 4, CDU10외: 3 },
    lte:    { DU20내: 48, DU20외: 38, ENB내: 28, ENB외: 22, DU25: 16, DU30내: 12, DU20내WL: 8, DU35: 6, DU3외: 4 },
    wcdma:  { E3내: 36, E3외: 28, E3R내: 22, E3R외: 16, E3내T: 12, E3외T: 8, "ENB-ELG": 6, FX: 4, IPNB3S: 3 },
    lora:   { LRGW: 58, LRGWIB: 28, LRGWREV: 18 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"제천시", siteCount:179,
    fiveG:  { CDU10: 8, CDU20_EL: 6, CDU20_NK: 5, DUH20: 4, DUH10: 3 },
    lte:    { DU20내: 38, DU20외: 30, ENB내: 22, ENB외: 16, DU25: 12, DU30내: 10, DU20내WL: 6, DU35: 5 },
    wcdma:  { E3내: 30, E3외: 24, E3R내: 18, E3R외: 12, E3내T: 10, E3외T: 6, "ENB-ELG": 5, FX: 4 },
    lora:   { LRGW: 48, LRGWIB: 22, LRGWREV: 14 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"음성군", siteCount:131,
    fiveG:  { CDU10: 5, CDU20_EL: 4, CDU20_NK: 3, DUH20: 2 },
    lte:    { DU20내: 34, DU20외: 26, ENB내: 18, ENB외: 14, DU25: 10, DU30내: 8, DU20내WL: 5, DU35: 4 },
    wcdma:  { E3내: 22, E3외: 18, E3R내: 14, E3R외: 10, E3내T: 8, E3외T: 4, "ENB-ELG": 4, FX: 3 },
    lora:   { LRGW: 38, LRGWIB: 18, LRGWREV: 10 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"괴산군", siteCount:123,
    fiveG:  { CDU10: 1 },
    lte:    { DU20내: 22, DU20외: 18, ENB내: 12, ENB외: 10, DU25: 8, DU30내: 6, DU20내WL: 4, DU35: 3 },
    wcdma:  { E3내: 18, E3외: 14, E3R내: 10, E3R외: 8, E3내T: 6, E3외T: 4, "ENB-ELG": 3, FX: 3 },
    lora:   { LRGW: 32, LRGWIB: 16, LRGWREV: 8 },
  },
];

// ════════════════════════════════════════════════════════════════
// 광중계기 Mock 데이터
// ════════════════════════════════════════════════════════════════

export const repeaterData: RepeaterRow[] = [

  // ── 서부 / 전남Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"광산구", siteCount:1074,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 182, "AAU20-3.5G-64T(EL)": 148,
      "AAU20-3.5G-32T(NK)": 124, "AAU20-3.5G-64T(NK)": 108,
      "AAU20-3.5G-32T(SS)": 96,  "AAU20-3.5G-64T(SS)": 82,
      "RO-GIRO-DS(8100)": 68,    "RO-GIRO-DS(8100)-SMHS(1C)": 54,
      "RO-GIRO-QS(8126)": 44,    "RO-GIRO-QS(8126)-SMHS(1C)": 36,
      "RO-GIRO-TS(81W0)": 28,    "RO-GIRO-TS(81W0)-SMHS(1C)": 22,
      "RO-PRU-3.5G-4T": 18,      "PRU10-3.5G-8T(NK)": 14,
    },
    lte: {
      "RO-IRO-T(8120)": 148,     "RO-IRO-T(8120)-SMHS(1C)": 124,
      "RO-IRO-DS(8100)": 108,    "RO-IRO-DS(8100)-SMHS(1C)": 92,
      "RO-IRO-Q(8126)": 78,      "RO-IRO-Q(8126)-SMHS(1C)": 64,
      "RO-MIBOS-T-L60": 52,      "RO-MIBOS-T-L60-QMHS": 44,
      "RO-MIBOS-D-L60": 38,      "RO-MIBOS-D-L60-QMHS": 30,
      "RRU(SS)": 24,             "RRU_L(SS)": 18,
    },
    wcdma: {
      "RHU-DUON5": 88,           "RHU-DUON5-OMHU": 72,
      "RHU-DUON20": 64,          "RHU-DUON20-OMHU": 52,
      "SF-DUO": 44,              "SF-DUO20": 36,
      "OR-DUO2": 28,             "OR-DUOR2": 22,
      "LR-DUO": 18,              "LR-DUO2": 14,
    },
    wibro: { "SF-TM023": 2 },
    idong: { "RHU-DUON5-OMHU": 2, "SF-DUO": 1 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"광주", city:"남구", siteCount:510,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 88,  "AAU20-3.5G-64T(EL)": 72,
      "AAU20-3.5G-32T(NK)": 60,  "AAU20-3.5G-64T(NK)": 48,
      "AAU20-3.5G-32T(SS)": 42,  "RO-GIRO-DS(8100)": 32,
      "RO-GIRO-DS(8100)-SMHS(1C)": 24, "RO-GIRO-QS(8126)": 18,
    },
    lte: {
      "RO-IRO-T(8120)": 72,      "RO-IRO-T(8120)-SMHS(1C)": 58,
      "RO-IRO-DS(8100)": 52,     "RO-IRO-Q(8126)": 44,
      "RO-MIBOS-T-L60": 36,      "RO-MIBOS-D-L60": 28,
      "RRU(SS)": 18,             "RRU_L(SS)": 14,
    },
    wcdma: {
      "RHU-DUON5": 44,           "RHU-DUON5-OMHU": 36,
      "RHU-DUON20": 28,          "SF-DUO": 22,
      "OR-DUO2": 16,             "LR-DUO": 12,
    },
    wibro: {},
    idong: { "SF-DUO": 1 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"순천시", siteCount:1180,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 148, "AAU20-3.5G-64T(EL)": 122,
      "AAU20-3.5G-32T(NK)": 104, "AAU20-3.5G-64T(NK)": 88,
      "AAU20-3.5G-32T(SS)": 78,  "AAU20-3.5G-64T(SS)": 64,
      "RO-GIRO-DS(8100)": 58,    "RO-GIRO-DS(8100)-SMHS(1C)": 48,
      "RO-GIRO-DS(81W0)-2T-SMHS(1C)": 38, "RO-GIRO-QS(8126)": 32,
      "RO-GIRO-QS(8126)-SMHS(1C)": 26, "RO-GIRO-TS(81W0)": 20,
      "RO-PRU-3.5G-4T": 16,      "PRU10-3.5G-8T(NK)": 12,
      "RO-GIRO-SS(8000)": 10,
    },
    lte: {
      "RO-IRO-T(8120)": 168,     "RO-IRO-T(8120)-SMHS(1C)": 142,
      "RO-IRO-DS(8100)": 124,    "RO-IRO-DS(8100)-SMHS(1C)": 108,
      "RO-IRO-Q(8126)": 92,      "RO-IRO-Q(8126)-SMHS(1C)": 78,
      "RO-MIBOS-T-L60": 64,      "RO-MIBOS-T-L60-QMHS": 52,
      "RO-MIBOS-AD-L60": 44,     "RO-MIBOS-AD-L60-SMHS(1C)": 36,
      "RRU(SS)": 28,             "RRU_L(SS)": 22,
      "RO-MIBOS-D-L60": 18,
    },
    wcdma: {
      "RHU-DUON5": 108,          "RHU-DUON5-OMHU": 88,
      "RHU-DUON20": 72,          "RHU-DUON20-OMHU": 58,
      "SF-DUO": 52,              "SF-DUO20": 44,
      "OR-DUO2": 36,             "OR-DUOR2": 28,
      "LR-DUO": 22,              "LR-DUO2": 16,
      "RO-MIBOS-T-L60": 12,
    },
    wibro: { "SF-TM023": 4, "SF-T": 3 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"west", team:"전남Access운용팀", state:"전남", city:"여수시", siteCount:1359,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 168, "AAU20-3.5G-64T(EL)": 142,
      "AAU20-3.5G-32T(NK)": 118, "AAU20-3.5G-64T(NK)": 98,
      "AAU20-3.5G-32T(SS)": 88,  "AAU20-3.5G-64T(SS)": 72,
      "RO-GIRO-DS(8100)": 62,    "RO-GIRO-DS(8100)-SMHS(1C)": 52,
      "RO-GIRO-QS(8126)": 42,    "RO-GIRO-QS(8126)-SMHS(1C)": 34,
      "RO-GIRO-TS(81W0)": 26,    "RO-PRU-3.5G-4T": 18,
    },
    lte: {
      "RO-IRO-T(8120)": 188,     "RO-IRO-T(8120)-SMHS(1C)": 158,
      "RO-IRO-DS(8100)": 138,    "RO-IRO-DS(8100)-SMHS(1C)": 118,
      "RO-IRO-Q(8126)": 102,     "RO-IRO-Q(8126)-SMHS(1C)": 86,
      "RO-MIBOS-T-L60": 72,      "RO-MIBOS-T-L60-QMHS": 58,
      "RO-MIBOS-AD-L60": 48,     "RRU(SS)": 32, "RRU_L(SS)": 24,
    },
    wcdma: {
      "RHU-DUON5": 118,          "RHU-DUON5-OMHU": 96,
      "RHU-DUON20": 82,          "RHU-DUON20-OMHU": 66,
      "SF-DUO": 58,              "SF-DUO20": 48,
      "OR-DUO2": 38,             "OR-DUOR2": 30,
      "LR-DUO": 24,              "LR-DUO2": 18,
    },
    wibro: { "SF-TM023": 2, "SF-T": 1 },
    idong: { "RHU-DUON20-OMHU": 2, "SF-DUO": 1 },
  },

  // ── 서부 / 전북Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"전주시 완산구", siteCount:754,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 122, "AAU20-3.5G-64T(EL)": 102,
      "AAU20-3.5G-32T(NK)": 88,  "AAU20-3.5G-64T(NK)": 72,
      "AAU20-3.5G-32T(SS)": 62,  "AAU20-3.5G-64T(SS)": 52,
      "RO-GIRO-DS(8100)": 44,    "RO-GIRO-DS(8100)-SMHS(1C)": 36,
      "RO-GIRO-QS(8126)": 28,    "RO-GIRO-QS(8126)-SMHS(1C)": 22,
      "RO-PRU-3.5G-4T": 14,
    },
    lte: {
      "RO-IRO-T(8120)": 138,     "RO-IRO-T(8120)-SMHS(1C)": 116,
      "RO-IRO-DS(8100)": 98,     "RO-IRO-DS(8100)-SMHS(1C)": 82,
      "RO-IRO-Q(8126)": 68,      "RO-IRO-Q(8126)-SMHS(1C)": 56,
      "RO-MIBOS-T-L60": 46,      "RO-MIBOS-T-L60-QMHS": 38,
      "RRU(SS)": 26,             "RRU_L(SS)": 18,
    },
    wcdma: {
      "RHU-DUON5": 82,           "RHU-DUON5-OMHU": 66,
      "RHU-DUON20": 54,          "RHU-DUON20-OMHU": 44,
      "SF-DUO": 36,              "SF-DUO20": 28,
      "OR-DUO2": 22,             "LR-DUO": 16,
    },
    wibro: {},
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"전주시 덕진구", siteCount:742,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 118, "AAU20-3.5G-64T(EL)": 98,
      "AAU20-3.5G-32T(NK)": 84,  "AAU20-3.5G-64T(NK)": 68,
      "AAU20-3.5G-32T(SS)": 58,  "AAU20-3.5G-64T(SS)": 48,
      "RO-GIRO-DS(8100)": 42,    "RO-GIRO-DS(8100)-SMHS(1C)": 34,
      "RO-GIRO-QS(8126)": 26,    "RO-PRU-3.5G-4T": 12,
    },
    lte: {
      "RO-IRO-T(8120)": 132,     "RO-IRO-T(8120)-SMHS(1C)": 112,
      "RO-IRO-DS(8100)": 94,     "RO-IRO-DS(8100)-SMHS(1C)": 78,
      "RO-IRO-Q(8126)": 64,      "RO-IRO-Q(8126)-SMHS(1C)": 52,
      "RO-MIBOS-T-L60": 44,      "RO-MIBOS-T-L60-QMHS": 36,
      "RRU(SS)": 22,             "RRU_L(SS)": 16,
    },
    wcdma: {
      "RHU-DUON5": 78,           "RHU-DUON5-OMHU": 62,
      "RHU-DUON20": 52,          "RHU-DUON20-OMHU": 42,
      "SF-DUO": 34,              "SF-DUO20": 26,
      "OR-DUO2": 20,             "LR-DUO": 14,
    },
    wibro: {},
    idong: { "RHU-DUON5-OMHU": 1 },
  },
  {
    region:"west", team:"전북Access운용팀", state:"전북", city:"익산시", siteCount:938,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 148, "AAU20-3.5G-64T(EL)": 122,
      "AAU20-3.5G-32T(NK)": 102, "AAU20-3.5G-64T(NK)": 84,
      "AAU20-3.5G-32T(SS)": 72,  "RO-GIRO-DS(8100)": 54,
      "RO-GIRO-DS(8100)-SMHS(1C)": 44, "RO-GIRO-QS(8126)": 34,
      "RO-PRU-3.5G-4T": 16,
    },
    lte: {
      "RO-IRO-T(8120)": 162,     "RO-IRO-T(8120)-SMHS(1C)": 136,
      "RO-IRO-DS(8100)": 116,    "RO-IRO-DS(8100)-SMHS(1C)": 98,
      "RO-IRO-Q(8126)": 82,      "RO-IRO-Q(8126)-SMHS(1C)": 68,
      "RO-MIBOS-T-L60": 54,      "RO-MIBOS-T-L60-QMHS": 44,
      "RRU(SS)": 30,             "RRU_L(SS)": 22,
    },
    wcdma: {
      "RHU-DUON5": 96,           "RHU-DUON5-OMHU": 78,
      "RHU-DUON20": 64,          "RHU-DUON20-OMHU": 52,
      "SF-DUO": 44,              "SF-DUO20": 34,
      "OR-DUO2": 26,             "LR-DUO": 18,
    },
    wibro: {},
    idong: { "RHU-DUON20-OMHU": 1, "SF-DUO": 1 },
  },

  // ── 서부 / 제주Access운용팀 ──────────────────────────────────
  {
    region:"west", team:"제주Access운용팀", state:"제주", city:"제주시", siteCount:2880,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 348, "AAU20-3.5G-64T(EL)": 298,
      "AAU20-3.5G-32T(NK)": 262, "AAU20-3.5G-64T(NK)": 224,
      "AAU20-3.5G-32T(SS)": 192, "AAU20-3.5G-64T(SS)": 162,
      "RO-GIRO-DS(8100)": 138,   "RO-GIRO-DS(8100)-SMHS(1C)": 116,
      "RO-GIRO-DS(81W0)-2T-SMHS(1C)": 94, "RO-GIRO-QS(8126)": 78,
      "RO-GIRO-QS(8126)-SMHS(1C)": 64, "RO-GIRO-TS(81W0)": 52,
      "RO-GIRO-TS(81W0)-SMHS(1C)": 42, "RO-PRU-3.5G-4T": 34,
      "PRU10-3.5G-8T(NK)": 26,   "RO-GIRO-SS(8000)": 18,
    },
    lte: {
      "RO-IRO-T(8120)": 388,     "RO-IRO-T(8120)-SMHS(1C)": 328,
      "RO-IRO-DS(8100)": 278,    "RO-IRO-DS(8100)-SMHS(1C)": 234,
      "RO-IRO-Q(8126)": 198,     "RO-IRO-Q(8126)-SMHS(1C)": 166,
      "RO-MIBOS-T-L60": 138,     "RO-MIBOS-T-L60-QMHS": 114,
      "RO-MIBOS-AD-L60": 94,     "RO-MIBOS-AD-L60-SMHS(1C)": 78,
      "RRU(SS)": 62,             "RRU_L(SS)": 48,
      "RO-MIBOS-D-L60": 38,      "RO-MIBOS-D-L60-QMHS": 28,
    },
    wcdma: {
      "RHU-DUON5": 248,          "RHU-DUON5-OMHU": 202,
      "RHU-DUON20": 168,         "RHU-DUON20-OMHU": 138,
      "SF-DUO": 118,             "SF-DUO20": 96,
      "OR-DUO2": 78,             "OR-DUOR2": 62,
      "LR-DUO": 48,              "LR-DUO2": 38,
      "RO-MIBOS-T-L60": 28,      "RO-W-D60": 18,
    },
    wibro: { "SF-TM023": 10, "SF-T": 8, "SF-WIM23": 4 },
    idong: { "RHU-DUON20-OMHU": 3, "SF-DUO": 2, "RO-DUO-AA2020-CMHU": 1 },
  },
  {
    region:"west", team:"제주Access운용팀", state:"제주", city:"서귀포시", siteCount:1822,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 228, "AAU20-3.5G-64T(EL)": 192,
      "AAU20-3.5G-32T(NK)": 162, "AAU20-3.5G-64T(NK)": 138,
      "AAU20-3.5G-32T(SS)": 118, "AAU20-3.5G-64T(SS)": 98,
      "RO-GIRO-DS(8100)": 84,    "RO-GIRO-DS(8100)-SMHS(1C)": 68,
      "RO-GIRO-QS(8126)": 54,    "RO-GIRO-QS(8126)-SMHS(1C)": 44,
      "RO-GIRO-TS(81W0)": 34,    "RO-PRU-3.5G-4T": 22,
    },
    lte: {
      "RO-IRO-T(8120)": 248,     "RO-IRO-T(8120)-SMHS(1C)": 208,
      "RO-IRO-DS(8100)": 178,    "RO-IRO-DS(8100)-SMHS(1C)": 148,
      "RO-IRO-Q(8126)": 124,     "RO-IRO-Q(8126)-SMHS(1C)": 104,
      "RO-MIBOS-T-L60": 86,      "RO-MIBOS-T-L60-QMHS": 72,
      "RO-MIBOS-AD-L60": 58,     "RRU(SS)": 44, "RRU_L(SS)": 32,
    },
    wcdma: {
      "RHU-DUON5": 158,          "RHU-DUON5-OMHU": 128,
      "RHU-DUON20": 108,         "RHU-DUON20-OMHU": 88,
      "SF-DUO": 72,              "SF-DUO20": 58,
      "OR-DUO2": 46,             "OR-DUOR2": 36,
      "LR-DUO": 28,              "LR-DUO2": 22,
    },
    wibro: { "SF-TM023": 5, "SF-T": 4 },
    idong: { "RHU-DUON20-OMHU": 2, "SF-DUO": 1 },
  },

  // ── 중부 / 충남Access운용팀 ──────────────────────────────────
  {
    region:"central", team:"충남Access운용팀", state:"대전", city:"서구", siteCount:834,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 128, "AAU20-3.5G-64T(EL)": 108,
      "AAU20-3.5G-32T(NK)": 92,  "AAU20-3.5G-64T(NK)": 76,
      "AAU20-3.5G-32T(SS)": 64,  "AAU20-3.5G-64T(SS)": 52,
      "RO-GIRO-DS(8100)": 44,    "RO-GIRO-DS(8100)-SMHS(1C)": 36,
      "RO-GIRO-QS(8126)": 28,    "RO-PRU-3.5G-4T": 16,
    },
    lte: {
      "RO-IRO-T(8120)": 148,     "RO-IRO-T(8120)-SMHS(1C)": 124,
      "RO-IRO-DS(8100)": 106,    "RO-IRO-DS(8100)-SMHS(1C)": 88,
      "RO-IRO-Q(8126)": 74,      "RO-IRO-Q(8126)-SMHS(1C)": 62,
      "RO-MIBOS-T-L60": 52,      "RO-MIBOS-T-L60-QMHS": 42,
      "RRU(SS)": 32,             "RRU_L(SS)": 22,
    },
    wcdma: {
      "RHU-DUON5": 88,           "RHU-DUON5-OMHU": 72,
      "RHU-DUON20": 58,          "RHU-DUON20-OMHU": 46,
      "SF-DUO": 38,              "SF-DUO20": 30,
      "OR-DUO2": 24,             "LR-DUO": 16,
    },
    wibro: { "SF-TM023": 3, "SF-T": 3 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"대전", city:"유성구", siteCount:872,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 138, "AAU20-3.5G-64T(EL)": 116,
      "AAU20-3.5G-32T(NK)": 98,  "AAU20-3.5G-64T(NK)": 82,
      "AAU20-3.5G-32T(SS)": 68,  "AAU20-3.5G-64T(SS)": 56,
      "RO-GIRO-DS(8100)": 46,    "RO-GIRO-DS(8100)-SMHS(1C)": 38,
      "RO-GIRO-QS(8126)": 30,    "RO-PRU-3.5G-4T": 18,
    },
    lte: {
      "RO-IRO-T(8120)": 158,     "RO-IRO-T(8120)-SMHS(1C)": 132,
      "RO-IRO-DS(8100)": 114,    "RO-IRO-DS(8100)-SMHS(1C)": 96,
      "RO-IRO-Q(8126)": 80,      "RO-IRO-Q(8126)-SMHS(1C)": 66,
      "RO-MIBOS-T-L60": 54,      "RO-MIBOS-T-L60-QMHS": 44,
      "RRU(SS)": 34,             "RRU_L(SS)": 24,
    },
    wcdma: {
      "RHU-DUON5": 92,           "RHU-DUON5-OMHU": 76,
      "RHU-DUON20": 62,          "RHU-DUON20-OMHU": 50,
      "SF-DUO": 40,              "SF-DUO20": 32,
      "OR-DUO2": 26,             "LR-DUO": 18,
    },
    wibro: { "SF-TM023": 2, "SF-T": 1 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"세종", city:"세종시", siteCount:1517,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 228, "AAU20-3.5G-64T(EL)": 192,
      "AAU20-3.5G-32T(NK)": 162, "AAU20-3.5G-64T(NK)": 136,
      "AAU20-3.5G-32T(SS)": 114, "AAU20-3.5G-64T(SS)": 94,
      "RO-GIRO-DS(8100)": 78,    "RO-GIRO-DS(8100)-SMHS(1C)": 64,
      "RO-GIRO-DS(81W0)-2T-SMHS(1C)": 52, "RO-GIRO-QS(8126)": 42,
      "RO-GIRO-QS(8126)-SMHS(1C)": 34, "RO-PRU-3.5G-4T": 24,
    },
    lte: {
      "RO-IRO-T(8120)": 248,     "RO-IRO-T(8120)-SMHS(1C)": 208,
      "RO-IRO-DS(8100)": 178,    "RO-IRO-DS(8100)-SMHS(1C)": 148,
      "RO-IRO-Q(8126)": 124,     "RO-IRO-Q(8126)-SMHS(1C)": 104,
      "RO-MIBOS-T-L60": 86,      "RO-MIBOS-T-L60-QMHS": 72,
      "RO-MIBOS-AD-L60": 58,     "RRU(SS)": 44, "RRU_L(SS)": 32,
    },
    wcdma: {
      "RHU-DUON5": 148,          "RHU-DUON5-OMHU": 122,
      "RHU-DUON20": 102,         "RHU-DUON20-OMHU": 82,
      "SF-DUO": 68,              "SF-DUO20": 54,
      "OR-DUO2": 44,             "OR-DUOR2": 34,
      "LR-DUO": 26,              "LR-DUO2": 18,
    },
    wibro: { "SF-TM023": 4, "SF-T": 3 },
    idong: { "RHU-DUON20-OMHU": 2, "SF-DUO": 2, "RO-DUO-AA2020-CMHU": 1 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"천안시 동남구", siteCount:1048,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 158, "AAU20-3.5G-64T(EL)": 132,
      "AAU20-3.5G-32T(NK)": 112, "AAU20-3.5G-64T(NK)": 94,
      "AAU20-3.5G-32T(SS)": 78,  "RO-GIRO-DS(8100)": 62,
      "RO-GIRO-DS(8100)-SMHS(1C)": 52, "RO-GIRO-QS(8126)": 40,
      "RO-PRU-3.5G-4T": 20,
    },
    lte: {
      "RO-IRO-T(8120)": 178,     "RO-IRO-T(8120)-SMHS(1C)": 148,
      "RO-IRO-DS(8100)": 128,    "RO-IRO-DS(8100)-SMHS(1C)": 108,
      "RO-IRO-Q(8126)": 90,      "RO-IRO-Q(8126)-SMHS(1C)": 76,
      "RO-MIBOS-T-L60": 62,      "RO-MIBOS-T-L60-QMHS": 52,
      "RRU(SS)": 38,             "RRU_L(SS)": 28,
    },
    wcdma: {
      "RHU-DUON5": 108,          "RHU-DUON5-OMHU": 88,
      "RHU-DUON20": 72,          "RHU-DUON20-OMHU": 58,
      "SF-DUO": 48,              "SF-DUO20": 38,
      "OR-DUO2": 30,             "LR-DUO": 20,
    },
    wibro: { "SF-TM023": 2, "SF-T": 1 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"central", team:"충남Access운용팀", state:"충남", city:"아산시", siteCount:1317,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 198, "AAU20-3.5G-64T(EL)": 166,
      "AAU20-3.5G-32T(NK)": 140, "AAU20-3.5G-64T(NK)": 118,
      "AAU20-3.5G-32T(SS)": 98,  "AAU20-3.5G-64T(SS)": 82,
      "RO-GIRO-DS(8100)": 68,    "RO-GIRO-DS(8100)-SMHS(1C)": 56,
      "RO-GIRO-QS(8126)": 46,    "RO-PRU-3.5G-4T": 24,
    },
    lte: {
      "RO-IRO-T(8120)": 218,     "RO-IRO-T(8120)-SMHS(1C)": 182,
      "RO-IRO-DS(8100)": 158,    "RO-IRO-DS(8100)-SMHS(1C)": 132,
      "RO-IRO-Q(8126)": 112,     "RO-IRO-Q(8126)-SMHS(1C)": 94,
      "RO-MIBOS-T-L60": 78,      "RO-MIBOS-T-L60-QMHS": 64,
      "RO-MIBOS-AD-L60": 52,     "RRU(SS)": 40, "RRU_L(SS)": 28,
    },
    wcdma: {
      "RHU-DUON5": 138,          "RHU-DUON5-OMHU": 112,
      "RHU-DUON20": 94,          "RHU-DUON20-OMHU": 76,
      "SF-DUO": 62,              "SF-DUO20": 50,
      "OR-DUO2": 40,             "OR-DUOR2": 30,
      "LR-DUO": 22,
    },
    wibro: { "SF-TM023": 4, "SF-T": 3 },
    idong: { "RHU-DUON20-OMHU": 2, "SF-DUO": 2 },
  },

  // ── 중부 / 충북Access운용팀 ──────────────────────────────────
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"청주시 흥덕구", siteCount:856,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 132, "AAU20-3.5G-64T(EL)": 112,
      "AAU20-3.5G-32T(NK)": 94,  "AAU20-3.5G-64T(NK)": 78,
      "AAU20-3.5G-32T(SS)": 64,  "AAU20-3.5G-64T(SS)": 52,
      "RO-GIRO-DS(8100)": 44,    "RO-GIRO-DS(8100)-SMHS(1C)": 36,
      "RO-GIRO-QS(8126)": 28,    "RO-PRU-3.5G-4T": 14,
    },
    lte: {
      "RO-IRO-T(8120)": 152,     "RO-IRO-T(8120)-SMHS(1C)": 128,
      "RO-IRO-DS(8100)": 108,    "RO-IRO-DS(8100)-SMHS(1C)": 90,
      "RO-IRO-Q(8126)": 76,      "RO-IRO-Q(8126)-SMHS(1C)": 62,
      "RO-MIBOS-T-L60": 52,      "RO-MIBOS-T-L60-QMHS": 42,
      "RRU(SS)": 32,             "RRU_L(SS)": 22,
    },
    wcdma: {
      "RHU-DUON5": 92,           "RHU-DUON5-OMHU": 74,
      "RHU-DUON20": 62,          "RHU-DUON20-OMHU": 50,
      "SF-DUO": 40,              "SF-DUO20": 32,
      "OR-DUO2": 24,             "LR-DUO": 16,
    },
    wibro: { "SF-TM023": 4, "SF-T": 4 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"충주시", siteCount:1312,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 118, "AAU20-3.5G-64T(EL)": 98,
      "AAU20-3.5G-32T(NK)": 82,  "AAU20-3.5G-64T(NK)": 68,
      "AAU20-3.5G-32T(SS)": 56,  "RO-GIRO-DS(8100)": 44,
      "RO-GIRO-DS(8100)-SMHS(1C)": 36, "RO-GIRO-QS(8126)": 26,
    },
    lte: {
      "RO-IRO-T(8120)": 138,     "RO-IRO-T(8120)-SMHS(1C)": 116,
      "RO-IRO-DS(8100)": 98,     "RO-IRO-DS(8100)-SMHS(1C)": 82,
      "RO-IRO-Q(8126)": 68,      "RO-MIBOS-T-L60": 54,
      "RO-MIBOS-T-L60-QMHS": 44, "RRU(SS)": 28, "RRU_L(SS)": 18,
    },
    wcdma: {
      "RHU-DUON5": 108,          "RHU-DUON5-OMHU": 88,
      "RHU-DUON20": 72,          "RHU-DUON20-OMHU": 58,
      "SF-DUO": 48,              "SF-DUO20": 38,
      "OR-DUO2": 28,             "LR-DUO": 20,
    },
    wibro: { "SF-TM023": 5, "SF-T": 4 },
    idong: { "RHU-DUON20-OMHU": 2, "SF-DUO": 2 },
  },
  {
    region:"central", team:"충북Access운용팀", state:"충북", city:"제천시", siteCount:896,
    fiveG: {
      "AAU20-3.5G-32T(EL)": 98,  "AAU20-3.5G-64T(EL)": 82,
      "AAU20-3.5G-32T(NK)": 68,  "AAU20-3.5G-64T(NK)": 56,
      "AAU20-3.5G-32T(SS)": 46,  "RO-GIRO-DS(8100)": 36,
      "RO-GIRO-DS(8100)-SMHS(1C)": 28, "RO-GIRO-QS(8126)": 20,
    },
    lte: {
      "RO-IRO-T(8120)": 118,     "RO-IRO-T(8120)-SMHS(1C)": 98,
      "RO-IRO-DS(8100)": 84,     "RO-IRO-DS(8100)-SMHS(1C)": 70,
      "RO-IRO-Q(8126)": 58,      "RO-MIBOS-T-L60": 46,
      "RO-MIBOS-T-L60-QMHS": 38, "RRU(SS)": 24, "RRU_L(SS)": 16,
    },
    wcdma: {
      "RHU-DUON5": 88,           "RHU-DUON5-OMHU": 72,
      "RHU-DUON20": 58,          "RHU-DUON20-OMHU": 46,
      "SF-DUO": 38,              "SF-DUO20": 30,
      "OR-DUO2": 22,             "LR-DUO": 14,
    },
    wibro: { "SF-TM023": 3, "SF-T": 2 },
    idong: { "RHU-DUON5-OMHU": 1, "SF-DUO": 1 },
  },
];

// ════════════════════════════════════════════════════════════════
// 집계 헬퍼 함수
// ════════════════════════════════════════════════════════════════

/** Record<string,number> 합산 */
function sumRecord(r: Partial<Record<string, number>>): number {
  return Object.values(r).reduce((a, v) => a + (v ?? 0), 0);
}

// ── 기지국 ───────────────────────────────────────────────────

export function filterGijiguk(
  hq: HqDivision,
  team: AccessTeam | null = null
): GijigukRow[] {
  return gijigukData.filter(
    (r) => r.region === hq && (team === null || r.team === team)
  );
}

export interface GijigukCityStats {
  state: string; city: string; team: AccessTeam;
  siteCount: number;
  fiveGTotal: number; lteTotal: number;
  wcdmaTotal: number; loraTotal: number;
}

export function getGijigukCityStats(
  hq: HqDivision,
  team: AccessTeam | null = null
): GijigukCityStats[] {
  return filterGijiguk(hq, team).map((r) => ({
    state: r.state, city: r.city, team: r.team,
    siteCount:  r.siteCount,
    fiveGTotal: sumRecord(r.fiveG),
    lteTotal:   sumRecord(r.lte),
    wcdmaTotal: sumRecord(r.wcdma),
    loraTotal:  sumRecord(r.lora),
  }));
}

export interface GijigukKpi {
  totalSite: number; fiveG: number; lte: number;
  wcdma: number; lora: number; rowCount: number;
}

export function getGijigukKpi(
  hq: HqDivision,
  team: AccessTeam | null = null
): GijigukKpi {
  const rows = filterGijiguk(hq, team);
  return {
    totalSite: rows.reduce((a, r) => a + r.siteCount,       0),
    fiveG:     rows.reduce((a, r) => a + sumRecord(r.fiveG), 0),
    lte:       rows.reduce((a, r) => a + sumRecord(r.lte),   0),
    wcdma:     rows.reduce((a, r) => a + sumRecord(r.wcdma), 0),
    lora:      rows.reduce((a, r) => a + sumRecord(r.lora),  0),
    rowCount:  rows.length,
  };
}

// ── 광중계기 ─────────────────────────────────────────────────

export function filterRepeater(
  hq: HqDivision,
  team: AccessTeam | null = null
): RepeaterRow[] {
  return repeaterData.filter(
    (r) => r.region === hq && (team === null || r.team === team)
  );
}

export interface RepeaterCityStats {
  state: string; city: string; team: AccessTeam;
  siteCount: number;
  fiveGTotal: number; lteTotal: number; wcdmaTotal: number;
  wibroTotal: number; idongTotal: number;
}

export function getRepeaterCityStats(
  hq: HqDivision,
  team: AccessTeam | null = null
): RepeaterCityStats[] {
  return filterRepeater(hq, team).map((r) => ({
    state: r.state, city: r.city, team: r.team,
    siteCount:  r.siteCount,
    fiveGTotal: sumRecord(r.fiveG),
    lteTotal:   sumRecord(r.lte),
    wcdmaTotal: sumRecord(r.wcdma),
    wibroTotal: sumRecord(r.wibro),
    idongTotal: sumRecord(r.idong),
  }));
}

export interface RepeaterKpi {
  totalSite: number; fiveG: number; lte: number;
  wcdma: number; wibro: number; idong: number; rowCount: number;
}

export function getRepeaterKpi(
  hq: HqDivision,
  team: AccessTeam | null = null
): RepeaterKpi {
  const rows = filterRepeater(hq, team);
  return {
    totalSite: rows.reduce((a, r) => a + r.siteCount,        0),
    fiveG:     rows.reduce((a, r) => a + sumRecord(r.fiveG),  0),
    lte:       rows.reduce((a, r) => a + sumRecord(r.lte),    0),
    wcdma:     rows.reduce((a, r) => a + sumRecord(r.wcdma),  0),
    wibro:     rows.reduce((a, r) => a + sumRecord(r.wibro),  0),
    idong:     rows.reduce((a, r) => a + sumRecord(r.idong),  0),
    rowCount:  rows.length,
  };
}

