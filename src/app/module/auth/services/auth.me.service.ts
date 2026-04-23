import { prisma } from "../../../lib/prisma";

export const getMeService = async (id: string) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!isUserExist) {
        throw new Error("User not found");
    }

    return isUserExist
}
