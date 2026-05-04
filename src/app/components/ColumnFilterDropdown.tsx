import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";

interface ColumnFilterDropdownProps {
  column: string;
  values: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ColumnFilterDropdown({
  column,
  values,
  selectedValues,
  onToggle,
  onClear,
  isOpen,
  onOpenChange,
}: ColumnFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  const allSelected = selectedValues.length === 0 || selectedValues.length === values.length;

  const handleSelectAll = () => {
    if (allSelected) {
      // Do nothing or clear all (currently keeping all selected means no filter)
    } else {
      onClear();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
          selectedValues.length > 0
            ? "opacity-100 text-white"
            : "opacity-45 hover:opacity-100"
        }`}
        style={
          selectedValues.length > 0
            ? { backgroundColor: "var(--region-primary)" }
            : { color: "var(--region-primary)" }
        }
      >
        <Filter className="w-3 h-3" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[160px] p-1.5"
          style={{ animation: "fadeIn 0.15s ease" }}
        >
          {/* 전체 선택 */}
          <label className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--region-light)] cursor-pointer text-xs font-bold border-b border-gray-100 mb-1"
            style={{ color: "var(--region-primary)" }}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-3.5 h-3.5 cursor-pointer"
              style={{ accentColor: "var(--region-primary)" }}
            />
            <span>전체 선택</span>
          </label>

          {/* 개별 항목 */}
          {values.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--region-light)] cursor-pointer text-xs text-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedValues.length === 0 || selectedValues.includes(value)}
                onChange={() => onToggle(value)}
                className="w-3.5 h-3.5 cursor-pointer"
                style={{ accentColor: "var(--region-primary)" }}
              />
              <span>{value}</span>
            </label>
          ))}

          {/* 버튼 */}
          {selectedValues.length > 0 && (
            <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-gray-100">
              <button
                onClick={onClear}
                className="flex-1 px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500 hover:bg-gray-300 hover:text-white transition-colors"
              >
                초기화
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
