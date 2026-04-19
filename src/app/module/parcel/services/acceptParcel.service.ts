import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IAcceptParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus, RiderStatus, RiderAccountStatus } from "../../../../generated/prisma/enums";

export const acceptParcelService = async (riderId: string, parcelId: string, payload: IAcceptParcelPayload) => {
    const rider = await prisma.rider.findUnique({
        where: { userId: riderId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can accept parcels");
    }

    if (rider.currentStatus !== RiderStatus.AVAILABLE) {
        throw new AppError(status.BAD_REQUEST, "Rider must be available to accept new parcels");
    }

    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    if (parcel.riderId !== null) {
        throw new AppError(status.CONFLICT, "Parcel is already assigned to another rider");
    }

    if (parcel.status !== ParcelStatus.REQUESTED) {
        throw new AppError(status.BAD_REQUEST, "Parcel must be in REQUESTED status to accept");
    }

    if (!parcel.isPaid) {
        throw new AppError(status.BAD_REQUEST, "Parcel must be paid before accepting");
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
        // Update parcel status and assign rider
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                status: ParcelStatus.ASSIGNED,
                riderId: rider.id
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: ParcelStatus.ASSIGNED,
                changedBy: riderId,
                note: payload.note
            }
        });

        return updated;
    });

    return updatedParcel;
};
