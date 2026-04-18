import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateRiderStatusService } from "../services";
import { IUpdateRiderStatusPayload } from "../interfaces/rider.interface";
import { updateRiderStatusValidation } from "../validations";
import { validateRequest } from "../../../middleware/validateRequest";

export const updateRiderStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = updateRiderStatusValidation.parse(req.body);
        const payload: IUpdateRiderStatusPayload = {
            currentStatus: validatedPayload.currentStatus
        };

        const rider = await updateRiderStatusService(userId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Rider status updated successfully",
            data: rider
        });
    }
)
