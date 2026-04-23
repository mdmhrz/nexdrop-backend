import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { verifyEmailService } from "../services";


//verify email controller
export const verifyEmailController = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        await verifyEmailService(email, otp);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Email verified successfully",
        })
    }
);
