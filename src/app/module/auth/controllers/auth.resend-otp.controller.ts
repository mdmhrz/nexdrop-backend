import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { resendOtpService } from "../services";

export const resendOtpController = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await resendOtpService(email);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "OTP sent successfully",
        });
    }
);
