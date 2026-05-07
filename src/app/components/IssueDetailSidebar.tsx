import { X } from "lucide-react";

interface IssueDetailItem {
  siteName: string;
  siteCode: string;
  state: string;
  city: string;
  severity: "주의" | "경계" | "심각";
  abnormalCategories: string[];
  equipmentNames?: string[];
  detectedAt: string;
  address?: string;
}

interface IssueDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  item: IssueDetailItem | null;
}

export function IssueDetailSidebar({ isOpen, onClose, title, item }: IssueDetailSidebarProps) {
  const severityClass =
    item?.severity === "심각"
      ? "bg-rose-50 text-rose-600 border-rose-200"
      : item?.severity === "경계"
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-blue-50 text-blue-600 border-blue-200";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-[340]" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[86%] lg:w-[52%] xl:w-[42%] bg-white shadow-2xl z-[341] transform transition-transform duration-500 ${
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
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate">선택 항목 상세</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-73px)]">
          {!item ? (
            <div className="text-sm text-gray-400">선택된 항목이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-800">{item.siteName}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severityClass}`}>
                    {item.severity}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {item.state} {item.city}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="grid grid-cols-[84px_1fr] gap-y-2 text-sm">
                  <div className="text-gray-500">기지국 이름</div>
                  <div className="font-semibold text-gray-800">{item.siteName}</div>

                  <div className="text-gray-500">주소</div>
                  <div className="text-gray-700">{item.address ?? "주소 정보 없음"}</div>

                  <div className="text-gray-500">Code</div>
                  <div className="font-mono text-gray-800">{item.siteCode}</div>

                  <div className="text-gray-500">감지 시각</div>
                  <div className="text-gray-700">{item.detectedAt}</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">이슈 사항</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.abnormalCategories.length === 0 && (
                    <span className="text-xs text-gray-400">이슈 정보 없음</span>
                  )}
                  {item.abnormalCategories.map((issue) => (
                    <span key={issue} className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-700">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">구성 장비 명</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(!item.equipmentNames || item.equipmentNames.length === 0) && (
                    <span className="text-xs text-gray-400">장비 정보 없음</span>
                  )}
                  {item.equipmentNames?.map((equipName) => (
                    <span key={equipName} className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-700">
                      {equipName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
