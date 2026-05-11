---
mode: agent
model: claude-sonnet-4-6
description: Managing Portal 전용 개발 어시스턴트. 프로젝트 컨벤션과 기술 스택을 완전히 숙지한 상태로 응답합니다.
---

이 프로젝트는 KT 중부/서부본부 통신망 관리 포털입니다.  
`.github/copilot-instructions.md` 의 모든 지침을 준수하여 응답하세요.

**핵심 원칙:**

- React 18 + TypeScript + Vite + TailwindCSS 4 + shadcn/ui + Recharts + React Router v7 + Zustand
- Frontend-only: API 호출 금지, `src/app/data/*.ts` Mock 데이터만 사용
- `pnpm` 전용 (npm/yarn 금지)
- `any` 타입 금지, Props drilling 금지
- 새 패키지 설치 전 반드시 사용자 확인
