import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../../utils/jwt";
import { tokenUtils } from "../../../utils/token";



export const getNewTokenService = async (refreshToken: string, sessionToken: string) => {

    const isSessionExist = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: true
        }
    })

    if (!isSessionExist || !isSessionExist.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid session token");
    }


    const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

    if (!verifyRefreshToken.success && verifyRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid refresh token");
    }

    const data = verifyRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        email: data.email,
        name: data.name,
        role: data.role,
        status: data.status,
        emailVerified: data.emailVerified
    })

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        email: data.email,
        name: data.name,
        role: data.role,
        status: data.status,
        emailVerified: data.emailVerified
    })

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    })



    return {
        sessionToken: token,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}
