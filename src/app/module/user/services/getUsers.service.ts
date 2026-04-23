import { prisma } from "../../../lib/prisma";
import { IPaginatedResult, calculatePaginationMeta } from "../../../shared/pagination";

export const getUsersService = async (search?: string, page: number = 1, limit: number = 10): Promise<IPaginatedResult<any>> => {
    const where = search ? {
        OR: [
            {
                email: {
                    contains: search,
                    mode: 'insensitive' as const
                }
            },
            {
                name: {
                    contains: search,
                    mode: 'insensitive' as const
                }
            }
        ]
    } : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        }),
        prisma.user.count({ where })
    ]);

    const meta = calculatePaginationMeta(page, limit, total);

    return {
        data: users,
        meta
    };
}
