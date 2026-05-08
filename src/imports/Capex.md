# CAPEX_PAGE_DESIGN.md
# CapEx 페이지 설계 명세서 (AI Context Document)
# 
# 목적: 이 문서는 Network 경영 포털의 CapEx 페이지 구현을 위한
#       데이터 구조, 화면 설계, 계산 로직을 AI가 코드 생성 시
#       참조할 수 있도록 단일 파일로 정리한 명세서입니다.
#
# 작성일: 2026-05-08
# 적용 본부: 중부(central) / 서부(west)
# 관련 파일: capexTypes.ts, capexMockData.ts, capexConfirmData.ts

---

## [SECTION 1] 비즈니스 컨텍스트

### 1-1. 업무 흐름
CapEx(자본지출) 집행은 아래 순서로 진행된다.

  STEP 1. AFE 승인
    - 연간 6~7차에 걸쳐 예산이 순차 승인됨
    - 차수가 발행될 때마다 누적 승인금액이 계단식으로 증가
    - 데이터 소스: capex_confirm 테이블

  STEP 2. 공사 착수 (NSheet 발행)
    - AFE 승인 후 현장 공사 착수를 위한 NSheet(작업지시서) 발행
    - date_nsheet 필드에 발행일 기록
    - NULL이면 아직 미착수

  STEP 3. 선로 개통
    - 전송망(백홀) 연결 작업 완료
    - date_transwork 필드에 완료일 기록

  STEP 4. 장비 설치
    - 기지국 장비(AAU, RRU 등) 물리 설치 완료
    - date_hwwork 필드에 완료일 기록

  STEP 5. 시험
    - 네트워크 품질 검증 시험 완료
    - date_test 필드에 완료일 기록

  STEP 6. 개통 완료
    - 상용 서비스 개통 완료
    - date_subscription 필드에 완료일 기록
    - open_clause = "개통완료"

### 1-2. AFE 누적 구조
  - AFE는 연간 6~7차 발행 (예: 1차 1월, 2차 3월, 3차 5월 ...)
  - 각 차수의 승인금액은 독립적으로 관리되며 누적 합산하여 사용
  - 미승인 예정 차수는 "예정" 상태로 표시
  - 집행(실적)은 공사 진행에 따라 완만하게 누적 증가
  - 핵심 시각화: 승인(계단형) vs 집행(면적형) 누적 콤보차트

---

## [SECTION 2] 데이터 소스 정의

### 2-1. capex_rawdata (공사 단계 추적)
  - 역할: 개별 공사 건별 진행 단계 추적
  - 단위: 건(row) = 기지국 1개소 공사 1건
  - 중부 300건 / 서부 300건 (총 600건)

  주요 필드:
    region          : "중부" | "서부"
    network         : "5G" | "LTE" | "Legacy"
    bizyear         : "2025" | "2026"
    afenumber       : "AFE 1차" | "AFE 2차" | ...  ← confirm 테이블과 연결
    commethod       : "인빌딩" | "광중계기" | "기지국" | "RF중계기" | "WMC"
    biz_category    : "신설" | "이설" | "대개체" | "철거"
    biz_subcategory : 세부 사업 분류
    bpnm            : BP사명 (중부: 블루/대성/영남/광진, 서부: 남양/미주/전통/국민)
    station_nm      : 기지국명
    mtso_nm         : 통합국사명
    work_addr       : 작업주소
    date_nsheet     : NSheet 발행일 (NULL = 미발행)
    date_transwork  : 선로개통 완료일 (NULL = 미완료)
    date_hwwork     : 장비설치 완료일 (NULL = 미완료)
    date_test       : 시험 완료일 (NULL = 미완료)
    date_subscription: 개통 완료일 (NULL = 미완료)
    open_clause     : 현재 상태 코드 (아래 2-4 참조)
    plannedHW       : 계획 장비명
    confirmHW       : 실제 설치 장비명 (개통완료 시에만 값 존재)
    capex_amount    : 사업별 CapEx 금액 (단위: 천원)

### 2-2. capex_confirm (AFE 승인 예산)
  - 역할: AFE 차수별 비목(투자항목)별 승인 예산 관리
  - 단위: row = 비목 1개 항목

  주요 필드:
    region          : "중부" | "서부"
    afe             : "AFE 1차" | "AFE 2차" | ...
    comcode         : 통시코드 (예: 2640C41905)
    investName      : 투자명 (예: "본원적 경쟁력 강화_5G")
    projcode        : 프로젝트코드 (예: "E.C267")
    childcode       : 비목코드 (예: "632117") ← construction 테이블과 연결키
    childcode_nm    : 비목명 (예: "(기지국/광:중부)..5G(1차)-기지국(3.5G_신규커버리지)")
    biz_detail      : 사업 상세명 (예: "5G(1차)-기지국(3.5G_신규커버리지)")
    confirm_amount  : 승인금액 (단위: 천원, 0이면 미배정)

  투자명(investName) 분류:
    - "본원적 경쟁력 강화_5G"    → 5G 관련 기지국/RF/이설
    - "본원적 경쟁력 강화_LTE"   → LTE 관련 기지국/RF/이설
    - "유선 유효 경쟁력 강화_유선"→ 유선 전송망
    - "MULTI-NW 효율화_WI-FI"   → Wi-Fi
    - "정보보호 수준 제고_NW센터" → ICT 보안

### 2-3. capex_construction (공사 집행 현황)
  - 역할: 비목별 확정/집행/잔여 금액 및 진행률 집계
  - 단위: row = 비목 1개 항목의 집계값
  - childcode로 capex_confirm과 1:1 매핑

  주요 필드:
    region      : "중부" | "서부"
    AFE         : "AFE 1차" | "AFE 2차" | ...
    childcode   : 비목코드 ← confirm 테이블과 연결키
    investName  : 비목명
    confirm     : 확정금액 (단위: 백만원)
    execution   : 집행금액 (단위: 백만원)
    remain      : 잔여금액 (단위: 백만원)
    progress    : 집행률 (%)

  주의: confirm 테이블은 천원 단위, construction 테이블은 백만원 단위

### 2-4. open_clause 상태 코드 정의
  "개통완료"        : 모든 단계 완료, 상용 서비스 중
  "구축_공사진행중" : date_hwwork까지 완료, 시험 전
  "구축_시험예정"   : date_test까지 완료, 개통 대기
  "KT_시설지연"     : 선로 개통 단계에서 KT 인프라 문제로 지연
  "선로_선로미개통" : NSheet 발행 후 선로 개통 대기
  "치국_시트미발행" : NSheet 미발행, 공사 미착수

### 2-5. 테이블 연결 관계
  capex_rawdata.afenumber  ──→  capex_confirm.afe
  capex_confirm.childcode  ──→  capex_construction.childcode
  (childcode가 두 테이블의 조인 키)

---

## [SECTION 3] 공사 단계 판별 로직

각 rawdata 건의 날짜 필드 4개로 현재 공사 단계를 판별한다.

  단계 판별 우선순위 (위에서 아래로 순차 체크):

  1. 미발행
     조건: date_nsheet IS NULL
     의미: 공사 미착수 상태

  2. NSheet 발행 완료
     조건: date_nsheet IS NOT NULL AND date_transwork IS NULL
     의미: 작업지시서 발행, 선로 개통 대기

  3. 선로 개통 완료
     조건: date_transwork IS NOT NULL AND date_hwwork IS NULL
     의미: 전송망 연결 완료, 장비 설치 대기

  4. 장비 설치 완료
     조건: date_hwwork IS NOT NULL AND date_test IS NULL
     의미: 물리 장비 설치 완료, 시험 대기

  5. 시험 완료
     조건: date_test IS NOT NULL AND date_subscription IS NULL
     의미: 품질 시험 완료, 개통 대기

  6. 개통 완료
     조건: date_subscription IS NOT NULL
     의미: 상용 서비스 개통 완료

---

## [SECTION 4] 화면 레이아웃 명세

### 4-1. 페이지 헤더
  위치: 최상단
  구성요소:
    - 페이지 제목: "CapEx 현황"
    - 필터 1: 본부 선택 드롭다운 [중부 | 서부]
    - 필터 2: AFE 차수 선택 드롭다운 [전체 | AFE 1차 | AFE 2차 | ...]
    - 필터 3: 사업년도 선택 드롭다운 [2025 | 2026]
    - DB 업데이트 일시 표시 (우측 상단)

### 4-2. Zone 1 — KPI 카드 4개
  위치: 헤더 바로 아래, 가로 4등분 배치

  카드 1: AFE 승인예산 (계획)
    메인값: SUM(capex_confirm.confirm_amount) — 선택된 차수까지 누적 합산
    단위: 백만원 (천원 → 백만원 변환 표시)
    서브텍스트: "AFE N차 기준 / 비목 N개"
    색상: 파랑 (중립)

  카드 2: 공사 집행금액 (실적)
    메인값: SUM(capex_construction.execution) — 선택된 차수 기준
    단위: 백만원
    서브텍스트: "전월 대비 +NM"
    색상: 파랑 (중립)

  카드 3: 예산 소진율
    메인값: SUM(execution) / SUM(confirm) × 100
    단위: %
    서브텍스트: "목표 소진율 대비 Gap"
    색상: 목표 대비 낮으면 주황, 정상이면 초록
    시각화: 인라인 프로그레스바

  카드 4: 공사 완료율
    메인값: COUNT(date_subscription IS NOT NULL) / COUNT(*) × 100
    단위: %
    서브텍스트: "N건 / 전체 N건 (개통완료 기준)"
    색상: 달성률에 따라 초록/주황/빨강

### 4-3. Zone 2 — 계획 대비 실적 (누적 차트 + 테이블)
  위치: Zone 1 아래

  #### 4-3-1. 누적 콤보차트 (상단 메인)
    차트 타입: ComposedChart (recharts)
    X축: AFE 차수 발행 시점 (1차, 2차, 3차 ...)
    Y축: 금액 (백만원)

    데이터 시리즈:
      시리즈 A: 누적 승인금액
        타입: Step Line (계단형)
        색상: 파랑 (#3b82f6)
        의미: AFE 차수 발행 시마다 수직 상승
        데이터: 차수별 confirm_amount 누적 합산

      시리즈 B: 누적 집행금액
        타입: Area Chart
        색상: 하늘색 (#93c5fd, 투명도 0.4)
        의미: 공사 진행에 따라 완만하게 증가
        데이터: construction.execution 누적 합산

      시리즈 C: 연간 목표선
        타입: 수평 점선 (ReferenceLine)
        색상: 회색 (#9ca3af)
        의미: 연간 전체 목표 예산

      시리즈 D: 미승인 예정 차수
        타입: 점선 Step Line
        색상: 연회색 (#d1d5db)
        의미: 아직 승인되지 않은 예정 차수

    인터랙션:
      - 차수 포인트 클릭 시 해당 차수 상세 테이블 하이라이트

  #### 4-3-2. AFE 차수별 집행률 테이블 (하단)
    컬럼 구성:
      구분        : AFE 차수명 (AFE 1차, AFE 2차 ...)
      승인금액    : SUM(confirm_amount) — 해당 차수 (단위: 백만원)
      누적집행    : SUM(execution) — 해당 차수 (단위: 백만원)
      잔여금액    : 승인금액 - 누적집행
      집행률      : 누적집행 / 승인금액 × 100 (%)
      상태        : 배지 표시 (아래 상태 정의 참조)

    상태 배지:
      "진행중"   → 파랑  : execution > 0인 차수
      "승인완료" → 초록  : confirm_amount > 0이나 execution = 0
      "예정"     → 회색  : 미승인 예정 차수 (점선 처리)

    누적합계 행:
      모든 차수의 승인금액 합계 / 집행 합계 / 잔여 합계 / 전체 집행률

    인터랙션:
      - 행 클릭 시 해당 차수의 비목별 상세 내역 펼치기 (Accordion)
      - 펼쳐진 내역: investName 그룹 헤더 + 비목별 confirm/execution/remain/progress

### 4-4. Zone 3 — 공사 단계별 현황 (도넛차트 5개)
  위치: Zone 2 아래
  레이아웃: 가로 5등분, 화살표(→)로 순서 연결

  도넛 1: 사업 목표
    중앙값: 전체 건수 (예: 300건)
    채움: 100% (기준값이므로 전체 채움)
    색상: 회색 (#6b7280)
    서브: "전체 사업 기준"
    데이터: COUNT(*) from capex_rawdata

  도넛 2: NSheet 발행
    중앙값: date_nsheet IS NOT NULL 건수
    완료율: 발행완료 건수 / 전체 건수 × 100
    채움: 완료율 %
    색상: 하늘색 (#38bdf8)
    서브: "미발행 N건"
    데이터: COUNT(date_nsheet IS NOT NULL)

  도넛 3: 선로 개통
    중앙값: date_transwork IS NOT NULL 건수
    완료율: 완료 건수 / 전체 건수 × 100
    채움: 완료율 %
    색상: 파랑 (#3b82f6)
    서브: "대기 N건"
    데이터: COUNT(date_transwork IS NOT NULL)

  도넛 4: 장비 설치
    중앙값: date_hwwork IS NOT NULL 건수
    완료율: 완료 건수 / 전체 건수 × 100
    채움: 완료율 %
    색상: 남색 (#6366f1)
    서브: "대기 N건"
    데이터: COUNT(date_hwwork IS NOT NULL)

  도넛 5: 시험/개통
    중앙값: date_subscription IS NOT NULL 건수
    완료율: 개통완료 건수 / 전체 건수 × 100
    채움: 완료율 %
    색상: 초록 (#22c55e)
    서브: "대기 N건"
    데이터: COUNT(date_subscription IS NOT NULL)

  도넛 공통 구성요소:
    - 도넛 내부 중앙: "완료건수 / 전체건수" 텍스트
    - 도넛 하단: 완료율 % (큰 텍스트)
    - 도넛 하단 서브: "미발행 N건" 또는 "대기 N건" (작은 텍스트, 회색)
    - 단계 간 화살표(→) 연결로 흐름 표현
    - 색상 그라데이션: 회색 → 하늘 → 파랑 → 남색 → 초록 (단계 진행 표현)

---

## [SECTION 5] 핵심 계산식 정의

  ### KPI 계산
  AFE_누적_승인금액  = SUM(capex_confirm.confirm_amount) WHERE afe IN (선택된 차수들)
  총_집행금액        = SUM(capex_construction.execution) WHERE AFE IN (선택된 차수들)
  잔여금액           = SUM(capex_construction.remain)
  예산_소진율        = 총_집행금액 / AFE_누적_승인금액 × 100
  공사_완료율        = COUNT(date_subscription IS NOT NULL) / COUNT(*) × 100

  ### 단계별 건수 계산
  미발행_건수        = COUNT(*) WHERE date_nsheet IS NULL
  NSheet발행_건수    = COUNT(*) WHERE date_nsheet IS NOT NULL
  선로개통_건수      = COUNT(*) WHERE date_transwork IS NOT NULL
  장비설치_건수      = COUNT(*) WHERE date_hwwork IS NOT NULL
  시험완료_건수      = COUNT(*) WHERE date_test IS NOT NULL
  개통완료_건수      = COUNT(*) WHERE date_subscription IS NOT NULL

  ### 누적 차트 데이터 계산
  차수별_누적_승인 = 1차부터 해당 차수까지 confirm_amount 누적 합산
  차수별_누적_집행 = 1차부터 해당 차수까지 execution 누적 합산
  차수별_집행률    = 해당 차수 execution / 해당 차수 confirm × 100

  ### 단위 변환
  capex_confirm.confirm_amount : 천원(KRW) → 표시 시 백만원으로 변환 (÷ 1,000)
  capex_construction.confirm   : 백만원(M) → 그대로 사용
  capex_construction.execution : 백만원(M) → 그대로 사용

---

## [SECTION 6] 컴포넌트 구조

  파일 경로: src/app/components/capex/

  CapexPage (page.tsx)
  ├── CapexHeader.tsx
  │     역할: 본부/AFE차수/사업년도 필터, DB 업데이트 일시
  │     props: region, afeFilter, yearFilter, onFilterChange
  │
  ├── CapexKpiCards.tsx  [Zone 1]
  │     역할: KPI 카드 4개 렌더링
  │     props: confirmTotal, executionTotal, soakRate, completionRate, totalCount, completedCount
  │     데이터: capex_confirm + capex_construction + capex_rawdata 집계값
  │
  ├── CapexCumulativeChart.tsx  [Zone 2 상단]
  │     역할: 누적 승인 vs 집행 콤보차트 (Step Line + Area)
  │     props: afeSeriesData (차수별 누적 승인/집행 배열)
  │     라이브러리: recharts ComposedChart
  │
  ├── CapexAfeTable.tsx  [Zone 2 하단]
  │     역할: AFE 차수별 집행률 테이블 + 비목별 Accordion 드릴다운
  │     props: afeTableData, constructionData
  │     인터랙션: 행 클릭 시 비목별 상세 펼치기
  │
  └── CapexPipelineDonut.tsx  [Zone 3]
        역할: 공사 단계별 도넛차트 5개 + 화살표 연결
        props: rawData (capex_rawdata 배열)
        내부 계산: 각 단계별 건수 집계
        라이브러리: recharts PieChart (도넛 모드)

---

## [SECTION 7] 추후 확장 계획 (Phase 2)

  ### 7-1. 비목별 세부 집행 내역 테이블
    위치: Zone 2 테이블의 AFE 차수 행 클릭 시 펼쳐지는 Accordion 영역
    구성: investName 그룹 헤더 + 비목별 행
    컬럼: 비목명 | 계획(승인) | 집행(실적) | 잔여 | 집행률 | 프로그레스바
    데이터: capex_confirm LEFT JOIN capex_construction ON childcode

  ### 7-2. 사업 목록 테이블
    위치: Zone 3 도넛차트 클릭 시 해당 단계 사업 목록 표시
    트리거: 도넛차트 클릭 → 해당 단계 필터 적용
    컬럼: 기지국명 | 망종류 | BP사 | NSheet | 선로개통 | 장비설치 | 상태배지
    데이터: capex_rawdata 필터링

  ### 7-3. BP사별 현황 테이블
    구성: BP사 × 공사단계 크로스탭
    컬럼: BP사명 | 전체 | 개통완료 | 진행중 | 지연 | 미착수
    데이터: capex_rawdata GROUP BY bpnm, open_clause

---

## [SECTION 8] 중부/서부 데이터 특성 차이

  중부 (central):
    - 사업년도: 2026년 중심 (85%), 2025년은 미진행 항목만 (15%)
    - BP사: 블루(SK하이닉스 B2B 특화), 대성, 영남, 광진
    - 주요 지역: 청주, 대전, 세종, 충주, 천안
    - 특이사항: SK하이닉스 M11/M15 대규모 B2B 인빌딩 프로젝트 포함
    - AFE 승인금액 규모: 서부 대비 약 105~110% 수준

  서부 (west):
    - 사업년도: 2025년 중심 (75%), 2026년 25%
    - BP사: 남양(제주 특화), 미주(전북), 전통(광주/전남), 국민(광주/전남)
    - 주요 지역: 광주, 전주, 익산, 군산, 순천, 제주
    - 특이사항: 도서 지역(제주, 신안 홍도, 추자도) 포함으로 공사 난이도 높음
    - AFE 승인금액 규모: 중부 대비 약 90~95% 수준

---

## [SECTION 9] 화면 읽기 흐름 (UX 의도)

  이 페이지는 아래 3단계 읽기 흐름을 지원하도록 설계되었다.

  STEP 1. 전체 규모 파악 (5초)
    → Zone 1 KPI 카드 4개
    → "올해 AFE 승인 총액이 얼마고, 지금까지 얼마를 집행했는가"

  STEP 2. 집행 트렌드 파악 (10초)
    → Zone 2 누적 콤보차트
    → "AFE 차수가 어떻게 쌓였고, 집행이 어느 시점부터 시작됐는가"
    → Zone 2 테이블로 차수별 정확한 수치 확인

  STEP 3. 공사 병목 파악 (10초)
    → Zone 3 도넛차트 5개
    → "공사가 어느 단계에서 가장 많이 막혀있는가"
    → 대기 건수가 많은 단계 = 즉시 조치 필요 구간

  전체 읽기 방향: 위→아래 (수직 스크롤)
  드릴다운 방향: 차트/테이블 클릭 → 상세 데이터 펼치기
