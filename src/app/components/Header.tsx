interface HeaderProps {
  region: "central" | "west";
  onRegionChange: (region: "central" | "west") => void;
  lastUpdated: string;
  onUpdate: () => void;
  isUpdating?: boolean;
}

export function Header({
  region,
  onRegionChange,
  lastUpdated,
  onUpdate,
  isUpdating = false,
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-[200] bg-gray-900 text-white px-6 h-[52px] flex items-center gap-3">
      {/* 로고 */}
      <div className="flex items-center gap-2 mr-3">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm transition-colors"
          style={{ backgroundColor: "var(--region-primary)" }}
        >
          T
        </div>
        <span className="text-sm font-bold">SKT</span>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <span className="text-xs text-gray-300">
          Network 경영 포털
        </span>
      </div>

      {/* 담당 토글 */}
      <div className="flex items-center bg-white/10 rounded-lg p-0.5 gap-0.5">
        <button
          onClick={() => onRegionChange("central")}
          className={`px-3.5 py-1 rounded text-xs font-medium transition-all ${
            region === "central"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={
            region === "central"
              ? { backgroundColor: "var(--region-primary)" }
              : {}
          }
        >
          🔵 중부
        </button>
        <button
          onClick={() => onRegionChange("west")}
          className={`px-3.5 py-1 rounded text-xs font-medium transition-all ${
            region === "west"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={
            region === "west"
              ? { backgroundColor: "var(--region-primary)" }
              : {}
          }
        >
          🟢 서부
        </button>
      </div>

      {/* 우측 컨트롤 */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* 기준일시 */}
        <div className="text-xs text-white/35 font-mono">
          {lastUpdated}
        </div>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs transition-colors"
            style={{ backgroundColor: "var(--region-primary)" }}
          >
            김
          </div>
          <span>김담당 · 담당자</span>
        </div>
      </div>
    </header>
  );
}