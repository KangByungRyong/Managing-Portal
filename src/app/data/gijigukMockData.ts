// src/app/data/gijigukMockData.ts

// ─── 타입 정의 ────────────────────────────────────────────────

export type HqDivision = "central" | "west";

// 담당 조직 (팀)
export type AccessTeam =
  | "충남Access운용팀"
  | "충북Access운용팀"
  | "전남Access운용팀"
  | "전북Access운용팀"
  | "제주Access운용팀";

// 본부별 담당 팀 매핑
export const HQ_TEAMS: Record<HqDivision, AccessTeam[]> = {
  central: ["충남Access운용팀", "충북Access운용팀"],
  west: [
    "전남Access운용팀",
    "전북Access운용팀",
    "제주Access운용팀",
  ],
};

// 팀별 행정구역 매핑
export const TEAM_REGION: Record<AccessTeam, string> = {
  충남Access운용팀: "충남",
  충북Access운용팀: "충북",
  전남Access운용팀: "전남",
  전북Access운용팀: "전북",
  제주Access운용팀: "제주",
};

// 장비 상태
export type EquipStatus = "정상" | "점검필요" | "긴급";

// Site 단위 기지국 인터페이스
export interface GijigukSite {
  id: string; // 사이트 ID (예: "CN-001")
  name: string; // 사이트명
  hq: HqDivision; // 본부 구분
  team: AccessTeam; // 담당 조직
  adminRegion: string; // 행정구역 (시/군/구)
  address: string; // 주소
  lat: number; // 위도
  lng: number; // 경도
  // 장비 구성 (보유 여부 + 상태)
  equip: {
    fiveG: {
      installed: boolean;
      count: number;
      status: EquipStatus;
    };
    lte: {
      installed: boolean;
      count: number;
      status: EquipStatus;
    };
    threeG: {
      installed: boolean;
      count: number;
      status: EquipStatus;
    };
    lora: {
      installed: boolean;
      count: number;
      status: EquipStatus;
    };
  };
  totalEquip: number; // 전체 장비 수
  siteStatus: EquipStatus; // 사이트 대표 상태 (가장 심각한 상태 기준)
  uptime: number; // 가동률 (%)
  lastChecked: string; // 최종 점검일
}

// KPI 집계 인터페이스
export interface GijigukKpi {
  totalSites: number;
  fiveG: {
    sites: number;
    equip: number;
    ratio: number;
    change: number;
  };
  lte: {
    sites: number;
    equip: number;
    ratio: number;
    change: number;
  };
  threeG: {
    sites: number;
    equip: number;
    ratio: number;
    change: number;
  };
  lora: {
    sites: number;
    equip: number;
    ratio: number;
    change: number;
  };
}

// 팀별 집계 인터페이스
export interface TeamSummary {
  team: AccessTeam;
  adminRegion: string;
  totalSites: number;
  fiveG: number;
  lte: number;
  threeG: number;
  lora: number;
  normal: number;
  needCheck: number;
  urgent: number;
  avgUptime: number;
}

// 지도 마커 인터페이스
export interface GijigukMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: EquipStatus;
  team: AccessTeam;
  region: string;
}

// ─── Mock 데이터 ──────────────────────────────────────────────

export const gijigukSites: GijigukSite[] = [
  // ══════════════════════════════════════════════
  // 중부 본부 — 충남Access운용팀
  // ══════════════════════════════════════════════
  {
    id: "CN-001",
    name: "천안북부사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "천안시",
    address: "충남 천안시 서북구 두정동",
    lat: 36.849,
    lng: 127.147,
    equip: {
      fiveG: { installed: true, count: 3, status: "정상" },
      lte: { installed: true, count: 6, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: false, count: 0, status: "정상" },
    },
    totalEquip: 11,
    siteStatus: "정상",
    uptime: 99.2,
    lastChecked: "2026-05-01",
  },
  {
    id: "CN-002",
    name: "천안남부사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "천안시",
    address: "충남 천안시 동남구 신방동",
    lat: 36.798,
    lng: 127.139,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 5, status: "점검필요" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 10,
    siteStatus: "점검필요",
    uptime: 97.4,
    lastChecked: "2026-04-28",
  },
  {
    id: "CN-003",
    name: "아산사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "아산시",
    address: "충남 아산시 온양동",
    lat: 36.7898,
    lng: 127.0018,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: false, count: 0, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "정상",
    uptime: 98.8,
    lastChecked: "2026-05-02",
  },
  {
    id: "CN-004",
    name: "당진사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "당진시",
    address: "충남 당진시 당진동",
    lat: 36.8927,
    lng: 126.6476,
    equip: {
      fiveG: { installed: true, count: 1, status: "긴급" },
      lte: { installed: true, count: 4, status: "점검필요" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: false, count: 0, status: "정상" },
    },
    totalEquip: 7,
    siteStatus: "긴급",
    uptime: 91.3,
    lastChecked: "2026-04-25",
  },
  {
    id: "CN-005",
    name: "공주사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "공주시",
    address: "충남 공주시 반포면",
    lat: 36.4465,
    lng: 127.1195,
    equip: {
      fiveG: { installed: false, count: 0, status: "정상" },
      lte: { installed: true, count: 5, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "정상",
    uptime: 98.1,
    lastChecked: "2026-05-03",
  },
  {
    id: "CN-006",
    name: "서산사이트",
    hq: "central",
    team: "충남Access운용팀",
    adminRegion: "서산시",
    address: "충남 서산시 동문동",
    lat: 36.7848,
    lng: 126.4503,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: true, count: 1, status: "점검필요" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 9,
    siteStatus: "점검필요",
    uptime: 96.5,
    lastChecked: "2026-04-30",
  },

  // ══════════════════════════════════════════════
  // 중부 본부 — 충북Access운용팀
  // ══════════════════════════════════════════════
  {
    id: "CB-001",
    name: "청주중앙사이트",
    hq: "central",
    team: "충북Access운용팀",
    adminRegion: "청주시",
    address: "충북 청주시 상당구 북문로",
    lat: 36.6424,
    lng: 127.489,
    equip: {
      fiveG: { installed: true, count: 4, status: "정상" },
      lte: { installed: true, count: 8, status: "정상" },
      threeG: { installed: true, count: 3, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 17,
    siteStatus: "정상",
    uptime: 99.5,
    lastChecked: "2026-05-04",
  },
  {
    id: "CB-002",
    name: "청주서부사이트",
    hq: "central",
    team: "충북Access운용팀",
    adminRegion: "청주시",
    address: "충북 청주시 서원구 사직동",
    lat: 36.62,
    lng: 127.45,
    equip: {
      fiveG: { installed: true, count: 3, status: "정상" },
      lte: { installed: true, count: 6, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: false, count: 0, status: "정상" },
    },
    totalEquip: 11,
    siteStatus: "정상",
    uptime: 99.1,
    lastChecked: "2026-05-04",
  },
  {
    id: "CB-003",
    name: "충주사이트",
    hq: "central",
    team: "충북Access운용팀",
    adminRegion: "충주시",
    address: "충북 충주시 성내동",
    lat: 36.991,
    lng: 127.926,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 5, status: "점검필요" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 10,
    siteStatus: "점검필요",
    uptime: 96.8,
    lastChecked: "2026-04-29",
  },
  {
    id: "CB-004",
    name: "제천사이트",
    hq: "central",
    team: "충북Access운용팀",
    adminRegion: "제천시",
    address: "충북 제천시 의림동",
    lat: 37.1326,
    lng: 128.1907,
    equip: {
      fiveG: { installed: false, count: 0, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "정상",
    uptime: 97.9,
    lastChecked: "2026-05-01",
  },
  {
    id: "CB-005",
    name: "음성사이트",
    hq: "central",
    team: "충북Access운용팀",
    adminRegion: "음성군",
    address: "충북 음성군 음성읍",
    lat: 36.9396,
    lng: 127.45,
    equip: {
      fiveG: { installed: true, count: 1, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: true, count: 1, status: "정상" },
      lora: { installed: true, count: 3, status: "정상" },
    },
    totalEquip: 9,
    siteStatus: "정상",
    uptime: 98.6,
    lastChecked: "2026-05-02",
  },

  // ══════════════════════════════════════════════
  // 서부 본부 — 전남Access운용팀
  // ══════════════════════════════════════════════
  {
    id: "JN-001",
    name: "광주중앙사이트",
    hq: "west",
    team: "전남Access운용팀",
    adminRegion: "광주시",
    address: "광주광역시 동구 금남로",
    lat: 35.1595,
    lng: 126.8526,
    equip: {
      fiveG: { installed: true, count: 4, status: "정상" },
      lte: { installed: true, count: 8, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 15,
    siteStatus: "정상",
    uptime: 99.3,
    lastChecked: "2026-05-04",
  },
  {
    id: "JN-002",
    name: "목포사이트",
    hq: "west",
    team: "전남Access운용팀",
    adminRegion: "목포시",
    address: "전남 목포시 원산동",
    lat: 34.8118,
    lng: 126.3922,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 5, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 11,
    siteStatus: "정상",
    uptime: 98.5,
    lastChecked: "2026-05-03",
  },
  {
    id: "JN-003",
    name: "여수사이트",
    hq: "west",
    team: "전남Access운용팀",
    adminRegion: "여수시",
    address: "전남 여수시 학동",
    lat: 34.7604,
    lng: 127.6622,
    equip: {
      fiveG: { installed: true, count: 3, status: "점검필요" },
      lte: { installed: true, count: 6, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: false, count: 0, status: "정상" },
    },
    totalEquip: 11,
    siteStatus: "점검필요",
    uptime: 96.1,
    lastChecked: "2026-04-27",
  },
  {
    id: "JN-004",
    name: "순천사이트",
    hq: "west",
    team: "전남Access운용팀",
    adminRegion: "순천시",
    address: "전남 순천시 조례동",
    lat: 34.9506,
    lng: 127.4872,
    equip: {
      fiveG: { installed: true, count: 2, status: "긴급" },
      lte: { installed: true, count: 5, status: "점검필요" },
      threeG: { installed: true, count: 1, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 9,
    siteStatus: "긴급",
    uptime: 89.7,
    lastChecked: "2026-04-24",
  },
  {
    id: "JN-005",
    name: "해남사이트",
    hq: "west",
    team: "전남Access운용팀",
    adminRegion: "해남군",
    address: "전남 해남군 해남읍",
    lat: 34.5737,
    lng: 126.599,
    equip: {
      fiveG: { installed: false, count: 0, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 3, status: "정상" },
    },
    totalEquip: 9,
    siteStatus: "정상",
    uptime: 98.2,
    lastChecked: "2026-05-02",
  },

  // ══════════════════════════════════════════════
  // 서부 본부 — 전북Access운용팀
  // ══════════════════════════════════════════════
  {
    id: "JB-001",
    name: "전주중앙사이트",
    hq: "west",
    team: "전북Access운용팀",
    adminRegion: "전주시",
    address: "전북 전주시 완산구 중앙동",
    lat: 35.8242,
    lng: 127.148,
    equip: {
      fiveG: { installed: true, count: 4, status: "정상" },
      lte: { installed: true, count: 7, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 15,
    siteStatus: "정상",
    uptime: 99.1,
    lastChecked: "2026-05-04",
  },
  {
    id: "JB-002",
    name: "익산사이트",
    hq: "west",
    team: "전북Access운용팀",
    adminRegion: "익산시",
    address: "전북 익산시 영등동",
    lat: 35.9483,
    lng: 126.9575,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 5, status: "정상" },
      threeG: { installed: true, count: 2, status: "점검필요" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 10,
    siteStatus: "점검필요",
    uptime: 97.2,
    lastChecked: "2026-04-30",
  },
  {
    id: "JB-003",
    name: "군산사이트",
    hq: "west",
    team: "전북Access운용팀",
    adminRegion: "군산시",
    address: "전북 군산시 중앙로",
    lat: 35.9676,
    lng: 126.7369,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: false, count: 0, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "정상",
    uptime: 98.4,
    lastChecked: "2026-05-01",
  },
  {
    id: "JB-004",
    name: "정읍사이트",
    hq: "west",
    team: "전북Access운용팀",
    adminRegion: "정읍시",
    address: "전북 정읍시 수성동",
    lat: 35.57,
    lng: 126.856,
    equip: {
      fiveG: { installed: false, count: 0, status: "정상" },
      lte: { installed: true, count: 4, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "정상",
    uptime: 97.8,
    lastChecked: "2026-05-02",
  },

  // ══════════════════════════════════════════════
  // 서부 본부 — 제주Access운용팀
  // ══════════════════════════════════════════════
  {
    id: "JJ-001",
    name: "제주중앙사이트",
    hq: "west",
    team: "제주Access운용팀",
    adminRegion: "제주시",
    address: "제주특별자치도 제주시 이도동",
    lat: 33.4996,
    lng: 126.5312,
    equip: {
      fiveG: { installed: true, count: 3, status: "정상" },
      lte: { installed: true, count: 6, status: "정상" },
      threeG: { installed: true, count: 2, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 13,
    siteStatus: "정상",
    uptime: 99.0,
    lastChecked: "2026-05-03",
  },
  {
    id: "JJ-002",
    name: "서귀포사이트",
    hq: "west",
    team: "제주Access운용팀",
    adminRegion: "서귀포시",
    address: "제주특별자치도 서귀포시 서귀동",
    lat: 33.2541,
    lng: 126.56,
    equip: {
      fiveG: { installed: true, count: 2, status: "정상" },
      lte: { installed: true, count: 4, status: "점검필요" },
      threeG: { installed: true, count: 1, status: "정상" },
      lora: { installed: true, count: 1, status: "정상" },
    },
    totalEquip: 8,
    siteStatus: "점검필요",
    uptime: 96.3,
    lastChecked: "2026-04-29",
  },
  {
    id: "JJ-003",
    name: "제주동부사이트",
    hq: "west",
    team: "제주Access운용팀",
    adminRegion: "제주시",
    address: "제주특별자치도 제주시 구좌읍",
    lat: 33.528,
    lng: 126.83,
    equip: {
      fiveG: { installed: false, count: 0, status: "정상" },
      lte: { installed: true, count: 3, status: "정상" },
      threeG: { installed: true, count: 1, status: "정상" },
      lora: { installed: true, count: 2, status: "정상" },
    },
    totalEquip: 6,
    siteStatus: "정상",
    uptime: 98.7,
    lastChecked: "2026-05-02",
  },
];

// ─── 집계 함수 ────────────────────────────────────────────────

/** 본부별 KPI 집계 */
export function getGijigukKpi(hq: HqDivision): GijigukKpi {
  const sites = gijigukSites.filter((s) => s.hq === hq);

  const fiveGSites = sites.filter(
    (s) => s.equip.fiveG.installed,
  );
  const lteSites = sites.filter((s) => s.equip.lte.installed);
  const threeGSites = sites.filter(
    (s) => s.equip.threeG.installed,
  );
  const loraSites = sites.filter((s) => s.equip.lora.installed);

  const totalEquip = sites.reduce(
    (a, s) => a + s.totalEquip,
    0,
  );
  const fiveGEquip = sites.reduce(
    (a, s) => a + s.equip.fiveG.count,
    0,
  );
  const lteEquip = sites.reduce(
    (a, s) => a + s.equip.lte.count,
    0,
  );
  const threeGEquip = sites.reduce(
    (a, s) => a + s.equip.threeG.count,
    0,
  );
  const loraEquip = sites.reduce(
    (a, s) => a + s.equip.lora.count,
    0,
  );

  return {
    totalSites: sites.length,
    fiveG: {
      sites: fiveGSites.length,
      equip: fiveGEquip,
      ratio: Math.round((fiveGEquip / totalEquip) * 1000) / 10,
      change: +4.2,
    },
    lte: {
      sites: lteSites.length,
      equip: lteEquip,
      ratio: Math.round((lteEquip / totalEquip) * 1000) / 10,
      change: -1.1,
    },
    threeG: {
      sites: threeGSites.length,
      equip: threeGEquip,
      ratio: Math.round((threeGEquip / totalEquip) * 1000) / 10,
      change: -5.3,
    },
    lora: {
      sites: loraSites.length,
      equip: loraEquip,
      ratio: Math.round((loraEquip / totalEquip) * 1000) / 10,
      change: +2.1,
    },
  };
}

/** 팀별 현황 집계 */
export function getTeamSummary(hq: HqDivision): TeamSummary[] {
  const teams = HQ_TEAMS[hq];
  return teams.map((team) => {
    const sites = gijigukSites.filter((s) => s.team === team);
    const avgUptime =
      sites.length > 0
        ? Math.round(
            (sites.reduce((a, s) => a + s.uptime, 0) /
              sites.length) *
              10,
          ) / 10
        : 0;
    return {
      team,
      adminRegion: TEAM_REGION[team],
      totalSites: sites.length,
      fiveG: sites.reduce((a, s) => a + s.equip.fiveG.count, 0),
      lte: sites.reduce((a, s) => a + s.equip.lte.count, 0),
      threeG: sites.reduce(
        (a, s) => a + s.equip.threeG.count,
        0,
      ),
      lora: sites.reduce((a, s) => a + s.equip.lora.count, 0),
      normal: sites.filter((s) => s.siteStatus === "정상")
        .length,
      needCheck: sites.filter(
        (s) => s.siteStatus === "점검필요",
      ).length,
      urgent: sites.filter((s) => s.siteStatus === "긴급")
        .length,
      avgUptime,
    };
  });
}

/** 지도 마커 데이터 */
export function getGijigukMarkers(
  hq: HqDivision,
): GijigukMarker[] {
  return gijigukSites
    .filter((s) => s.hq === hq)
    .map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      status: s.siteStatus,
      team: s.team,
      region: s.adminRegion,
    }));
}

// ─── 시단위 집계 (기존 파일 하단에 추가) ─────────────────────

export interface CityStats {
  city:       string;
  team:       AccessTeam;
  totalSites: number;
  fiveG:      number;
  lte:        number;
  threeG:     number;
  lora:       number;
  normal:     number;
  needCheck:  number;
  urgent:     number;
  avgUptime:  number;
}

export function getCityStats(
  hq: HqDivision,
  team: AccessTeam | null
): CityStats[] {
  const sites = gijigukSites.filter(
    (s) => s.hq === hq && (team === null || s.team === team)
  );

  const cityMap = new Map<string, GijigukSite[]>();
  sites.forEach((s) => {
    const list = cityMap.get(s.adminRegion) ?? [];
    list.push(s);
    cityMap.set(s.adminRegion, list);
  });

  return Array.from(cityMap.entries()).map(([city, list]) => ({
    city,
    team:       list[0].team,
    totalSites: list.length,
    fiveG:      list.reduce((a, s) => a + s.equip.fiveG.count, 0),
    lte:        list.reduce((a, s) => a + s.equip.lte.count, 0),
    threeG:     list.reduce((a, s) => a + s.equip.threeG.count, 0),
    lora:       list.reduce((a, s) => a + s.equip.lora.count, 0),
    normal:     list.filter((s) => s.siteStatus === "정상").length,
    needCheck:  list.filter((s) => s.siteStatus === "점검필요").length,
    urgent:     list.filter((s) => s.siteStatus === "긴급").length,
    avgUptime:
      Math.round(
        (list.reduce((a, s) => a + s.uptime, 0) / list.length) * 10
      ) / 10,
  }));
}
 