import { prisma } from "../../../lib/prisma";
import { ParcelStatus } from "../../../../generated/prisma/enums";

export const getAllParcelsService = async (
    page: number = 1,
    limit: number = 10,
    status?: ParcelStatus,
    district?: string,
    date?: string
) => {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
        where.status = status;
    }

    if (district) {
        where.OR = [
            { districtFrom: { contains: district, mode: 'insensitive' } },
            { districtTo: { contains: district, mode: 'insensitive' } }
        ];
    }

    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt = {
            gte: startDate,
            lt: endDate
        };
    }

    const [parcels, total] = await Promise.all([
        prisma.parcel.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
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
        prisma.parcel.count({ where })
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
