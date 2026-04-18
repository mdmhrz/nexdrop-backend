import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IUpdateUserStatusPayload } from "../interfaces/user.interface";
import { UserStatus } from "../../../../generated/prisma/enums";

export const updateUserStatusService = async (id: string, payload: IUpdateUserStatusPayload, currentUserId: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Prevent user from changing their own status (except DELETE)
    if (id === currentUserId && payload.status !== UserStatus.DELETED) {
        throw new AppError(status.FORBIDDEN, "You cannot change your own status");
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: payload.status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            phone: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return updatedUser;
}
