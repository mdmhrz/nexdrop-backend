import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";
import { IUpdateAddressPayload } from "../interfaces/address.interface";

export const updateAddressService = async (id: string, userId: string, payload: IUpdateAddressPayload) => {
    const address = await prisma.userAddress.findUnique({
        where: { id }
    });

    if (!address) {
        throw new AppError(status.NOT_FOUND, "Address not found");
    }

    if (address.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "You can only update your own addresses");
    }

    // If this is set as default, unset all other default addresses for this user
    if (payload.isDefault) {
        await prisma.userAddress.updateMany({
            where: { userId },
            data: { isDefault: false }
        });
    }

    const updatedAddress = await prisma.userAddress.update({
        where: { id },
        data: payload
    });

    return updatedAddress;
}
