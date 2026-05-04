import { X } from "lucide-react";
import { TonghabStation } from "../data/tonghabMockData";

interface StationListSidebarProps {
  stations: TonghabStation[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function StationListSidebar({
  stations,
  isOpen,
  onClose,
  title,
}: StationListSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[300] transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-2xl z-[301] transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--region-light)",
            borderBottomColor: "var(--region-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-0.5 h-5 rounded"
              style={{ backgroundColor: "var(--region-primary)" }}
            />
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <span className="text-sm text-gray-500 font-normal ml-2">
              총 {stations.length}개
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-73px)]">
          <div className="space-y-3">
            {stations.map((station) => (
              <div
                key={station.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[var(--region-primary)] hover:shadow-md transition-all"
              >
                {/* 국사명 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <h3 className="text-sm font-bold text-gray-900">
                      {station.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {station.id}
                  </span>
                </div>

                {/* 정보 그리드 */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">운용 구분</div>
                    <div
                      className="inline-flex px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: station.isClosing ? "#FFF3E0" : "#E6F0FF",
                        color: station.isClosing ? "var(--warn)" : "#3617CE",
                      }}
                    >
                      {station.isClosing ? "폐국 진행중" : "운용중"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 mb-1">지역</div>
                    <div className="font-medium text-gray-900">
                      {station.region}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 mb-1">임차형태</div>
                    <div
                      className="inline-flex px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: "var(--region-light)",
                        color: "var(--region-primary)",
                      }}
                    >
                      {station.leaseType}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 mb-1">발전기</div>
                    <div
                      className="inline-flex px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: station.hasGenerator
                          ? "#E6F7F1"
                          : "#FFF0F1",
                        color: station.hasGenerator
                          ? "var(--ok)"
                          : "var(--danger)",
                      }}
                    >
                      {station.hasGenerator ? "설치" : "미설치"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 mb-1">수전용량</div>
                    <div className="font-medium text-gray-900 font-mono">
                      {station.powerCapacity}kW
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-gray-500 mb-1">축전지</div>
                    <div className="font-medium text-gray-900">
                      {station.battery}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
