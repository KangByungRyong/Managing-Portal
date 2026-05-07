// src/app/data/securityMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// 보안 페이지 전용 Mock 데이터
// 중부 본부 (서버 120대) / 서부 본부 (서버 430대)
// PC 보안: 중부 기준 이미지 → 서부는 중부의 120% 수준
// ─────────────────────────────────────────────────────────────────────────────

export type Region = "central" | "west";

// ═════════════════════════════════════════════════════════════════════════════
// 1. 서버 보안
// ═════════════════════════════════════════════════════════════════════════════

// ── 1-1. 보안 조치 현황 타입 ──────────────────────────────────────────────────

export interface ServerSecurityActionItem {
  /** 조치 항목명 */
  label: string;
  /** 전체 대상 서버 수 */
  total: number;
  /** 조치 완료 대수 */
  completed: number;
  /** 조치 불필요 (해당 없음) 대수 */
  notApplicable: number;
  /** 진행 중 대수 (total - completed - notApplicable - pending) */
  inProgress: number;
  /** 미착수 대수 */
  pending: number;
}

export interface EquipmentStatusItem {
  /** 장비 현황 항목명 */
  label: "총 운용 장비 대수" | "운용 장비 대수" | "유휴 장비 대수" | "구축 장비 대수" | "폐기 장비 대수";
  /** 현재 대수 */
  count: number;
  /** 전월 대비 증감(대수) */
  delta: number;
}

/** 조치율 계산 헬퍼 */
export const calcActionRate = (item: ServerSecurityActionItem): number =>
  parseFloat(((item.completed / item.total) * 100).toFixed(1));

// ── 중부 서버 보안 조치 현황 (총 120대) ──────────────────────────────────────

const centralServerActions: ServerSecurityActionItem[] = [
  {
    label: "서버 내 기록 현황",
    total: 120,
    completed: 112,
    notApplicable: 3,
    inProgress: 4,
    pending: 1,
  },
  {
    label: "저장 제한",
    total: 120,
    completed: 108,
    notApplicable: 5,
    inProgress: 6,
    pending: 1,
  },
  {
    label: "EOS 장비 교체 및 리빌딩",
    total: 120,
    completed: 95,
    notApplicable: 8,
    inProgress: 12,
    pending: 5,
  },
  {
    label: "EDR 설치",
    total: 120,
    completed: 104,   // 5G 완료 + LTE 17식 완료 기반 반영
    notApplicable: 8, // EMS#31~38 (설치 불가)
    inProgress: 5,
    pending: 3,
  },
  {
    label: "보안 진단 및 Solution 적용",
    total: 120,
    completed: 98,
    notApplicable: 4,
    inProgress: 14,
    pending: 4,
  },
];

// ── 서부 서버 보안 조치 현황 (총 430대) ──────────────────────────────────────

const westServerActions: ServerSecurityActionItem[] = [
  {
    label: "서버 내 기록 현황",
    total: 430,
    completed: 391,
    notApplicable: 12,
    inProgress: 22,
    pending: 5,
  },
  {
    label: "저장 제한",
    total: 430,
    completed: 372,
    notApplicable: 18,
    inProgress: 28,
    pending: 12,
  },
  {
    label: "EOS 장비 교체 및 리빌딩",
    total: 430,
    completed: 318,
    notApplicable: 30,
    inProgress: 55,
    pending: 27,
  },
  {
    label: "EDR 설치",
    total: 430,
    completed: 358,
    notApplicable: 28,
    inProgress: 30,
    pending: 14,
  },
  {
    label: "보안 진단 및 Solution 적용",
    total: 430,
    completed: 335,
    notApplicable: 15,
    inProgress: 58,
    pending: 22,
  },
];

const centralEquipmentStatus: EquipmentStatusItem[] = [
  { label: "총 운용 장비 대수", count: 120, delta: 3 },
  { label: "운용 장비 대수", count: 117, delta: 4 },
  { label: "유휴 장비 대수", count: 3, delta: -1 },
  { label: "구축 장비 대수", count: 0, delta: 1 },
  { label: "폐기 장비 대수", count: 0, delta: -1 },
];

const westEquipmentStatus: EquipmentStatusItem[] = [
  { label: "총 운용 장비 대수", count: 430, delta: 8 },
  { label: "운용 장비 대수", count: 424, delta: 10 },
  { label: "유휴 장비 대수", count: 6, delta: -4 },
  { label: "구축 장비 대수", count: 0, delta: 3 },
  { label: "폐기 장비 대수", count: 0, delta: -1 },
];

// ── 1-2. 주요 과제 타입 ───────────────────────────────────────────────────────

export type TaskStatus = "완료" | "진행 중" | "연기" | "미착수";
export type TaskPriority = "긴급" | "일반" | "예정";

export interface SecurityTask {
  id: number;
  /** 요청일 */
  requestDate: string;
  /** 요청 부서 */
  requestTeam: string;
  /** 담당자 */
  manager?: string;
  /** 과제 제목 */
  title: string;
  /** 상세 내용 */
  description: string;
  /** 완료 기한 */
  deadline: string;
  /** 진행 현황 */
  status: TaskStatus;
  /** 완료일 */
  completedDate?: string;
  /** 진행 사항 상세 */
  progressDetail: string;
  /** 비고 */
  note?: string;
  priority: TaskPriority;
}

// ── 주요 과제 목록 (23개 — 중부/서부 공통 과제 기반, 지역별 상태 분리) ────────

const taskBase: Omit<SecurityTask, "status" | "completedDate" | "progressDetail">[] = [
  {
    id: 1,
    requestDate: "'25.09.05",
    requestTeam: "요소기술팀",
    title: "EDR(Endpoint Detection and Response) 설치",
    description: "5G USM 2식(USM#7,12 - VM 총 80식), LTE EMS 25식 대상 EDR 설치",
    deadline: "미지정",
    priority: "일반",
    note: "Linux(5.x) EMS 8식 OS Upgrade 및 EDR 설치 검토 중 (비용 이슈)",
  },
  {
    id: 2,
    requestDate: "'25.10.15",
    requestTeam: "A솔루션팀",
    manager: "황현민",
    title: "5G DU 접속 Default Password 변경",
    description: "5G DU 전체 대상 접속 Default Password 변경 시행",
    deadline: "'25.12.31",
    priority: "일반",
    note: "R-sol과 동시 변경 필요하여 담당자간 일정 조율 후 변경 시행",
  },
  {
    id: 3,
    requestDate: "'25.12.16",
    requestTeam: "운용기획팀",
    manager: "임재윤",
    title: "폐쇄망 업무용 PC SentinelOne EDR 설치 및 V3 삭제",
    description: "16대 중 1대 설치 완료(60점망), 15대(200점망) 설치 불가로 중단",
    deadline: "'26.01.15 (연기)",
    priority: "긴급",
    note: "200점망 외 192망, 38망도 proxy 연동 불가 PC 다수 존재 확인",
  },
  {
    id: 4,
    requestDate: "'26.01.20",
    requestTeam: "운용기획팀",
    manager: "임재윤",
    title: "폐쇄망 업무용 PC EDR 설치 불가 사유 확인 요청",
    description: "EDR 설치 불가 15대 전체 EDR proxy 연동 불가 회신",
    deadline: "'26.01.22",
    priority: "일반",
  },
  {
    id: 5,
    requestDate: "'26.01.02",
    requestTeam: "운용기획팀",
    manager: "임재윤",
    title: "폐쇄망 접속 BP사 PC 현황 조사",
    description: "5개 구축협력사 PC 10대 확인 (광진 2, 대성 3, 동서 1, 블루엔이 2, 영남 2)",
    deadline: "'26.01.08",
    priority: "일반",
  },
  {
    id: 6,
    requestDate: "'26.01.15",
    requestTeam: "운용기획팀",
    manager: "김승동",
    title: "BP사 업무용 PC 현황 조사",
    description: "총 171대 현황 조사 완료 (SKO 구성원용 PC 제외)",
    deadline: "'26.01.21",
    priority: "일반",
  },
  {
    id: 7,
    requestDate: "'26.02.05",
    requestTeam: "A솔루션팀",
    title: "LMT Port Lock 작업 시행",
    description: "기지국 물리 보안 강화를 위한 불필요한 LMT Port Lock 시행 (5G 1,442식, LTE 3,800식)",
    deadline: "'26.02.28",
    priority: "일반",
  },
  {
    id: 8,
    requestDate: "'26.02.09",
    requestTeam: "NAD",
    title: "URL 현황 조사",
    description: "NW 센터 내 URL 접속 가능 장비 현황 조사 (5G USM 2식, LTE EMS 25식)",
    deadline: "'26.02.24",
    priority: "일반",
  },
  {
    id: 9,
    requestDate: "'26.02.09",
    requestTeam: "NAD",
    title: "웹서비스(URL) 보안 진단",
    description: "URL 접속 가능 장비에 대한 URL 보안 진단 시행 (신청 및 진단 완료)",
    deadline: "'26.02.24",
    priority: "일반",
  },
  {
    id: 10,
    requestDate: "'26.02.10",
    requestTeam: "운용기획팀",
    manager: "김승동",
    title: "BP사 업무용 PC OS 업데이트(Win11) 및 백신 설치",
    description: "OS 업데이트 대상 32대 중 5대 완료. 표준 백신 172대 중 169대 설치 완료",
    deadline: "미지정",
    priority: "일반",
    note: "미완료 및 설치불가 30대는 추후 본사 가이드에 따라 추가 진행 예정",
  },
  {
    id: 11,
    requestDate: "'26.02.10",
    requestTeam: "요소기술팀",
    title: "BRMS 현행화",
    description: "A-BRMS(Backup & Recovery Management System) 연동 (5G/LTE EMS 서버군)",
    deadline: "'26.03.04",
    priority: "일반",
  },
  {
    id: 12,
    requestDate: "'26.02.23",
    requestTeam: "요소기술팀",
    title: "EDR Full Scan",
    description: "EDR Full Scan 시행 — 매주 화요일 03시 자동 동작 설정 (5G USM, LTE EMS)",
    deadline: "'26.03.10",
    priority: "일반",
  },
  {
    id: 13,
    requestDate: "'26.02.23",
    requestTeam: "요소기술팀",
    title: "SIMS 스크립트 설치",
    description: "SIMS(보안 이벤트 통합 관리·분석 시스템) 자산 정보 수집 스크립트 설치",
    deadline: "'26.03.13",
    priority: "일반",
  },
  {
    id: 14,
    requestDate: "'26.02.23",
    requestTeam: "요소기술팀",
    title: "보안 진단 Agent(솔리드스텝) 설치",
    description: "솔리드스텝 Agent 설치 → 보안 진단(3~4월) → 결과 조치(~6월)",
    deadline: "'26.03.31",
    priority: "일반",
    note: "LTE 초도: 3.20 EMS#39 / 전체 일정: ~6월 결과 조치",
  },
  {
    id: 15,
    requestDate: "'26.03.03",
    requestTeam: "요소기술팀",
    title: "EDR Agent 업그레이드",
    description: "5G USM#7,12(80식), LTE EMS 25식 대상 EDR Agent 업그레이드 ('26년 4월까지)",
    deadline: "'26.04.30",
    priority: "긴급",
    note: "설치 후 부하 증가 이슈 — 커널(v7.5) 리셋 발생. EDR OFF: EMS#151~155",
  },
  {
    id: 16,
    requestDate: "'26.03.12",
    requestTeam: "A솔루션팀",
    title: "HPE Aruba Networking AOS-CX 취약점 조치",
    description: "HPE Aruba AOS-CX 취약점 긴급 조치 요청",
    deadline: "즉시",
    priority: "긴급",
    note: "중부: HP 미사용으로 해당 없음",
  },
  {
    id: 17,
    requestDate: "'26.03.12",
    requestTeam: "A솔루션팀",
    title: "EDR 설치 조건 변경 (apse2 → apse1)",
    description: "EDR 설치 조건 apse2에서 apse1으로 변경 적용",
    deadline: "'26.03.16",
    priority: "일반",
  },
  {
    id: 18,
    requestDate: "'26.03.12",
    requestTeam: "A솔루션팀",
    title: "둔산사옥 60망 Telco-OSS NW 방화벽 Open",
    description: "Telco 관리망 - OSS NW 간 방화벽 도입에 따른 OCGW 60망 방화벽 Open 신청",
    deadline: "'26.03.19",
    priority: "일반",
    note: "방화벽 해제 목적지: 5G 18개, LTE 8개",
  },
  {
    id: 19,
    requestDate: "'26.03.23",
    requestTeam: "보안팀",
    title: "범용 S/W 현황 조사",
    description: "보안 취약점 신속 대응 목적 — 5G/LTE 서버군 범용 소프트웨어 현황 조사",
    deadline: "'26.03.31",
    priority: "일반",
    note: "'26년 7월 솔리드스텝 내 수집기능 도입 예정",
  },
  {
    id: 20,
    requestDate: "'26.04.01",
    requestTeam: "요소기술팀",
    title: "EDR 원장 / TANGO-I 현행화",
    description: "과기부 이행 점검 관련 자산 원장 현행화 (LTE EMS, 5G USM, 프론트홀, PMS 등)",
    deadline: "'26.04.01",
    priority: "긴급",
    note: "제출 이후 수정 불가",
  },
  {
    id: 21,
    requestDate: "'26.04.17",
    requestTeam: "네트워크보안팀",
    title: "SecureGW 우회접근 정책 관리 현황 및 검토",
    description: "SecureGW를 통하지 않은 접속 로그 기반 조사 (LTE EMS 서버군)",
    deadline: "'26.04.17",
    priority: "일반",
    note: "솔리드스텝 설치 관련 직접 접속 외 특이사항 없음",
  },
  {
    id: 22,
    requestDate: "'26.04.17",
    requestTeam: "보안탐지대응팀",
    title: "SentinelOne Windows Agent 업그레이드",
    description: "중부 프론트홀 및 PMS 서버 Windows 기반 서버 Agent 업그레이드",
    deadline: "'26.04.22",
    priority: "일반",
  },
  {
    id: 23,
    requestDate: "'26.04.17",
    requestTeam: "요소기술팀",
    title: "EDR 설치 불가 서버 BPFdoor 스케줄링 확인",
    description: "LTE EMS#31~38(8식) BPFdoor 크론탭 스케줄링 점검",
    deadline: "'26.04.21",
    priority: "일반",
    note: "스케줄링 점검 결과 양호",
  },
];

// ── 중부 과제 상태 (실제 Excel 기반) ─────────────────────────────────────────

const centralTaskStatusMap: Record<number, Pick<SecurityTask,
  "status" | "completedDate" | "progressDetail">> = {
  1:  { status: "진행 중",  completedDate: "1차 완료 '25.10.17", progressDetail: "5G 완료, LTE 25식 중 17식 완료. 8식 미완료 2차 진행 예정" },
  2:  { status: "완료",     completedDate: "'25.11.15",           progressDetail: "5G DU 전체 Default Password 변경 완료" },
  3:  { status: "연기",     completedDate: undefined,             progressDetail: "16대 중 1대 설치 완료(60점망). 15대(200점망) proxy 연동 불가로 중단. 가이드 대기 중" },
  4:  { status: "완료",     completedDate: "'26.01.22",           progressDetail: "EDR 설치 불가 15대 전체 proxy 연동 불가 회신 완료" },
  5:  { status: "완료",     completedDate: "'26.01.08",           progressDetail: "5개 구축협력사 PC 10대 확인 완료" },
  6:  { status: "완료",     completedDate: "'26.01.20",           progressDetail: "총 171대 현황 조사 완료" },
  7:  { status: "완료",     completedDate: "'26.02월",            progressDetail: "5G 1,442식 완료, LTE 3,800식 완료" },
  8:  { status: "완료",     completedDate: "'26.02월",            progressDetail: "5G 완료, LTE 완료" },
  9:  { status: "완료",     completedDate: "'26.02월",            progressDetail: "5G 완료, LTE 완료 (신청 및 진단 완료)" },
  10: { status: "완료",     completedDate: "'26.02.20",           progressDetail: "OS 업데이트 5대 완료(32대 중). 표준 백신 169대 설치 완료(172대 중)" },
  11: { status: "완료",     completedDate: "'26.02.26",           progressDetail: "5G 완료, LTE 완료" },
  12: { status: "완료",     completedDate: "'26.03.03",           progressDetail: "5G 완료, LTE 완료. 매주 화요일 03시 자동 동작" },
  13: { status: "완료",     completedDate: "'26.03.13",           progressDetail: "LTE 완료, 5G 완료" },
  14: { status: "완료",     completedDate: "'26.03.25",           progressDetail: "5G 2월 설치 완료, LTE 3월 설치 완료" },
  15: { status: "완료",     completedDate: "1차 완료 '26.03.26",  progressDetail: "5G 완료, LTE 총 25식 중 12식 완료. 미완료 비고 참조" },
  16: { status: "완료",     completedDate: "'26.03.12",           progressDetail: "중부 해당 사항 없음 (HP 미사용)" },
  17: { status: "완료",     completedDate: "'26.03.12",           progressDetail: "apse2 → apse1 조건 변경 완료" },
  18: { status: "완료",     completedDate: "'26.03.17",           progressDetail: "방화벽 해제 신청 완료 (5G 18개, LTE 8개)" },
  19: { status: "완료",     completedDate: "'26.03.23",           progressDetail: "'26년 7월 솔리드스텝 내 수집기능 도입 예정" },
  20: { status: "완료",     completedDate: "'26.04.01",           progressDetail: "LTE EMS, 5G USM, 프론트홀, PMS 등 중부 전체 서버군 현행화 완료" },
  21: { status: "완료",     completedDate: "'26.04.17",           progressDetail: "솔리드스텝 설치 관련 직접 접속 외 특이사항 없음" },
  22: { status: "완료",     completedDate: "'26.04.20",           progressDetail: "중부 프론트홀 및 PMS Windows 서버 Agent 업그레이드 완료" },
  23: { status: "완료",     completedDate: "'26.04.17",           progressDetail: "스케줄링 점검 결과 양호" },
};

// ── 서부 과제 상태 (중부 대비 진행 지연 반영) ─────────────────────────────────

const westTaskStatusMap: Record<number, Pick<SecurityTask,
  "status" | "completedDate" | "progressDetail">> = {
  1:  { status: "진행 중",  completedDate: undefined,             progressDetail: "5G 완료, LTE 43식 중 28식 완료. 15식 미완료 진행 중" },
  2:  { status: "완료",     completedDate: "'25.11.28",           progressDetail: "5G DU 전체 Default Password 변경 완료" },
  3:  { status: "진행 중",  completedDate: undefined,             progressDetail: "32대 중 8대 설치 완료(60점망). 24대(200점망) proxy 연동 불가. 가이드 대기 중" },
  4:  { status: "완료",     completedDate: "'26.01.24",           progressDetail: "EDR 설치 불가 28대 전체 proxy 연동 불가 회신 완료" },
  5:  { status: "완료",     completedDate: "'26.01.10",           progressDetail: "8개 구축협력사 PC 18대 확인 완료" },
  6:  { status: "완료",     completedDate: "'26.01.22",           progressDetail: "총 205대 현황 조사 완료" },
  7:  { status: "완료",     completedDate: "'26.02월",            progressDetail: "5G 1,731식 완료, LTE 4,560식 완료" },
  8:  { status: "완료",     completedDate: "'26.02월",            progressDetail: "5G 완료, LTE 완료" },
  9:  { status: "완료",     completedDate: "'26.03월",            progressDetail: "5G 완료, LTE 완료 (신청 및 진단 완료)" },
  10: { status: "진행 중",  completedDate: undefined,             progressDetail: "OS 업데이트 7대 완료(38대 중). 표준 백신 203대 설치 완료(206대 중). 3대 미설치 진행 중" },
  11: { status: "완료",     completedDate: "'26.03.05",           progressDetail: "5G 완료, LTE 완료" },
  12: { status: "완료",     completedDate: "'26.03.10",           progressDetail: "5G 완료, LTE 완료. 매주 화요일 03시 자동 동작" },
  13: { status: "완료",     completedDate: "'26.03.18",           progressDetail: "LTE 완료, 5G 완료" },
  14: { status: "완료",     completedDate: "'26.03.30",           progressDetail: "5G 3월 설치 완료, LTE 4월 설치 완료" },
  15: { status: "진행 중",  completedDate: undefined,             progressDetail: "5G 완료, LTE 총 38식 중 20식 완료. 18식 미완료 진행 중" },
  16: { status: "완료",     completedDate: "'26.03.15",           progressDetail: "서부 HP Aruba 장비 3식 취약점 조치 완료" },
  17: { status: "완료",     completedDate: "'26.03.14",           progressDetail: "apse2 → apse1 조건 변경 완료" },
  18: { status: "완료",     completedDate: "'26.03.20",           progressDetail: "방화벽 해제 신청 완료 (5G 22개, LTE 11개)" },
  19: { status: "완료",     completedDate: "'26.03.28",           progressDetail: "'26년 7월 솔리드스텝 내 수집기능 도입 예정" },
  20: { status: "완료",     completedDate: "'26.04.03",           progressDetail: "LTE EMS, 5G USM, 프론트홀, PMS 등 서부 전체 서버군 현행화 완료" },
  21: { status: "완료",     completedDate: "'26.04.19",           progressDetail: "솔리드스텝 설치 관련 직접 접속 외 특이사항 없음" },
  22: { status: "진행 중",  completedDate: undefined,             progressDetail: "서부 프론트홀 및 PMS Windows 서버 18식 중 12식 완료. 6식 진행 중" },
  23: { status: "완료",     completedDate: "'26.04.19",           progressDetail: "스케줄링 점검 결과 양호" },
};

// ── 과제 목록 조합 함수 ───────────────────────────────────────────────────────

const buildTaskList = (
  statusMap: typeof centralTaskStatusMap,
): SecurityTask[] =>
  taskBase.map((base) => ({
    ...base,
    ...statusMap[base.id],
  }));

export const centralSecurityTasks: SecurityTask[] = buildTaskList(centralTaskStatusMap);
export const westSecurityTasks: SecurityTask[]    = buildTaskList(westTaskStatusMap);

/** 완료율 계산 헬퍼 */
export const calcTaskCompletionRate = (tasks: SecurityTask[]): number => {
  const done = tasks.filter((t) => t.status === "완료").length;
  return parseFloat(((done / tasks.length) * 100).toFixed(1));
};

// ═════════════════════════════════════════════════════════════════════════════
// 2. PC 보안
// ═════════════════════════════════════════════════════════════════════════════

// ── 2-1. PC 구분 타입 ─────────────────────────────────────────────────────────

export type PcOwner   = "SKT" | "SKO" | "BP";
export type NetworkZone = "OA망" | "폐쇄망_60" | "폐쇄망_192" | "폐쇄망_200";

export interface PcCountItem {
  owner: PcOwner;
  /** OA망 (150점망) */
  oa: number;
  /** 폐쇄망 60점망 */
  closed60: number;
  /** 폐쇄망 192점망 */
  closed192: number;
  /** 폐쇄망 200점망 */
  closed200: number;
  /** 합계 */
  total: number;
}

// ── 중부 PC 대수 (이미지 기준 그대로) ────────────────────────────────────────
//
//  구분 │  OA망  │ 폐쇄망           │  계
//       │  150   │  60  │ 192 │ 200 │
// ──────┼────────┼──────┼─────┼─────┼────
//  SKT  │   1    │   1  │  -  │  15 │  17
//  SKO  │  30    │   9  │  -  │  11 │  50
//  BP   │  57    │   1  │  30 │  10 │  98
//  계   │  88    │  11  │  30 │  36 │ 165

export const centralPcCount: PcCountItem[] = [
  { owner: "SKT", oa: 1,  closed60: 1,  closed192: 0,  closed200: 15, total: 17  },
  { owner: "SKO", oa: 30, closed60: 9,  closed192: 0,  closed200: 11, total: 50  },
  { owner: "BP",  oa: 57, closed60: 1,  closed192: 30, closed200: 10, total: 98  },
];

export const centralPcTotal: PcCountItem = {
  owner: "SKT", // placeholder — 합계 행
  oa: 88, closed60: 11, closed192: 30, closed200: 36, total: 165,
};

// ── 서부 PC 대수 (중부의 120% 수준, 소수점 반올림) ───────────────────────────
//
//  구분 │  OA망  │ 폐쇄망              │  계
//       │  180   │  72  │ 230 │ 240  │
// ──────┼────────┼──────┼─────┼──────┼─────
//  SKT  │   1    │   1  │  -  │  18  │  20
//  SKO  │  36    │  11  │  -  │  13  │  60
//  BP   │  68    │   1  │  36 │  12  │ 117
//  계   │ 105    │  13  │  36 │  43  │ 197

export const westPcCount: PcCountItem[] = [
  { owner: "SKT", oa: 1,  closed60: 1,  closed192: 0,  closed200: 18, total: 20  },
  { owner: "SKO", oa: 36, closed60: 11, closed192: 0,  closed200: 13, total: 60  },
  { owner: "BP",  oa: 68, closed60: 1,  closed192: 36, closed200: 12, total: 117 },
];

export const westPcTotal: PcCountItem = {
  owner: "SKT",
  oa: 105, closed60: 13, closed192: 36, closed200: 43, total: 197,
};

// ── 2-2. PC 보안 점검 항목 타입 ───────────────────────────────────────────────

export type CheckCategory = "서비스 관리" | "패치 관리" | "계정 관리" | "보안 관리" | "S/W 관리";
export type CheckScope    = "공통" | "SKO 해당";

export interface PcSecurityCheckItem {
  id: string;
  category: CheckCategory;
  feature: string;
  scope: CheckScope;
}

// ── 점검 항목 목록 (Excel 기준 21개) ─────────────────────────────────────────

export const pcSecurityCheckItems: PcSecurityCheckItem[] = [
  // 서비스 관리
  { id: "SVC-01", category: "서비스 관리", feature: "공유 폴더 점검",   scope: "공통" },
  { id: "SVC-02", category: "서비스 관리", feature: "멀티 OS 점검",     scope: "공통" },
  { id: "SVC-03", category: "서비스 관리", feature: "NTFS 설정 점검",   scope: "공통" },
  // 패치 관리
  { id: "PAT-01", category: "패치 관리",   feature: "윈도우 최신 버전 점검",  scope: "공통" },
  { id: "PAT-02", category: "패치 관리",   feature: "윈도우 업데이트 점검",   scope: "공통" },
  // 계정 관리
  { id: "ACC-01", category: "계정 관리",   feature: "패스워드 변경 주기 점검",   scope: "공통" },
  { id: "ACC-02", category: "계정 관리",   feature: "패스워드 최소길이 점검",    scope: "공통" },
  { id: "ACC-03", category: "계정 관리",   feature: "패스워드 복잡성 점검",      scope: "공통" },
  { id: "ACC-04", category: "계정 관리",   feature: "복구 콘솔 자동로그온 점검", scope: "공통" },
  // 보안 관리
  { id: "SEC-01", category: "보안 관리",   feature: "화면보호기 설정",                  scope: "공통" },
  { id: "SEC-02", category: "보안 관리",   feature: "화면보호기 10분 이내 설정",         scope: "공통" },
  { id: "SEC-03", category: "보안 관리",   feature: "화면보호기 암호화 점검",            scope: "공통" },
  { id: "SEC-04", category: "보안 관리",   feature: "백신 프로그램 업데이트 점검",       scope: "공통" },
  { id: "SEC-05", category: "보안 관리",   feature: "백신 프로그램 실시간 감시",         scope: "공통" },
  { id: "SEC-06", category: "보안 관리",   feature: "Windows Defender 방화벽 실행 점검", scope: "공통" },
  { id: "SEC-07", category: "보안 관리",   feature: "휴지통 점검",                      scope: "공통" },
  // S/W 관리
  { id: "SW-01",  category: "S/W 관리",    feature: "이글아이 설치 점검",   scope: "SKO 해당" },
  { id: "SW-02",  category: "S/W 관리",    feature: "문서보안 설치 점검",   scope: "SKO 해당" },
  { id: "SW-03",  category: "S/W 관리",    feature: "SKT-AD 설치 점검",     scope: "공통" },
  { id: "SW-04",  category: "S/W 관리",    feature: "SKT-DLP 설치 점검",    scope: "공통" },
  { id: "SW-05",  category: "S/W 관리",    feature: "evEraser 설치 점검",   scope: "공통" },
];

// ── 2-3. PC 점검 결과 타입 ────────────────────────────────────────────────────

export interface PcCheckResult {
  checkId: string;
  owner: PcOwner;
  networkZone: NetworkZone;
  /** 해당 owner × zone 의 전체 PC 수 */
  totalPc: number;
  /** 양호 대수 */
  good: number;
  /** 조치 필요 대수 */
  needsAction: number;
  /** 미점검 대수 (점검 미완료) */
  unchecked: number;
}

/** 양호율 계산 헬퍼 */
export const calcGoodRate = (r: PcCheckResult): number =>
  r.totalPc > 0
    ? parseFloat(((r.good / r.totalPc) * 100).toFixed(1))
    : 0;

// ── PC 점검 결과 생성 헬퍼 ────────────────────────────────────────────────────

/**
 * owner × zone × checkId 조합으로 점검 결과 생성
 * @param total        해당 조합의 전체 PC 수
 * @param goodRate     양호 비율 (0~1)
 * @param uncheckedRate 미점검 비율 (0~1)
 */
function makeCheckResult(
  checkId: string,
  owner: PcOwner,
  networkZone: NetworkZone,
  total: number,
  goodRate: number,
  uncheckedRate = 0,
): PcCheckResult {
  const unchecked    = Math.round(total * uncheckedRate);
  const checkedTotal = total - unchecked;
  const good         = Math.round(checkedTotal * goodRate);
  const needsAction  = checkedTotal - good;
  return { checkId, owner, networkZone, totalPc: total, good, needsAction, unchecked };
}

// ── 점검 결과 생성 설정 테이블 ────────────────────────────────────────────────
// [owner, zone, total, goodRate, uncheckedRate]
// goodRate: SKO 해당 항목은 SKT/BP에서 0 (해당 없음 처리)

type ResultConfig = [PcOwner, NetworkZone, number, number, number];

/**
 * 중부 PC 대수 기준 설정
 * 각 항목의 양호율은 실제 보안 수준을 반영하여 차등 설정
 */
const centralPcMatrix: ResultConfig[] = [
  // SKT
  ["SKT", "OA망",       1,  0.90, 0.00],
  ["SKT", "폐쇄망_60",  1,  0.85, 0.00],
  ["SKT", "폐쇄망_200", 15, 0.88, 0.05],
  // SKO
  ["SKO", "OA망",       30, 0.87, 0.03],
  ["SKO", "폐쇄망_60",  9,  0.82, 0.05],
  ["SKO", "폐쇄망_200", 11, 0.80, 0.08],
  // BP
  ["BP",  "OA망",       57, 0.78, 0.05],
  ["BP",  "폐쇄망_60",  1,  0.75, 0.00],
  ["BP",  "폐쇄망_192", 30, 0.72, 0.10],
  ["BP",  "폐쇄망_200", 10, 0.74, 0.08],
];

/**
 * 서부 PC 대수 기준 설정 (중부 120% 수준)
 */
const westPcMatrix: ResultConfig[] = [
  // SKT
  ["SKT", "OA망",       1,  0.88, 0.00],
  ["SKT", "폐쇄망_60",  1,  0.83, 0.00],
  ["SKT", "폐쇄망_200", 18, 0.85, 0.06],
  // SKO
  ["SKO", "OA망",       36, 0.84, 0.04],
  ["SKO", "폐쇄망_60",  11, 0.79, 0.06],
  ["SKO", "폐쇄망_200", 13, 0.77, 0.09],
  // BP
  ["BP",  "OA망",       68, 0.75, 0.06],
  ["BP",  "폐쇄망_60",  1,  0.72, 0.00],
  ["BP",  "폐쇄망_192", 36, 0.69, 0.11],
  ["BP",  "폐쇄망_200", 12, 0.71, 0.09],
];

// ── 항목별 양호율 보정 오프셋 ─────────────────────────────────────────────────
// 점검 항목 특성에 따라 양호율을 미세 조정
// 양수 = 해당 항목이 잘 지켜짐, 음수 = 취약한 항목

const checkItemGoodRateOffset: Record<string, number> = {
  "SVC-01": -0.05, // 공유 폴더 — 취약하기 쉬움
  "SVC-02":  0.02,
  "SVC-03":  0.01,
  "PAT-01": -0.08, // 윈도우 최신 버전 — 업데이트 지연 多
  "PAT-02": -0.06,
  "ACC-01": -0.04, // 패스워드 변경 주기 — 미준수 多
  "ACC-02":  0.03,
  "ACC-03":  0.02,
  "ACC-04":  0.05,
  "SEC-01":  0.04,
  "SEC-02": -0.03,
  "SEC-03":  0.02,
  "SEC-04":  0.06, // 백신 업데이트 — 비교적 잘 됨
  "SEC-05":  0.05,
  "SEC-06":  0.04,
  "SEC-07": -0.02,
  "SW-01":   0.00, // SKO 전용 (비SKO는 해당 없음)
  "SW-02":   0.00,
  "SW-03":   0.03,
  "SW-04":   0.02,
  "SW-05":   0.01,
};

// ── 점검 결과 전체 생성 함수 ──────────────────────────────────────────────────

function buildPcCheckResults(matrix: ResultConfig[]): PcCheckResult[] {
  const results: PcCheckResult[] = [];

  for (const item of pcSecurityCheckItems) {
    for (const [owner, zone, total, baseGoodRate, uncheckedRate] of matrix) {
      // SKO 전용 항목은 SKT/BP에서 제외 (total = 0 처리)
      if (item.scope === "SKO 해당" && owner !== "SKO") {
        results.push({
          checkId: item.id,
          owner,
          networkZone: zone,
          totalPc: total,
          good: 0,
          needsAction: 0,
          unchecked: total, // 전체 미해당
        });
        continue;
      }

      const offset       = checkItemGoodRateOffset[item.id] ?? 0;
      const adjustedRate = Math.min(0.99, Math.max(0.30, baseGoodRate + offset));

      results.push(
        makeCheckResult(item.id, owner, zone, total, adjustedRate, uncheckedRate)
      );
    }
  }

  return results;
}

export const centralPcCheckResults: PcCheckResult[] = buildPcCheckResults(centralPcMatrix);
export const westPcCheckResults: PcCheckResult[]    = buildPcCheckResults(westPcMatrix);

// ── 2-4. 점검 결과 집계 헬퍼 ─────────────────────────────────────────────────

/**
 * 특정 checkId의 전체 집계 (owner × zone 합산)
 */
export const aggregateByCheckId = (
  results: PcCheckResult[],
  checkId: string,
): { totalPc: number; good: number; needsAction: number; unchecked: number } => {
  const filtered = results.filter((r) => r.checkId === checkId);
  return filtered.reduce(
    (acc, r) => ({
      totalPc:     acc.totalPc     + r.totalPc,
      good:        acc.good        + r.good,
      needsAction: acc.needsAction + r.needsAction,
      unchecked:   acc.unchecked   + r.unchecked,
    }),
    { totalPc: 0, good: 0, needsAction: 0, unchecked: 0 }
  );
};

/**
 * 특정 owner의 전체 점검 결과 집계
 */
export const aggregateByOwner = (
  results: PcCheckResult[],
  owner: PcOwner,
): { totalPc: number; good: number; needsAction: number; unchecked: number } => {
  const filtered = results.filter((r) => r.owner === owner);
  return filtered.reduce(
    (acc, r) => ({
      totalPc:     acc.totalPc     + r.totalPc,
      good:        acc.good        + r.good,
      needsAction: acc.needsAction + r.needsAction,
      unchecked:   acc.unchecked   + r.unchecked,
    }),
    { totalPc: 0, good: 0, needsAction: 0, unchecked: 0 }
  );
};

/**
 * 카테고리별 점검 결과 집계
 */
export const aggregateByCategory = (
  results: PcCheckResult[],
  category: CheckCategory,
): { totalPc: number; good: number; needsAction: number; unchecked: number } => {
  const checkIds = pcSecurityCheckItems
    .filter((i) => i.category === category)
    .map((i) => i.id);
  const filtered = results.filter((r) => checkIds.includes(r.checkId));
  return filtered.reduce(
    (acc, r) => ({
      totalPc:     acc.totalPc     + r.totalPc,
      good:        acc.good        + r.good,
      needsAction: acc.needsAction + r.needsAction,
      unchecked:   acc.unchecked   + r.unchecked,
    }),
    { totalPc: 0, good: 0, needsAction: 0, unchecked: 0 }
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// 3. 지역별 통합 조회
// ═════════════════════════════════════════════════════════════════════════════

export interface RegionalSecurityData {
  /** 서버 보안 조치 현황 */
  serverActions: ServerSecurityActionItem[];
  /** 서버 총 대수 */
  serverTotal: number;
  /** 서버 장비 현황 */
  equipmentStatus: EquipmentStatusItem[];
  /** 주요 과제 목록 */
  tasks: SecurityTask[];
  /** PC 대수 현황 */
  pcCount: PcCountItem[];
  /** PC 합계 행 */
  pcTotal: PcCountItem;
  /** PC 점검 결과 */
  pcCheckResults: PcCheckResult[];
}

export const centralSecurityData: RegionalSecurityData = {
  serverActions:    centralServerActions,
  serverTotal:      120,
  equipmentStatus:  centralEquipmentStatus,
  tasks:            centralSecurityTasks,
  pcCount:          centralPcCount,
  pcTotal:          centralPcTotal,
  pcCheckResults:   centralPcCheckResults,
};

export const westSecurityData: RegionalSecurityData = {
  serverActions:    westServerActions,
  serverTotal:      430,
  equipmentStatus:  westEquipmentStatus,
  tasks:            westSecurityTasks,
  pcCount:          westPcCount,
  pcTotal:          westPcTotal,
  pcCheckResults:   westPcCheckResults,
};

export const getSecurityData = (region: Region): RegionalSecurityData =>
  region === "central" ? centralSecurityData : westSecurityData;
