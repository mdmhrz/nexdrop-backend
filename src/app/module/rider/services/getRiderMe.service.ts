import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const getRiderMeService = async (userId: string) => {
    const rider = await prisma.rider.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true
                }
            }
        }
    });

    if (!rider) {
        throw new AppError(status.NOT_FOUND, "Rider profile not found");
    }

    return rider;
};
