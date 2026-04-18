import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { UserRole } from "../../../../generated/prisma/enums";

export const getParcelByIdService = async (parcelId: string, userId: string, userRole: string) => {
    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId },
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
            },
            statusLogs: {
                orderBy: {
                    timestamp: 'desc'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    // Admins and Super Admins can view any parcel
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        return parcel;
    }

    // Check if user is the customer or the rider assigned to this parcel
    if (parcel.customerId !== userId && parcel.riderId) {
        const rider = await prisma.rider.findUnique({
            where: { id: parcel.riderId }
        });
        if (rider?.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You don't have permission to view this parcel");
        }
    } else if (parcel.customerId !== userId) {
        throw new AppError(status.FORBIDDEN, "You don't have permission to view this parcel");
    }

    return parcel;
};
