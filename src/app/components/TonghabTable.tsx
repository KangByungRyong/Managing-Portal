import { useState, useMemo } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { TonghabStation } from "../data/tonghabMockData";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ColumnFilterDropdown } from "./ColumnFilterDropdown";

interface TonghabTableProps {
  data: TonghabStation[];
  onStationClick?: (station: TonghabStation) => void;
}

export function TonghabTable({
  data,
  onStationClick,
}: TonghabTableProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([
    "전체",
  ]);
  const [columnFilters, setColumnFilters] = useState<
    Record<string, string[]>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    string | null
  >(null);

  const filteredData = useMemo(() => {
    return data.filter((station) => {
      // 키워드 필터
      const matchKeyword =
        searchKeyword === "" ||
        station.name
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        station.region
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());

      // 상태 필터
      const matchStatus =
        statusFilters.includes("전체") ||
        statusFilters.includes(station.status);

      // 컬럼 필터
      const matchRegion =
        !columnFilters.region ||
        columnFilters.region.length === 0 ||
        columnFilters.region.includes(station.region);

      const matchLease =
        !columnFilters.lease ||
        columnFilters.lease.length === 0 ||
        columnFilters.lease.includes(station.leaseType);

      const matchGen =
        !columnFilters.gen ||
        columnFilters.gen.length === 0 ||
        columnFilters.gen.includes(
          station.hasGenerator ? "설치" : "미설치",
        );

      const matchGrade =
        !columnFilters.grade ||
        columnFilters.grade.length === 0 ||
        columnFilters.grade.includes(station.stationGrade);

      const matchClosing =
        !columnFilters.closing ||
        columnFilters.closing.length === 0 ||
        columnFilters.closing.includes(
          station.isClosing ? "폐국 진행중" : "운용중",
        );

      const matchBattery =
        !columnFilters.battery ||
        columnFilters.battery.length === 0 ||
        columnFilters.battery.includes(station.battery);

      const matchStatusColumn =
        !columnFilters.status ||
        columnFilters.status.length === 0 ||
        columnFilters.status.includes(station.status);

      return (
        matchKeyword &&
        matchStatus &&
        matchRegion &&
        matchLease &&
        matchGen &&
        matchGrade &&
        matchClosing &&
        matchBattery &&
        matchStatusColumn
      );
    });
  }, [data, searchKeyword, statusFilters, columnFilters]);

  const toggleStatusFilter = (status: string) => {
    if (status === "전체") {
      setStatusFilters(["전체"]);
      return;
    }

    let newFilters = statusFilters.filter((s) => s !== "전체");

    if (newFilters.includes(status)) {
      newFilters = newFilters.filter((s) => s !== status);
    } else {
      newFilters.push(status);
    }

    if (newFilters.length === 0) {
      newFilters = ["전체"];
    }

    setStatusFilters(newFilters);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { bg: string; text: string }
    > = {
      정상: { bg: "bg-green-100", text: "text-green-700" },
      점검필요: {
        bg: "bg-orange-100",
        text: "text-orange-700",
      },
      긴급: { bg: "bg-red-100", text: "text-red-700" },
    };
    const variant = variants[status] || variants["정상"];
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${variant.bg} ${variant.text}`}
      >
        {status}
      </span>
    );
  };

  // 컬럼별 고유값 추출
  const getUniqueValues = (column: string) => {
    const values = new Set<string>();
    data.forEach((station) => {
      if (column === "region") values.add(station.region);
      if (column === "lease") values.add(station.leaseType);
      if (column === "gen")
        values.add(station.hasGenerator ? "설치" : "미설치");
      if (column === "grade") values.add(station.stationGrade);
      if (column === "closing")
        values.add(
          station.isClosing ? "폐국 진행중" : "운용중",
        );
      if (column === "battery") values.add(station.battery);
      if (column === "status") values.add(station.status);
    });
    return Array.from(values).sort();
  };

  const toggleColumnFilter = (
    column: string,
    value: string,
  ) => {
    setColumnFilters((prev) => {
      const current = prev[column] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [column]: newValues };
    });
  };

  const clearColumnFilter = (column: string) => {
    setColumnFilters((prev) => {
      const { [column]: _, ...rest } = prev;
      return rest;
    });
    setOpenDropdown(null);
  };

  const hasActiveFilters = () => {
    return (
      searchKeyword !== "" ||
      !statusFilters.includes("전체") ||
      Object.keys(columnFilters).some(
        (key) => columnFilters[key].length > 0,
      )
    );
  };

  const getActiveFilterChips = () => {
    const chips: Array<{
      type: string;
      label: string;
      onRemove: () => void;
    }> = [];

    if (searchKeyword) {
      chips.push({
        type: "search",
        label: `검색: ${searchKeyword}`,
        onRemove: () => setSearchKeyword(""),
      });
    }

    statusFilters.forEach((status) => {
      if (status !== "전체") {
        chips.push({
          type: "status",
          label: `상태: ${status}`,
          onRemove: () => toggleStatusFilter(status),
        });
      }
    });

    Object.entries(columnFilters).forEach(
      ([column, values]) => {
        values.forEach((value) => {
          const labels: Record<string, string> = {
            region: "지역",
            lease: "임차형태",
            gen: "발전기",
            grade: "등급",
            closing: "운용구분",
            battery: "축전지",
            status: "상태",
          };
          chips.push({
            type: column,
            label: `${labels[column]}: ${value}`,
            onRemove: () => toggleColumnFilter(column, value),
          });
        });
      },
    );

    return chips;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col">
      {/* 필터 영역 */}
      <div className="px-3.5 pt-3 pb-1.5 flex-shrink-0">
        {/* 키워드 검색 & 상태 필터 */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* 필터 표시 */}
            <div className="text-[11px] text-gray-500 font-mono">
              총{" "}
              <b className="text-[var(--region-primary)]">
                {data.length}
              </b>
              개 중{" "}
              <b className="text-[var(--region-primary)]">
                {filteredData.length}
              </b>
              개 표시
            </div>

            {/* 키워드 검색 */}
            <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
            <Input
              type="text"
              placeholder="국사명 / 주소 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs h-8 bg-gray-50 border-gray-300 focus:bg-white"
              style={{
                borderColor: searchKeyword
                  ? "var(--region-primary)"
                  : undefined,
                boxShadow: searchKeyword
                  ? "0 0 0 3px var(--region-light)"
                  : undefined,
              }}
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-500 flex items-center justify-center text-white text-[10px] font-bold transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* 상태 필터 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-bold">
              상태
            </span>
            {[
              { key: "전체", label: "전체" },
              { key: "정상", label: "✅ 정상" },
              { key: "점검필요", label: "⚠️ 점검필요" },
              { key: "긴급", label: "🚨 긴급" },
            ].map((status) => {
              const isActive = statusFilters.includes(
                status.key,
              );
              return (
                <button
                  key={status.key}
                  onClick={() => toggleStatusFilter(status.key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? status.key === "전체"
                        ? "font-bold"
                        : "font-bold"
                      : "bg-white border-gray-300 text-gray-500 hover:border-[var(--region-primary)] hover:text-[var(--region-primary)]"
                  }`}
                  style={
                    isActive
                      ? status.key === "전체"
                        ? {
                            backgroundColor:
                              "var(--region-light)",
                            borderColor:
                              "var(--region-primary)",
                            color: "var(--region-primary)",
                          }
                        : status.key === "정상"
                          ? {
                              backgroundColor: "#E6F7F1",
                              borderColor: "var(--ok)",
                              color: "var(--ok)",
                            }
                          : status.key === "점검필요"
                            ? {
                                backgroundColor: "#FFF3E0",
                                borderColor: "var(--warn)",
                                color: "var(--warn)",
                              }
                            : {
                                backgroundColor: "#FFF0F1",
                                borderColor: "var(--danger)",
                                color: "var(--danger)",
                              }
                      : {}
                  }
                >
                  {status.label}
                </button>
              );
            })}
          </div>
          </div>

          {/* 초기화 버튼 */}
          <button
            onClick={() => {
              setSearchKeyword("");
              setStatusFilters(["전체"]);
              setColumnFilters({});
            }}
            className={`px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1 transition-all ml-auto ${
              hasActiveFilters()
                ? "border-[var(--region-primary)] text-[var(--region-primary)] bg-[var(--region-light)]"
                : "border-gray-300 text-gray-500 bg-white hover:border-[var(--danger)] hover:text-[var(--danger)]"
            }`}
          >
            ↺ 전체 초기화
          </button>
        </div>
      </div>

      {/* 활성 필터 칩 */}
      {getActiveFilterChips().length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-3.5 pb-1.5 flex-shrink-0">
          {getActiveFilterChips().map((chip, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
              style={{
                backgroundColor: "var(--region-light)",
                borderColor: "var(--region-border)",
                color: "var(--region-primary)",
                animation: "fadeIn 0.15s ease",
              }}
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="font-bold opacity-60 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          {getActiveFilterChips().length > 1 && (
            <button
              onClick={() => {
                setSearchKeyword("");
                setStatusFilters(["전체"]);
                setColumnFilters({});
              }}
              className="text-[10px] text-gray-400 hover:text-[var(--danger)] font-semibold ml-1 transition-colors"
            >
              모두 지우기
            </button>
          )}
        </div>
      )}

      {/* 테이블 */}
      <div className="px-3.5 pt-1.5 pb-5 overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse text-xs">
          <thead
            className="sticky top-0 z-10"
            style={{
              backgroundColor: "var(--region-light)",
            }}
          >
            <tr>
              <th
                className="sticky left-0 z-20 text-left py-2 px-3 font-bold whitespace-nowrap border-r"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                  borderRightColor: "var(--region-border)",
                }}
              >
                국사명
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>운용 구분</span>
                  <ColumnFilterDropdown
                    column="closing"
                    values={getUniqueValues("closing")}
                    selectedValues={columnFilters.closing || []}
                    onToggle={(value) =>
                      toggleColumnFilter("closing", value)
                    }
                    onClear={() => clearColumnFilter("closing")}
                    isOpen={openDropdown === "closing"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "closing" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>지역</span>
                  <ColumnFilterDropdown
                    column="region"
                    values={getUniqueValues("region")}
                    selectedValues={columnFilters.region || []}
                    onToggle={(value) =>
                      toggleColumnFilter("region", value)
                    }
                    onClear={() => clearColumnFilter("region")}
                    isOpen={openDropdown === "region"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "region" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>임차형태</span>
                  <ColumnFilterDropdown
                    column="lease"
                    values={getUniqueValues("lease")}
                    selectedValues={columnFilters.lease || []}
                    onToggle={(value) =>
                      toggleColumnFilter("lease", value)
                    }
                    onClear={() => clearColumnFilter("lease")}
                    isOpen={openDropdown === "lease"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "lease" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>발전기</span>
                  <ColumnFilterDropdown
                    column="gen"
                    values={getUniqueValues("gen")}
                    selectedValues={columnFilters.gen || []}
                    onToggle={(value) =>
                      toggleColumnFilter("gen", value)
                    }
                    onClear={() => clearColumnFilter("gen")}
                    isOpen={openDropdown === "gen"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "gen" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                수전용량
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>국사등급</span>
                  <ColumnFilterDropdown
                    column="grade"
                    values={getUniqueValues("grade")}
                    selectedValues={columnFilters.grade || []}
                    onToggle={(value) =>
                      toggleColumnFilter("grade", value)
                    }
                    onClear={() => clearColumnFilter("grade")}
                    isOpen={openDropdown === "grade"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "grade" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>축전지</span>
                  <ColumnFilterDropdown
                    column="battery"
                    values={getUniqueValues("battery")}
                    selectedValues={columnFilters.battery || []}
                    onToggle={(value) =>
                      toggleColumnFilter("battery", value)
                    }
                    onClear={() => clearColumnFilter("battery")}
                    isOpen={openDropdown === "battery"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "battery" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                Modernization
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap relative"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>상태</span>
                  <ColumnFilterDropdown
                    column="status"
                    values={getUniqueValues("status")}
                    selectedValues={columnFilters.status || []}
                    onToggle={(value) =>
                      toggleColumnFilter("status", value)
                    }
                    onClear={() => clearColumnFilter("status")}
                    isOpen={openDropdown === "status"}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? "status" : null)
                    }
                  />
                </div>
              </th>
              <th
                className="text-center py-2 px-3 font-bold whitespace-nowrap"
                style={{
                  backgroundColor: "var(--region-light)",
                  color: "var(--region-primary)",
                }}
              >
                상세
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-10 text-gray-300"
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="text-sm font-semibold mb-1">
                    검색 결과가 없습니다
                  </div>
                  <div className="text-xs">
                    다른 검색어를 입력하거나 필터를 초기화하세요
                  </div>
                  <button
                    onClick={() => {
                      setSearchKeyword("");
                      setStatusFilters(["전체"]);
                    }}
                    className="mt-3 px-4 py-1.5 rounded-lg border text-xs font-bold"
                    style={{
                      borderColor: "var(--region-border)",
                      backgroundColor: "var(--region-light)",
                      color: "var(--region-primary)",
                    }}
                  >
                    필터 초기화
                  </button>
                </td>
              </tr>
            ) : (
              filteredData.map((station) => (
                <tr
                  key={station.id}
                  onClick={() => onStationClick?.(station)}
                  className="group border-b border-gray-100 cursor-pointer transition-colors hover:bg-[var(--region-light)]"
                >
                  <td
                    className="sticky left-0 z-10 py-2 px-3 text-gray-700 whitespace-nowrap font-medium border-r bg-white group-hover:bg-[var(--region-light)]"
                    style={{ borderRightColor: "var(--region-border)" }}
                  >
                    {station.name}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    {station.isClosing ? (
                      <span className="text-orange-600 font-semibold">
                        폐국 진행중
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">
                        운용중
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-700 whitespace-nowrap text-center">
                    {station.region}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    <Badge variant="outline">
                      {station.leaseType}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    {station.hasGenerator ? (
                      <span className="text-green-600 font-semibold">
                        설치
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        미설치
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-700 whitespace-nowrap font-mono text-center">
                    {station.powerCapacity}kW
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    <Badge
                      variant={
                        station.stationGrade === "A"
                          ? "default"
                          : station.stationGrade === "B"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {station.stationGrade}등급
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-gray-700 whitespace-nowrap text-center">
                    {station.battery}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-700 font-mono">
                      {station.modernizationCount}/37
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    {getStatusBadge(station.status)}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-center">
                    <ChevronRight className="w-4 h-4 text-gray-400 inline-block" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}