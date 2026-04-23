import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { createAddressService } from "../services";

export const createAddressController = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const payload = req.body;

        if (!user) {
            throw new Error("Request User not found");
        }

        const result = await createAddressService(user.userId, payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Address created successfully",
            data: result
        })
    }
)
