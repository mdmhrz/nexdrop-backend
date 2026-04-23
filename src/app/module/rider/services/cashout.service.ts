import { prisma } from "../../../lib/prisma";
import { CashoutStatus, EarningStatus } from "../../../../generated/prisma/enums";
import { paginationHelper } from "../../../shared/pagination";
import { updateStatsCache } from "../../../shared/services/statsCache.service";

export const requestCashoutService = async (userId: string, amount: number) => {
    const rider = await prisma.rider.findUnique({
        where: { userId },
    });

    if (!rider) {
        throw new Error("Rider profile not found");
    }

    // Calculate total available earnings
    const totalAvailable = await prisma.earning.aggregate({
        where: {
            riderId: rider.id,
            status: EarningStatus.PENDING,
        },
        _sum: {
            amount: true,
        },
    });

    const availableAmount = totalAvailable._sum.amount || 0;

    if (amount > availableAmount) {
        throw new Error(`Insufficient balance. Available: ${availableAmount}, Requested: ${amount}`);
    }

    // Create cashout request
    const cashout = await prisma.cashout.create({
        data: {
            riderId: rider.id,
            amount,
            status: CashoutStatus.PENDING,
        },
    });

    // Update stats cache
    await updateStatsCache({
        pendingPayouts: { increment: amount },
    });

    return cashout;
};

export const getMyCashoutsService = async (userId: string, query: { status?: string; startDate?: string; endDate?: string; page?: string | string[]; limit?: string | string[] }) => {
    const rider = await prisma.rider.findUnique({
        where: { userId },
    });

    if (!rider) {
        throw new Error("Rider profile not found");
    }

    const { page, limit, skip } = paginationHelper(query);

    // Build where clause with filters
    const where: Record<string, unknown> = {
        riderId: rider.id,
    };

    // Status filter
    if (query.status && query.status !== "ALL") {
        where.status = query.status;
    }

    // Date range filter
    if (query.startDate || query.endDate) {
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (query.startDate) {
            dateFilter.gte = new Date(query.startDate);
        }
        if (query.endDate) {
            dateFilter.lte = new Date(query.endDate);
        }
        where.requestedAt = dateFilter;
    }

    const [cashouts, total] = await Promise.all([
        prisma.cashout.findMany({
            where,
            orderBy: {
                requestedAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.cashout.count({ where }),
    ]);

    return {
        cashouts,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAllCashoutsService = async (query: { status?: string; startDate?: string; endDate?: string; page?: string | string[]; limit?: string | string[] }) => {
    const { page, limit, skip } = paginationHelper(query);

    // Build where clause with filters
    const where: Record<string, unknown> = {};

    // Status filter
    if (query.status && query.status !== "ALL") {
        where.status = query.status;
    }

    // Date range filter
    if (query.startDate || query.endDate) {
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (query.startDate) {
            dateFilter.gte = new Date(query.startDate);
        }
        if (query.endDate) {
            dateFilter.lte = new Date(query.endDate);
        }
        where.requestedAt = dateFilter;
    }

    const [cashouts, total] = await Promise.all([
        prisma.cashout.findMany({
            where,
            include: {
                rider: {
                    include: {
                        user: {
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
                requestedAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.cashout.count({ where }),
    ]);

    return {
        cashouts,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const updateCashoutStatusService = async (cashoutId: string, status: string) => {
    const cashout = await prisma.cashout.findUnique({
        where: { id: cashoutId },
    });

    if (!cashout) {
        throw new Error("Cashout not found");
    }

    // Validate status transition
    const validTransitions: Record<CashoutStatus, CashoutStatus[]> = {
        [CashoutStatus.PENDING]: [CashoutStatus.APPROVED, CashoutStatus.REJECTED],
        [CashoutStatus.REJECTED]: [CashoutStatus.APPROVED], // Can reverse rejection
        [CashoutStatus.APPROVED]: [CashoutStatus.PAID], // Can mark as paid after processing
        [CashoutStatus.PAID]: [], // No further transitions allowed
    };

    const allowedTransitions = validTransitions[cashout.status];
    if (!allowedTransitions || !allowedTransitions.includes(status as CashoutStatus)) {
        throw new Error(`Invalid status transition from ${cashout.status} to ${status}`);
    }

    const updatedCashout = await prisma.cashout.update({
        where: { id: cashoutId },
        data: {
            status: status as CashoutStatus,
            processedAt: new Date(),
        },
    });

    // Update stats cache based on status change
    if (status === CashoutStatus.PAID) {
        await updateStatsCache({
            riderPayouts: { increment: updatedCashout.amount },
            pendingPayouts: { decrement: updatedCashout.amount },
        });
    } else if (status === CashoutStatus.APPROVED) {
        // When approved, we keep it in pending until actually paid
        // No cache change needed
    } else if (status === CashoutStatus.REJECTED) {
        // When rejected, remove from pending
        await updateStatsCache({
            pendingPayouts: { decrement: updatedCashout.amount },
        });
    }

    // If approved, mark associated earnings as PAID
    if (status === CashoutStatus.APPROVED) {
        const totalAmount = updatedCashout.amount;

        // Get pending earnings for this rider
        const pendingEarnings = await prisma.earning.findMany({
            where: {
                riderId: cashout.riderId,
                status: EarningStatus.PENDING,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Mark earnings as paid until total amount is covered
        let remainingAmount = totalAmount;
        const earningsToUpdate: string[] = [];

        for (const earning of pendingEarnings) {
            if (remainingAmount <= 0) break;
            earningsToUpdate.push(earning.id);
            remainingAmount -= earning.amount;
        }

        if (earningsToUpdate.length > 0) {
            await prisma.earning.updateMany({
                where: {
                    id: { in: earningsToUpdate },
                },
                data: {
                    status: EarningStatus.PAID,
                },
            });
        }
    }

    return updatedCashout;
};
