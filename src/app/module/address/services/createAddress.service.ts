import { prisma } from "../../../lib/prisma";
import { ICreateAddressPayload } from "../interfaces/address.interface";

export const createAddressService = async (userId: string, payload: ICreateAddressPayload) => {
    // If this is set as default, unset all other default addresses for this user
    if (payload.isDefault) {
        await prisma.userAddress.updateMany({
            where: { userId },
            data: { isDefault: false }
        });
    }

    const address = await prisma.userAddress.create({
        data: {
            ...payload,
            userId
        }
    });

    return address;
}
