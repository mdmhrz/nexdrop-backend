import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getAddressesService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";

export const getAddressesController = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const { page, limit } = req.query;

        if (!user) {
            throw new Error("Request User not found");
        }

        const { page: pageNum, limit: limitNum } = getPaginationParams(page as string, limit as string);
        
        const result = await getAddressesService(user.userId, pageNum, limitNum);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Addresses fetched successfully",
            data: result.data,
            meta: result.meta
        })
    }
)
