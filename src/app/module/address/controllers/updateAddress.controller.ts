import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateAddressService } from "../services";

export const updateAddressController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user;
        const payload = req.body;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await updateAddressService(id as string, user.userId, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Address updated successfully",
            data: result
        })
    }
)
