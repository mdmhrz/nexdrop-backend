import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { RiderAccountStatus, UserRole, UserStatus } from "../../../../generated/prisma/enums";

export const updateRiderAccountStatusService = async (
    riderId: string,
    accountStatus: RiderAccountStatus
) => {
    // ── 1. Fetch the rider and their user in one query ──────────────────────
    const rider = await prisma.rider.findUnique({
        where: { id: riderId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
        },
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider application not found");
    }

    // ── 2. Guard: cannot approve a blocked or deleted user account ──────────
    if (accountStatus === RiderAccountStatus.ACTIVE) {
        if (rider.user.status === UserStatus.BLOCKED) {
            throw new AppError(
                status.FORBIDDEN,
                "Cannot approve a blocked user account. Unblock the user first."
            );
        }
        if (rider.user.status === UserStatus.DELETED) {
            throw new AppError(
                status.FORBIDDEN,
                "Cannot approve a deleted user account."
            );
        }
    }

    // ── 3. No-op guard: skip DB writes if nothing would change ──────────────
    if (rider.accountStatus === accountStatus) {
        return rider; // already in the requested state
    }

    // ── 4. Determine whether user.role needs to change ──────────────────────
    //    Approve (ACTIVE)  → role must become RIDER
    //    Anything else     → role must revert to CUSTOMER
    //    Only write if the role is actually different (avoid unnecessary update)
    const targetUserRole =
        accountStatus === RiderAccountStatus.ACTIVE ? UserRole.RIDER : UserRole.CUSTOMER;

    const roleNeedsUpdate = rider.user.role !== targetUserRole;

    // ── 5. Run both updates atomically in a transaction ─────────────────────
    const [updated] = await prisma.$transaction([
        prisma.rider.update({
            where: { id: riderId },
            data: { accountStatus },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        }),
        ...(roleNeedsUpdate
            ? [
                prisma.user.update({
                    where: { id: rider.userId },
                    data: { role: targetUserRole },
                }),
            ]
            : []),
    ]);

    return updated;
};
