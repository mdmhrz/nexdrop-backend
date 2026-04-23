import status from "http-status";

import AppError from "../../../errorHelper/AppError";
import { auth } from "../../../lib/auth";
import { tokenUtils } from "../../../utils/token";
import { ILoginPayload } from "../interfaces/auth.interface";
import { UserStatus } from "../../../../generated/prisma/enums";




export const loginService = async (payload: ILoginPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if (data?.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }


    if (data?.user?.status === UserStatus.DELETED) {
        throw new AppError(status.GONE, "Your account has been deleted. Please contact support.");
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
        accessToken,
        refreshToken
    }
}
