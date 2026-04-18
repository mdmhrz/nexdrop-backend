import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IUpdateMyProfilePayload } from "../interfaces/user.interface";

export const updateMyProfileService = async (userId: string, payload: IUpdateMyProfilePayload) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: payload,
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
