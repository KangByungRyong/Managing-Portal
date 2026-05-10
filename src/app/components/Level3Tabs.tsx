interface Level3Tab {
  id: string;
  label: string;
  icon?: string;
  status?: "complete" | "structure" | "blank";
  disabled?: boolean;
}

interface Level3TabsProps {
  tabs: Level3Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Level3Tabs({ tabs, activeTab, onChange }: Level3TabsProps) {
  return (
    <div className="flex gap-1.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              isActive
                ? "text-white"
                : tab.disabled
                ? "opacity-40 cursor-not-allowed"
                : "bg-white hover:bg-[var(--region-light)]"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: "var(--region-primary)",
                    borderColor: "var(--region-primary)",
                    color: "white",
                  }
                : {
                    borderColor: "var(--region-border)",
                    color: "var(--region-primary)",
                  }
            }
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {tab.status === "complete" && !isActive && (
              <span className="ml-1.5">✅</span>
            )}
            {tab.status === "structure" && !isActive && (
              <span className="ml-1.5">🔶</span>
            )}
            {tab.status === "blank" && !isActive && (
              <span className="ml-1.5">📋</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
