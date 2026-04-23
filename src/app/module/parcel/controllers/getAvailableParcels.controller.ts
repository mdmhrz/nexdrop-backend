import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getAvailableParcelsService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";

export const getAvailableParcelsController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (!userId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        if (!userRole) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "User role not found"
            });
            return;
        }

        const { page, limit } = getPaginationParams(
            req.query.page ? String(req.query.page) : undefined,
            req.query.limit ? String(req.query.limit) : undefined
        );
        const result = await getAvailableParcelsService(userId as string, userRole, page, limit);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Available parcels fetched successfully",
            data: result.data,
            meta: result.meta
        });
    }
)
