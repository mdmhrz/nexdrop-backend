import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IUpdateUserRolePayload } from "../interfaces/user.interface";
import { UserRole } from "../../../../generated/prisma/enums";

export const updateUserRoleService = async (id: string, payload: IUpdateUserRolePayload) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: payload.role },
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
