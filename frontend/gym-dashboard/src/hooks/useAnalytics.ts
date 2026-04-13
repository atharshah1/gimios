import { useEffect } from "react";
import { subscribe } from "../events";
import { analyticsService } from "../services/analytics.service";
import { useDomainData } from "./useDomainData";

export function useAnalytics() {
  const metrics = useDomainData(() => analyticsService.getDashboardMetrics(), []);
  const trends = useDomainData(() => analyticsService.getTrends(), []);
  const reports = useDomainData(() => analyticsService.getReports(), []);
  const platform = useDomainData(() => analyticsService.getPlatformSnapshot(), []);
  useEffect(
    () => subscribe("analytics:changed", () => {
      void metrics.refresh();
      void trends.refresh();
      void reports.refresh();
      void platform.refresh();
    }),
    [metrics, trends, reports, platform],
  );
  return { metrics, trends, reports, platform };
}
