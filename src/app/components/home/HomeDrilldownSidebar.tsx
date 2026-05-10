import { X } from "lucide-react";

interface HomeDrilldownSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
}

export function HomeDrilldownSidebar({ isOpen, onClose, title, subtitle }: HomeDrilldownSidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-[360]" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[86%] lg:w-[52%] xl:w-[42%] bg-white shadow-2xl z-[361] transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--region-light)",
            borderBottomColor: "var(--region-border)",
          }}
        >
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-73px)]">
          <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
            <h3 className="text-base font-bold text-gray-800 mb-2">세부 정보</h3>
            <p className="text-sm text-gray-500">
              선택 항목의 상세 내용을 여기에 구성할 수 있습니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
            <h4 className="text-base font-bold text-gray-700 mb-3">상세 항목(Placeholder)</h4>
            <div className="grid grid-cols-[92px_1fr] gap-y-2 text-base">
              <div className="text-gray-500">작업명</div>
              <div className="text-gray-700">추후 입력</div>

              <div className="text-gray-500">지역</div>
              <div className="text-gray-700">추후 입력</div>

              <div className="text-gray-500">분류</div>
              <div className="text-gray-700">추후 입력</div>

              <div className="text-gray-500">담당팀</div>
              <div className="text-gray-700">추후 입력</div>

              <div className="text-gray-500">주/야간</div>
              <div className="text-gray-700">추후 입력</div>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
            <h4 className="text-base font-bold text-gray-700 mb-2">메모</h4>
            <div className="text-sm text-gray-500">사용자 입력 영역 (내용 작성 예정)</div>
          </div>
        </div>
      </div>
    </>
  );
}