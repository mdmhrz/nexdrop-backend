import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelper/AppError";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../../utils/jwt";
import { tokenUtils } from "../../../utils/token";



export const getNewTokenService = async (refreshToken: string, sessionToken: string) => {

    // better-auth stores "tokenId.signature" in the cookie; only the tokenId is in the DB
    const cleanSessionToken = sessionToken.split(".")[0];

    const isSessionExist = await prisma.session.findUnique({
        where: {
            token: cleanSessionToken
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

    // Only extend the session lifetime — do NOT change the session token value.
    // Changing it to a JWT would break checkAuth which strips after the first "."
    await prisma.session.update({
        where: {
            token: cleanSessionToken
        },
        data: {
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            updatedAt: new Date()
        }
    })

    return {
        // Return the original session token (with .signature) unchanged so the browser cookie stays valid
        sessionToken,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}
