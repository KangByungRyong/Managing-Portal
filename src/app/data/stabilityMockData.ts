// src/app/data/stabilityMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// 안정 페이지 전용 Mock 데이터
// RM 현황 + VoC 현황 (중부/서부 분리)
// ─────────────────────────────────────────────────────────────────────────────

export type Region = "central" | "west";

// ═════════════════════════════════════════════════════════════════════════════
// 공통 타입
// ═════════════════════════════════════════════════════════════════════════════

// ── RM 분류 타입 ──────────────────────────────────────────────────────────────

export type RmSource   = "NMC: 담당_고장" | "NMC: 팀_고장" | "NMC봇: 담당_언론" | "NMC봇: 팀_언론";
export type RmStatus   = "처리완료" | "처리중" | "접수";
export type RmCategory = "고장" | "언론" | "장애" | "예방";

// ── VoC 분류 타입 ─────────────────────────────────────────────────────────────

export type VocConsultType =
  | "HDVoice품질"
  | "WiFi문의"
  | "WiFi품질"
  | "단말설정"
  | "데이터품질"
  | "부가서비스"
  | "영상품질"
  | "음성품질"
  | "제도/프로세스"
  | "기타";

export type VocLocationCode =
  | "공공기관" | "공사현장" | "공장" | "교육기관" | "군부대"
  | "기숙사"   | "도로"     | "리조트" | "병원"   | "사무실"
  | "상가"     | "선박"     | "신규아파트" | "신축건물" | "아파트"
  | "오피스텔" | "원룸/고시원" | "주택" | "철도"   | "팬션"
  | "해상"     | "호텔"     | "휴양지" | "미분류";

// ═════════════════════════════════════════════════════════════════════════════
// 1. RM 현황
// ═════════════════════════════════════════════════════════════════════════════

export interface RmProcessStep {
  /** 진행 단계명 */
  step: string;
  /** 처리 일시 */
  datetime: string;
  /** 진행 내역 */
  detail: string;
  /** 처리자 */
  handler?: string;
}

export interface RmItem {
  id: string;
  region: Region;
  /** 분류 (NMC 소스) */
  source: RmSource;
  /** 고장/언론/장애/예방 */
  category: RmCategory;
  /** 제목 */
  title: string;
  /** 발생 일시 */
  occurredAt: string;
  /** 복구/종료 일시 */
  resolvedAt?: string;
  /** 영향 가입자 수 */
  affectedCount: number | null;
  /** 고객 문의 건수 */
  customerInquiry: number;
  /** 발생 원인 */
  cause: string;
  /** 조치 내용 */
  action: string;
  /** 처리 현황 */
  status: RmStatus;
  /** 처리 이력 */
  processSteps: RmProcessStep[];
  /** 지역 */
  area: string;
}

// ── RM 처리 이력 생성 헬퍼 ────────────────────────────────────────────────────

function makeSteps(
  occurredAt: string,
  resolvedAt: string | undefined,
  status: RmStatus,
  cause: string,
  action: string,
  handler: string,
): RmProcessStep[] {
  const steps: RmProcessStep[] = [
    {
      step: "접수",
      datetime: occurredAt,
      detail: `NMC 모니터링 시스템 자동 감지 — ${cause}`,
      handler: "NMC 자동",
    },
    {
      step: "원인 분석",
      datetime: addMinutes(occurredAt, 15),
      detail: `현장 확인 및 원인 분석 완료: ${cause}`,
      handler,
    },
  ];

  if (status === "처리중") {
    steps.push({
      step: "처리 중",
      datetime: addMinutes(occurredAt, 30),
      detail: `${action} 진행 중`,
      handler,
    });
  }

  if (status === "처리완료" && resolvedAt) {
    steps.push({
      step: "조치 완료",
      datetime: resolvedAt,
      detail: `${action} 완료, 서비스 정상화 확인`,
      handler,
    });
    steps.push({
      step: "종결",
      datetime: addMinutes(resolvedAt, 10),
      detail: "처리 결과 보고 및 이력 등록 완료",
      handler: "NMC 담당",
    });
  }

  return steps;
}

/** 날짜 문자열에 분 추가 (간단 헬퍼) */
function addMinutes(datetimeStr: string, minutes: number): string {
  const match = datetimeStr.match(/(\d{2})\.(\d{2})\(.\) (\d{2}):(\d{2})/);
  if (!match) return datetimeStr;
  const [, month, day, hour, min] = match.map(Number);
  const date = new Date(2026, month - 1, day, hour, min + minutes);
  const m  = String(date.getMonth() + 1).padStart(2, "0");
  const d  = String(date.getDate()).padStart(2, "0");
  const h  = String(date.getHours()).padStart(2, "0");
  const mn = String(date.getMinutes()).padStart(2, "0");
  const days = ["일","월","화","수","목","금","토"];
  return `${m}.${d}(${days[date.getDay()]}) ${h}:${mn}`;
}

// ── 중부 본부 RM 데이터 (20개) ────────────────────────────────────────────────
// 대전/세종/충남/충북 지역 기반

export const centralRmList: RmItem[] = [
  {
    id: "C-RM-001",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "대전 동구 판암동 일대 기지국 3식 다운 발생",
    occurredAt: "05.06(수) 08:35",
    resolvedAt: "05.06(수) 11:40",
    affectedCount: 1842,
    customerInquiry: 47,
    cause: "인근 공사로 인한 광케이블 절단",
    action: "광케이블 긴급 복구 및 기지국 재기동",
    status: "처리완료",
    area: "대전 동구",
    processSteps: makeSteps(
      "05.06(수) 08:35", "05.06(수) 11:40", "처리완료",
      "인근 공사로 인한 광케이블 절단",
      "광케이블 긴급 복구 및 기지국 재기동",
      "충남Access운용팀 김민준"
    ),
  },
  {
    id: "C-RM-002",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "세종시 조치원읍 중계기 5식 다운 발생",
    occurredAt: "05.06(수) 09:12",
    resolvedAt: "05.06(수) 13:25",
    affectedCount: 923,
    customerInquiry: 18,
    cause: "한전 정전영향으로 축전지 방전",
    action: "축전지 대개체 및 외부 전원 공급 복구",
    status: "처리완료",
    area: "세종시 조치원읍",
    processSteps: makeSteps(
      "05.06(수) 09:12", "05.06(수) 13:25", "처리완료",
      "한전 정전영향으로 축전지 방전",
      "축전지 대개체 및 외부 전원 공급 복구",
      "충남Access운용팀 이서연"
    ),
  },
  {
    id: "C-RM-003",
    region: "central",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "충남 천안시 5G 서비스 품질 저하 관련 언론 보도",
    occurredAt: "05.06(수) 10:00",
    resolvedAt: "05.06(수) 16:30",
    affectedCount: null,
    customerInquiry: 0,
    cause: "5G 기지국 소프트웨어 버그로 인한 간헐적 품질 저하",
    action: "소프트웨어 패치 적용 및 품질 모니터링 강화",
    status: "처리완료",
    area: "충남 천안시",
    processSteps: makeSteps(
      "05.06(수) 10:00", "05.06(수) 16:30", "처리완료",
      "5G 기지국 SW 버그",
      "소프트웨어 패치 적용",
      "충남Access운용팀 박지훈"
    ),
  },
  {
    id: "C-RM-004",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "충북 청주시 흥덕구 기지국 전원 장애",
    occurredAt: "05.06(수) 11:20",
    resolvedAt: "05.06(수) 14:05",
    affectedCount: 2341,
    customerInquiry: 63,
    cause: "사옥 전원 공급 장치(UPS) 고장",
    action: "UPS 긴급 교체 및 전원 복구",
    status: "처리완료",
    area: "충북 청주시 흥덕구",
    processSteps: makeSteps(
      "05.06(수) 11:20", "05.06(수) 14:05", "처리완료",
      "UPS 고장",
      "UPS 긴급 교체",
      "충북Access운용팀 최수빈"
    ),
  },
  {
    id: "C-RM-005",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "대전 서구 둔산동 LTE 기지국 2식 다운",
    occurredAt: "05.06(수) 12:45",
    resolvedAt: "05.06(수) 15:10",
    affectedCount: 756,
    customerInquiry: 22,
    cause: "차량 충돌로 인한 기지국 안테나 파손",
    action: "안테나 교체 및 기지국 재기동",
    status: "처리완료",
    area: "대전 서구 둔산동",
    processSteps: makeSteps(
      "05.06(수) 12:45", "05.06(수) 15:10", "처리완료",
      "차량 충돌로 인한 안테나 파손",
      "안테나 교체 및 기지국 재기동",
      "충남Access운용팀 정다은"
    ),
  },
  {
    id: "C-RM-006",
    region: "central",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "충북 충주시 LTE 통화 품질 저하 민원 급증 보도",
    occurredAt: "05.06(수) 13:00",
    resolvedAt: "05.07(목) 09:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "인근 공사로 인한 전파 간섭",
    action: "주파수 최적화 파라미터 조정 및 현장 점검",
    status: "처리완료",
    area: "충북 충주시",
    processSteps: makeSteps(
      "05.06(수) 13:00", "05.07(목) 09:00", "처리완료",
      "인근 공사로 인한 전파 간섭",
      "주파수 최적화 파라미터 조정",
      "충북Access운용팀 한동현"
    ),
  },
  {
    id: "C-RM-007",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "세종시 금남면 일대 중계기 4식 동시 다운",
    occurredAt: "05.06(수) 14:33",
    resolvedAt: "05.06(수) 18:20",
    affectedCount: 1205,
    customerInquiry: 31,
    cause: "낙뢰로 인한 전원 공급 장치 손상",
    action: "전원 공급 장치 교체 및 낙뢰 보호 장치 점검",
    status: "처리완료",
    area: "세종시 금남면",
    processSteps: makeSteps(
      "05.06(수) 14:33", "05.06(수) 18:20", "처리완료",
      "낙뢰로 인한 전원 공급 장치 손상",
      "전원 공급 장치 교체",
      "충남Access운용팀 오민석"
    ),
  },
  {
    id: "C-RM-008",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "충남 공주시 기지국 6식 전원 단절",
    occurredAt: "05.06(수) 15:54",
    resolvedAt: "05.06(수) 19:30",
    affectedCount: 892,
    customerInquiry: 0,
    cause: "한전 배전선로 공사로 인한 일시 정전",
    action: "한전 협조 요청 및 비상 발전기 가동, 전원 복구 후 기지국 재기동",
    status: "처리완료",
    area: "충남 공주시",
    processSteps: makeSteps(
      "05.06(수) 15:54", "05.06(수) 19:30", "처리완료",
      "한전 배전선로 공사로 인한 일시 정전",
      "비상 발전기 가동 및 전원 복구",
      "충남Access운용팀 윤지원"
    ),
  },
  {
    id: "C-RM-009",
    region: "central",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "대전 유성구 5G 속도 저하 관련 SNS 확산",
    occurredAt: "05.06(수) 16:00",
    resolvedAt: "05.06(수) 20:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "트래픽 폭증으로 인한 일시적 속도 저하",
    action: "트래픽 분산 처리 및 용량 증설 검토",
    status: "처리완료",
    area: "대전 유성구",
    processSteps: makeSteps(
      "05.06(수) 16:00", "05.06(수) 20:00", "처리완료",
      "트래픽 폭증",
      "트래픽 분산 처리",
      "충남Access운용팀 강현우"
    ),
  },
  {
    id: "C-RM-010",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "충북 제천시 기지국 광전송 장비 장애",
    occurredAt: "05.06(수) 17:22",
    resolvedAt: "05.07(목) 08:15",
    affectedCount: 3421,
    customerInquiry: 128,
    cause: "광전송 장비 노후화로 인한 자연 고장",
    action: "광전송 장비 긴급 교체 및 서비스 복구",
    status: "처리완료",
    area: "충북 제천시",
    processSteps: makeSteps(
      "05.06(수) 17:22", "05.07(목) 08:15", "처리완료",
      "광전송 장비 노후화",
      "광전송 장비 긴급 교체",
      "충북Access운용팀 임채원"
    ),
  },
  {
    id: "C-RM-011",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "대전 중구 은행동 소형 기지국 전원 이상",
    occurredAt: "05.06(수) 18:05",
    resolvedAt: "05.06(수) 21:30",
    affectedCount: 445,
    customerInquiry: 9,
    cause: "건물 내 전기 공사로 인한 전원 차단",
    action: "건물 관리자 협조 요청 및 전원 복구",
    status: "처리완료",
    area: "대전 중구 은행동",
    processSteps: makeSteps(
      "05.06(수) 18:05", "05.06(수) 21:30", "처리완료",
      "건물 내 전기 공사로 인한 전원 차단",
      "건물 관리자 협조 및 전원 복구",
      "충남Access운용팀 신예린"
    ),
  },
  {
    id: "C-RM-012",
    region: "central",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "충남 아산시 스마트팩토리 5G 전용망 장애 보도",
    occurredAt: "05.06(수) 19:00",
    resolvedAt: "05.07(목) 10:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "전용망 코어 장비 소프트웨어 오류",
    action: "소프트웨어 롤백 및 전용망 서비스 복구",
    status: "처리완료",
    area: "충남 아산시",
    processSteps: makeSteps(
      "05.06(수) 19:00", "05.07(목) 10:00", "처리완료",
      "전용망 코어 장비 SW 오류",
      "소프트웨어 롤백",
      "충남Access운용팀 배준호"
    ),
  },
  {
    id: "C-RM-013",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "충북 청주시 상당구 기지국 안테나 강풍 피해",
    occurredAt: "05.06(수) 20:15",
    resolvedAt: "05.07(목) 11:00",
    affectedCount: 1678,
    customerInquiry: 55,
    cause: "강풍으로 인한 안테나 방향 틀어짐",
    action: "안테나 방향 재조정 및 고정 볼트 교체",
    status: "처리완료",
    area: "충북 청주시 상당구",
    processSteps: makeSteps(
      "05.06(수) 20:15", "05.07(목) 11:00", "처리완료",
      "강풍으로 인한 안테나 방향 틀어짐",
      "안테나 방향 재조정",
      "충북Access운용팀 류성민"
    ),
  },
  {
    id: "C-RM-014",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "세종시 연서면 농촌 지역 기지국 2식 다운",
    occurredAt: "05.06(수) 21:40",
    resolvedAt: "05.07(목) 07:30",
    affectedCount: 312,
    customerInquiry: 4,
    cause: "야생동물에 의한 광케이블 손상",
    action: "광케이블 교체 및 케이블 보호관 설치",
    status: "처리완료",
    area: "세종시 연서면",
    processSteps: makeSteps(
      "05.06(수) 21:40", "05.07(목) 07:30", "처리완료",
      "야생동물에 의한 광케이블 손상",
      "광케이블 교체 및 보호관 설치",
      "충남Access운용팀 조현아"
    ),
  },
  {
    id: "C-RM-015",
    region: "central",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "대전 대덕구 연구단지 WiFi 불통 관련 커뮤니티 게시",
    occurredAt: "05.07(목) 00:30",
    resolvedAt: "05.07(목) 06:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "WiFi AP 펌웨어 업데이트 후 설정 초기화",
    action: "WiFi AP 설정 복구 및 펌웨어 재적용",
    status: "처리완료",
    area: "대전 대덕구",
    processSteps: makeSteps(
      "05.07(목) 00:30", "05.07(목) 06:00", "처리완료",
      "WiFi AP 펌웨어 업데이트 후 설정 초기화",
      "WiFi AP 설정 복구",
      "충남Access운용팀 문지수"
    ),
  },
  {
    id: "C-RM-016",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "충남 서산시 기지국 광전송 링크 단절",
    occurredAt: "05.07(목) 02:15",
    resolvedAt: "05.07(목) 09:45",
    affectedCount: 2105,
    customerInquiry: 72,
    cause: "도로 공사 중 광케이블 굴착 손상",
    action: "광케이블 긴급 복구 (임시 우회 후 정식 복구)",
    status: "처리완료",
    area: "충남 서산시",
    processSteps: makeSteps(
      "05.07(목) 02:15", "05.07(목) 09:45", "처리완료",
      "도로 공사 중 광케이블 굴착 손상",
      "광케이블 긴급 복구",
      "충남Access운용팀 홍성준"
    ),
  },
  {
    id: "C-RM-017",
    region: "central",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "충북 음성군 기지국 전원 불안정 반복 발생",
    occurredAt: "05.07(목) 03:50",
    resolvedAt: undefined,
    affectedCount: 518,
    customerInquiry: 11,
    cause: "전원 공급 장치 노후화로 인한 간헐적 전원 불안정",
    action: "전원 공급 장치 교체 진행 중 (부품 수급 대기)",
    status: "처리중",
    area: "충북 음성군",
    processSteps: makeSteps(
      "05.07(목) 03:50", undefined, "처리중",
      "전원 공급 장치 노후화",
      "전원 공급 장치 교체 진행 중",
      "충북Access운용팀 권태양"
    ),
  },
  {
    id: "C-RM-018",
    region: "central",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "대전 서구 탄방동 5G 커버리지 불만 온라인 확산",
    occurredAt: "05.07(목) 05:00",
    resolvedAt: undefined,
    affectedCount: null,
    customerInquiry: 0,
    cause: "신축 건물 밀집으로 인한 전파 음영 지역 발생",
    action: "소형 기지국 추가 설치 검토 및 현장 RF 측정 예정",
    status: "처리중",
    area: "대전 서구 탄방동",
    processSteps: makeSteps(
      "05.07(목) 05:00", undefined, "처리중",
      "신축 건물 밀집으로 인한 전파 음영",
      "소형 기지국 추가 설치 검토",
      "충남Access운용팀 나현정"
    ),
  },
  {
    id: "C-RM-019",
    region: "central",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "충남 당진시 기지국 냉각 시스템 이상 경보",
    occurredAt: "05.07(목) 06:30",
    resolvedAt: undefined,
    affectedCount: 0,
    customerInquiry: 0,
    cause: "기지국 냉각 팬 고장으로 장비 온도 상승 (78°C)",
    action: "냉각 팬 긴급 교체 및 장비 온도 모니터링 강화",
    status: "처리중",
    area: "충남 당진시",
    processSteps: makeSteps(
      "05.07(목) 06:30", undefined, "처리중",
      "냉각 팬 고장으로 장비 온도 상승",
      "냉각 팬 긴급 교체",
      "충남Access운용팀 서동민"
    ),
  },
  {
    id: "C-RM-020",
    region: "central",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "충북 청주시 오창읍 산업단지 5G 전용망 품질 이슈 보도",
    occurredAt: "05.07(목) 07:15",
    resolvedAt: undefined,
    affectedCount: null,
    customerInquiry: 0,
    cause: "산업단지 내 전파 간섭 발생 (신규 공장 장비 영향)",
    action: "전파 간섭 원인 조사 및 주파수 최적화 검토",
    status: "접수",
    area: "충북 청주시 오창읍",
    processSteps: makeSteps(
      "05.07(목) 07:15", undefined, "접수",
      "신규 공장 장비로 인한 전파 간섭",
      "전파 간섭 원인 조사",
      "충북Access운용팀 전민서"
    ),
  },
];

// ── 서부 본부 RM 데이터 (20개) ────────────────────────────────────────────────
// 광주/전남/전북/제주 지역 기반

export const westRmList: RmItem[] = [
  {
    id: "W-RM-001",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 완도군 도서 지역 기지국 5식 전체 장애",
    occurredAt: "05.06(수) 05:58",
    resolvedAt: "05.07(목) 14:30",
    affectedCount: 4218,
    customerInquiry: 312,
    cause: "해저케이블 절단으로 도서 지역 전체 서비스 중단",
    action: "해저케이블 긴급 복구 작업 (해양 작업선 투입)",
    status: "처리완료",
    area: "전남 완도군",
    processSteps: makeSteps(
      "05.06(수) 05:58", "05.07(목) 14:30", "처리완료",
      "해저케이블 절단",
      "해저케이블 긴급 복구",
      "전남Access운용팀 김도현"
    ),
  },
  {
    id: "W-RM-002",
    region: "west",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "제주 서귀포시 산불 인접 기지국 서비스 불안 보도",
    occurredAt: "05.06(수) 02:11",
    resolvedAt: "05.06(수) 18:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "서귀포시 한라산 인근 산불 확산으로 기지국 3기 접근 불가",
    action: "원격 모니터링 강화 및 산불 진화 후 현장 점검",
    status: "처리완료",
    area: "제주 서귀포시",
    processSteps: makeSteps(
      "05.06(수) 02:11", "05.06(수) 18:00", "처리완료",
      "산불 확산으로 기지국 접근 불가",
      "원격 모니터링 강화 및 현장 점검",
      "제주Access운용팀 고은지"
    ),
  },
  {
    id: "W-RM-003",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 군산시 항만 인근 중계기 전원 불안정",
    occurredAt: "05.06(수) 23:30",
    resolvedAt: "05.07(목) 06:15",
    affectedCount: 672,
    customerInquiry: 15,
    cause: "항만 내 전원 공급 불안정으로 중계기 간헐적 재부팅",
    action: "전원 안정화 장치 설치 및 중계기 전원 라인 교체",
    status: "처리완료",
    area: "전북 군산시",
    processSteps: makeSteps(
      "05.06(수) 23:30", "05.07(목) 06:15", "처리완료",
      "항만 전원 공급 불안정",
      "전원 안정화 장치 설치",
      "전북Access운용팀 박성훈"
    ),
  },
  {
    id: "W-RM-004",
    region: "west",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "광주 북구 5G 장비 과열 관련 온라인 민원 확산",
    occurredAt: "05.06(수) 20:15",
    resolvedAt: "05.07(목) 09:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "광주 북구 5G CDU 장비 내부 온도 81°C 초과",
    action: "냉각 팬 교체 및 장비 온도 정상화 확인",
    status: "처리완료",
    area: "광주 북구",
    processSteps: makeSteps(
      "05.06(수) 20:15", "05.07(목) 09:00", "처리완료",
      "5G CDU 장비 과열",
      "냉각 팬 교체",
      "전남Access운용팀 이수진"
    ),
  },
  {
    id: "W-RM-005",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 목포시 원도심 기지국 품질 급락",
    occurredAt: "05.06(수) 18:40",
    resolvedAt: "05.07(목) 11:30",
    affectedCount: 3105,
    customerInquiry: 187,
    cause: "기지국 소프트웨어 오류로 CQ 1등급 비율 72%→65% 감소",
    action: "소프트웨어 패치 적용 및 품질 파라미터 재조정",
    status: "처리완료",
    area: "전남 목포시",
    processSteps: makeSteps(
      "05.06(수) 18:40", "05.07(목) 11:30", "처리완료",
      "기지국 소프트웨어 오류",
      "소프트웨어 패치 적용",
      "전남Access운용팀 장민호"
    ),
  },
  {
    id: "W-RM-006",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 전주시 완산구 기지국 광케이블 단절",
    occurredAt: "05.06(수) 08:20",
    resolvedAt: "05.06(수) 15:45",
    affectedCount: 2891,
    customerInquiry: 94,
    cause: "도시가스 공사 중 광케이블 굴착 손상",
    action: "광케이블 긴급 복구 (임시 우회 후 정식 복구)",
    status: "처리완료",
    area: "전북 전주시 완산구",
    processSteps: makeSteps(
      "05.06(수) 08:20", "05.06(수) 15:45", "처리완료",
      "도시가스 공사 중 광케이블 손상",
      "광케이블 긴급 복구",
      "전북Access운용팀 오지현"
    ),
  },
  {
    id: "W-RM-007",
    region: "west",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "제주 제주시 관광지 일대 5G 속도 저하 관광객 불만 보도",
    occurredAt: "05.06(수) 10:30",
    resolvedAt: "05.06(수) 17:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "연휴 관광객 급증으로 인한 트래픽 폭증",
    action: "트래픽 분산 처리 및 임시 용량 증설",
    status: "처리완료",
    area: "제주 제주시",
    processSteps: makeSteps(
      "05.06(수) 10:30", "05.06(수) 17:00", "처리완료",
      "관광객 급증으로 트래픽 폭증",
      "트래픽 분산 처리",
      "제주Access운용팀 현성민"
    ),
  },
  {
    id: "W-RM-008",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 여수시 돌산도 기지국 전원 단절",
    occurredAt: "05.06(수) 11:15",
    resolvedAt: "05.06(수) 20:30",
    affectedCount: 1543,
    customerInquiry: 67,
    cause: "한전 정전영향으로 축전지 방전",
    action: "비상 발전기 투입 및 한전 복구 후 기지국 재기동",
    status: "처리완료",
    area: "전남 여수시 돌산도",
    processSteps: makeSteps(
      "05.06(수) 11:15", "05.06(수) 20:30", "처리완료",
      "한전 정전으로 축전지 방전",
      "비상 발전기 투입",
      "전남Access운용팀 임서연"
    ),
  },
  {
    id: "W-RM-009",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 남원시 농촌 지역 기지국 3식 다운",
    occurredAt: "05.06(수) 12:50",
    resolvedAt: "05.06(수) 19:10",
    affectedCount: 428,
    customerInquiry: 8,
    cause: "강풍으로 인한 안테나 탈락",
    action: "안테나 재설치 및 고정 장치 보강",
    status: "처리완료",
    area: "전북 남원시",
    processSteps: makeSteps(
      "05.06(수) 12:50", "05.06(수) 19:10", "처리완료",
      "강풍으로 인한 안테나 탈락",
      "안테나 재설치",
      "전북Access운용팀 최재원"
    ),
  },
  {
    id: "W-RM-010",
    region: "west",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "광주 서구 상무지구 LTE 통화 품질 저하 민원 급증",
    occurredAt: "05.06(수) 14:00",
    resolvedAt: "05.07(목) 08:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "상무지구 신축 건물 밀집으로 전파 음영 발생",
    action: "소형 기지국 추가 설치 및 주파수 최적화",
    status: "처리완료",
    area: "광주 서구 상무지구",
    processSteps: makeSteps(
      "05.06(수) 14:00", "05.07(목) 08:00", "처리완료",
      "신축 건물 밀집으로 전파 음영",
      "소형 기지국 추가 설치",
      "전남Access운용팀 나도현"
    ),
  },
  {
    id: "W-RM-011",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 순천시 기지국 광전송 장비 장애",
    occurredAt: "05.06(수) 15:30",
    resolvedAt: "05.07(목) 07:00",
    affectedCount: 2756,
    customerInquiry: 103,
    cause: "광전송 장비 노후화로 인한 자연 고장",
    action: "광전송 장비 긴급 교체 및 서비스 복구",
    status: "처리완료",
    area: "전남 순천시",
    processSteps: makeSteps(
      "05.06(수) 15:30", "05.07(목) 07:00", "처리완료",
      "광전송 장비 노후화",
      "광전송 장비 긴급 교체",
      "전남Access운용팀 황민준"
    ),
  },
  {
    id: "W-RM-012",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 익산시 기지국 낙뢰 피해 발생",
    occurredAt: "05.06(수) 16:45",
    resolvedAt: "05.07(목) 10:20",
    affectedCount: 1892,
    customerInquiry: 78,
    cause: "낙뢰로 인한 기지국 전원 공급 장치 및 안테나 손상",
    action: "전원 공급 장치 및 안테나 교체, 낙뢰 보호 장치 점검",
    status: "처리완료",
    area: "전북 익산시",
    processSteps: makeSteps(
      "05.06(수) 16:45", "05.07(목) 10:20", "처리완료",
      "낙뢰로 인한 장비 손상",
      "전원 공급 장치 및 안테나 교체",
      "전북Access운용팀 송지은"
    ),
  },
  {
    id: "W-RM-013",
    region: "west",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "제주 성산일출봉 인근 관광지 5G 불통 SNS 확산",
    occurredAt: "05.06(수) 17:20",
    resolvedAt: "05.06(수) 22:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "기지국 소프트웨어 업데이트 후 설정 오류",
    action: "소프트웨어 설정 복구 및 서비스 정상화",
    status: "처리완료",
    area: "제주 서귀포시 성산읍",
    processSteps: makeSteps(
      "05.06(수) 17:20", "05.06(수) 22:00", "처리완료",
      "소프트웨어 업데이트 후 설정 오류",
      "소프트웨어 설정 복구",
      "제주Access운용팀 부성호"
    ),
  },
  {
    id: "W-RM-014",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 광양시 제철소 인근 기지국 전파 간섭",
    occurredAt: "05.06(수) 19:30",
    resolvedAt: "05.07(목) 13:00",
    affectedCount: 1124,
    customerInquiry: 42,
    cause: "제철소 신규 설비 가동으로 인한 전파 간섭",
    action: "주파수 최적화 파라미터 조정 및 현장 RF 측정",
    status: "처리완료",
    area: "전남 광양시",
    processSteps: makeSteps(
      "05.06(수) 19:30", "05.07(목) 13:00", "처리완료",
      "제철소 신규 설비로 인한 전파 간섭",
      "주파수 최적화 파라미터 조정",
      "전남Access운용팀 정수현"
    ),
  },
  {
    id: "W-RM-015",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 정읍시 기지국 광케이블 화재 손상",
    occurredAt: "05.06(수) 21:05",
    resolvedAt: "05.07(목) 15:30",
    affectedCount: 2341,
    customerInquiry: 156,
    cause: "인근 화재로 인한 광케이블 소손",
    action: "광케이블 재포설 및 기지국 재기동",
    status: "처리완료",
    area: "전북 정읍시",
    processSteps: makeSteps(
      "05.06(수) 21:05", "05.07(목) 15:30", "처리완료",
      "인근 화재로 인한 광케이블 소손",
      "광케이블 재포설",
      "전북Access운용팀 윤채영"
    ),
  },
  {
    id: "W-RM-016",
    region: "west",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "광주 동구 충장로 일대 5G 커버리지 불만 보도",
    occurredAt: "05.07(목) 00:45",
    resolvedAt: "05.07(목) 10:00",
    affectedCount: null,
    customerInquiry: 0,
    cause: "구도심 건물 밀집으로 인한 전파 음영 지역 발생",
    action: "소형 기지국 추가 설치 및 RF 최적화",
    status: "처리완료",
    area: "광주 동구 충장로",
    processSteps: makeSteps(
      "05.07(목) 00:45", "05.07(목) 10:00", "처리완료",
      "구도심 건물 밀집으로 전파 음영",
      "소형 기지국 추가 설치",
      "전남Access운용팀 강태민"
    ),
  },
  {
    id: "W-RM-017",
    region: "west",
    source: "NMC: 담당_고장",
    category: "고장",
    title: "전남 신안군 도서 기지국 2식 전원 단절",
    occurredAt: "05.07(목) 02:30",
    resolvedAt: undefined,
    affectedCount: 891,
    customerInquiry: 34,
    cause: "도서 지역 한전 정전 및 축전지 방전",
    action: "선박 이용 현장 출동 및 비상 발전기 투입 진행 중",
    status: "처리중",
    area: "전남 신안군",
    processSteps: makeSteps(
      "05.07(목) 02:30", undefined, "처리중",
      "도서 지역 한전 정전 및 축전지 방전",
      "선박 이용 현장 출동",
      "전남Access운용팀 허지훈"
    ),
  },
  {
    id: "W-RM-018",
    region: "west",
    source: "NMC봇: 담당_언론",
    category: "언론",
    title: "제주 중문 관광단지 WiFi 불통 관광객 민원 급증",
    occurredAt: "05.07(목) 04:00",
    resolvedAt: undefined,
    affectedCount: null,
    customerInquiry: 0,
    cause: "WiFi AP 집중 접속으로 인한 과부하",
    action: "WiFi AP 용량 증설 및 부하 분산 설정 적용 진행 중",
    status: "처리중",
    area: "제주 서귀포시 중문",
    processSteps: makeSteps(
      "05.07(목) 04:00", undefined, "처리중",
      "WiFi AP 집중 접속으로 과부하",
      "WiFi AP 용량 증설",
      "제주Access운용팀 변수진"
    ),
  },
  {
    id: "W-RM-019",
    region: "west",
    source: "NMC: 팀_고장",
    category: "고장",
    title: "전북 완주군 기지국 냉각 시스템 이상",
    occurredAt: "05.07(목) 06:00",
    resolvedAt: undefined,
    affectedCount: 0,
    customerInquiry: 0,
    cause: "기지국 냉각 팬 2기 동시 고장으로 장비 온도 상승",
    action: "냉각 팬 긴급 교체 진행 중 (부품 이동 중)",
    status: "처리중",
    area: "전북 완주군",
    processSteps: makeSteps(
      "05.07(목) 06:00", undefined, "처리중",
      "냉각 팬 2기 동시 고장",
      "냉각 팬 긴급 교체",
      "전북Access운용팀 류민아"
    ),
  },
  {
    id: "W-RM-020",
    region: "west",
    source: "NMC봇: 팀_언론",
    category: "언론",
    title: "전남 해남군 해상 선박 통신 불통 어민 민원 접수",
    occurredAt: "05.07(목) 07:30",
    resolvedAt: undefined,
    affectedCount: null,
    customerInquiry: 0,
    cause: "해상 기지국 안테나 강풍 피해로 서비스 범위 축소",
    action: "안테나 점검 및 복구 일정 수립 중",
    status: "접수",
    area: "전남 해남군",
    processSteps: makeSteps(
      "05.07(목) 07:30", undefined, "접수",
      "해상 기지국 안테나 강풍 피해",
      "안테나 점검 및 복구 일정 수립",
      "전남Access운용팀 조성빈"
    ),
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 2. VoC 현황
// ═════════════════════════════════════════════════════════════════════════════

export interface VocItem {
  id: string;
  region: Region;
  /** 세부 상담명 */
  consultType: VocConsultType;
  /** 품질 발생 지역 코드 */
  locationCode: VocLocationCode;
  /** 광역시/도 */
  metropolitan: string;
  /** 시/군/구 */
  district: string;
  /** 날짜 (YYYY-MM-DD) */
  date: string;
  /** 월 (집계용) */
  month: number;
}

// ── VoC 생성 헬퍼 ─────────────────────────────────────────────────────────────

const VOC_CONSULT_TYPES: VocConsultType[] = [
  "HDVoice품질","WiFi문의","WiFi품질","단말설정","데이터품질",
  "부가서비스","영상품질","음성품질","제도/프로세스","기타",
];

const VOC_LOCATION_CODES: VocLocationCode[] = [
  "공공기관","공사현장","공장","교육기관","군부대","기숙사","도로","리조트",
  "병원","사무실","상가","선박","신규아파트","신축건물","아파트","오피스텔",
  "원룸/고시원","주택","철도","팬션","해상","호텔","휴양지","미분류",
];

// 상담 유형별 가중치 (실제 VoC 분포 반영)
const CONSULT_WEIGHTS: Record<VocConsultType, number> = {
  "데이터품질":     22,
  "음성품질":       18,
  "WiFi품질":       14,
  "WiFi문의":        8,
  "단말설정":        8,
  "영상품질":        7,
  "HDVoice품질":     6,
  "부가서비스":      6,
  "제도/프로세스":   5,
  "기타":           6,
};

// 발생 지역 코드별 가중치
const LOCATION_WEIGHTS: Record<VocLocationCode, number> = {
  "아파트":       18,
  "주택":         12,
  "사무실":       10,
  "도로":          8,
  "상가":          7,
  "신규아파트":    6,
  "교육기관":      5,
  "오피스텔":      5,
  "신축건물":      4,
  "원룸/고시원":   4,
  "공공기관":      3,
  "병원":          3,
  "공장":          3,
  "기숙사":        2,
  "미분류":        2,
  "철도":          1,
  "공사현장":      1,
  "군부대":        1,
  "호텔":          1,
  "리조트":        1,
  "팬션":          1,
  "휴양지":        1,
  "해상":          1,
  "선박":          1,
};

/** 가중치 기반 랜덤 선택 */
function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total   = entries.reduce((s, [, w]) => s + w, 0);
  let rand = Math.random() * total;
  for (const [key, weight] of entries) {
    rand -= weight;
    if (rand <= 0) return key;
  }
  return entries[0][0];
}

/** 시드 기반 의사 난수 (재현 가능한 MockData용) */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** YYYY-MM-DD 날짜 생성 (2026년 1월~5월) */
function randomDate(seed: number): { date: string; month: number } {
  const r     = seededRandom(seed);
  const month = Math.floor(r * 5) + 1;           // 1~5월
  const maxDay = [31, 28, 31, 30, 6][month - 1]; // 5월은 6일까지
  const day   = Math.floor(seededRandom(seed + 0.1) * maxDay) + 1;
  return {
    date:  `2026-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
    month,
  };
}

// ── 중부 지역 정보 ────────────────────────────────────────────────────────────

const CENTRAL_AREAS: { metro: string; districts: string[] }[] = [
  {
    metro: "대전광역시",
    districts: ["동구","서구","중구","남구","북구","유성구","대덕구"],
  },
  {
    metro: "세종특별자치시",
    districts: ["조치원읍","금남면","연서면","연동면","부강면","한솔동","도담동","어진동"],
  },
  {
    metro: "충청남도",
    districts: ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  },
  // ── (이어서) stabilityMockData.ts ────────────────────────────────────────────

  {
    metro: "충청북도",
    districts: ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],
  },
];

// ── 서부 지역 정보 ────────────────────────────────────────────────────────────

const WEST_AREAS: { metro: string; districts: string[] }[] = [
  {
    metro: "광주광역시",
    districts: ["동구","서구","남구","북구","광산구"],
  },
  {
    metro: "전라남도",
    districts: ["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],
  },
  {
    metro: "전라북도",
    districts: ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],
  },
  {
    metro: "제주특별자치도",
    districts: ["제주시","서귀포시"],
  },
];

// ── VoC 생성 함수 ─────────────────────────────────────────────────────────────

function generateVocList(
  region: Region,
  areas: { metro: string; districts: string[] }[],
  count: number,
  idPrefix: string,
): VocItem[] {
  const items: VocItem[] = [];

  // 상담 유형 균등 분배를 위한 버킷
  const consultBucket: VocConsultType[] = [];
  const totalWeight = Object.values(CONSULT_WEIGHTS).reduce((a, b) => a + b, 0);
  for (const [type, weight] of Object.entries(CONSULT_WEIGHTS) as [VocConsultType, number][]) {
    const fill = Math.round((weight / totalWeight) * count);
    for (let i = 0; i < fill; i++) consultBucket.push(type);
  }
  // 부족분 채우기
  while (consultBucket.length < count) {
    consultBucket.push(weightedRandom(CONSULT_WEIGHTS));
  }
  // 셔플
  for (let i = consultBucket.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i * 7.3 + 1.1) * (i + 1));
    [consultBucket[i], consultBucket[j]] = [consultBucket[j], consultBucket[i]];
  }

  // 발생 지역 코드 균등 분배 버킷
  const locationBucket: VocLocationCode[] = [];
  const locTotal = Object.values(LOCATION_WEIGHTS).reduce((a, b) => a + b, 0);
  for (const [code, weight] of Object.entries(LOCATION_WEIGHTS) as [VocLocationCode, number][]) {
    const fill = Math.round((weight / locTotal) * count);
    for (let i = 0; i < fill; i++) locationBucket.push(code);
  }
  while (locationBucket.length < count) {
    locationBucket.push(weightedRandom(LOCATION_WEIGHTS));
  }
  for (let i = locationBucket.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i * 5.7 + 2.3) * (i + 1));
    [locationBucket[i], locationBucket[j]] = [locationBucket[j], locationBucket[i]];
  }

  for (let i = 0; i < count; i++) {
    const seed        = i * 13.7 + (region === "central" ? 100 : 500);
    const areaIdx     = Math.floor(seededRandom(seed)       * areas.length);
    const distIdx     = Math.floor(seededRandom(seed + 0.3) * areas[areaIdx].districts.length);
    const { date, month } = randomDate(seed + 0.5);

    items.push({
      id:           `${idPrefix}-${String(i + 1).padStart(4, "0")}`,
      region,
      consultType:  consultBucket[i],
      locationCode: locationBucket[i],
      metropolitan: areas[areaIdx].metro,
      district:     areas[areaIdx].districts[distIdx],
      date,
      month,
    });
  }

  return items;
}

// ── 중부/서부 VoC 데이터 생성 (각 1,200건) ───────────────────────────────────

export const centralVocList: VocItem[] = generateVocList(
  "central", CENTRAL_AREAS, 1200, "C-VOC"
);

export const westVocList: VocItem[] = generateVocList(
  "west", WEST_AREAS, 1200, "W-VOC"
);

// ═════════════════════════════════════════════════════════════════════════════
// 3. 집계 헬퍼 함수
// ═════════════════════════════════════════════════════════════════════════════

// ── RM 집계 ───────────────────────────────────────────────────────────────────

/** 지역별 RM 목록 반환 */
export const getRmList = (region: Region): RmItem[] =>
  region === "central" ? centralRmList : westRmList;

/** RM 상태별 건수 집계 */
export const countRmByStatus = (
  list: RmItem[],
): Record<RmStatus, number> => ({
  처리완료: list.filter((r) => r.status === "처리완료").length,
  처리중:   list.filter((r) => r.status === "처리중").length,
  접수:     list.filter((r) => r.status === "접수").length,
});

/** RM 분류별 건수 집계 */
export const countRmByCategory = (
  list: RmItem[],
): Record<RmCategory, number> => ({
  고장: list.filter((r) => r.category === "고장").length,
  언론: list.filter((r) => r.category === "언론").length,
  장애: list.filter((r) => r.category === "장애").length,
  예방: list.filter((r) => r.category === "예방").length,
});

/** RM 소스별 건수 집계 */
export const countRmBySource = (
  list: RmItem[],
): Record<RmSource, number> => {
  const result = {} as Record<RmSource, number>;
  const sources: RmSource[] = [
    "NMC: 담당_고장","NMC: 팀_고장",
    "NMC봇: 담당_언론","NMC봇: 팀_언론",
  ];
  for (const s of sources) {
    result[s] = list.filter((r) => r.source === s).length;
  }
  return result;
};

// ── VoC 집계 ──────────────────────────────────────────────────────────────────

/** 지역별 VoC 목록 반환 */
export const getVocList = (region: Region): VocItem[] =>
  region === "central" ? centralVocList : westVocList;

/** 월별 VoC 건수 집계 */
export const countVocByMonth = (
  list: VocItem[],
): Record<number, number> => {
  const result: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  for (const item of list) {
    result[item.month] = (result[item.month] ?? 0) + 1;
  }
  return result;
};

/** 상담 유형별 VoC 건수 집계 */
export const countVocByConsultType = (
  list: VocItem[],
): Record<VocConsultType, number> => {
  const result = {} as Record<VocConsultType, number>;
  for (const t of VOC_CONSULT_TYPES) result[t] = 0;
  for (const item of list) result[item.consultType]++;
  return result;
};

/** 발생 지역 코드별 VoC 건수 집계 */
export const countVocByLocationCode = (
  list: VocItem[],
): Record<VocLocationCode, number> => {
  const result = {} as Record<VocLocationCode, number>;
  for (const c of VOC_LOCATION_CODES) result[c] = 0;
  for (const item of list) result[item.locationCode]++;
  return result;
};

/** 광역시별 VoC 건수 집계 */
export const countVocByMetro = (
  list: VocItem[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const item of list) {
    result[item.metropolitan] = (result[item.metropolitan] ?? 0) + 1;
  }
  return result;
};

/** 시/군/구별 VoC 건수 집계 */
export const countVocByDistrict = (
  list: VocItem[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const item of list) {
    const key = `${item.metropolitan} ${item.district}`;
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
};

/** 월 + 상담유형 교차 집계 (월간 차트용) */
export const countVocByMonthAndType = (
  list: VocItem[],
): Record<number, Record<VocConsultType, number>> => {
  const result: Record<number, Record<VocConsultType, number>> = {};
  for (let m = 1; m <= 5; m++) {
    result[m] = {} as Record<VocConsultType, number>;
    for (const t of VOC_CONSULT_TYPES) result[m][t] = 0;
  }
  for (const item of list) {
    result[item.month][item.consultType]++;
  }
  return result;
};

/** 월 + 발생지역코드 교차 집계 (월간 차트용) */
export const countVocByMonthAndLocation = (
  list: VocItem[],
): Record<number, Record<VocLocationCode, number>> => {
  const result: Record<number, Record<VocLocationCode, number>> = {};
  for (let m = 1; m <= 5; m++) {
    result[m] = {} as Record<VocLocationCode, number>;
    for (const c of VOC_LOCATION_CODES) result[m][c] = 0;
  }
  for (const item of list) {
    result[item.month][item.locationCode]++;
  }
  return result;
};

/** 특정 월 필터링 */
export const filterVocByMonth = (
  list: VocItem[],
  month: number,
): VocItem[] => list.filter((v) => v.month === month);

/** 특정 상담유형 필터링 */
export const filterVocByConsultType = (
  list: VocItem[],
  type: VocConsultType,
): VocItem[] => list.filter((v) => v.consultType === type);

/** 특정 발생지역코드 필터링 */
export const filterVocByLocationCode = (
  list: VocItem[],
  code: VocLocationCode,
): VocItem[] => list.filter((v) => v.locationCode === code);

/** 특정 광역시 필터링 */
export const filterVocByMetro = (
  list: VocItem[],
  metro: string,
): VocItem[] => list.filter((v) => v.metropolitan === metro);

// ═════════════════════════════════════════════════════════════════════════════
// 4. 통합 조회
// ═════════════════════════════════════════════════════════════════════════════

export interface RegionalStabilityData {
  rmList:   RmItem[];
  vocList:  VocItem[];
  /** RM 요약 */
  rmSummary: {
    total:       number;
    byStatus:    Record<RmStatus, number>;
    byCategory:  Record<RmCategory, number>;
    bySource:    Record<RmSource, number>;
  };
  /** VoC 요약 */
  vocSummary: {
    total:           number;
    byMonth:         Record<number, number>;
    byConsultType:   Record<VocConsultType, number>;
    byLocationCode:  Record<VocLocationCode, number>;
    byMetro:         Record<string, number>;
  };
}

const buildRegionalData = (region: Region): RegionalStabilityData => {
  const rmList  = getRmList(region);
  const vocList = getVocList(region);
  return {
    rmList,
    vocList,
    rmSummary: {
      total:      rmList.length,
      byStatus:   countRmByStatus(rmList),
      byCategory: countRmByCategory(rmList),
      bySource:   countRmBySource(rmList),
    },
    vocSummary: {
      total:          vocList.length,
      byMonth:        countVocByMonth(vocList),
      byConsultType:  countVocByConsultType(vocList),
      byLocationCode: countVocByLocationCode(vocList),
      byMetro:        countVocByMetro(vocList),
    },
  };
};

export const centralStabilityData: RegionalStabilityData =
  buildRegionalData("central");

export const westStabilityData: RegionalStabilityData =
  buildRegionalData("west");

export const getStabilityData = (region: Region): RegionalStabilityData =>
  region === "central" ? centralStabilityData : westStabilityData;

// ── 상수 export (컴포넌트에서 반복 정의 방지) ─────────────────────────────────

export { VOC_CONSULT_TYPES, VOC_LOCATION_CODES };
