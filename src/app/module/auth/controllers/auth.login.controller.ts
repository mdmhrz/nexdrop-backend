import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { tokenUtils } from "../../../utils/token";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { loginService } from "../services";

export const loginController = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await loginService(payload);
        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);


        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                ...rest,
                token,
                accessToken,
                refreshToken
            },
        })
    }
)
