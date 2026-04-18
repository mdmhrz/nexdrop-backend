import { prisma } from "../../../lib/prisma";
import { ParcelStatus, RiderAccountStatus } from "../../../../generated/prisma/enums";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const getAssignedParcelsService = async (riderId: string, page: number = 1, limit: number = 10) => {
    const rider = await prisma.rider.findUnique({
        where: { userId: riderId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can view assigned parcels");
    }

    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
        prisma.parcel.findMany({
            where: {
                riderId: riderId,
                status: {
                    in: [ParcelStatus.ASSIGNED, ParcelStatus.PICKED, ParcelStatus.IN_TRANSIT]
                }
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
                riderId: riderId,
                status: {
                    in: [ParcelStatus.ASSIGNED, ParcelStatus.PICKED, ParcelStatus.IN_TRANSIT]
                }
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
