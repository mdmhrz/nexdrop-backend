import { prisma } from "../../../lib/prisma";
import { ParcelStatus } from "../../../../generated/prisma/enums";

export const getAvailableParcelsService = async (riderId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
        prisma.parcel.findMany({
            where: {
                status: ParcelStatus.REQUESTED,
                riderId: null
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
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
                status: ParcelStatus.REQUESTED,
                riderId: null
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
