import { prisma } from "../../../lib/prisma";

export const getMyParcelsService = async (customerId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
        prisma.parcel.findMany({
            where: {
                customerId: customerId
            },
            include: {
                rider: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        }),
        prisma.parcel.count({
            where: {
                customerId: customerId
            }
        })
    ]);

    return {
        data: parcels,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
