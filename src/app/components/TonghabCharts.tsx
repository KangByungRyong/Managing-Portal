import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "../lib/loadKakaoMapsSdk";

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
  chartId?: string;
}

export function DonutChart({ title, data, chartId }: DonutChartProps) {
  const id = useMemo(() => chartId || `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [chartId]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5 h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <div
            className="w-0.5 h-3 rounded"
            style={{ backgroundColor: "var(--region-primary)" }}
          />
          {title}
        </div>
        <span className="text-[10px] text-gray-300">📂 SQL</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`${id}-${entry.name}-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MapPlaceholderProps {
  stationCount: number;
  stations: Array<{
    id: string;
    name: string;
    lat?: number;
    lng?: number;
    status: "정상" | "점검필요" | "긴급";
  }>;
}

export function MapPlaceholder({ stationCount, stations }: MapPlaceholderProps) {
  const [sdkStatus, setSdkStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [sdkMessage, setSdkMessage] = useState("Kakao SDK 준비 전");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

  const positionedStations = useMemo(
    () => stations.filter((station) => typeof station.lat === "number" && typeof station.lng === "number"),
    [stations]
  );

  const mapCenter = useMemo(() => {
    if (positionedStations.length === 0) {
      return { lat: 36.35, lng: 127.38, level: 12 };
    }

    const sum = positionedStations.reduce(
      (acc, station) => ({
        lat: acc.lat + (station.lat ?? 0),
        lng: acc.lng + (station.lng ?? 0),
      }),
      { lat: 0, lng: 0 }
    );

    const lat = sum.lat / positionedStations.length;
    const lng = sum.lng / positionedStations.length;
    const latSpread = Math.max(...positionedStations.map((station) => station.lat ?? lat)) - Math.min(...positionedStations.map((station) => station.lat ?? lat));
    const lngSpread = Math.max(...positionedStations.map((station) => station.lng ?? lng)) - Math.min(...positionedStations.map((station) => station.lng ?? lng));
    const maxSpread = Math.max(latSpread, lngSpread);

    let level = 12;
    if (maxSpread > 2.2) level = 13;
    else if (maxSpread > 1.2) level = 12;
    else if (maxSpread > 0.6) level = 11;
    else level = 10;

    return { lat, lng, level };
  }, [positionedStations]);

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

  useEffect(() => {
    if (sdkStatus !== "ready" || !mapContainerRef.current || !window.kakao?.maps) {
      return;
    }

    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: mapCenter.level,
    });

    const statusColorMap = {
      정상: "#2563EB",
      점검필요: "#F59E0B",
      긴급: "#DC2626",
    } as const;

    const overlays = positionedStations.map((station) => {
      const color = statusColorMap[station.status];
      const content = `
        <div title="${station.name} (${station.status})" style="display:flex;flex-direction:column;align-items:center;gap:4px;transform:translateY(-4px);cursor:pointer;">
          <div style="padding:3px 7px;border-radius:999px;background:rgba(15,23,42,0.88);color:white;font-size:10px;font-weight:700;line-height:1;white-space:nowrap;box-shadow:0 8px 18px rgba(15,23,42,0.18);">
            ${station.name}
          </div>
          <div style="width:14px;height:14px;border-radius:999px;background:${color};border:3px solid rgba(255,255,255,0.98);box-shadow:0 8px 20px rgba(15,23,42,0.16);"></div>
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(station.lat ?? mapCenter.lat, station.lng ?? mapCenter.lng),
        content,
        xAnchor: 0.5,
        yAnchor: 1,
      });

      overlay.setMap(map);
      return overlay;
    });

    return () => {
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [mapCenter, positionedStations, sdkStatus]);

  const statusCounts = useMemo(
    () => ({
      정상: stations.filter((s) => s.status === "정상").length,
      점검필요: stations.filter((s) => s.status === "점검필요").length,
      긴급: stations.filter((s) => s.status === "긴급").length,
    }),
    [stations]
  );
  const sdkToneClass =
    sdkStatus === "ready"
      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
      : sdkStatus === "loading"
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : sdkStatus === "error"
          ? "text-rose-600 bg-rose-50 border-rose-100"
          : "text-gray-400 bg-gray-50 border-gray-100";

  return (
    <div className="bg-white rounded-lg shadow-sm p-3.5 h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <div
            className="w-0.5 h-3 rounded"
            style={{ backgroundColor: "var(--region-primary)" }}
          />
          통합국 위치 현황
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${sdkToneClass}`}>
          {sdkMessage}
        </span>
      </div>
      <div
        className="rounded-lg h-[300px] relative border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(226,232,240,0.9))",
          borderColor: "var(--region-border)",
        }}
      >
        <div ref={mapContainerRef} className="absolute inset-0" />

        {sdkStatus !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/88 backdrop-blur-[1px]">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-[11px] font-bold text-gray-700">지도 준비 중</div>
              <div className="mt-1 text-[10px] text-gray-500">{sdkMessage}</div>
            </div>
          </div>
        )}

        {/* 범례 */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 rounded-lg px-2.5 py-2 text-[10px] shadow-md">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--region-primary)" }}
            />
            <span className="text-gray-700">정상</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--warn)" }}
            />
            <span className="text-gray-700">점검필요</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--danger)" }}
            />
            <span className="text-gray-700">긴급</span>
          </div>
        </div>

        {/* 카운터 */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 rounded-lg px-2.5 py-2 text-[10px] shadow-md font-mono">
          <div className="flex justify-between gap-4 mb-0.5">
            <span className="text-gray-500">정상</span>
            <span className="font-bold text-gray-900">{statusCounts.정상}</span>
          </div>
          <div className="flex justify-between gap-4 mb-0.5">
            <span className="text-gray-500">점검필요</span>
            <span className="font-bold text-gray-900">{statusCounts.점검필요}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">긴급</span>
            <span className="font-bold text-gray-900">{statusCounts.긴급}</span>
          </div>
          <div className="mt-1 flex justify-between gap-4 border-t border-gray-100 pt-1">
            <span className="text-gray-500">전체</span>
            <span className="font-bold text-gray-900">{stationCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  title: string;
  data: ChartData[];
}

export function HorizontalBarChart({ title, data }: HorizontalBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
        <div
          className="w-0.5 h-3 rounded"
          style={{ backgroundColor: "var(--region-primary)" }}
        />
        {title}
      </div>
      <div className="flex rounded-lg overflow-hidden border border-gray-200 h-10">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          if (percentage === 0) return null;

          return (
            <div
              key={index}
              className="flex items-center justify-center transition-all duration-300 relative group"
              style={{
                width: `${percentage}%`,
                backgroundColor: item.fill,
              }}
            >
              <div className="flex flex-col items-center justify-center text-white">
                <span className="text-[10px] font-bold">{item.name}</span>
                <span className="text-xs font-bold">{item.value}</span>
              </div>
              {/* 호버 시 퍼센트 표시 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-white">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
