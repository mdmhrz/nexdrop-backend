import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { tokenUtils } from "../../../utils/token";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { getNewTokenService } from "../services";



export const getNewTokenController = catchAsync(
    async (req: Request, res: Response) => {



        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];


        console.log({
            refreshToken,
            betterAuthSessionToken
        })

        if (!refreshToken && !betterAuthSessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! no refresh token provided");
        }

        const result = await getNewTokenService(refreshToken, betterAuthSessionToken);

        const {
            sessionToken,
            accessToken,
            refreshToken: newRefreshToken
        } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);


        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken
            },
        })

    }
);
