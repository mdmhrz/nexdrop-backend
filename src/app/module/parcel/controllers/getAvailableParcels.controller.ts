import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getAvailableParcelsService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";

export const getAvailableParcelsController = catchAsync(
    async (req: Request, res: Response) => {
        const riderId = req.user?.userId;

        if (!riderId) {
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
        const result = await getAvailableParcelsService(riderId as string, page, limit);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Available parcels fetched successfully",
            data: result.data,
            meta: result.meta
        });
    }
)
