import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateUserStatusService } from "../services";

export const updateUserStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
        const user = req.user;

        if (!user) {
            throw new Error("Request User not found");
        }

        // Prevent users from updating their own status
        if (id === user.userId) {
            sendResponse(res, {
                httpStatusCode: status.FORBIDDEN,
                success: false,
                message: "You cannot update your own status"
            });
            return;
        }

        const result = await updateUserStatusService(id as string, payload, user.userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User status updated successfully",
            data: result
        })
    }
)
