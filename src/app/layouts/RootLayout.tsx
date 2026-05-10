// src/app/layouts/RootLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 전체 앱의 최상위 레이아웃
// Header + Navigation을 감싸고, Outlet으로 페이지 콘텐츠를 렌더링
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { useAppStore } from "../stores/appStore";

export function RootLayout() {
  const { region, isNavExpanded, setLastUpdated, setDbLastUpdated } =
    useAppStore();

  // 초기 시간 설정 및 1초 클럭
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    setLastUpdated(fmt());

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setDbLastUpdated(`${year}-${month}-${day}`);

    const interval = setInterval(() => setLastUpdated(fmt()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 담당 변경 시 테마 업데이트
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-region",
      region === "central" ? "central" : "west",
    );
  }, [region]);

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <Header />
      <Navigation />
      <main
        className="p-4 flex flex-col transition-all duration-300 overflow-x-hidden"
        style={{
          marginTop: isNavExpanded ? "140px" : "100px",
          minHeight: isNavExpanded
            ? "calc(100vh - 140px)"
            : "calc(100vh - 100px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
