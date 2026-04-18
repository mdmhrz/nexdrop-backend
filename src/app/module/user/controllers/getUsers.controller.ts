import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getUsersService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";

export const getUsersController = catchAsync(
    async (req: Request, res: Response) => {
        const { search, page, limit } = req.query;
        const { page: pageNum, limit: limitNum } = getPaginationParams(page as string, limit as string);

        const result = await getUsersService(search as string, pageNum, limitNum);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Users fetched successfully",
            data: result.data,
            meta: result.meta
        })
    }
)
