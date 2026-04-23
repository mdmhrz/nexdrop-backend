import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { cookieUtils } from "../../../utils/cookie";
import { envVars } from "../../../config/env";
import { logoutService } from "../services";



export const logoutController = catchAsync(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await logoutService(betterAuthSessionToken);

        cookieUtils.clearCookie(res, "better-auth.session_token", {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
        });

        cookieUtils.clearCookie(res, "refreshToken", {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
        });

        cookieUtils.clearCookie(res, "accessToken", {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
        });



        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged out successfully",
            data: result
        })
    }
)
