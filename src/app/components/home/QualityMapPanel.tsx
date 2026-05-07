// src/app/components/home/QualityMapPanel.tsx
import { useEffect, useRef, useState } from "react";
import { DistrictQualityItem, getRegionalDistricts } from "../../data/homeMockData";

interface QualityMapPanelProps {
  region: "central" | "west";
  onSelectWorstDistrict?: (district: DistrictQualityItem, rank: number) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function QualityMapPanel({ region, onSelectWorstDistrict }: QualityMapPanelProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictQualityItem | null>(null);

  const allDistricts = getRegionalDistricts(region);
  // Worst 5 (grade1stRate 낮은 순)
  const worstDistricts = [...allDistricts]
    .sort((a, b) => a.grade1stRate - b.grade1stRate)
    .slice(0, 5);

  // 목록에서 지역 선택 시 지도 이동
  const panToDistrict = (district: DistrictQualityItem) => {
    if (!kakaoMapRef.current || !window.kakao?.maps) return;
    kakaoMapRef.current.setCenter(new window.kakao.maps.LatLng(district.lat, district.lng));
    kakaoMapRef.current.setLevel(7);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = () => {
      if (!mapContainer.current || !window.kakao?.maps) return;

      const districts = getRegionalDistricts(region);
      const center = region === "central"
        ? { lat: 36.5, lng: 127.3 }
        : { lat: 35.15, lng: 127.0 };

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: region === "central" ? 9 : 10,
      };
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      kakaoMapRef.current = kakaoMap;

      // Worst 5 마커만 지도에 표시
      const worst5 = [...districts]
        .sort((a, b) => a.grade1stRate - b.grade1stRate)
        .slice(0, 5);

      // LatLngBounds로 5개 마커 모두 보이도록 초기 줌 설정
      const bounds = new window.kakao.maps.LatLngBounds();
      worst5.forEach((district) => {
        bounds.extend(new window.kakao.maps.LatLng(district.lat, district.lng));
      });
      kakaoMap.setBounds(bounds, 60);

      worst5.forEach((district, idx) => {
        const position = new window.kakao.maps.LatLng(district.lat, district.lng);

        // 순위 라벨 커스텀 마커
        const markerImage = new window.kakao.maps.MarkerImage(
          `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='36'><ellipse cx='14' cy='14' rx='14' ry='14' fill='%23ef4444'/><text x='14' y='19' text-anchor='middle' fill='white' font-size='13' font-weight='bold' font-family='sans-serif'>${idx + 1}</text><polygon points='8,24 20,24 14,36' fill='%23ef4444'/></svg>`
          )}`,
          new window.kakao.maps.Size(28, 36),
          { offset: new window.kakao.maps.Point(14, 36) }
        );

        const marker = new window.kakao.maps.Marker({
          position,
          map: kakaoMap,
          title: district.name,
          image: markerImage,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px 10px;font-size:11px;white-space:nowrap"><b>${idx + 1}. ${district.name}</b><br/>최저: <span style="color:#ef4444;font-weight:bold">${district.grade1stRate}%</span></div>`,
          removable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          setSelectedDistrict(district);
          onSelectWorstDistrict?.(district, idx + 1);
          infowindow.open(kakaoMap, marker);
          kakaoMap.setCenter(position);
          kakaoMap.setLevel(7);
        });
        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          infowindow.open(kakaoMap, marker);
        });
        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          infowindow.close();
        });
      });
    };

    // kakao.maps.load()를 통해 API 준비 완료 후 초기화
    if (window.kakao?.maps) {
      initMap();
    } else if (window.kakao) {
      window.kakao.maps.load(initMap);
    } else {
      // SDK 스크립트 로드 대기 (최대 3초)
      const timer = window.setTimeout(initMap, 300);
      return () => window.clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-2 h-full">
      {/* 헤더 */}
      <div className="shrink-0 flex items-center gap-1.5">
        <div className="w-0.5 h-4 rounded" style={{ backgroundColor: "var(--region-primary)" }} />
        <span className="text-xs font-bold text-gray-700">
          {region === "central" ? "중부 본부" : "서부 본부"} 시군구별 품질 현황
        </span>
        <span className="text-[10px] text-gray-400 ml-1">Quality by District</span>
      </div>

      {/* 지도 + 우측 패널 (side-by-side) - flex-1로 나머지 높이 차지 */}
      <div className="flex-1 min-h-0 flex gap-3">
        {/* 지도: h-full로 부모 높이 채움 */}
        <div ref={mapContainer} className="flex-1 min-h-0 rounded-lg border border-gray-200 min-w-0" style={{ minHeight: 180 }} />

        {/* 우측: 범례 + 선택 정보 + Worst 5 목록 */}
        <div className="w-44 shrink-0 flex flex-col gap-2 overflow-y-auto">
          {/* 범례 */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 mb-1">1등급 비율 기준</p>
            <div className="flex flex-col gap-0.5 text-[10px]">
              {[
                { color: "#1a7a4a", label: "85%+" },
                { color: "#16a34a", label: "80 ~ 85%" },
                { color: "#22c55e", label: "75 ~ 80%" },
                { color: "#84cc16", label: "70 ~ 75%" },
                { color: "#fbbf24", label: "70% 이하" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 선택된 지역 상세 */}
          {selectedDistrict && (
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-gray-700 truncate">{selectedDistrict.name}</span>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="text-gray-400 hover:text-gray-600 ml-1 shrink-0 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">1등급</span>
                  <span className="font-bold text-gray-800">{selectedDistrict.grade1stRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">4등급↓</span>
                  <span className="font-bold text-red-600">{selectedDistrict.grade4thRate}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Worst 5 목록 */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 mb-1">Worst 5 지역</p>
            <div className="flex flex-col gap-0.5">
              {worstDistricts.map((district, idx) => (
                <div
                  key={district.id}
                  onClick={() => {
                    setSelectedDistrict(district);
                    onSelectWorstDistrict?.(district, idx + 1);
                    panToDistrict(district);
                  }}
                  className={`p-1.5 rounded cursor-pointer transition-colors text-[10px] ${
                    selectedDistrict?.id === district.id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] font-bold text-red-500 w-3 shrink-0">{idx + 1}</span>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: district.color }} />
                      <span className="text-gray-700 font-medium truncate">{district.name}</span>
                    </div>
                    <span className="text-red-600 tabular-nums font-semibold ml-1 shrink-0">
                      {district.grade1stRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
