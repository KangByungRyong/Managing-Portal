export interface TonghabStation {
  id: string;
  name: string;
  networkDivision: "central" | "west"; // 네트워크 담당 구분
  region: string;
  leaseType: "자가" | "임차" | "공동";
  hasGenerator: boolean;
  powerCapacity: number;
  stationGrade: "A" | "B" | "C";
  battery: "리튬" | "납" | "리튬+납";
  modernizationCount: number; // Modernization 추진 항목 수 (0-37)
  status: "정상" | "점검필요" | "긴급";
  isClosing: boolean; // 폐국 진행중 여부
  lat?: number;
  lng?: number;
}

export const tonghabMockData: TonghabStation[] = [
  // 중부 네트워크 담당 (대전, 세종, 충남, 충북)
  {
    id: "CT001",
    name: "대전중앙국",
    networkDivision: "central",
    region: "대전",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 520,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 32,
    status: "정상",
    isClosing: false,
    lat: 36.3504,
    lng: 127.3845,
  },
  {
    id: "CT002",
    name: "유성국",
    networkDivision: "central",
    region: "대전",
    leaseType: "임차",
    hasGenerator: true,
    powerCapacity: 450,
    stationGrade: "A",
    battery: "리튬+납",
    modernizationCount: 29,
    status: "정상",
    isClosing: false,
    lat: 36.3621,
    lng: 127.3561,
  },
  {
    id: "CT003",
    name: "세종국",
    networkDivision: "central",
    region: "세종",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 580,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 34,
    status: "정상",
    isClosing: false,
    lat: 36.4800,
    lng: 127.2890,
  },
  {
    id: "CT004",
    name: "천안국",
    networkDivision: "central",
    region: "충남",
    leaseType: "임차",
    hasGenerator: true,
    powerCapacity: 480,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 28,
    status: "정상",
    isClosing: false,
    lat: 36.8151,
    lng: 127.1139,
  },
  {
    id: "CT005",
    name: "아산국",
    networkDivision: "central",
    region: "충남",
    leaseType: "공동",
    hasGenerator: false,
    powerCapacity: 350,
    stationGrade: "B",
    battery: "납",
    modernizationCount: 19,
    status: "점검필요",
    isClosing: true,
    lat: 36.7898,
    lng: 127.0018,
  },
  {
    id: "CT006",
    name: "당진국",
    networkDivision: "central",
    region: "충남",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 420,
    stationGrade: "B",
    battery: "리튬+납",
    modernizationCount: 24,
    status: "정상",
    isClosing: false,
    lat: 36.8927,
    lng: 126.6476,
  },
  {
    id: "CT007",
    name: "공주국",
    networkDivision: "central",
    region: "충남",
    leaseType: "임차",
    hasGenerator: false,
    powerCapacity: 310,
    stationGrade: "C",
    battery: "납",
    modernizationCount: 14,
    status: "긴급",
    isClosing: true,
    lat: 36.4465,
    lng: 127.1195,
  },
  {
    id: "CT008",
    name: "청주중앙국",
    networkDivision: "central",
    region: "충북",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 510,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 31,
    status: "정상",
    isClosing: false,
    lat: 36.6424,
    lng: 127.4890,
  },
  {
    id: "CT009",
    name: "충주국",
    networkDivision: "central",
    region: "충북",
    leaseType: "공동",
    hasGenerator: true,
    powerCapacity: 390,
    stationGrade: "B",
    battery: "리튬",
    modernizationCount: 22,
    status: "정상",
    isClosing: false,
    lat: 36.9910,
    lng: 127.9260,
  },
  {
    id: "CT010",
    name: "제천국",
    networkDivision: "central",
    region: "충북",
    leaseType: "임차",
    hasGenerator: false,
    powerCapacity: 330,
    stationGrade: "C",
    battery: "납",
    modernizationCount: 16,
    status: "점검필요",
    isClosing: false,
    lat: 37.1326,
    lng: 128.1907,
  },

  // 서부 네트워크 담당 (전라남도, 전라북도, 제주)
  {
    id: "WS001",
    name: "전주중앙국",
    networkDivision: "west",
    region: "전북",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 540,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 32,
    status: "정상",
    isClosing: false,
    lat: 35.8242,
    lng: 127.1480,
  },
  {
    id: "WS002",
    name: "익산국",
    networkDivision: "west",
    region: "전북",
    leaseType: "임차",
    hasGenerator: true,
    powerCapacity: 460,
    stationGrade: "A",
    battery: "리튬+납",
    modernizationCount: 27,
    status: "정상",
    isClosing: false,
    lat: 35.9483,
    lng: 126.9575,
  },
  {
    id: "WS003",
    name: "군산국",
    networkDivision: "west",
    region: "전북",
    leaseType: "자가",
    hasGenerator: false,
    powerCapacity: 380,
    stationGrade: "B",
    battery: "납",
    modernizationCount: 20,
    status: "점검필요",
    isClosing: true,
    lat: 35.9676,
    lng: 126.7369,
  },
  {
    id: "WS004",
    name: "광주중앙국",
    networkDivision: "west",
    region: "전남",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 560,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 33,
    status: "정상",
    isClosing: false,
    lat: 35.1595,
    lng: 126.8526,
  },
  {
    id: "WS005",
    name: "목포국",
    networkDivision: "west",
    region: "전남",
    leaseType: "공동",
    hasGenerator: true,
    powerCapacity: 440,
    stationGrade: "B",
    battery: "리튬",
    modernizationCount: 25,
    status: "정상",
    isClosing: false,
    lat: 34.8118,
    lng: 126.3922,
  },
  {
    id: "WS006",
    name: "여수국",
    networkDivision: "west",
    region: "전남",
    leaseType: "임차",
    hasGenerator: true,
    powerCapacity: 470,
    stationGrade: "A",
    battery: "리튬+납",
    modernizationCount: 29,
    status: "정상",
    isClosing: false,
    lat: 34.7604,
    lng: 127.6622,
  },
  {
    id: "WS007",
    name: "순천국",
    networkDivision: "west",
    region: "전남",
    leaseType: "자가",
    hasGenerator: false,
    powerCapacity: 360,
    stationGrade: "C",
    battery: "납",
    modernizationCount: 17,
    status: "긴급",
    isClosing: false,
    lat: 34.9506,
    lng: 127.4872,
  },
  {
    id: "WS008",
    name: "제주중앙국",
    networkDivision: "west",
    region: "제주",
    leaseType: "자가",
    hasGenerator: true,
    powerCapacity: 600,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 34,
    status: "정상",
    isClosing: false,
    lat: 33.4996,
    lng: 126.5312,
  },
  {
    id: "WS009",
    name: "서귀포국",
    networkDivision: "west",
    region: "제주",
    leaseType: "임차",
    hasGenerator: true,
    powerCapacity: 490,
    stationGrade: "A",
    battery: "리튬",
    modernizationCount: 31,
    status: "정상",
    isClosing: false,
    lat: 33.2541,
    lng: 126.5601,
  },
  {
    id: "WS010",
    name: "제주동부국",
    networkDivision: "west",
    region: "제주",
    leaseType: "공동",
    hasGenerator: false,
    powerCapacity: 370,
    stationGrade: "B",
    battery: "납",
    modernizationCount: 21,
    status: "점검필요",
    isClosing: false,
    lat: 33.5097,
    lng: 126.7219,
  },
];

export const getKpiData = (data: TonghabStation[]) => {
  return {
    total: data.length,
    operating: data.filter((s) => !s.isClosing).length,
    closing: data.filter((s) => s.isClosing).length,
    normal: data.filter((s) => s.status === "정상").length,
    needsInspection: data.filter((s) => s.status === "점검필요").length,
    urgent: data.filter((s) => s.status === "긴급").length,
    withGenerator: data.filter((s) => s.hasGenerator).length,
    withoutGenerator: data.filter((s) => !s.hasGenerator).length,
  };
};

export const getLeaseTypeData = (data: TonghabStation[]) => {
  const counts = data.reduce((acc, station) => {
    acc[station.leaseType] = (acc[station.leaseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: "자가", value: counts["자가"] || 0, fill: "#3617CE" },
    { name: "임차", value: counts["임차"] || 0, fill: "#00A86B" },
    { name: "공동", value: counts["공동"] || 0, fill: "#FF7A00" },
  ];
};

export const getGeneratorData = (data: TonghabStation[]) => {
  const withGen = data.filter((s) => s.hasGenerator).length;
  const withoutGen = data.filter((s) => !s.hasGenerator).length;

  return [
    { name: "설치", value: withGen, fill: "#00A86B" },
    { name: "미설치", value: withoutGen, fill: "#EA002C" },
  ];
};

export const getStationGradeData = (data: TonghabStation[]) => {
  const counts = data.reduce((acc, station) => {
    acc[station.stationGrade] = (acc[station.stationGrade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: "A등급", value: counts["A"] || 0, fill: "#3617CE" },
    { name: "B등급", value: counts["B"] || 0, fill: "#00A86B" },
    { name: "C등급", value: counts["C"] || 0, fill: "#FF7A00" },
  ];
};

export const getBatteryData = (data: TonghabStation[]) => {
  const counts = data.reduce((acc, station) => {
    acc[station.battery] = (acc[station.battery] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: "리튬", value: counts["리튬"] || 0, fill: "#3617CE" },
    { name: "납", value: counts["납"] || 0, fill: "#FF7A00" },
    { name: "리튬+납", value: counts["리튬+납"] || 0, fill: "#00A86B" },
  ];
};
