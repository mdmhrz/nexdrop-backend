import { prisma } from "../../../lib/prisma";
import { IPaginatedResult, calculatePaginationMeta } from "../../../shared/pagination";

export const getAddressesService = async (userId: string, page: number = 1, limit: number = 10): Promise<IPaginatedResult<any>> => {
    const skip = (page - 1) * limit;

    const [addresses, total] = await Promise.all([
        prisma.userAddress.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ],
            skip,
            take: limit
        }),
        prisma.userAddress.count({ where: { userId } })
    ]);

    const meta = calculatePaginationMeta(page, limit, total);

    return {
        data: addresses,
        meta
    };
}
