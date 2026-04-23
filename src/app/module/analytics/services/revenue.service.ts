import { prisma } from "../../../lib/prisma";
import { PaymentStatus } from "../../../../generated/prisma/enums";
import {
  RevenueAnalyticsResponse,
  RevenueByPaymentMethod,
  RevenueByDistrict,
  RevenueOverTime,
  RevenueSummary,
} from "../interfaces";
import { getStatsCache } from "../../../shared/services/statsCache.service";

export const getRevenueAnalyticsService = async (query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  // Build date filter
  const dateFilter = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Get revenue summary from cache (for overall stats)
  const cache = await getStatsCache();

  // Get payment count and calculate average for the date range
  const summaryData = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter,
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const totalRevenue = summaryData._sum.amount || 0;
  const totalPayments = summaryData._count;
  const averageOrderValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const summary: RevenueSummary = {
    totalRevenue: cache.totalRevenue, // Use cache for overall revenue
    totalPayments,
    averageOrderValue,
    currency: "BDT",
  };

  // Get revenue by payment method
  const byPaymentMethodData = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter,
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const byPaymentMethod: RevenueByPaymentMethod[] = byPaymentMethodData.map((item) => ({
    paymentMethod: item.paymentMethod,
    totalRevenue: item._sum.amount || 0,
    paymentCount: item._count,
    percentage: totalRevenue > 0 ? ((item._sum.amount || 0) / totalRevenue) * 100 : 0,
  }));

  // Get revenue by district (from parcel pickup address)
  const paymentsWithParcel = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter,
    },
    include: {
      parcel: {
        select: {
          districtFrom: true,
        },
      },
    },
  });

  const districtMap = new Map<string, { revenue: number; count: number }>();

  paymentsWithParcel.forEach((payment) => {
    const district = payment.parcel?.districtFrom || "Unknown";
    const current = districtMap.get(district) || { revenue: 0, count: 0 };
    current.revenue += payment.amount;
    current.count += 1;
    districtMap.set(district, current);
  });

  const byDistrict: RevenueByDistrict[] = Array.from(districtMap.entries()).map(([district, data]) => ({
    district,
    totalRevenue: data.revenue,
    parcelCount: data.count,
    averageOrderValue: data.count > 0 ? data.revenue / data.count : 0,
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Get revenue over time (daily)
  const overTimeData = await prisma.payment.groupBy({
    by: ["createdAt"],
    where: {
      status: PaymentStatus.SUCCESS,
      ...dateFilter,
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const dateMap = new Map<string, { revenue: number; count: number }>();

  overTimeData.forEach((item) => {
    const date = item.createdAt.toISOString().split("T")[0];
    const current = dateMap.get(date) || { revenue: 0, count: 0 };
    current.revenue += item._sum.amount || 0;
    current.count += item._count;
    dateMap.set(date, current);
  });

  // Fill missing dates with zero revenue
  const overTime: RevenueOverTime[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const data = dateMap.get(dateStr) || { revenue: 0, count: 0 };
    overTime.push({
      date: dateStr,
      revenue: data.revenue,
      paymentCount: data.count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const response: RevenueAnalyticsResponse = {
    summary,
    byPaymentMethod,
    byDistrict,
    overTime,
  };

  return response;
};
