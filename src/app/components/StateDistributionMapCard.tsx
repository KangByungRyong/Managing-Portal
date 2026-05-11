import { useEffect, useMemo, useRef, useState } from "react";
import { HqDivision } from "../data/facilityStatusData";
import { loadKakaoMapsSdk } from "../lib/loadKakaoMapsSdk";

export interface StateMetricDefinition {
  key: string;
  label: string;
  unit: string;
  color: string;
}

export interface StateMetricRow {
  state: string;
  values: Record<string, number>;
}

interface StateDistributionMapCardProps {
  region: HqDivision;
  title?: string;
  rows: StateMetricRow[];
  metrics: StateMetricDefinition[];
  initialMetricKey?: string;
  showSummaryPanel?: boolean;
  showTotalBadge?: boolean;
  fitToRegionStates?: boolean;
}

interface StateCoordinate {
  lat: number;
  lng: number;
}

const STATE_COORDINATES: Record<string, StateCoordinate> = {
  충북: { lat: 36.6358, lng: 127.4914 },
  세종: { lat: 36.48, lng: 127.289 },
  대전: { lat: 36.3504, lng: 127.3845 },
  충남: { lat: 36.6588, lng: 126.6728 },
  전북: { lat: 35.8242, lng: 127.148 },
  광주: { lat: 35.1595, lng: 126.8526 },
  전남: { lat: 34.8161, lng: 126.463 },
  제주: { lat: 33.4996, lng: 126.5312 },
};

const MAP_VIEW: Record<HqDivision, { center: StateCoordinate; level: number }> = {
  central: { center: { lat: 36.45, lng: 127.15 }, level: 12 },
  west: { center: { lat: 35.35, lng: 126.75 }, level: 13 },
};

export function StateDistributionMapCard({
  region,
  title = "광역시도별 분포",
  rows,
  metrics,
  initialMetricKey,
  showSummaryPanel = true,
  showTotalBadge = true,
  fitToRegionStates = false,
}: StateDistributionMapCardProps) {
  const [activeMetric, setActiveMetric] = useState<string>(
    initialMetricKey ?? metrics[0]?.key ?? "",
  );
  const [sdkStatus, setSdkStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [sdkMessage, setSdkMessage] = useState("Kakao SDK 준비 전");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const initialViewSetRef = useRef(false);
  const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

  useEffect(() => {
    if (!activeMetric && metrics[0]?.key) {
      setActiveMetric(metrics[0].key);
    }
  }, [activeMetric, metrics]);

  useEffect(() => {
    if (!kakaoAppKey) {
      setSdkStatus("error");
      setSdkMessage("VITE_KAKAO_MAP_APP_KEY 미설정");
      return;
    }

    let isMounted = true;
    setSdkStatus("loading");
    setSdkMessage("Kakao SDK 로딩 중");

    loadKakaoMapsSdk(kakaoAppKey)
      .then(() => {
        if (!isMounted) return;
        setSdkStatus("ready");
        setSdkMessage("Kakao SDK 준비 완료");
      })
      .catch((error: Error) => {
        if (!isMounted) return;
        setSdkStatus("error");
        setSdkMessage(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [kakaoAppKey]);

  const metricMeta = useMemo(() => {
    return metrics.find((metric) => metric.key === activeMetric) ?? metrics[0];
  }, [activeMetric, metrics]);

  const stateMetrics = useMemo(() => {
    return [...rows].sort((a, b) => (b.values[activeMetric] ?? 0) - (a.values[activeMetric] ?? 0));
  }, [activeMetric, rows]);

  const maxValue =
    stateMetrics.length > 0
      ? Math.max(...stateMetrics.map((item) => item.values[activeMetric] ?? 0))
      : 0;
  const totalValue = stateMetrics.reduce((sum, item) => sum + (item.values[activeMetric] ?? 0), 0);
  const sdkToneClass =
    sdkStatus === "ready"
      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
      : sdkStatus === "loading"
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : sdkStatus === "error"
          ? "text-rose-600 bg-rose-50 border-rose-100"
          : "text-gray-400 bg-gray-50 border-gray-100";

  // Effect 1: 지도 인스턴스 생성 — SDK ready + region 변경 시에만 실행 (1회)
  useEffect(() => {
    if (sdkStatus !== "ready" || !mapContainerRef.current || !window.kakao?.maps) return;

    const mapConfig = MAP_VIEW[region];
    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(mapConfig.center.lat, mapConfig.center.lng),
      level: mapConfig.level,
      draggable: true,
      scrollwheel: true,
      disableDoubleClick: false,
      disableDoubleClickZoom: false,
      keyboardShortcuts: true,
    });

    mapRef.current = map;
    initialViewSetRef.current = false; // 페이지 진입 시마다 초기 뷰 플래그 리셋

    return () => {
      // 컴포넌트 언마운트(페이지 이탈) 시 인스턴스 정리
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
      mapRef.current = null;
    };
  }, [sdkStatus, region]);

  // Effect 2: 오버레이만 교체 — 지도 인스턴스는 재생성하지 않음
  useEffect(() => {
    const map = mapRef.current;
    if (!map || sdkStatus !== "ready" || !metricMeta) return;

    // 기존 오버레이 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    // 새 오버레이 생성
    const newOverlays = stateMetrics
      .map((item) => {
        const coordinate = STATE_COORDINATES[item.state];
        if (!coordinate) return null;

        const value = item.values[activeMetric] ?? 0;
        const ratio = maxValue > 0 ? value / maxValue : 0;
        const size = Math.round(42 + ratio * 28);
        const content = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transform:translateY(-6px);pointer-events:none;">
            <div style="padding:2px 6px;border-radius:999px;background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.95);box-shadow:0 6px 18px rgba(15,23,42,0.12);font-size:10px;font-weight:700;color:#334155;white-space:nowrap;">
              ${item.state}
            </div>
            <div style="width:${size}px;height:${size}px;border-radius:999px;background:${metricMeta.color};border:3px solid rgba(255,255,255,0.96);box-shadow:0 12px 30px rgba(15,23,42,0.18);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:800;letter-spacing:-0.02em;">
              ${value.toLocaleString()}
            </div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(coordinate.lat, coordinate.lng),
          content,
          xAnchor: 0.5,
          yAnchor: 1,
        });
        return overlay;
      })
      .filter((overlay): overlay is KakaoCustomOverlay => overlay !== null);

    newOverlays.forEach((o) => o.setMap(map));
    overlaysRef.current = newOverlays;

    // 초기 진입 시에만 전체 지역이 보이도록 자동 zoom 조정
    if (fitToRegionStates && !initialViewSetRef.current) {
      const positions = stateMetrics
        .map((item) => STATE_COORDINATES[item.state])
        .filter((pos): pos is StateCoordinate => Boolean(pos));

      if (positions.length >= 2) {
        const bounds = new window.kakao.maps.LatLngBounds();
        positions.forEach((pos) => {
          bounds.extend(new window.kakao.maps.LatLng(pos.lat, pos.lng));
        });
        map.setBounds(bounds);
      }
      initialViewSetRef.current = true;
    }
  }, [sdkStatus, stateMetrics, activeMetric, maxValue, metricMeta, fitToRegionStates]);

  return (
    <div className="bg-white rounded-lg shadow-sm h-full min-h-[220px] flex flex-col">
      {/* 제목 */}
      <div className="px-3.5 pt-3.5 pb-2 flex-shrink-0 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>

      {/* 지표 선택 및 SDK 상태 */}
      <div className="px-3.5 pt-3 pb-2 flex-shrink-0">
        <div className="flex justify-between items-center gap-3">
          <span
            className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${sdkToneClass}`}
          >
            {sdkMessage}
          </span>
        </div>
      </div>

      {metrics.length > 1 && (
        <div className="px-3.5 pt-2 pb-3 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {metrics.map((metric) => {
              const isActive = metric.key === activeMetric;
              return (
                <button
                  key={metric.key}
                  onClick={() => setActiveMetric(metric.key)}
                  className="px-2.5 py-1 rounded-full border text-[10px] font-semibold transition-colors"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${metric.color}14`,
                          borderColor: `${metric.color}66`,
                          color: metric.color,
                        }
                      : {
                          borderColor: "#E5E7EB",
                          color: "#6B7280",
                        }
                  }
                >
                  {metric.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showSummaryPanel ? (
        <div className="px-3.5 pb-3.5 flex-1 min-h-0 flex flex-col">
          <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
            <div
              className="col-span-7 rounded-xl border relative overflow-hidden"
              style={{
                borderColor: "var(--region-border)",
                background:
                  "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(226,232,240,0.9))",
              }}
            >
              <div ref={mapContainerRef} className="absolute inset-0" />

              {sdkStatus !== "ready" && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 backdrop-blur-[1px]">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                    <div className="text-[11px] font-bold text-gray-700">지도 준비 중</div>
                    <div className="mt-1 text-[10px] text-gray-500">{sdkMessage}</div>
                  </div>
                </div>
              )}

              <div className="absolute left-2.5 top-2.5 rounded-lg bg-white/85 px-2 py-1.5 shadow-sm pointer-events-none">
                <div className="text-[10px] font-semibold text-gray-700">
                  {region === "central" ? "중부권" : "서부권"}
                </div>
                <div className="text-[10px] text-gray-500">
                  {metricMeta?.label ?? "지표"} 기준 표시
                </div>
              </div>

              {showTotalBadge && (
                <div className="absolute right-2.5 bottom-2.5 rounded-lg bg-white/88 px-2.5 py-2 shadow-sm text-[10px] font-mono pointer-events-none">
                  <div className="flex justify-between gap-4 text-gray-500">
                    <span>합계</span>
                    <span className="font-bold text-gray-900">{totalValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-0.5 text-right text-gray-400">{metricMeta?.unit ?? ""}</div>
                </div>
              )}
            </div>

            <div className="col-span-5 rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold text-gray-700">광역시도 집계</div>
                <div className="text-[10px] text-gray-400">{metricMeta?.label ?? "지표"}</div>
              </div>
              <div className="space-y-2">
                {stateMetrics.map((item) => {
                  const value = item.values[activeMetric] ?? 0;
                  const ratio = maxValue > 0 ? value / maxValue : 0;
                  return (
                    <div key={item.state} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-medium text-gray-700">{item.state}</span>
                        <span className="font-mono text-gray-800">{value.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white overflow-hidden border border-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(8, ratio * 100)}%`,
                            backgroundColor: metricMeta?.color ?? "#64748B",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3.5 pb-3.5 flex-1 min-h-0 flex flex-col">
          <div
            className="rounded-xl border relative overflow-hidden flex-1 min-h-[300px]"
            style={{
              borderColor: "var(--region-border)",
              background: "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(226,232,240,0.9))",
            }}
          >
            <div ref={mapContainerRef} className="absolute inset-0" />

            {sdkStatus !== "ready" && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 backdrop-blur-[1px]">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                  <div className="text-[11px] font-bold text-gray-700">지도 준비 중</div>
                  <div className="mt-1 text-[10px] text-gray-500">{sdkMessage}</div>
                </div>
              </div>
            )}

            <div className="absolute left-2.5 top-2.5 rounded-lg bg-white/85 px-2 py-1.5 shadow-sm pointer-events-none">
              <div className="text-[10px] font-semibold text-gray-700">
                {region === "central" ? "중부권" : "서부권"}
              </div>
              <div className="text-[10px] text-gray-500">
                {metricMeta?.label ?? "지표"} 기준 표시
              </div>
            </div>

            {showTotalBadge && (
              <div className="absolute right-2.5 bottom-2.5 rounded-lg bg-white/88 px-2.5 py-2 shadow-sm text-[10px] font-mono pointer-events-none">
                <div className="flex justify-between gap-4 text-gray-500">
                  <span>합계</span>
                  <span className="font-bold text-gray-900">{totalValue.toLocaleString()}</span>
                </div>
                <div className="mt-0.5 text-right text-gray-400">{metricMeta?.unit ?? ""}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
