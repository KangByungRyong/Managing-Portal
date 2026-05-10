import { useMemo, useState } from "react";
import { useAppStore } from "../stores/appStore";
import { KpiCard } from "../components/KpiCard";
import {
  HorizontalBarChart,
  MapPlaceholder,
} from "../components/TonghabCharts";
import { TonghabTable } from "../components/TonghabTable";
import { StationListSidebar } from "../components/StationListSidebar";
import { StationDetailSidebar } from "../components/StationDetailSidebar";
import {
  tonghabMockData,
  getKpiData,
  getLeaseTypeData,
  getGeneratorData,
  getStationGradeData,
  getBatteryData,
  TonghabStation,
} from "../data/tonghabMockData";

export function TonghabPage() {
  const { region } = useAppStore();
  const [isListSidebarOpen, setIsListSidebarOpen] = useState(false);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<TonghabStation | null>(null);
  const [sidebarStations, setSidebarStations] = useState<TonghabStation[]>([]);
  const [sidebarTitle, setSidebarTitle] = useState("");

  // 선택된 네트워크 담당의 데이터만 필터링
  const filteredData = useMemo(
    () =>
      tonghabMockData.filter(
        (station) => station.networkDivision === region,
      ),
    [region],
  );

  const kpiData = getKpiData(filteredData);
  const leaseData = getLeaseTypeData(filteredData);
  const generatorData = getGeneratorData(filteredData);
  const gradeData = getStationGradeData(filteredData);
  const batteryData = getBatteryData(filteredData);

  const handleAllStationsClick = () => {
    setSidebarStations(filteredData);
    setSidebarTitle("전체 국사 목록");
    setIsListSidebarOpen(true);
  };

  const handleNormalStationsClick = () => {
    setSidebarStations(filteredData.filter((s) => s.status === "정상"));
    setSidebarTitle("정상 운용 항목");
    setIsListSidebarOpen(true);
  };

  const handleInspectionStationsClick = () => {
    setSidebarStations(filteredData.filter((s) => s.status === "점검필요"));
    setSidebarTitle("점검 필요 항목");
    setIsListSidebarOpen(true);
  };

  const handleUrgentStationsClick = () => {
    setSidebarStations(filteredData.filter((s) => s.status === "긴급"));
    setSidebarTitle("긴급 점검 필요 항목");
    setIsListSidebarOpen(true);
  };

  const handleStationClick = (station: TonghabStation) => {
    setSelectedStation(station);
    setIsDetailSidebarOpen(true);
  };

  const handleCloseListSidebar = () => {
    setIsListSidebarOpen(false);
  };

  const handleCloseDetailSidebar = () => {
    setIsDetailSidebarOpen(false);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* KPI 카드 */}
      <div className="grid grid-cols-4 gap-2.5">
        <KpiCard
          label="운용중 / 폐국 진행중"
          value={`${kpiData.operating} / ${kpiData.closing}`}
          unit=""
          yoy={3.2}
          onClick={handleAllStationsClick}
        />
        <KpiCard
          label="정상 운용"
          value={kpiData.normal}
          unit="개"
          yoy={5.1}
          onClick={handleNormalStationsClick}
        />
        <KpiCard
          label="점검 필요"
          value={kpiData.needsInspection}
          unit="개"
          yoy={2.3}
          onClick={handleInspectionStationsClick}
        />
        <KpiCard
          label="긴급 점검 필요"
          value={kpiData.urgent}
          unit="개"
          yoy={-12.5}
          onClick={handleUrgentStationsClick}
        />
      </div>

      {/* 지도 + 차트 영역 */}
      <div className="grid grid-cols-12 gap-2.5">
        {/* 지도 - 6fr */}
        <div className="col-span-6">
          <MapPlaceholder
            stationCount={filteredData.length}
            stations={filteredData.map((station) => ({
              id: station.id,
              name: station.name,
              lat: station.lat,
              lng: station.lng,
              status: station.status,
            }))}
          />
        </div>

        {/* 차트 영역 - 6fr */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg shadow-sm p-3.5 h-full">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <div
                  className="w-0.5 h-3 rounded"
                  style={{
                    backgroundColor: "var(--region-primary)",
                  }}
                />
                현황 분석
              </div>
            </div>
            <div className="space-y-4">
              <HorizontalBarChart
                title="임차 형태"
                data={leaseData}
              />
              <HorizontalBarChart
                title="발전기 현황"
                data={generatorData}
              />
              <HorizontalBarChart
                title="국사 등급"
                data={gradeData}
              />
              <HorizontalBarChart
                title="축전지"
                data={batteryData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 국사 세부 현황 */}
      <div className="bg-white rounded-lg shadow-sm flex flex-col">
        {/* 제목 */}
        <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">국사 세부 현황</h3>
        </div>
        <TonghabTable data={filteredData} onStationClick={handleStationClick} />
      </div>

      {/* List Sidebar */}
      <StationListSidebar
        stations={sidebarStations}
        isOpen={isListSidebarOpen}
        onClose={handleCloseListSidebar}
        title={sidebarTitle}
      />

      {/* Detail Sidebar */}
      <StationDetailSidebar
        station={selectedStation}
        isOpen={isDetailSidebarOpen}
        onClose={handleCloseDetailSidebar}
      />
    </div>
  );
}