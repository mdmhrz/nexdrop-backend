import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IUpdateRiderStatusPayload } from "../interfaces/rider.interface";
import { RiderStatus, RiderAccountStatus } from "../../../../generated/prisma/enums";

export const updateRiderStatusService = async (userId: string, payload: IUpdateRiderStatusPayload) => {
    const rider = await prisma.rider.findUnique({
        where: { userId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    // Check if rider account is active
    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can update their status");
    }

    const updatedRider = await prisma.rider.update({
        where: { userId },
        data: {
            currentStatus: payload.currentStatus as RiderStatus
        }
    });

    return updatedRider;
};
