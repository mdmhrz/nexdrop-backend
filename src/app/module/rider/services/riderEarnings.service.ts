import { prisma } from "../../../lib/prisma";
import { EarningStatus } from "../../../../generated/prisma/enums";
import { paginationHelper } from "../../../shared/pagination";

export const getCurrentEarningsService = async (userId: string) => {
    const rider = await prisma.rider.findUnique({
        where: { userId },
    });

    if (!rider) {
        throw new Error("Rider profile not found");
    }

    // Get total available amount
    const totalAvailable = await prisma.earning.aggregate({
        where: {
            riderId: rider.id,
            status: EarningStatus.PENDING,
        },
        _sum: {
            amount: true,
        },
    });

    // Get recent 5 pending earnings
    const recentEarnings = await prisma.earning.findMany({
        where: {
            riderId: rider.id,
            status: EarningStatus.PENDING,
        },
        include: {
            parcel: {
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });

    return {
        totalAvailable: totalAvailable._sum.amount || 0,
        recentEarnings,
    };
};

export const getEarningsHistoryService = async (userId: string, query: any) => {
    const rider = await prisma.rider.findUnique({
        where: { userId },
    });

    if (!rider) {
        throw new Error("Rider profile not found");
    }

    const { page, limit, skip } = paginationHelper(query);

    // Build where clause with filters
    const where: any = {
        riderId: rider.id,
    };

    // Status filter
    if (query.status && query.status !== "ALL") {
        where.status = query.status;
    }

    // Date range filter
    if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
            where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
            where.createdAt.lte = new Date(query.endDate);
        }
    }

    // Search by tracking ID
    if (query.search) {
        where.parcel = {
            trackingId: {
                contains: query.search,
                mode: "insensitive",
            },
        };
    }

    // Sorting
    const orderBy: any = {};
    if (query.sortBy) {
        orderBy[query.sortBy] = query.sortOrder === "asc" ? "asc" : "desc";
    } else {
        orderBy.createdAt = "desc";
    }

    const [earnings, total] = await Promise.all([
        prisma.earning.findMany({
            where,
            include: {
                parcel: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy,
            skip,
            take: limit,
        }),
        prisma.earning.count({ where }),
    ]);

    const totalAmount = earnings.reduce((sum, earning) => sum + earning.amount, 0);

    return {
        earnings,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            totalAmount,
        },
    };
};
