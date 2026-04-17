import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { tokenUtils } from "../../../utils/token";
import { IRegisterPayload } from "../interfaces/auth.interface";




const registerService = async (payload: IRegisterPayload) => {
    const { name, email, password } = payload;

    // Better Auth 1.6.5 returns a ghost user on duplicate email when
    // requireEmailVerification is true (email enumeration protection).
    // Pre-check to return a proper error before that happens.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError(status.CONFLICT, "User already exists. Use another email.");
    }

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    });

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        status: data.user.status,
        emailVerified: data.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        status: data.user.status,
        emailVerified: data.user.emailVerified
    })


    return {
        ...data,
        token: data.token,
        accessToken,
        refreshToken
    };
}

export default registerService;
