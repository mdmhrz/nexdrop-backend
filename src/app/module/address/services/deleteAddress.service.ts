import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const deleteAddressService = async (id: string, userId: string) => {
    const address = await prisma.userAddress.findUnique({
        where: { id }
    });

    if (!address) {
        throw new AppError(status.NOT_FOUND, "Address not found");
    }

    if (address.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "You can only delete your own addresses");
    }

    await prisma.userAddress.delete({
        where: { id }
    });

    return { message: "Address deleted successfully" };
}
