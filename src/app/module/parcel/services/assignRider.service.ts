import { prisma } from "../../../lib/prisma";
import { IAssignRiderPayload } from "../interfaces/parcel.interface";
import { ParcelStatus, RiderAccountStatus, RiderStatus } from "../../../../generated/prisma/enums";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const assignRiderService = async (parcelId: string, payload: IAssignRiderPayload, adminId: string) => {
    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    if (parcel.status !== ParcelStatus.REQUESTED) {
        throw new AppError(status.BAD_REQUEST, "Only parcels in REQUESTED status can be assigned to a rider");
    }

    if (parcel.riderId) {
        throw new AppError(status.BAD_REQUEST, "Parcel is already assigned to a rider");
    }

    if (!parcel.isPaid) {
        throw new AppError(status.BAD_REQUEST, "Parcel must be paid before assigning a rider");
    }

    const rider = await prisma.rider.findUnique({
        where: { id: payload.riderId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.BAD_REQUEST, "Rider account is not active");
    }

    if (rider.currentStatus !== RiderStatus.AVAILABLE) {
        throw new AppError(status.BAD_REQUEST, "Rider is not available for new assignments");
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                riderId: payload.riderId,
                status: ParcelStatus.ASSIGNED
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: ParcelStatus.ASSIGNED,
                changedBy: adminId,
                note: payload.note
            }
        });

        return updated;
    });

    return updatedParcel;
};
