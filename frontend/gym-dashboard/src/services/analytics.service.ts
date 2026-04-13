import type { DashboardMetric } from "../types";
import { delay, store } from "./store";

export const analyticsService = {
  async getDashboardMetrics(): Promise<DashboardMetric> {
    await delay();
    const activeSubscriptions = store.members.filter((m) => m.membershipStatus === "active").length;
    const attendancePercent = Math.round((store.attendance.filter((a) => a.status === "present").length / Math.max(store.attendance.length, 1)) * 100);
    const monthlyRevenue = store.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    return {
      totalMembers: store.members.length,
      activeTrainers: store.trainers.filter((t) => t.status === "active").length,
      attendancePercent,
      monthlyRevenue,
      activeSubscriptions,
    };
  },
  async getTrends() {
    await delay();
    return store.trends;
  },
  async getReports() {
    await delay();
    return {
      retention: 82,
      churn: 4.1,
      trainerEfficiency: 87,
      revenuePerMember: 2120,
      attendanceConsistency: 79,
      absenteeTrend: "High absenteeism on Sundays",
      peakHours: "07:00 and 18:00",
    };
  },
  async getPlatformSnapshot() {
    await delay();
    return {
      gyms: store.platformGyms,
      users: store.platformUsers,
      mrr: 452000,
      growth: 12.5,
      failures: 4,
      apiHealth: "healthy",
      activeSessions: 241,
    };
  },
};
