import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const trackParcelService = async (trackingId: string) => {
    const parcel = await prisma.parcel.findFirst({
        where: {
            trackingId: {
                contains: trackingId,
                mode: 'insensitive'
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

    return parcel;
};
