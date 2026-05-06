import { useMemo } from "react";
import { HqDivision, RepeaterRow } from "../data/facilityStatusData";
import { StateDistributionMapCard } from "./StateDistributionMapCard";

type MetricKey = "siteCount";

interface RepeaterStateMapCardProps {
  region: HqDivision;
  rows: RepeaterRow[];
}

const METRIC_META: Record<MetricKey, { label: string; unit: string; color: string }> = {
  siteCount: { label: "사이트", unit: "개소", color: "#374151" },
};

export function RepeaterStateMapCard({ region, rows }: RepeaterStateMapCardProps) {
  const stateMetrics = useMemo(() => {
    const aggregate = new Map<string, { state: string; values: Record<MetricKey, number> }>();

    rows.forEach((row) => {
      const current = aggregate.get(row.state) ?? {
        state: row.state,
        values: {
          siteCount: 0,
        },
      };

      current.values.siteCount += row.siteCount;
      aggregate.set(row.state, current);
    });

    return Array.from(aggregate.values());
  }, [rows]);

  return (
    <StateDistributionMapCard
      region={region}
      rows={stateMetrics}
      metrics={(Object.entries(METRIC_META) as Array<[MetricKey, (typeof METRIC_META)[MetricKey]]>).map(
        ([key, value]) => ({ key, ...value })
      )}
      initialMetricKey="siteCount"
      showSummaryPanel={false}
      showTotalBadge={false}
      fitToRegionStates
    />
  );
}
