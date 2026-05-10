# GitHub Copilot Instructions — Managing Portal

## 프로젝트 개요
- KT 중부/서부본부 통신망 관리 포털 (Frontend-only, 백엔드 없음)
- 모든 데이터는 `src/app/data/*.ts` Mock 파일에서 공급
- 실제 API 연동 시 해당 파일만 교체하는 구조로 설계됨

---

## 기술 스택 (고정 — 임의 추가 금지)

| 항목 | 버전 | 용도 |
|------|------|------|
| React | 18.3.1 | UI 프레임워크 |
| TypeScript | strict | 타입 안전성 |
| Vite | 6.3.5 | 빌드 도구 |
| TailwindCSS | 4.1.12 | 스타일링 (`@tailwindcss/vite`) |
| shadcn/ui + Radix UI | latest | UI 컴포넌트 (`src/app/components/ui/`) |
| Recharts | 2.15.2 | 차트 (Chart.js 사용 금지) |
| React Router | v7.13.0 | 라우팅 (`createBrowserRouter`) |
| Zustand | 5.0.13 | 전역 상태 관리 |
| pnpm | workspace | 패키지 매니저 (npm/yarn 사용 금지) |

---

## 프로젝트 구조

```
src/
  app/
    components/       # 공유 UI 컴포넌트
      ui/             # shadcn/ui 컴포넌트 (직접 수정 지양)
      home/           # 홈 페이지 전용 컴포넌트
    data/             # Mock 데이터 (*.ts)
    layouts/          # React Router 레이아웃 (RootLayout, FacilityLayout, SafetyLayout)
    pages/            # 라우트별 페이지 컴포넌트
    router.tsx        # createBrowserRouter 설정
    stores/
      appStore.ts     # Zustand 전역 스토어
    types/
      navigation.ts   # 네비게이션 타입 및 navigationConfig
  styles/             # 글로벌 CSS (theme.css, globals.css 등)
```

---

## 코딩 컨벤션

### 컴포넌트
- 함수 컴포넌트만 사용 (클래스 컴포넌트 금지)
- named export 사용 (`export function Foo()`, default export는 페이지에서만)
- Props 타입은 인라인 인터페이스로 정의: `function Foo({ bar }: { bar: string })`
- Props drilling 금지 — 전역 상태는 반드시 `useAppStore()` 사용

### 상태 관리
- 컴포넌트 간 공유 상태 → `src/app/stores/appStore.ts` (Zustand)
- 로컬 UI 상태(토글, 폼 등)만 `useState` 허용
- 라우팅 상태(현재 페이지) → URL이 단일 진실 공급원. `navState`를 Zustand에 두지 않음

### 라우팅
- `useNavigate()` / `useLocation()` 사용 (Link 컴포넌트는 선택)
- 탭 클릭 → `navigate("/status/facility/tonghab")` 형태의 URL 이동
- 새 페이지 추가 시 `router.tsx`에 경로 등록 필수

### 스타일링
- Tailwind 유틸리티 클래스 우선 사용
- 인라인 `style={{}}` 은 CSS 변수(`--region-primary` 등)를 사용하는 경우에만 허용
- 절대 위치(`absolute`) 최소화, flexbox/grid 우선
- 반응형 불필요 (관리자 전용 대시보드, 고정 레이아웃)

### 레이아웃 & 스크롤 전략 (필수 준수)

**기본 원칙**: 1920px 너비 고정 + **세로 스크롤 허용**

| 계층 | 적용 클래스 | 설명 |
|------|------------|------|
| `RootLayout` 외부 div | `w-screen min-h-screen` | 전체 폭 고정, 세로는 자연 확장 |
| `RootLayout` `<main>` | `overflow-y-auto` + `minHeight: calc(100vh - Xpx)` | 세로 스크롤 허용, 최소 뷰포트 높이 확보 |
| `FacilityLayout` / `SafetyLayout` | `flex flex-col` (overflow 없음) | 자연 높이 흐름, 내부 Outlet이 스크롤 |
| 페이지 루트 div | **`h-full` / `overflow-hidden` 금지** | `flex flex-col gap-N` 으로 자연 흐름 |
| 차트/지도 등 고정 높이 블록 | `h-[Npx]` 또는 `style={{ height: N }}` 명시 | `flex-1 min-h-0` 체인 사용 금지 |
| 카드 내부 스크롤 필요 시 | `overflow-y-auto` + 부모 명시 높이 | 카드 내부에서만 스크롤, 페이지 전체 스크롤에 영향 없음 |

**금지 패턴** (새 페이지 작성 시 사용 금지):
```tsx
// ❌ 금지: overflow-hidden이 세로 스크롤을 막음
<div className="h-screen overflow-hidden">
<main className="overflow-hidden" style={{ height: "calc(100vh - 100px)" }}>

// ❌ 금지: h-full 체인이 콘텐츠를 클리핑
<div className="h-full">
  <div className="flex flex-col h-full min-h-0">
    <div className="flex-1 min-h-0">  {/* 내부 요소가 잘림 */}
```

**권장 패턴**:
```tsx
// ✅ 페이지 루트
<div className="flex flex-col gap-3">

// ✅ 고정 높이가 필요한 차트/지도 영역
<div className="h-[440px] flex gap-2">
  <div className="flex-1 min-w-0"><MapPanel /></div>
  <div className="flex-1 min-w-0"><ChartPanel /></div>
</div>

// ✅ 카드 내부에서만 스크롤
<div className="bg-white rounded-lg p-3 h-full flex flex-col">
  <div className="flex-1 overflow-y-auto">...</div>
</div>
```

### TypeScript
- `any` 타입 사용 금지 (`unknown` 또는 구체 타입 사용)
- 타입 단언(`as`) 은 narrowing이 불가능할 때만 최소한으로 사용
- 인터페이스보다 `type` alias 선호 (단, 확장 가능성 있으면 `interface`)

### 파일 명명
- 컴포넌트 파일: PascalCase (`GijigukPage.tsx`)
- 데이터/유틸 파일: camelCase (`gijigukMockData.ts`)
- 한 파일 = 하나의 관심사 원칙 유지

---

## 도메인 용어 (비즈니스 맥락)

| 한글 | 영문 키 | 설명 |
|------|---------|------|
| 중부본부 | `central` | region 값, 충남/충북 담당 |
| 서부본부 | `west` | region 값, 전남/전북/제주 담당 |
| 통합국 | `tonghab` | 국사(건물) 단위 관리 |
| 기지국 | `giji` | 5G/LTE/WCDMA/LoRa 장비 관리 |
| 중계기 | `junggye` | 광중계기 |
| 충남Access운용팀 | — | 충남, 대전, 세종 담당 |
| 충북Access운용팀 | — | 충북 담당 |
| 전남Access운용팀 | — | 전남 담당 |
| 전북Access운용팀 | — | 전북 담당 |
| 제주Access운용팀 | — | 제주 담당 |

### 기지국 장비 분류 체계
- **5G**: CDU10, CDU20_EL, CDU20_NK, DUH10, DUH20 계열
- **LTE**: DU20/25/30/35, ENB 계열
- **WCDMA**: E3/E3R, ENB-ELG, FX, IPNB, DBTS 계열
- **LoRa**: LRGW, LRGWIB, LRGWREV

### 중계기 장비 분류 체계
- **5G**: AAU10/11/20/21, PRU10/11, OPRU10, RO-AAU/GIRO/PRU 계열
- **LTE**: ARRU, CRU, DBRRU 계열 (추가 정의 필요)
- **WCDMA**: (추가 정의 필요)
- **이동전화공통 / WIBRO**: (추가 정의 필요)

---

## 테마 시스템

CSS 변수로 담당(region) 별 색상 분기:

| 변수 | 용도 |
|------|------|
| `--region-primary` | 주요 강조색 |
| `--region-light` | 배경 연색 |
| `--region-border` | 테두리색 |

`data-region="central"` / `data-region="west"` 속성이 `<html>` 에 부착됨.  
`useAppStore().region` 변경 → `RootLayout.tsx` useEffect가 자동 반영.

---

## 금지 사항

- `npm` / `yarn` 사용 금지 (pnpm 전용 워크스페이스)
- Props drilling (2단계 이상 prop 전달) 금지
- 백엔드 API 호출 코드 작성 금지 (Mock 데이터 전용)
- `Chart.js` 신규 도입 금지 (Recharts 사용)
- `any` 타입 사용 금지
- `src/app/components/ui/` 파일 직접 수정 금지 (shadcn/ui 관리 영역)
- 새 npm 패키지 임의 설치 금지 — 반드시 사용자 확인 후 진행

---

## 현재 구현 상태

| 페이지 | 경로 | 상태 |
|--------|------|------|
| 홈 | `/home` | ✅ 구현 |
| 통합국 현황 | `/status/facility/tonghab` | ✅ 구현 |
| 기지국 현황 | `/status/facility/giji` | ✅ 구현 |
| 중계기 현황 | `/status/facility/junggye` | ✅ 구현 |
| WiFi/Femto 현황 | `/status/facility/lora` | ⬜ BlankPage |
| 재고 현황 | `/status/inventory` | ✅ 구현 |
| 특화 지표 | `/status/specialized` | ⬜ BlankPage |
| 작업 | `/status/safety/work` | ✅ 구현 |
| 보안 | `/status/safety/security` | ✅ 구현 |
| 안정 | `/status/stability` | ✅ 구현 |
| CapEx | `/metrics/capex` | ✅ 구현 |
| OpEx | `/metrics/opex` | ✅ 구현 |
