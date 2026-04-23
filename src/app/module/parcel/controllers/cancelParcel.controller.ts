import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { cancelParcelService } from "../services";
import { ICancelParcelPayload } from "../interfaces/parcel.interface";
import { cancelParcelValidation } from "../validations";

export const cancelParcelController = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = req.user?.userId;
        const parcelId = req.params.id;

        if (!customerId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = cancelParcelValidation.parse(req.body);
        const payload: ICancelParcelPayload = {
            note: validatedPayload.note
        };

        const parcel = await cancelParcelService(customerId as string, parcelId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel cancelled successfully",
            data: parcel
        });
    }
)
