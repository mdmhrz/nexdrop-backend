import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { requestCashoutService, getMyCashoutsService, getAllCashoutsService, updateCashoutStatusService } from "../services/cashout.service";

export const requestCashoutController = catchAsync(
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

        const { amount } = req.body;
        const result = await requestCashoutService(userId as string, amount);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Cashout request submitted successfully",
            data: result,
        });
    }
);

export const getMyCashoutsController = catchAsync(
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

        const result = await getMyCashoutsService(userId as string, req.query);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Cashouts fetched successfully",
            data: result.cashouts,
            meta: result.meta,
        });
    }
);

export const getAllCashoutsController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await getAllCashoutsService(req.query);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All cashouts fetched successfully",
            data: result.cashouts,
            meta: result.meta,
        });
    }
);

export const updateCashoutStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status: cashoutStatus } = req.body;

        const result = await updateCashoutStatusService(id as string, cashoutStatus);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: `Cashout ${cashoutStatus.toLowerCase()} successfully`,
            data: result,
        });
    }
);
