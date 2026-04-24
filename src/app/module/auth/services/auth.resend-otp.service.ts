import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { UserStatus } from "../../../../generated/prisma/enums";

export const resendOtpService = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const isGoogleAuthenticatedUser = await prisma.account.findFirst({
        where: {
            userId: user.id,
            providerId: "google"
        }
    });

    if (isGoogleAuthenticatedUser) {
        throw new AppError(status.BAD_REQUEST, "Google authenticated users do not require email verification");
    }

    if (user.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email is already verified");
    }

    if (user.status === UserStatus.DELETED) {
        throw new AppError(status.BAD_REQUEST, "User is deleted");
    }

    await auth.api.sendVerificationOTP({
        body: {
            email,
            type: "email-verification"
        }
    });
};
