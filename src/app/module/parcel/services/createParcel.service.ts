import { prisma } from "../../../lib/prisma";
import { ICreateParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus } from "../../../../generated/prisma/enums";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const createParcelService = async (customerId: string, payload: ICreateParcelPayload) => {
    // Generate a unique tracking ID
    const trackingId = `PKG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const parcel = await prisma.$transaction(async (tx) => {
        const createdParcel = await tx.parcel.create({
            data: {
                trackingId,
                customerId,
                pickupAddress: payload.pickupAddress,
                deliveryAddress: payload.deliveryAddress,
                districtFrom: payload.districtFrom,
                districtTo: payload.districtTo,
                price: payload.price,
                status: ParcelStatus.REQUESTED
            }
        });

        // Create initial status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: createdParcel.id,
                status: ParcelStatus.REQUESTED,
                changedBy: customerId,
                note: payload.note
            }
        });

        return createdParcel;
    });

    return parcel;
};
