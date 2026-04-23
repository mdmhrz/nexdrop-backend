import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { auth } from "../../../lib/auth";
import { IApplyRiderAuthenticatedPayload, IApplyRiderUnauthenticatedPayload, IRiderApplyResult } from "../interfaces/rider.interface";
import { RiderAccountStatus, RiderStatus } from "../../../../generated/prisma/enums";
import { updateStatsCache } from "../../../shared/services/statsCache.service";

export const riderApplyService = async (
    userId: string | undefined,
    payload: IApplyRiderAuthenticatedPayload | IApplyRiderUnauthenticatedPayload
): Promise<IRiderApplyResult> => {
    // Scenario 1: Authenticated user applying for rider
    if (userId) {
        // Create rider profile (role and rider profile checks are done in controller)
        const riderProfile = await prisma.rider.create({
            data: {
                userId: userId,
                district: (payload as IApplyRiderAuthenticatedPayload).district,
                accountStatus: RiderAccountStatus.PENDING,
                currentStatus: RiderStatus.AVAILABLE
            }
        });

        // Update stats cache
        await updateStatsCache({
            totalRiders: { increment: 1 },
        });

        return {
            rider: riderProfile as IRiderApplyResult["rider"]
        };
    }

    // Scenario 2: Unauthenticated user - create user and rider profile
    const unauthenticatedPayload = payload as IApplyRiderUnauthenticatedPayload;
    const { name, email, password, district } = unauthenticatedPayload;

    let createdUserId: string | null = null;

    try {
        // Step 1: Create user via better-auth (better-auth handles duplicate email)
        const authData = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password
            }
        });

        if (!authData.user) {
            throw new AppError(status.BAD_REQUEST, "Failed to register user");
        }

        createdUserId = authData.user.id;

        // Step 2: Create rider profile
        const riderProfile = await prisma.rider.create({
            data: {
                userId: authData.user.id,
                district,
                accountStatus: RiderAccountStatus.PENDING,
                currentStatus: RiderStatus.AVAILABLE
            }
        });

        // Update stats cache
        await updateStatsCache({
            totalUsers: { increment: 1 },
            totalRiders: { increment: 1 },
            newUsersToday: { increment: 1 },
            newUsersThisWeek: { increment: 1 },
            newUsersThisMonth: { increment: 1 },
        });

        return {
            user: {
                id: authData.user.id,
                name: authData.user.name,
                email: authData.user.email,
                role: authData.user.role,
                status: authData.user.status
            },
            rider: riderProfile as IRiderApplyResult["rider"]
        };
    } catch (error) {
        // Manual rollback: if rider creation fails, delete the user
        if (createdUserId) {
            try {
                await prisma.user.delete({
                    where: { id: createdUserId }
                });
            } catch {
                // Silently ignore deletion errors - user might already be deleted or cascade handled it
            }
        }
        throw error;
    }
};
