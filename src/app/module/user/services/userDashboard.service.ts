import { prisma } from "../../../lib/prisma";
import { ParcelStatus } from "../../../../generated/prisma/enums";

export const getUserDashboardService = async (userId: string) => {
  // Get overview stats
  const [
    totalParcels,
    totalSpent,
    activeParcels,
    deliveredParcels,
    todayParcels,
    thisWeekParcels,
    thisMonthParcels,
  ] = await Promise.all([
    // Total parcels sent
    prisma.parcel.count({
      where: { customerId: userId },
    }),
    // Total spent (successful payments)
    prisma.payment.aggregate({
      where: {
        parcel: { customerId: userId },
      },
      _sum: { amount: true },
    }),
    // Active parcels (not delivered)
    prisma.parcel.count({
      where: {
        customerId: userId,
        status: {
          not: ParcelStatus.DELIVERED,
        },
      },
    }),
    // Delivered parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        status: ParcelStatus.DELIVERED,
      },
    }),
    // Today's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    // This week's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // This month's parcels
    prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  // Calculate average delivery time for their parcels
  const customerParcels = await prisma.parcel.findMany({
    where: {
      customerId: userId,
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

  for (const parcel of customerParcels) {
    const firstLog = parcel.statusLogs[0];
    const lastLog = parcel.statusLogs[parcel.statusLogs.length - 1];
    if (firstLog && lastLog) {
      const hours = (lastLog.timestamp.getTime() - firstLog.timestamp.getTime()) / (1000 * 60 * 60);
      totalDeliveryTime += hours;
      deliveryTimeCount++;
    }
  }

  const avgDeliveryTime = deliveryTimeCount > 0 ? totalDeliveryTime / deliveryTimeCount : 0;

  // Bar chart data: Spending over last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayPayments = await prisma.payment.aggregate({
      where: {
        parcel: {
          customerId: userId,
        },
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
      _sum: { amount: true },
      _count: true,
    });

    const dayParcels = await prisma.parcel.count({
      where: {
        customerId: userId,
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
    });

    last7Days.push({
      date: date.toISOString().split('T')[0],
      spent: dayPayments._sum.amount || 0,
      parcels: dayParcels,
    });
  }

  // Pie chart data: Parcel status distribution
  const statusDistribution = await prisma.parcel.groupBy({
    by: ['status'],
    where: {
      customerId: userId,
    },
    _count: true,
  });

  const pieChartData = statusDistribution.map((item) => ({
    status: item.status,
    count: item._count,
  }));

  // Overview stats object
  const overview = {
    totalParcels,
    totalSpent: totalSpent._sum.amount || 0,
    activeParcels,
    deliveredParcels,
    avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10, // Round to 1 decimal
    todayParcels,
    thisWeekParcels,
    thisMonthParcels,
  };

  return {
    overview,
    barChart: {
      title: 'Spending & Parcels (Last 7 Days)',
      data: last7Days,
    },
    pieChart: {
      title: 'Parcel Status Distribution',
      data: pieChartData,
    },
  };
};
