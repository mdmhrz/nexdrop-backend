import { prisma } from "../../../lib/prisma";
import { ParcelStatus, EarningStatus } from "../../../../generated/prisma/enums";

export const getRiderDashboardService = async (userId: string) => {
  const rider = await prisma.rider.findUnique({
    where: { userId },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  // Get overview stats
  const [
    totalDeliveries,
    totalEarnings,
    availableEarnings,
    todayDeliveries,
    thisWeekDeliveries,
    thisMonthDeliveries,
  ] = await Promise.all([
    // Total completed deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
      },
    }),
    // Total earnings (paid + pending)
    prisma.earning.aggregate({
      where: { riderId: rider.id },
      _sum: { amount: true },
    }),
    // Available earnings (pending only)
    prisma.earning.aggregate({
      where: {
        riderId: rider.id,
        status: EarningStatus.PENDING,
      },
      _sum: { amount: true },
    }),
    // Today's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    // This week's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // This month's deliveries
    prisma.parcel.count({
      where: {
        riderId: rider.id,
        status: ParcelStatus.DELIVERED,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  // Calculate average delivery time (from status logs)
  const deliveredParcels = await prisma.parcel.findMany({
    where: {
      riderId: rider.id,
      status: ParcelStatus.DELIVERED,
    },
    include: {
      statusLogs: {
        orderBy: { timestamp: 'asc' },
      },
    },
    take: 100, // Limit to last 100 for performance
  });

  let totalDeliveryTime = 0;
  let deliveryTimeCount = 0;

  for (const parcel of deliveredParcels) {
    const firstLog = parcel.statusLogs[0];
    const lastLog = parcel.statusLogs[parcel.statusLogs.length - 1];
    if (firstLog && lastLog) {
      const hours = (lastLog.timestamp.getTime() - firstLog.timestamp.getTime()) / (1000 * 60 * 60);
      totalDeliveryTime += hours;
      deliveryTimeCount++;
    }
  }

  const avgDeliveryTime = deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0;

  // Bar chart data: Earnings over last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayEarnings = await prisma.earning.aggregate({
      where: {
        riderId: rider.id,
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
      _sum: { amount: true },
      _count: true,
    });

    last7Days.push({
      date: date.toISOString().split('T')[0],
      earnings: dayEarnings._sum.amount || 0,
      deliveries: dayEarnings._count,
    });
  }

  // Pie chart data: Delivery status distribution
  const statusDistribution = await prisma.parcel.groupBy({
    by: ['status'],
    where: {
      riderId: rider.id,
    },
    _count: true,
  });

  const pieChartData = statusDistribution.map((item) => ({
    status: item.status,
    count: item._count,
  }));

  // Overview stats object
  const overview = {
    totalDeliveries,
    totalEarnings: totalEarnings._sum.amount || 0,
    availableEarnings: availableEarnings._sum.amount || 0,
    rating: rider.rating,
    totalRatings: rider.totalRatings,
    avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10, // Round to 1 decimal
    todayDeliveries,
    thisWeekDeliveries,
    thisMonthDeliveries,
  };

  return {
    overview,
    barChart: {
      title: 'Earnings & Deliveries (Last 7 Days)',
      data: last7Days,
    },
    pieChart: {
      title: 'Delivery Status Distribution',
      data: pieChartData,
    },
  };
};
