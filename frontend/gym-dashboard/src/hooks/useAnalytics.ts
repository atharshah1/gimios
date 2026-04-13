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
    () => {
      const refreshAll = () => {
        void metrics.refresh();
        void trends.refresh();
        void reports.refresh();
        void platform.refresh();
      };
      const offAnalytics = subscribe("analytics:changed", refreshAll);
      const offGym = subscribe("gym:changed", refreshAll);
      const offAttendance = subscribe("attendance:changed", refreshAll);
      const offBilling = subscribe("billing:changed", refreshAll);
      return () => {
        offAnalytics();
        offGym();
        offAttendance();
        offBilling();
      };
    },
    [metrics, trends, reports, platform],
  );
  return { metrics, trends, reports, platform };
}
