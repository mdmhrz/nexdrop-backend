import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IPickParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus, RiderStatus, RiderAccountStatus } from "../../../../generated/prisma/enums";

export const pickParcelService = async (riderId: string, parcelId: string, payload: IPickParcelPayload) => {
    const rider = await prisma.rider.findUnique({
        where: { userId: riderId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can pick up parcels");
    }

    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    if (parcel.riderId !== rider.id) {
        throw new AppError(status.FORBIDDEN, "This parcel is not assigned to you");
    }

    if (parcel.status !== ParcelStatus.ASSIGNED) {
        throw new AppError(status.BAD_REQUEST, "Parcel must be in ASSIGNED status to pick up");
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
        // Update parcel status
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                status: ParcelStatus.IN_TRANSIT
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: ParcelStatus.IN_TRANSIT,
                changedBy: riderId,
                note: payload.note
            }
        });

        // Update rider status to BUSY
        await tx.rider.update({
            where: { id: rider.id },
            data: {
                currentStatus: RiderStatus.BUSY
            }
        });

        return updated;
    });

    return updatedParcel;
};
