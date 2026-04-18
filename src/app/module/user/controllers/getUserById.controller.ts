import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getUserByIdService } from "../services";

export const getUserByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await getUserByIdService(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User fetched successfully",
            data: result
        })
    }
)
