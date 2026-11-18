import { useMemo } from "react";
import type { ConsultationLog, Metrics } from "../types";

export function useMetrics(logs: ConsultationLog[]): Metrics {
  return useMemo(() => {
    const total = logs.length;
    const resolved = logs.filter((l) => l.resolved).length;
    const escalated = logs.filter((l) => l.escalated).length;
    const avg =
      total === 0 ? 0 : Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / total);
    return {
      totalConsultations: total,
      resolvedCount: resolved,
      escalatedCount: escalated,
      avgLatencyMs: avg,
      resolutionRate: total === 0 ? 0 : resolved / total,
    };
  }, [logs]);
}