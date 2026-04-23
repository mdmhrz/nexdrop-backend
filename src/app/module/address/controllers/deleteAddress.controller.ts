import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { deleteAddressService } from "../services";

export const deleteAddressController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await deleteAddressService(id as string, user.userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Address deleted successfully",
            data: result
        })
    }
)
