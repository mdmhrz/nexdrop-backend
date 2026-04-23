import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IDeliverParcelPayload } from "../interfaces/parcel.interface";
import { ParcelStatus, RiderStatus, RiderAccountStatus, EarningStatus } from "../../../../generated/prisma/enums";
import { updateStatsCache, getStatsCache } from "../../../shared/services/statsCache.service";

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

    // Update stats cache (parcel delivered)
    await updateStatsCache({
        totalCompletedParcels: { increment: 1 },
    });

    // Calculate delivery time and update performance metrics
    const parcelLogs = await prisma.parcelStatusLog.findMany({
        where: { parcelId },
        orderBy: { timestamp: 'asc' }
    });

    if (parcelLogs.length >= 2) {
        const pickupTime = parcelLogs.find(log => log.status === ParcelStatus.IN_TRANSIT)?.timestamp;
        const deliveredTime = parcelLogs.find(log => log.status === ParcelStatus.DELIVERED)?.timestamp;

        if (pickupTime && deliveredTime) {
            const deliveryTimeHours = (deliveredTime.getTime() - pickupTime.getTime()) / (1000 * 60 * 60);

            // Update average delivery time (simple moving average)
            const cache = await getStatsCache();
            const newAvg = (cache.avgDeliveryTime * (cache.totalCompletedParcels - 1) + deliveryTimeHours) / cache.totalCompletedParcels;
            await updateStatsCache({ avgDeliveryTime: newAvg });
        }
    }

    // Calculate and update delivery success rate
    const totalParcels = await prisma.parcel.count();
    const cancelledParcels = await prisma.parcel.count({ where: { status: ParcelStatus.CANCELLED } });
    const successRate = totalParcels > 0 ? ((totalParcels - cancelledParcels) / totalParcels) * 100 : 0;
    await updateStatsCache({ deliverySuccessRate: successRate });

    return updatedParcel;
};
