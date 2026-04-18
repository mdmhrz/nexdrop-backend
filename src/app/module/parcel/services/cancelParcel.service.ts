import { prisma } from "../../../lib/prisma";
import { ICancelParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus } from "../../../../generated/prisma/enums";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const cancelParcelService = async (customerId: string, parcelId: string, payload: ICancelParcelPayload) => {
    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    if (parcel.customerId !== customerId) {
        throw new AppError(status.FORBIDDEN, "You can only cancel your own parcels");
    }

    if (parcel.status !== ParcelStatus.REQUESTED) {
        throw new AppError(status.BAD_REQUEST, "Only parcels in REQUESTED status can be cancelled");
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                status: ParcelStatus.CANCELLED
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: ParcelStatus.CANCELLED,
                changedBy: customerId,
                note: payload.note
            }
        });

        return updated;
    });

    return updatedParcel;
};
