import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../../utils/token";
import { changePasswordService } from "../services";


//change password controller
export const changePasswordController = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await changePasswordService(payload, betterAuthSessionToken);

        const {
            accessToken,
            refreshToken,
            token
        } = result;



        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result
        })
    }
);
