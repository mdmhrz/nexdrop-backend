import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getRiderMeService } from "../services";

export const getRiderMeController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const rider = await getRiderMeService(userId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Rider profile fetched successfully",
            data: rider
        });
    }
)
