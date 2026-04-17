import { prisma } from "../../../lib/prisma"
import { tokenUtils } from "../../../utils/token";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const googleLoginService = async (session: Record<string, any>) => {

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
    });

    return {
        accessToken,
        refreshToken
    }
}
