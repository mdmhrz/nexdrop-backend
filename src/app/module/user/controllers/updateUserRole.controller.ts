import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateUserRoleService } from "../services";

export const updateUserRoleController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
        const user = req.user;

        if (!user) {
            throw new Error("Request User not found");
        }

        // Prevent users from updating their own role
        if (id === user.userId) {
            sendResponse(res, {
                httpStatusCode: status.FORBIDDEN,
                success: false,
                message: "You cannot update your own role"
            });
            return;
        }

        const result = await updateUserRoleService(id as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User role updated successfully",
            data: result
        })
    }
)
