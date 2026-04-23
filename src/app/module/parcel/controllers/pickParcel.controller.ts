import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { pickParcelService } from "../services";
import { IPickParcelPayload } from "../interfaces/parcel.interface";
import { pickParcelValidation } from "../validations";

export const pickParcelController = catchAsync(
    async (req: Request, res: Response) => {
        const riderId = req.user?.userId;
        const parcelId = req.params.id;

        if (!riderId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = pickParcelValidation.parse(req.body);
        const payload: IPickParcelPayload = {
            note: validatedPayload.note
        };

        const parcel = await pickParcelService(riderId as string, parcelId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel picked up successfully",
            data: parcel
        });
    }
)
