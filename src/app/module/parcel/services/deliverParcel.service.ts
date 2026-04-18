import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IDeliverParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus, RiderStatus, RiderAccountStatus, EarningStatus } from "../../../../generated/prisma/enums";

export const deliverParcelService = async (riderId: string, parcelId: string, payload: IDeliverParcelPayload) => {
    const rider = await prisma.rider.findUnique({
        where: { userId: riderId }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    if (rider.accountStatus !== RiderAccountStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "Only active riders can deliver parcels");
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

    if (parcel.status !== ParcelStatus.IN_TRANSIT) {
        throw new AppError(status.BAD_REQUEST, "Parcel must be in IN_TRANSIT status to deliver");
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
        // Update parcel status
        const updated = await tx.parcel.update({
            where: { id: parcelId },
            data: {
                status: ParcelStatus.DELIVERED
            }
        });

        // Create status log
        await tx.parcelStatusLog.create({
            data: {
                parcelId: parcelId,
                status: ParcelStatus.DELIVERED,
                changedBy: riderId,
                note: payload.note
            }
        });

        // Generate rider earning (calculate as percentage of parcel price)
        const riderPercentage = 0.7; // 70% of parcel price goes to rider
        const earningAmount = parcel.price * riderPercentage;

        await tx.earning.create({
            data: {
                riderId: rider.id,
                parcelId: parcelId,
                amount: earningAmount,
                percentage: riderPercentage * 100,
                status: EarningStatus.PENDING
            }
        });

        // Update rider status to AVAILABLE
        await tx.rider.update({
            where: { id: rider.id },
            data: {
                currentStatus: RiderStatus.AVAILABLE
            }
        });

        return updated;
    });

    return updatedParcel;
};
