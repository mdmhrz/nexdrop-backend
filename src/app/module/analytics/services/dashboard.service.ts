import { getStatsCache } from "../../../shared/services/statsCache.service";

export interface DashboardMetricsResponse {
  // Overview metrics
  overview: {
    totalParcels: number;
    totalPendingParcels: number;
    totalCompletedParcels: number;
    totalUsers: number;
    totalRiders: number;
    totalCustomers: number;
  };

  // Revenue metrics
  revenue: {
    totalRevenue: number;
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    platformRevenue: number;
    avgOrderValue: number;
  };

  // Rider metrics
  riders: {
    totalRiders: number;
    activeRiders: number;
    onlineRiders: number;
  };

  // Performance metrics
  performance: {
    avgDeliveryTime: number; // in hours
    deliverySuccessRate: number; // percentage
  };

  // Financial metrics
  financial: {
    riderPayouts: number;
    pendingPayouts: number;
  };

  // Growth metrics
  growth: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
}

export const getDashboardMetricsService = async (): Promise<DashboardMetricsResponse> => {
  const cache = await getStatsCache();

  return {
    overview: {
      totalParcels: cache.totalParcels,
      totalPendingParcels: cache.totalPendingParcels,
      totalCompletedParcels: cache.totalCompletedParcels,
      totalUsers: cache.totalUsers,
      totalRiders: cache.totalRiders,
      totalCustomers: cache.totalCustomers,
    },
    revenue: {
      totalRevenue: cache.totalRevenue,
      dailyRevenue: cache.dailyRevenue,
      weeklyRevenue: cache.weeklyRevenue,
      monthlyRevenue: cache.monthlyRevenue,
      platformRevenue: cache.platformRevenue,
      avgOrderValue: cache.avgOrderValue,
    },
    riders: {
      totalRiders: cache.totalRiders,
      activeRiders: cache.activeRiders,
      onlineRiders: cache.onlineRiders,
    },
    performance: {
      avgDeliveryTime: cache.avgDeliveryTime,
      deliverySuccessRate: cache.deliverySuccessRate,
    },
    financial: {
      riderPayouts: cache.riderPayouts,
      pendingPayouts: cache.pendingPayouts,
    },
    growth: {
      newUsersToday: cache.newUsersToday,
      newUsersThisWeek: cache.newUsersThisWeek,
      newUsersThisMonth: cache.newUsersThisMonth,
    },
  };
};
