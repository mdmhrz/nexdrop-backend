import { prisma } from "../../../lib/prisma";
import { ParcelStatus, RiderAccountStatus, UserRole } from "../../../../generated/prisma/enums";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const getAvailableParcelsService = async (userId: string, userRole: UserRole, page: number = 1, limit: number = 10) => {
    // If user is admin or super admin, they can view available parcels without rider account check
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
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
    }

    // For riders, check account status
    const rider = await prisma.rider.findUnique({
        where: { userId: userId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can view available parcels");
    }

    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
        prisma.parcel.findMany({
            where: {
                status: ParcelStatus.REQUESTED,
                riderId: null,
                isPaid: true
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
                riderId: null,
                isPaid: true
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
