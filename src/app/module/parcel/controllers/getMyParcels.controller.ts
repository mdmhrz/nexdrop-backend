import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getMyParcelsService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";

export const getMyParcelsController = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = req.user?.userId;

        if (!customerId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const { page, limit } = getPaginationParams(
            req.query.page ? String(req.query.page) : undefined,
            req.query.limit ? String(req.query.limit) : undefined
        );
        const result = await getMyParcelsService(customerId as string, page, limit);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "My parcels fetched successfully",
            data: result.data,
            meta: result.meta
        });
    }
)
