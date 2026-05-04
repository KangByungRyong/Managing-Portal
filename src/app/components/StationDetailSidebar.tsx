import { useState } from "react";
import { X, Edit2, Save } from "lucide-react";
import { TonghabStation } from "../data/tonghabMockData";

interface StationDetailSidebarProps {
  station: TonghabStation | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "basic" | "modernization" | "status";

// Modernization 항목 (37개)
const modernizationItems = [
  { id: 1, name: "과제 01-1: 노후설비 대개체 기준 실행력 강화(분전반)", phase: "AFE 1차", completed: true },
  { id: 2, name: "과제 01-2: 노후설비 대개체 기준 실행력 강화(냉방기)", phase: "AFE 1차", completed: true },
  { id: 3, name: "과제 02: 설비 구조개선 Process 재정립", phase: "AFE 1차", completed: true },
  { id: 4, name: "과제 03: 망구조 변화 대응 통합국 설계 기준 개정", phase: "AFE 1차", completed: true },
  { id: 5, name: "과제 04: 통신 Infra 내진 Legal 이슈 효과적 대응", phase: "AFE 1차", completed: true },
  { id: 6, name: "과제 05: 한전 배전선로 이원화 및 주/예비 선로 감시 강화", phase: "AFE 1차", completed: true },
  { id: 7, name: "과제 06: 전원설비 정밀 점검 및 선제적 부품 교체", phase: "AFE 1차", completed: true },
  { id: 8, name: "과제 07: 분전반 열화상 측정 DT 기반 고도화", phase: "AFE 1차", completed: true },
  { id: 9, name: "과제 08: 인입차단기 단중화 구조 Risk 감소", phase: "AFE 1차", completed: true },
  { id: 10, name: "과제 09: SPD 성능 검증 통한 성능 판단 강화", phase: "AFE 1차", completed: true },
  { id: 11, name: "과제 10: 정류기 구조 개선(2N) 통한 안정성 강화", phase: "AFE 2차", completed: true },
  { id: 12, name: "과제 11: 노후 정류기 대개체 강화", phase: "AFE 2차", completed: true },
  { id: 13, name: "과제 12: 리튬이온 축전지 Back up 시간 보강", phase: "AFE 2차", completed: true },
  { id: 14, name: "과제 13: 망구조 개선에 따른 정류기/축전지 최적화", phase: "AFE 2차", completed: true },
  { id: 15, name: "과제 14: 통합 전원실 확보 및 통합 전원 구조 추진", phase: "AFE 2차", completed: true },
  { id: 16, name: "과제 15: 대용량 전원공급체계 확보", phase: "AFE 2차", completed: false },
  { id: 17, name: "과제 16: 냉방기 설치 기준 재정립", phase: "AFE 2차", completed: false },
  { id: 18, name: "과제 17: 가변 용량 냉방기 성능 개선", phase: "AFE 2차", completed: false },
  { id: 19, name: "과제 18: 자연공조형 냉방기 구조 변경 및 조기 대개체", phase: "AFE 2차", completed: false },
  { id: 20, name: "과제 19: 냉방기 안정성 강화 Item 검증 및 실행력 강화", phase: "AFE 2차", completed: false },
  { id: 21, name: "과제 20: Best RM 기반 설비 현황 고도화", phase: "AFE 3차", completed: false },
  { id: 22, name: "과제 21: 이동용 발전차 최적 운용 방안 및 RM 대응 강화", phase: "AFE 3차", completed: false },
  { id: 23, name: "과제 22: 고온 대응 RM 솔루션 지속 강화", phase: "AFE 3차", completed: false },
  { id: 24, name: "과제 23: 통합국 누수 및 침수 대응 강화", phase: "AFE 3차", completed: false },
  { id: 25, name: "과제 24: 리튬 축전지 화재 Risk 최소화 (LFP 추전지 대개체)", phase: "AFE 3차", completed: false },
  { id: 26, name: "과제 25: 냉방 저효율 국소 개선", phase: "AFE 3차", completed: false },
  { id: 27, name: "과제 26: 고효율 냉방기 도입", phase: "AFE 3차", completed: false },
  { id: 28, name: "과제 27: 고효율 정류기 도입", phase: "AFE 3차", completed: false },
  { id: 29, name: "과제 28: 외기 활용 자연 공조 솔루션 도입", phase: "AFE 3차", completed: false },
  { id: 30, name: "과제 29: 장비실 온도 상향 조정", phase: "AFE 3차", completed: false },
  { id: 31, name: "과제 30: 냉방 Cycle 원격 감시/진단 및 개선", phase: "AFE 4차", completed: false },
  { id: 32, name: "과제 31: 전력 측정 및 지표화", phase: "AFE 4차", completed: false },
  { id: 33, name: "과제 32: 통합관리시스템 신규 개발", phase: "AFE 4차", completed: false },
  { id: 34, name: "과제 33: 설비 데이터 Migration 및 통합 관리", phase: "AFE 4차", completed: false },
  { id: 35, name: "과제 34: 리튬축전지 감시 강화", phase: "AFE 4차", completed: false },
  { id: 36, name: "과제 35: 통합국 냉방기 유지보수 강화", phase: "AFE 4차", completed: false },
  { id: 37, name: "과제 36: 통합국 설비 운용 역량 강화", phase: "AFE 4차", completed: false },
];

export function StationDetailSidebar({
  station,
  isOpen,
  onClose,
}: StationDetailSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [statusNote, setStatusNote] = useState("정기 점검 완료. 모든 시스템 정상 작동 중.");
  const [isEditing, setIsEditing] = useState(false);

  if (!station) return null;

  const completedCount = modernizationItems.filter((item) => item.completed).length;

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
            <h2 className="text-lg font-bold text-gray-900">{station.name}</h2>
            <span className="text-xs text-gray-400 font-mono">{station.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-[var(--region-primary)] text-[var(--region-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            기본 정보
          </button>
          <button
            onClick={() => setActiveTab("modernization")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "modernization"
                ? "border-[var(--region-primary)] text-[var(--region-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Modernization
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "status"
                ? "border-[var(--region-primary)] text-[var(--region-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            상태 세부 정보
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-137px)]">
          {/* Tab 1: 기본 정보 */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1.5">국사명</div>
                <div className="text-lg text-gray-900 font-bold">
                  {station.name}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">운용 구분</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor: station.isClosing ? "#FFF3E0" : "#E6F0FF",
                    color: station.isClosing ? "var(--warn)" : "#3617CE",
                  }}
                >
                  {station.isClosing ? "폐국 진행중" : "운용중"}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">주소</div>
                <div className="text-sm text-gray-900">
                  {station.region} (상세 주소 정보 미제공)
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">임차 형태</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor: "var(--region-light)",
                    color: "var(--region-primary)",
                  }}
                >
                  {station.leaseType}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">발전기</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor: station.hasGenerator ? "#E6F7F1" : "#FFF0F1",
                    color: station.hasGenerator ? "var(--ok)" : "var(--danger)",
                  }}
                >
                  {station.hasGenerator ? "✅ 설치" : "❌ 미설치"}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">수전 용량</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {station.powerCapacity}
                  </span>
                  <span className="text-sm text-gray-500">kW</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">국사 등급</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor:
                      station.stationGrade === "A"
                        ? "var(--region-light)"
                        : station.stationGrade === "B"
                        ? "#E6F7F1"
                        : "#FFF3E0",
                    color:
                      station.stationGrade === "A"
                        ? "var(--region-primary)"
                        : station.stationGrade === "B"
                        ? "var(--ok)"
                        : "var(--warn)",
                  }}
                >
                  {station.stationGrade}등급
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-1.5">축전지</div>
                <div className="text-sm text-gray-900 font-medium">
                  {station.battery}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Modernization */}
          {activeTab === "modernization" && (
            <div className="space-y-4">
              {/* 진행 현황 요약 */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--region-light)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">전체 진행률</span>
                  <span
                    className="text-lg font-bold font-mono"
                    style={{ color: "var(--region-primary)" }}
                  >
                    {completedCount}/37
                  </span>
                </div>
                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(completedCount / 37) * 100}%`,
                      backgroundColor: "var(--region-primary)",
                    }}
                  />
                </div>
              </div>

              {/* 진행 상태별 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-600 font-bold mb-1">진행 완료</div>
                  <div className="text-2xl font-bold text-green-700">{completedCount}</div>
                </div>
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-orange-600 font-bold mb-1">미진행</div>
                  <div className="text-2xl font-bold text-orange-700">{37 - completedCount}</div>
                </div>
              </div>

              {/* 항목 목록 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm font-bold text-gray-700 mb-3">항목별 상세</div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {modernizationItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[var(--region-primary)] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              item.completed ? "text-green-600" : "text-orange-600"
                            }`}
                          >
                            {item.completed ? "✓" : "○"}
                          </span>
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 ml-5">
                          {item.phase}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          item.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.completed ? "완료" : "대기"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: 상태 세부 정보 */}
          {activeTab === "status" && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1.5">현재 상태</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor:
                      station.status === "정상"
                        ? "#E6F7F1"
                        : station.status === "점검필요"
                        ? "#FFF3E0"
                        : "#FFF0F1",
                    color:
                      station.status === "정상"
                        ? "var(--ok)"
                        : station.status === "점검필요"
                        ? "var(--warn)"
                        : "var(--danger)",
                  }}
                >
                  {station.status === "정상"
                    ? "✅ 정상"
                    : station.status === "점검필요"
                    ? "⚠️ 점검필요"
                    : "🚨 긴급"}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-gray-500">상태 메모</div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded transition-colors"
                    style={{
                      backgroundColor: isEditing ? "#E6F7F1" : "var(--region-light)",
                      color: isEditing ? "var(--ok)" : "var(--region-primary)",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-3 h-3" />
                        저장
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3 h-3" />
                        수정
                      </>
                    )}
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--region-primary)]"
                    placeholder="상태에 대한 메모를 입력하세요..."
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {statusNote || "메모가 없습니다."}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-xs font-bold text-gray-500 mb-2">최근 이력</div>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                      2024-12-15
                    </div>
                    <div className="text-sm text-gray-700">정기 점검 완료</div>
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                      2024-12-01
                    </div>
                    <div className="text-sm text-gray-700">발전기 정기 시운전</div>
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                      2024-11-20
                    </div>
                    <div className="text-sm text-gray-700">UPS 배터리 교체</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
