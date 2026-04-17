import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { resetPasswordService } from "../services";


//reset password controller
export const resetPasswordController = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await resetPasswordService(email, otp, newPassword);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset successfully",
        })
    }
);
