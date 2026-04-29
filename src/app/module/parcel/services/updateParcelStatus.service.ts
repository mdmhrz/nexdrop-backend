import { prisma } from "../../../lib/prisma";
import { IUpdateParcelStatusPayload } from "../interfaces/parcel.interface";
import AppError from "../../../errorHelper/AppError";
import { Prisma } from "../../../../generated/prisma/client";
import status from "http-status";

export const updateParcelStatusService = async (parcelId: string, payload: IUpdateParcelStatusPayload, adminId: string) => {
    const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId }
    });

    if (!parcel) {
        throw new AppError(status.NOT_FOUND, "Parcel not found");
    }

    if (parcel.status === payload.status) {
        throw new AppError(status.BAD_REQUEST, "Parcel is already in the requested status");
    }

    const updatedParcel = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                status: payload.status
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: payload.status,
                changedBy: adminId,
                note: payload.note
            }
        });

        return updated;
    });

    return updatedParcel;
};
