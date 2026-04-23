import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getMeService } from "../services";


export const getMeController = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await getMeService(user.userId)

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User fetched successfully",
            data: result
        })
    }
)
