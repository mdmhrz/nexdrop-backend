import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelper/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            //get session token from request
            const rawSessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

            // Part-1: check if session token is provided and verify
            if (!rawSessionToken) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! no session token provided");
            }

            // Better-Auth stores only the token ID in the DB; the cookie value is `tokenId.signature`
            // So we must strip the signature suffix before querying
            const sessionToken = rawSessionToken.split(".")[0];

            // if session token is provided then check if session token is valid
            if (sessionToken) {

                // is session token exist in database
                const sessionExist = await prisma.session.findFirst({
                    where: {
                        token: sessionToken,
                        expiresAt: {
                            gt: new Date()
                        }
                    },
                    include: {
                        user: true
                    }
                })


                if (!sessionExist || !sessionExist.user) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid session token");
                }

                if (sessionExist && sessionExist.user) {

                    const user = sessionExist.user;
                    const now = new Date();
                    const expiresAt = new Date(sessionExist.expiresAt);
                    const createdAt = new Date(sessionExist.createdAt);

                    const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
                    const timeLeft = expiresAt.getTime() - now.getTime();
                    const timeLeftPercent = (timeLeft / sessionLifetime) * 100;

                    if (timeLeftPercent <= 20) {
                        res.setHeader("X-Session-Refresh", 'true');
                        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                        res.setHeader("X-Time-Left", timeLeft.toString());

                        console.log("Session token is about to expire.");
                    }

                    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                        throw new AppError(status.FORBIDDEN, `Your account has been ${user.status === UserStatus.BLOCKED ? "blocked" : "deleted"}. Please contact support.`);
                    }


                    if (authRoles.length > 0 && !authRoles.includes(user.role as UserRole)) {
                        throw new AppError(status.FORBIDDEN, "You are not authorized to access this resource");
                    }


                    // set user data to request header

                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: user.role as UserRole,
                    }
                }
            }



            // Part-2: check if access token is provided and verify
            const accessToken = cookieUtils.getCookie(req, "accessToken");

            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! no access token provided");
            }

            const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET as string);

            if (!verifiedToken.success) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! invalid access token provided");
            }

            if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role)) {
                throw new AppError(status.UNAUTHORIZED, "Forbidden access! you do not have permission to access this route");
            }




            next();


        } catch (error) {
            next(error)
        }
    }
}
