import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { auth } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export const verifyEmailService = async (email: string, otp: string) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const isGoogleAuthenticatedUser = await prisma.account.findFirst({
        where: {
            userId: user.id,
            providerId: "google"
        }
    })

    if (isGoogleAuthenticatedUser) {
        throw new AppError(status.BAD_REQUEST, "Google authenticated users can not verify email");
    }


    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })

    if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        })
    }

}
