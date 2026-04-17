import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { forgetPasswordService } from "../services";


//forget password controller
export const forgetPasswordController = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await forgetPasswordService(email);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset OTP sent to your email successfully",
        })
    }
);
