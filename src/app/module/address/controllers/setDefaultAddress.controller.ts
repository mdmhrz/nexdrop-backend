import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { setDefaultAddressService } from "../services";

export const setDefaultAddressController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await setDefaultAddressService(id as string, user.userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Default address set successfully",
            data: result
        })
    }
)
