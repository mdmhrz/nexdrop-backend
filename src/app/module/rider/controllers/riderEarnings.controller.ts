import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getCurrentEarningsService, getEarningsHistoryService } from "../services";

export const getCurrentEarningsController = catchAsync(
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

        const result = await getCurrentEarningsService(userId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Current earnings fetched successfully",
            data: result,
        });
    }
);

export const getEarningsHistoryController = catchAsync(
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

        const result = await getEarningsHistoryService(userId as string, req.query);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Earnings history fetched successfully",
            data: result.earnings,
            meta: result.meta,
        });
    }
);
