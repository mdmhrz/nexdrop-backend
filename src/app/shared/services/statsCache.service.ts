import { prisma } from "../../lib/prisma";

type CacheUpdate = {
  // Existing metrics
  totalUsers?: number | { increment: number } | { decrement: number };
  totalParcels?: number | { increment: number } | { decrement: number };
  totalPendingParcels?: number | { increment: number } | { decrement: number };
  totalCompletedParcels?: number | { increment: number } | { decrement: number };
  totalRevenue?: number | { increment: number } | { decrement: number };

  // Time-based metrics
  dailyRevenue?: number | { increment: number } | { decrement: number };
  weeklyRevenue?: number | { increment: number } | { decrement: number };
  monthlyRevenue?: number | { increment: number } | { decrement: number };
  dailyParcels?: number | { increment: number } | { decrement: number };
  weeklyParcels?: number | { increment: number } | { decrement: number };
  monthlyParcels?: number | { increment: number } | { decrement: number };

  // Rider metrics
  activeRiders?: number | { increment: number } | { decrement: number };
  onlineRiders?: number | { increment: number } | { decrement: number };
  totalRiders?: number | { increment: number } | { decrement: number };
  topRiderId?: string;

  // Customer metrics
  activeCustomers?: number | { increment: number } | { decrement: number };
  totalCustomers?: number | { increment: number } | { decrement: number };

  // Performance metrics
  avgDeliveryTime?: number;
  deliverySuccessRate?: number;

  // Financial metrics
  avgOrderValue?: number;
  platformRevenue?: number | { increment: number } | { decrement: number };
  riderPayouts?: number | { increment: number } | { decrement: number };
  pendingPayouts?: number | { increment: number } | { decrement: number };

  // Growth metrics
  newUsersToday?: number | { increment: number } | { decrement: number };
  newUsersThisWeek?: number | { increment: number } | { decrement: number };
  newUsersThisMonth?: number | { increment: number } | { decrement: number };
};

export const updateStatsCache = async (updates: CacheUpdate) => {
  const cache = await prisma.statsCache.findFirst();

  if (!cache) {
    // Initialize if doesn't exist
    await prisma.statsCache.create({
      data: {
        totalUsers: typeof updates.totalUsers === 'number' ? updates.totalUsers : 0,
        totalParcels: typeof updates.totalParcels === 'number' ? updates.totalParcels : 0,
        totalPendingParcels: typeof updates.totalPendingParcels === 'number' ? updates.totalPendingParcels : 0,
        totalCompletedParcels: typeof updates.totalCompletedParcels === 'number' ? updates.totalCompletedParcels : 0,
        totalRevenue: typeof updates.totalRevenue === 'number' ? updates.totalRevenue : 0,
        dailyRevenue: typeof updates.dailyRevenue === 'number' ? updates.dailyRevenue : 0,
        weeklyRevenue: typeof updates.weeklyRevenue === 'number' ? updates.weeklyRevenue : 0,
        monthlyRevenue: typeof updates.monthlyRevenue === 'number' ? updates.monthlyRevenue : 0,
        dailyParcels: typeof updates.dailyParcels === 'number' ? updates.dailyParcels : 0,
        weeklyParcels: typeof updates.weeklyParcels === 'number' ? updates.weeklyParcels : 0,
        monthlyParcels: typeof updates.monthlyParcels === 'number' ? updates.monthlyParcels : 0,
        activeRiders: typeof updates.activeRiders === 'number' ? updates.activeRiders : 0,
        onlineRiders: typeof updates.onlineRiders === 'number' ? updates.onlineRiders : 0,
        totalRiders: typeof updates.totalRiders === 'number' ? updates.totalRiders : 0,
        topRiderId: updates.topRiderId,
        activeCustomers: typeof updates.activeCustomers === 'number' ? updates.activeCustomers : 0,
        totalCustomers: typeof updates.totalCustomers === 'number' ? updates.totalCustomers : 0,
        avgDeliveryTime: updates.avgDeliveryTime || 0,
        deliverySuccessRate: updates.deliverySuccessRate || 0,
        avgOrderValue: updates.avgOrderValue || 0,
        platformRevenue: typeof updates.platformRevenue === 'number' ? updates.platformRevenue : 0,
        riderPayouts: typeof updates.riderPayouts === 'number' ? updates.riderPayouts : 0,
        pendingPayouts: typeof updates.pendingPayouts === 'number' ? updates.pendingPayouts : 0,
        newUsersToday: typeof updates.newUsersToday === 'number' ? updates.newUsersToday : 0,
        newUsersThisWeek: typeof updates.newUsersThisWeek === 'number' ? updates.newUsersThisWeek : 0,
        newUsersThisMonth: typeof updates.newUsersThisMonth === 'number' ? updates.newUsersThisMonth : 0,
      },
    });
  } else {
    // Update existing cache
    await prisma.statsCache.update({
      where: { id: cache.id },
      data: updates,
    });
  }
};

export const getStatsCache = async () => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) {
    // Initialize if doesn't exist
    return prisma.statsCache.create({
      data: {
        totalUsers: 0,
        totalParcels: 0,
        totalPendingParcels: 0,
        totalCompletedParcels: 0,
        totalRevenue: 0,
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        dailyParcels: 0,
        weeklyParcels: 0,
        monthlyParcels: 0,
        activeRiders: 0,
        onlineRiders: 0,
        totalRiders: 0,
        activeCustomers: 0,
        totalCustomers: 0,
        avgDeliveryTime: 0,
        deliverySuccessRate: 0,
        avgOrderValue: 0,
        platformRevenue: 0,
        riderPayouts: 0,
        pendingPayouts: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0,
      },
    });
  }
  return cache;
};

// Reset daily metrics (call via scheduled job at midnight)
export const resetDailyMetrics = async () => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) return;

  await prisma.statsCache.update({
    where: { id: cache.id },
    data: {
      dailyRevenue: 0,
      dailyParcels: 0,
      newUsersToday: 0,
    },
  });
};

// Reset weekly metrics (call via scheduled job at start of week)
export const resetWeeklyMetrics = async () => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) return;

  await prisma.statsCache.update({
    where: { id: cache.id },
    data: {
      weeklyRevenue: 0,
      weeklyParcels: 0,
      newUsersThisWeek: 0,
    },
  });
};

// Reset monthly metrics (call via scheduled job at start of month)
export const resetMonthlyMetrics = async () => {
  const cache = await prisma.statsCache.findFirst();
  if (!cache) return;

  await prisma.statsCache.update({
    where: { id: cache.id },
    data: {
      monthlyRevenue: 0,
      monthlyParcels: 0,
      newUsersThisMonth: 0,
    },
  });
};
