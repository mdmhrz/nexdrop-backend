import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateMyProfileService } from "../services";

export const updateMyProfileController = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const payload = req.body;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await updateMyProfileService(user.userId, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Profile updated successfully",
            data: result
        })
    }
)
