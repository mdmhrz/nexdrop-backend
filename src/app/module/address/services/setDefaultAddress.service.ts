import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const setDefaultAddressService = async (id: string, userId: string) => {
    const address = await prisma.userAddress.findUnique({
        where: { id }
    });

    if (!address) {
        throw new AppError(status.NOT_FOUND, "Address not found");
    }

    if (address.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "You can only set your own addresses as default");
    }

    // Unset all other default addresses for this user
    await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false }
    });

    // Set this address as default
    const updatedAddress = await prisma.userAddress.update({
        where: { id },
        data: { isDefault: true }
    });

    return updatedAddress;
}
